import React, { useEffect, useState } from 'react'
import { useFetchUserProfile } from '../Customer/CustProfile'
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';

interface CartProduct {
    name: string;
    price: string;
    description: string;
    cloudinaryUrl: string;
    id: string;
}


const Cart = () => {

    const [userDetail, fetchCustProfile] = useFetchUserProfile();
    const [cartItemInfo, setCartItemInfo] = useState<CartProduct[]>([]);
    // const navigate = useNavigate();
    const router = useRouter();


    console.log(userDetail?.cart)

    useEffect(() => {
        if(userDetail) {
            fetchCartItems();
        }
    }, [userDetail])

    

    const fetchCartItems = async(): Promise<void> => {

        if(!userDetail || !userDetail.cart || userDetail.cart.length === 0) {
            return;
        }

        try {
            const cartItemPromises = userDetail.cart.map(async (cartElement) => {
                const cartItems = await fetch (`${process.env.NEXT_PUBLIC_BASE_URL}/getproductbyid/${cartElement}`, {
                    method: "GET",
                })

                const res = await cartItems.json();
                console.log(res)
                console.log(res.data.name)

                return res.data;

            });

            const cartItemData = await Promise.all(cartItemPromises)

            setCartItemInfo(cartItemData);
        }
        catch(error) {
            console.log("Error: ", error)
        }
    }


    const deleteCartItems = async(productId: string): Promise<void> => {
    const custId = localStorage.getItem('id')



      const info = {
        custId,
        productId,
      }
    
      try {
        const cartItemremove = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/deletecartItems`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
        })

        console.log(cartItemremove)
    
        const res = await cartItemremove.json();
        console.log(res)

        if(res.success === true) {
          
          setCartItemInfo(prevItems => prevItems.filter(item => item.id !== productId));
        }
    
      }
      catch(error) {
        console.log("Error: ", error)
      }
    }

  return (
    <div>

        {
          cartItemInfo.map((item, index) => (
            <div>


<div className="bg-white border rounded-md shadow-sm sm:flex">
  <div className="flex-shrink-0 relative w-full rounded-t-sm overflow-hidden pt-[10%] sm:max-w-[120px] sm:rounded-t-none sm:rounded-l-md">
    <img className="absolute top-0 left-0 w-full h-full object-cover" src={item.cloudinaryUrl} alt="Image Description" />
  </div>
  <div className="flex flex-wrap">
    <div className="flex flex-col sm:p-2"> 
      <h3 className="text-sm font-bold text-gray-800">
        {item.name}
      </h3>
      
      <br></br>
      <p>Price: ${item.price}</p>

      <div className='flex'>
      <button className='flex mx-4 text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-700'>Buy Now</button>
      <button 
      onClick={() => deleteCartItems(item.id)}
      className='text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-700"'>Remove From Cart</button>
      </div>



      <div className="mt-2 sm:mt-auto">
        <p className="text-xs text-gray-500">
          Last updated 5 mins ago
        </p>
      </div>
    </div>
  </div>
</div>

<br></br>
<br></br>
            </div>
          ))
        }

{
cartItemInfo.length === 0 ? <div className='font-bold text-xl flex justify-center my-[250px]'>Looks, Like Your cart is empty. Continue Browsing <button className='text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-700' onClick={() => router.push('/firstpage')}>HomePage</button></div> : 

<button  onClick={() => router.push('/fullcartorder')}
className='text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-700'>Checkout</button>

}
    </div>
  )
}

export default Cart