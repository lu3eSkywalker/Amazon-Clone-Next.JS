import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from 'jsonwebtoken';

import {z} from "zod";


const ReviewSchema = z.object({
    review: z.string().min(10).max(1000)
})


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        req.user = decoded;
        next();
    } catch(error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const authorizedProductReview = (req: Request, res: Response, next: NextFunction) => {
    if(req.user.payload.role !== 'customer') {
        return res.status(403).json({ message: 'Forbidden Only Seller can upload products' });
    }
    next();
};


export const postReviewOnProduct = async(req: Request, res: Response): Promise<void> => {

    authenticate(req, res, async() => {
        authorizedProductReview(req, res, async() => {

            try {
                const {custId, prodId} = req.body as {custId: number, prodId: number}
        
                const parsedReview = ReviewSchema.safeParse(req.body);
                if(!parsedReview.success) {
                    res.status(411).json({
                        error: parsedReview.error
                    })
                    return;
                }
        
                const review = parsedReview.data.review;
        
                const prodReview = await prisma.review.create({
                    data: {
                        custId: custId,
                        prodId: prodId,
                        review: review
                    }
                })
        
                res.status(200).json({
                    success: true,
                    data: prodReview,
                    message: 'Entry Created Successfully'
                });
        
            }
            catch (error) {
                console.log("Error: ", error);
                res.status(500).json({
                    success: false,
                    message: 'Error Posting the Review'
                });
            }

        })
    })
}

export const getReviewByProdId = async(req: Request, res: Response): Promise<void> => {
    try {
        const prodId = parseInt(req.params.prodId);

        const reviews = await prisma.review.findMany({
            where: {
                prodId: prodId
            }
        })

        if(!reviews) {
            res.status(404).json({
                success: false,
                message: 'No Data Found With the Given Id'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: reviews,
            message: 'Data Fetched Successfully'
        })

    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error Fetching the review'
        });
    }
}

export const getReviewofCust = async(req: Request, res: Response): Promise<void> => {
    try {
        const custId = parseInt(req.params.custId);

        const reviews = await prisma.review.findMany({
            where: {
                   custId: custId
            }
        })

        if(reviews.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Error Fetching the review'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: reviews,
            message: 'Review fetched successfully'
        })
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error Fetching the review'
        });
    }
}