import { PrismaClient, Status } from '@prisma/client';
const prisma = new PrismaClient();

import { Request, Response } from "express";

export const postOrder = async(req: Request, res: Response): Promise<void> => {
    try {
        const { custId, prodId, status } = req.body as { custId: number, prodId: number, status: Status };

        const orderCreate = await prisma.order.create({
            data: {
                custId: custId,
                prodId: prodId,
                status: status
            }
        });

        res.status(200).json({
            success: true,
            data: orderCreate,
            messasge: "Order has been created successfully"
        })
    }
    catch(error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error creating the order'
        });
    }
}

export const fetchOrderByStatus = async(req: Request, res: Response): Promise<void> => {
    try {

        const {custId, status} = req.body as { custId: number, status: Status}

        const orderDetail = await prisma.order.findMany({
            where: {
                custId: custId,
                status: status
            }
        });

        if(orderDetail.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No Data Found'
            })
            return
        }

        res.status(200).json({
            success: true,
            data: orderDetail,
            message: 'Data Fetched Successfully'
        })

    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching the order'
        });
    }
}