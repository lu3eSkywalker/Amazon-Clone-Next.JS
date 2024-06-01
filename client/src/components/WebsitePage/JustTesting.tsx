import React, { useEffect, useState } from 'react';

interface CartData {
    cart: string[];
}

interface Product {
    // Define your product properties here
    data: Data[],
}

interface Data {
    name: string;
    price: number;
    id: string;
}

export const useCartQuantityHook = () => {
    const [cartQuantity, setCartQuantity] = useState<string[]>([]);
    const [cartContents, setCartContents] = useState<Product[]>([]);

    const userId = localStorage.getItem('userId');

    const getProfile = async (): Promise<void> => {
        try {
            const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/custprofile/${userId}`, {
                method: "GET",
            });

            const response = await savedUserResponse.json();
            setCartQuantity(response.data.cart);

            const productPromiseArray = response.data.cart.map(async (productId: string) => {
                const productInfo = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getproductbyid/${productId}`, {
                    method: "GET",
                });
                return productInfo.json();
            });

            const products: Product[] = await Promise.all(productPromiseArray);
            setCartContents(products);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return { cartQuantity, cartContents, getProfile, setCartQuantity, setCartContents };
};

