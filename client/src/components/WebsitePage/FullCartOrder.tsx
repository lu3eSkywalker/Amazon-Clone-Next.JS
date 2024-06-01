import React, { useEffect, useState, SetStateAction } from 'react';
import Cart from './Cart';
import { useFetchUserProfile } from '../Customer/CustProfile';
import { useCartQuantityHook } from './JustTesting';
import { useRouter } from 'next/navigation';



const FullCartOrder = () => {
    const router = useRouter();

    const [cartTotal, setCartTotal] = useState(0);
    const [userDetail, fetchCustProfile] = useFetchUserProfile();






    const orderTotal = async (): Promise<void> => {
        const custId = localStorage.getItem('id');
        const userId = localStorage.getItem('id');


        const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/custprofile/${userId}`, {
            method: 'GET',
        });

        const res = await savedUserResponse.json();
        const cartMapping = res.data.cart;

        let totalPrice: number = 0;

        await Promise.all(cartMapping.map(async (dataItem: number) => {
            const productPriceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getproductbyid/${dataItem}`, {
                method: 'GET',
            });

            const productData = await productPriceResponse.json();
            const price = Number(productData.data.price); // Convert price to number

            console.log(price); // Log individual product price

            totalPrice += price; // Add current product price to total price
        }));

        console.log('Total Price:', totalPrice);
        setCartTotal(totalPrice);
    }



    useEffect(() => {
        orderTotal();
    }, [])


    const orderConfirm = async(): Promise<void> => {
        const userId = localStorage.getItem('id');

        try {
            const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/custprofile/${userId}`, {
                method: 'GET',
            })

            const res = await savedUserResponse.json();

            const cartMapping = res.data.cart;

            cartMapping.map(async(dataItem: number) => {
                try {
                    const info = {
                        custId: parseInt(userId || 'O'),
                        prodId: dataItem,
                        status: "pending"
                    };
                    const orderStatusFunction = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/createorder`, {
                        method: 'Post',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(info)
                    });
                    const res = await orderStatusFunction.json();
                    console.log(res)
                    
                }
                catch(error) {
                    console.log("Error: ", error)
                }
            })
            await checkOut()
            router.push('/orderplaced');
        }
        catch(error) {
            console.log("Error: ", error)
        }
    }




    const checkOut = async(): Promise<void> => {
        const custIdd: string | null = localStorage.getItem('id');
        const custId: number | null = custIdd !== null ? parseInt(custIdd) : null;

        try {
          const deleteCart = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/deletewholecart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({custId})
          })
  
          const res = await deleteCart.json();
          router.push('/orderplaced')
        }
        catch(error) {
            console.log("Error: ", error)
        }
      }


  


    return (
        <div>

            <div>
                <p className='font-bold text-xl'>Info for Delivering</p>
                <p>{userDetail?.name}</p>
                <p>{userDetail?.address}</p>
                <p>{userDetail?.email}</p>

            </div>


        <div>Total Order PricePrice: ${cartTotal}</div>
        <br></br>
        <br></br>

        <button onClick={() => orderConfirm()}>Order Confirm</button>
    </div>
    )
  
};

export default FullCartOrder;