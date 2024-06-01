"use client";

import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Counter from '../Counter';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';



interface Product {
    name: string;
    description: string;
    price: string;
    cloudinaryUrl: string;
    category: string;
    id: string;
}

interface ProductReview {
    review: string
}

interface ProductPageProps {
    productId: string | string[] | undefined;
}

const ProductPage = () => {



    const router = useRouter()


    const params = useParams();

    const [data, setData] = useState<Product | null>(null)
    const [formData, setFormData] = useState('');
    const [reviewData, setReviewData] = useState<ProductReview[]>([]);


    const fetchProductReview = async(productId: string): Promise<void> => {
            
        const reviewByProduct = await fetch(`http://localhost:4000/api/v1/getreviewbyprodid/${productId}`, {
            method: 'GET',
        })

        const res = await reviewByProduct.json();
        // console.log(res.data[0].review)

        setReviewData(res.data || [])
    }



    useEffect(() => {
        if(params) {
            console.log(params)

            const productId = params.id;

            const getProduct = async(): Promise<void> => {
                try {
                    const savedResponse = await fetch(`http://localhost:4000/api/v1/getproductbyid/${productId}`, {
                        method: "GET",
                    })

                    const response = await savedResponse.json();
                    console.log(response.data)
                    setData(response.data)


                    const reviewByProduct = await fetch(`http://localhost:4000/api/v1/getreviewbyprodid/${productId}`, {
                        method: 'GET',
                    })

                    const res = await reviewByProduct.json();
                    console.log(res.data[0].review)

                    setReviewData(res.data || [])
                }
                catch(error) {
                    console.log("Error: ", error)
                }
            }

            getProduct();
        }
    }, [params]);



    function changeHandler(event: ChangeEvent<HTMLInputElement>): void {
        const { name, value } = event.target;
        setFormData(value); // Update formData state iwth new value
    }


    const buttonHandler = async (id: string): Promise<void> => {
        // const custId = parseInt(localStorage.getItem('userId') || '0', 10);
        const custId = parseInt(localStorage.getItem('id') || '0', 10);
        console.log(formData)


        const token = localStorage.getItem('accessToken')

        const dataObject = {
            custId,
            prodId: id,
            review: formData,
            token
        }
        console.log(dataObject)
        
        try {
            const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/uploadreview`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`,
                },
                body: JSON.stringify(dataObject),
            });

            const response = await savedUserResponse.json()
             setFormData('')
            console.log(response)

        }
        catch(error) {
            console.log("Error: ", error)
        }

        await fetchProductReview(id);


    }

    const navigateToOrderPage = (productId: string | undefined) => {

        // router.push(`/orderpage/${productId}`)
        router.push(`/orderpage/${productId}/order`)

    }




  return (
    <div>
        <div className=''>
        <div className="bg-gray-100 dark:bg-gray-800 py-[50px] ">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
                <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                    <img className="w-full h-full object-cover" src={data?.cloudinaryUrl} alt="Product Image" />
                </div>
                <div className="flex -mx-2 mb-4">
                    <div className="w-1/2 px-2">
                        <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700">Add to Cart</button>
                    </div>


                    <div className="w-1/2 px-2">
                        <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => navigateToOrderPage(data?.id)}>Buy Now</button>
                    </div>



                </div>
            </div>
            <div className="md:flex-1 px-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{data?.name}</h2>
                <div className="flex mb-4">
                    <div className="mr-4">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                        <span className="text-gray-600 dark:text-gray-300">${data?.price}</span>
                    </div>
                    <div>
                        <span className="font-bold text-gray-700 dark:text-gray-300">Availability:</span>
                        <span className="text-gray-600 dark:text-gray-300">In Stock</span>
                    </div>
                </div>

                {data?.category === "Clothes" ? <div>

                <div className="mb-4">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Select Color:</span>
                    <div className="flex items-center mt-2">
                        <button className="w-6 h-6 rounded-full bg-gray-800 dark:bg-gray-200 mr-2"></button>
                        <button className="w-6 h-6 rounded-full bg-red-500 dark:bg-red-700 mr-2"></button>
                        <button className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-700 mr-2"></button>
                        <button className="w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-700 mr-2"></button>
                    </div>
                </div>


                <div className="mb-4">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Select Size:</span>
                    <div className="flex items-center mt-2">
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">S</button>
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">M</button>
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">L</button>
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">XL</button>
                        <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-full font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600">XXL</button>
                    </div>
                </div>

                </div> : null}
                



                <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">Product Description:</span>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                        {data?.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

    </div>
    <div className='flex justify-start'>
        <input 
        type='text'
        placeholder='review'
        name='review' 
        onChange={changeHandler}
        value={formData}
        className='border border-gray-900 rounded h-20 w-75 placeholder: px-2 mb-2 mr-2'
        />

        <button onClick={() => buttonHandler(data?.id || '')} className=']'>Submit</button>
    </div>
<div>




    {reviewData.map((review, index) => (
        <div className="w-full p-4">
        <div className="p-8 rounded-xl shadow-md bg-white">
            <span className="text-6xl">❝</span>
            <p className="text-base">{review.review}</p>
            {/* <hr className="my-4"> */}
            <div className="flex flex-wrap items-center">
                <img className="w-12 h-12 rounded-full" alt="Use any sample image here..." src="https://tailwindcomponents.com/storage/avatars/baG0wMQUtoTOZOOmStaUBVQsa7LAwc5HjiGZMjdB.png" />
                <p className="mx-2 text-gray-500 text-sm">
                    User Name
                    <br />
                    More Info
                </p>
            </div>
        </div>
    </div>
    
    ))}



</div>




    </div>
    

  )
}

export default ProductPage