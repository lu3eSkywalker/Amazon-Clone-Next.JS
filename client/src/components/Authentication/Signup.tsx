import { useRouter } from 'next/router';
import React, { useState, ChangeEvent, FormEvent } from 'react';


type UserType = 'customer' | 'seller'

interface FormData {
    name: string;
    email: string;
    password: string;
    address?: string;
    company?: string;
};


export default function Signup ({userType}: {userType: UserType}) {

    const initialFormData = userType === 'customer'
    ? {name: '', email: '', password: '', address: ''}
    : {name: '', email: '', password: '', company: ''}


    const [formData, setFormData] = useState<FormData>(initialFormData)
    const router = useRouter();

    const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const buttonHandler = async (event: FormEvent<HTMLButtonElement>): Promise<void> => {
        event.preventDefault();

        try {
            const endpoint = userType === 'customer' ? 'signupcustomer': 'signupseller';

            const savedUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const res = await savedUserResponse.json();

            if(res.success) {
                router.push('/firstpage')
            }
        }
        catch(error) {
            console.log("Error: ", error)
        }

    }

  return (
    <div>

        <div className='bg-gray-200 shadow-lg p-4 py-[150px]'>

        <div className='flex justify-center'>
            {userType === 'customer' ? (<p className='font-bold text-2xl text-blue-700'>Signup To Nebula Nexus as Customer</p>): (<p className='font-bold text-2xl text-blue-700'>Signup To Nebula Nexus as Seller</p>)}
        </div>

            <div className='flex justify-center py-2'>

            
    <form className='flex flex-col py-2'>
        <input 
            type='text'
            placeholder='name'
            onChange={changeHandler}
            name='name'
            value={formData.name}
            className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
            />

            <input 
            type='text'
            placeholder='email'
            onChange={changeHandler}
            name='email'
            value={formData.email}
            className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
            />

            <input 
            type='text'
            placeholder='password'
            onChange={changeHandler}
            name='password'
            value={formData.password}
            className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
            />

            {userType === 'customer' ? (<input 
            type='text'
            placeholder='address'
            onChange={changeHandler}
            name='address'
            value={formData.address}
            className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
            />): 

            (<input 
            type='text'
            placeholder='company'
            onChange={changeHandler}
            name='company'
            value={formData.company}
            className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
            />)}
            
    <button 
    className='h-9 w-[225px] font-bold text-white bg-cyan-500'
    onClick={buttonHandler}>Submit</button>


    </form>
    </div>
    </div>
    </div>
  )
}