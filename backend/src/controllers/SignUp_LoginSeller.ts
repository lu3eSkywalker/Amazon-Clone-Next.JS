import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import {z} from 'zod'
import dotenv from 'dotenv';
dotenv.config();
import jwt, { Secret } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const secretjwt: string = process.env.JWT_SECRET || 'amazon'


const SignupSellerSchema = z.object({
    name: z.string().min(5).max(10),
    email: z.string().email(),
    password: z.string().min(8),
    company: z.string(),
})


export const signupseller = async(req: Request, res: Response): Promise<void> => {
    try {
        // const {name, email, password, company} = req.body as {name: string, email: string, password: string, company: string};

        const parsedInput = SignupSellerSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const name = parsedInput.data.name;
        const email = parsedInput.data.email;
        const password = parsedInput.data.password;
        const company = parsedInput.data.company;


        let hashedPassword: string ;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error) {
            console.log("Error: ", error)
             res.status(500).json({
                success: false,
                message: 'Error in hashing password',
            })
            return;
        }


        const response = await prisma.seller.create({
            data: {
                name, 
                email, 
                password: hashedPassword, 
                company
            }
            });

        res.status(200).json({
            success: true,
            data: response,
            message: 'Entry Created Successfully'
        });
    }
    catch(error) {
        console.log("Error: ", error)
        res.status(500).json({
            success: false,
            message: "Entry Creation Failed",
        })
    }
}


const SellerLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  
  


export const loginSeller = async(req: Request<{ email: string; password: string }>, res: Response): Promise<void> => {
    try {
        // const { email, password } = req.body;

        const parsedInput = SellerLoginSchema.safeParse(req.body);
        if(!parsedInput.success) {
          res.status(411).json({
            error: parsedInput.error
          })
          return
        }

        const email = parsedInput.data.email
        const password = parsedInput.data.password
    

        const user = await prisma.seller.findUnique({
            where: {
                email: email
            }  
        });

        if(!user) {
             res.status(404).json({
                success: false,
                message: "User not registered",
            });
            return;
        }

        const role = 'seller'

        const payload = {
            email: user.email,
            name: user.name,
            id: user.id,
            role
        }

        const compare = await bcrypt.compare(password, user.password)

        if(compare) {
            const token = jwt.sign({payload}, secretjwt, { expiresIn: "24hr" })

            res.status(200).json({
                success: true,
                data: user,
                token: token,
                message: "Logged In successfully"
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Password Incorrect",
            });
        }
    }
    catch(error) {
        console.log("Error: ", error)
         res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getSellerProfile = async(req: Request, res: Response):Promise<void> => {
    try {
        const sellerId = parseInt(req.params.sellerId);


        const sellerProfile = await prisma.seller.findUnique({
            where: {
                id: sellerId
            }
        });

        if(!sellerProfile) {
            res.status(404).json({
                success: false,
                message: "Seller Profile does not exist"
            })
            return
        }

        res.status(200).json({
            success: true,
            data: sellerProfile,
            message: "Data Fetched Successfully"
        })

    }
    catch(error) {
        console.log("Error: ", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}