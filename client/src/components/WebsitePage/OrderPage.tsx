import React, { useEffect, useState } from 'react'
import { useFetchUserProfile } from '../Customer/CustProfile';
import { useCartQuantityHook } from './JustTesting';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


const OrderPage = () => {

    const router = useRouter()

    const params = useParams();

    const [userDetail, fetchCustProfile] = useFetchUserProfile();
    const [itemPrice, setItemPrice] = useState();

    console.log(userDetail?.address)

    useEffect(() => {
        getProductInfo()
    }, [])

    const getProductInfo = async(): Promise<void> => {

        const productId = params.id

        console.log(productId)
        
        try {
            const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/getproductbyid/${productId}`, {
                method: "GET",
            });
            const res = await savedUserResponse.json();
            console.log(res.data[0].price);
            setItemPrice(res.data[0].price);
        }
        catch(error) {
            console.log("Error: ", error)
        }
    }



  return (
    <div>
        <div>
            <p>Name: {userDetail?.name} </p>
            <p>Address: {userDetail?.address}</p>
            <p>Order Total: {itemPrice}</p>
        </div>

        <div>
            <button onClick={() => router.push('/orderplaced')}>Order Confirm</button>
        </div>
    </div>
  )
}

export default OrderPage