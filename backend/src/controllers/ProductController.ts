import { NextFunction, Request, Response } from "express";
import {z} from 'zod'
import dotenv from 'dotenv';

dotenv.config();
import jwt, { Secret } from 'jsonwebtoken';
import { cloudinary } from '../utils/cloudinary'

import { Category, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const itemSchema = z.object({
    name: z.string().min(5).max(1000),
    price: z.string().min(1).max(100000000),
    description: z.string().min(10).max(10000),
})

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const authorizedProductUpload = (req: Request, res: Response, next: NextFunction) => {
    if(req.user.payload.role !== 'seller') {
        return res.status(403).json({ message: 'Forbidden: Only seller can upload products' });
    }
    next();
};


export const ProductControllerWithImage = async(req: Request, res: Response): Promise<void> => {
    try {

        authenticate(req, res, async() => {
            authorizedProductUpload(req, res, async() => {



                let result

                if(req.file) {
                    result = await cloudinary.uploader.upload(req.file.path);
                } else {
                    result = await cloudinary.uploader.upload(req.body.filePath);
                }
        
                const {category } = req.body as {category: Category};
        
                const sellerId = parseInt(req.body.sellerId)
                
        
                const parsedInput = itemSchema.safeParse(req.body);
                if(!parsedInput.success) {
                    res.status(411).json({
                        error: parsedInput.error
                    })
                    return;
                }
        
                const name = parsedInput.data.name;
                const price = parsedInput.data.price;
                const description = parsedInput.data.description;
        
                const newFile = await prisma.product.create({
                    data: {
                        sellerId: sellerId,
                        name: name,
                        price: price,
                        description: description,
                        category: category,
                        cloudinaryUrl: result.secure_url,
                    }
                })
        
                res.status(200).json({
                    success: true,
                    data: newFile,
                    message: 'Entry Created Successfully'
                });

            })
        })

    }
    catch(error) {
        console.log("Error: ", error)
        res.status(500).json({
            success: false,
            message: 'Entry Creation Failed'
        })
    }
}



const authorizedAddToCart = (req: Request, res: Response, next: NextFunction) => {
    if(req.user.payload.role !== 'customer') {
        return res.status(403).json({ message: 'Forbidden: Only customer can upload products' });
    }
    next();
}



export const addProductToCart = async(req: Request, res: Response): Promise<void> => {

    authenticate(req, res, async() => {
        authorizedAddToCart(req, res, async() => {
            try {
                const {custId, prodId} = req.body
        
        
                const updatedCustCart = await prisma.customer.update({
                    where: {
                        id: custId
                    },
                    data: {
                        cart: {
                            push: prodId
                        }
                    }
                })
                
                res.status(200).json({
                    success: true,
                    data: updatedCustCart,
                    message: 'Product added to cart successfully'
                })
        
            }
            catch (error) {
                console.log("Error: ", error);
                 res.status(500).json({
                    success: false,
                    message: 'Error Adding the Product to the cart'
                });
            }

        })
    })

}





export const GetAllProducts = async(req: Request, res: Response): Promise<void> => {
    try {
        const allProducts = await prisma.product.findMany({});

        res.status(200).json({
            success: true,
            data: allProducts,
            message: "This is entire Product List"
        });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error Fetching all the Products'
        });
    }
}

export const getProductByCategory = async(req: Request, res: Response): Promise<void> => {
    try {
        const categoryQuery: Category = req.params.categoryQuery as Category;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const offset  = (page - 1) * limit;

        const products = await prisma.product.findMany({
            where: {
                category: categoryQuery
            },
            skip: offset,
            take: limit
        })

        if(products.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No Data Found with the Given category'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: products,
            message: 'Data Fetched Successfully'
        })
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error Fetching Products by category'
        });
    }
}

export const getProductPagination = async(req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const offset = (page - 1) * limit;

        const allProducts = await prisma.product.findMany({
            skip: offset,
            take: limit
        });

        res.status(200).json({
            success: true,
            data: allProducts,
            message: 'This is entire Product List'
        });
    }
    catch(error) {
        console.log("Error", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Product by pagination method'
        });
    }
}


export const getProductByName = async(req: Request, res: Response): Promise<void> => {
    try {
        const searchQuery = req.params.searchQuery
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const offset = (page - 1) * limit;

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: searchQuery,
                    mode: 'insensitive'
                }
            },
            skip: offset,
            take: limit
        });

        if(!products) {
            res.status(404).json({
                success: false,
                message: 'No Data found with the given Id'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: products,
            message: 'Data Fetched Successfully'
        })
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error Fetching Products by Name'
        });
    }
}

export const getProductById = async(req: Request, res: Response): Promise<void> => {
    try {
        const prodId = parseInt(req.params.prodId);

        const product = await prisma.product.findUnique({
            where: {
                id: prodId
            }
        })

        if(!product) {
            res.status(404).json({
                success: false,
                message: 'No Data Found with the Given Id'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: product,
            message: 'Data Fetched Successfully'
        })
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching the product by id'
        });
    }
}




export const deleteCartItems = async(req: Request, res: Response): Promise<void> => {
    try {
        const { custId, productId } = req.body;

        const customer = await prisma.customer.findUnique({
            where: {
                id: parseInt(custId)
            }
        });

        if (!customer) {
            res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
            return;
        }

        const updatedCustomer = await prisma.customer.update({
            where: {
                id: parseInt(custId)
            },
            data: {
                cart: {
                    // Filter out the productId from the cart
                    set: customer.cart.filter(itemId => itemId !== productId)
                }
            }
        });


        res.status(200).json({
            success: true,
            message: 'Item Deleted Successfully'
        })
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error removing the product from the cart'
        });
    }
}

export const deleteWholeCart = async(req: Request, res: Response): Promise<void> => {
    try {
        const { custId } = req.body;

        const updatedCustCart = await prisma.customer.update({
            where: {
                id: custId
            },
            data: {
                cart: []
            }
        })

        res.status(200).json({
            success: true,
            message: 'Product Removed from cart successfully'
        })

    }
    catch(error) {
        console.log("Error: ", error);
        res.status(500).json({
            success: false,
            message: 'Error removing the product from the cart'
        });
    }
}