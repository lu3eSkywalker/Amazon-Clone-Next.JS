import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import {z} from 'zod'
import dotenv from 'dotenv';
dotenv.config();
import jwt, { Secret } from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const secretjwt: string = process.env.JWT_SECRET || ''


const SignupCustSchema = z.object({
    name: z.string().min(5).max(10),
    email: z.string().email(),
    password: z.string().min(8),
    address: z.string(),
})

export const signupcust = async(req: Request, res: Response): Promise <void> => {
    try {

        // const {name, email, password, address} = req.body as {name: string, email: string, password: string, address: string}

        const parsedInput = SignupCustSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const name = parsedInput.data.name;
        const email = parsedInput.data.email;
        const password = parsedInput.data.password;
        const address = parsedInput.data.address;



        let hashedPassword: string;
            hashedPassword = await bcrypt.hash(password, 10);


            const response = await prisma.customer.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    address
                }
            })

            res.status(200).json({
                success: true,
                data: response,
                message: 'Signed up successfully'
            })
    }
    catch(error) {
        console.log("Error: ", error)
        res.status(500).json({
            success: false,
            message: "Entry Creation Failed",
        })
    }
}


const CustLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})



export const login = async(req: Request<{ email: string, password: string }>, res: Response): Promise<void> => {
    try {
        const parsedInput = CustLoginSchema.safeParse(req.body);
        if(!parsedInput.success) {
            res.status(411).json({
                error: parsedInput.error
            })
            return;
        }

        const email = parsedInput.data.email;
        const password = parsedInput.data.password;

        const user = await prisma.customer.findUnique({
            where: {
                email: email,
            }
        });

        if(!user) {
            res.status(404).json({
                success: false,
                message: "User not registered",
            });
            return
        }

        const role = 'customer'

        const payload = {
            email: user.email,
            name: user.name,
            id: user.id,
            role
        }

        const compare = await bcrypt.compare(password, user.password)

        if(compare) {
            const token = jwt.sign({payload}, secretjwt, { expiresIn: "24hr"} )

            res.status(200).json({
                success: true,
                data: user,
                token: token,
                message: "Logged in successfully"
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Password Incorrect",
            });
            return;
        }



    }
    catch(error) {
        console.log("Error: ", error)
        res.status(500).json({
            success: false,
            message: "Entry Creation Failed",
        })
    }
}

export const getUserProfile = async(req: Request, res: Response): Promise<void> => {
    try {
        const custId = parseInt(req.params.custId, 10);

        const custProfile = await prisma.customer.findUnique({
            where: {
                id: custId,
            }
        })

        if(!custProfile) {
            res.status(404).json({
                success: false,
                message: "User Doesn't Exist"
            })
            return
        }

        res.status(200).json({
            success: true,
            data: custProfile,
            message: "Data Fetched Successfully"
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
}


export const logout = async(req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1] ?? '';

        await prisma.blacklistedtoken.create({
            data: {
                token: token,
                createdAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: 'User Logged out successfully'
        })
        
    }
    catch(error) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}