import React, { useState } from 'react'
import ProductCard from './ProductCard'


interface Product {
    name: string;
    description: string;
    cloudinaryUrl: string;
    id: string;
    price: string
}


const ByCategory = () => {

    const [data, setData] = useState<Product[]>([])

    const getProducts = async(category : string): Promise<void> => {
        try {
            const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bycategory/${category}`, {
                method: "GET",
            })

            const response = await savedResponse.json()
            console.log(response.data)

            localStorage.setItem('category', category);

            if(response.data) {
                setData(response.data)
            }

        }
        catch(error) {
            console.log("Error: ", error)
        }
    }

    
    
    
    const getProductsPagination = async(page: number, limit: number): Promise<void> => {
        const category = localStorage.getItem('category');
        try {
            const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bycategory/${category}?page=${page}&limit=${limit}`, {
                method: 'GET',
            });
            const response = await savedResponse.json();

            if(response.data) {
                setData(response.data)
            }
        }
        catch(error) {
            console.log("Error: ", error)
        }
    }


  return (
    <div>
        <div className='flex mx-5 py-5 px-5'>
            <button onClick={() => getProducts('video_game')} className="mx-4 relative inline-block px-4 py-2 font-medium group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white">Video Games</span>
            </button>

            <br></br>

            <button onClick={() => getProducts('clothes')} className="mx-4 relative inline-block px-4 py-2 font-medium group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white">Clothes</span>
            </button>

            <br></br> 


            <button onClick={() => getProducts('electronics')} className="mx-4 relative inline-block px-4 py-2 font-medium group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white">Electronics</span>
            </button>

            </div>

            <ProductCard data={data} />


        <div className='flex justify-center'>
  <button className=" bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => getProductsPagination(1, 5)}>1</button>
  
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => getProductsPagination(2, 5)}>2</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => getProductsPagination(3, 5)}>3</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => getProductsPagination(4, 5)}>4</button>
  <button className="mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" onClick={() => getProductsPagination(5, 5)}>5</button>
</div>


    </div>
  )
}

export default ByCategory