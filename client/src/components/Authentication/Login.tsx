// useLogin.tsx
"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
    email: string;
    password: string;
}

interface UseLoginReturnType {
    formData: FormData;
    userData: any[]; // Change 'any[]' to the appropriate type of your user data
    changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    buttonHandler: (event: FormEvent<HTMLButtonElement>) => Promise<void>;
}

type UserType = 'customer' | 'seller';

export default function useLogin({userType}: { userType: UserType }): UseLoginReturnType {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const [userData, setUserData] = useState<any>([]);
    const router = useRouter();

    const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const email = formData.email
    const password = formData.password 


    const buttonHandler = async (event: FormEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();

        const result: any = await signIn('credentials', {
            redirect: false,
            email,
            password,
            userType
        });

        if(result.ok) {
            router.push('/firstpageserverside');
        } else {
            alert('Login Failed');
        };



        // try {
        //     const endpoint = userType === 'customer' ? 'logincust' : 'loginseller';

        //     const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${endpoint}`, {

        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(formData),
        //     });

        //     const res = await savedUserResponse.json();
        //     // console.log(res.data)
        //     localStorage.setItem('token', res.data2)


        //     if(res.data.company) {
        //         const seller = 'seller'
        //         localStorage.setItem('role', seller)
        //     } else {
        //         const customer = 'customer'
        //         localStorage.setItem('role', customer)
        //     }

        //     const userId = res.data.id
        //     localStorage.setItem("userId", userId);

        //     setUserData(res.data);

            

        //     if(res.success) {
        //         router.push('/firstpage')
        //     }
        //     else {
        //         console.log("Wrong Password")
        //     }

            

        // } catch (error) {
        //     console.log("Error: ", error);
        // }
    };

    return {
        formData,
        userData,
        changeHandler,
        buttonHandler,
    };
}
        export function LoginForm({ formData, changeHandler, buttonHandler}
        : {
            formData: FormData;
            changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
            buttonHandler: (event: FormEvent<HTMLButtonElement>) => Promise<void>;
          }) 
        
        
        {
            return (
                <div className='bg-gray-200 shadow-lg p-4 py-[150px]'>

                
                    <div className='flex justify-center'>
                        <p className='font-bold text-2xl text-blue-700'>Login to Nebula Nexus</p>
                    </div>



                <div className='flex justify-center py-2'>

                
                <form className='flex flex-col py-2'>
                    <input 
                        type='text'
                        placeholder='email'
                        name='email'
                        onChange={changeHandler}
                        value={formData.email}
                        className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
                    />

                    <input 
                        type='password'
                        placeholder='password'
                        name='password'
                        onChange={changeHandler}
                        value={formData.password}
                        className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
                    />

                    <div className='flex justify-center'>
                    <button 
                    className='h-9 w-[225px] font-bold text-white bg-green-500 rounded'
                    onClick={buttonHandler}>Submit</button>
                    </div>


                </form>
                </div>

            </div>
            )
        }