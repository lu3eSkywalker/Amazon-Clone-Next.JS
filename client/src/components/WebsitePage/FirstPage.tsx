import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

// import * as React from 'react';
// import '../../index.css'
import ProductCard from './ProductCard';
import { jwtDecode } from 'jwt-decode';


interface Product {
    name: string;
    description: string;
    cloudinaryUrl: string;
    id: string;
    price: string;
}

interface TokenPayload {
    role: string;
    email: string;
    id: string;
    name: string;
}


const FirstPage = () => {

    const [data, setData] = useState<Product[]>([]);

    useEffect(() => {
        paginationLogic(1, 5)
    }, [])


    const paginationLogic = async(page: number, limit: number): Promise<void> => {
        try {
            const savedResponse = await fetch(`http://localhost:4000/api/v1/productPagination?page=${page}&limit=${limit}`, {
                method: 'GET',
            });
            const response = await savedResponse.json();
            setData(response.data);

            const token: any = localStorage.getItem('accessToken')
            console.log(token)

            let decodedToken: { payload: TokenPayload } | null = null;
            try {
                decodedToken = jwtDecode<{ payload: TokenPayload }>(token);
                console.log(decodedToken.payload.name);
                console.log(decodedToken.payload.email);
                console.log(decodedToken.payload.role);
                console.log(decodedToken.payload.id);
                localStorage.setItem("role", decodedToken.payload.role);
                localStorage.setItem("id", decodedToken.payload.id);

            } catch (error) {
                console.log("Invalid token: ", error);
            }

        }
        catch(error) {
            console.log("Error: ", error)
        }
    }




    return (
    <div>
        <div className='flex justify-end mx-5'></div>

        <ProductCard data={data} />


        <div className='flex justify-center'>
  <button className=" bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => paginationLogic(1, 5)}>1</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => paginationLogic(2, 5)}>2</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => paginationLogic(3, 5)}>3</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => paginationLogic(4, 5)}>4</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => paginationLogic(5, 5)}>5</button>
</div>


    </div>
        
    );
}

export default FirstPage