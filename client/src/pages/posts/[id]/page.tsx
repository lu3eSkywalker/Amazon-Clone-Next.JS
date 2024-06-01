"use client"

// import { useParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function PostID() {
    const params = useParams()
    

    useEffect(() => {
        if (params) {
            console.log(params);

            const productId = params.id;
            
            const getProduct = async(): Promise<void> => {
                try  {
                    const savedResponse = await fetch(`http://localhost:4000/api/v1/getproductbyid/${productId}`, {
                        method: "GET",
                    })

                    const response = await savedResponse.json();
                    console.log(response.data)
                }
                catch(error) {
                    console.log("Error: ", error)
                }
            }

            getProduct()
            
        } else {
            console.log('Params are null');
        }
    }, [params]);

    if (!params) {
        return <div>Loading...</div>; // Render a loading state while params are null
    }


    console.log(params)
}