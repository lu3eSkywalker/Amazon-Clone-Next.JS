"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import Counter from '../Counter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/router';

import SearchPage from './SearchPage';
import { signIn, signOut, useSession } from 'next-auth/react';



interface FormData {
  name: string;
}

const Header = () => {
  const router = useRouter();
  const {data: session} = useSession()
  const accessToken = session?.user?.accessToken;


  const handleSignOut = () => {
    signOut();
    router.push('/logingeneral')
    logoutHandler();
    localStorage.clear();
  }

  const setAccessTokenToLocalStorage = () => {
    const accessToken = session?.user?.accessToken;
    if(accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
  };

  useEffect(() => {
    setAccessTokenToLocalStorage();
  }, [session]);




  const [formData, setFormData] = useState<FormData>({
    name: ''
  });

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {

    if(typeof window !== 'undefined') {
      setRole(localStorage.getItem('role'))
    }
  }, [])

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const {name, value} = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const buttonHandler = async(event: FormEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    console.log(formData.name)
    // router.push(`searchpage/${formData.name}/searchpage`)
    router.replace(`/searchpage/${formData.name}/searchpage`)
  }

  const logoutHandler = async(): Promise<void> => {
    const token = localStorage.getItem('accessToken')

    try {
      const logoutUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`
        }
      });

      const res = await logoutUser.json();
      if(res.success) {
        router.push('logingeneral')
        localStorage.clear()
      }
    }
    catch(error) {
      console.log("Error: ", error)
    }
  }


  return (
      <div className="sticky top-0 z-50">
        <nav className='py-3 bg-blue-300'>
            <button onClick={() => router.push('/firstpageserverside')} className='flex font-bold text-white text-4xl '>Nebula Nexus</button>
            <ul className='flex justify-end text-xl font-bold'>

              <div>
                <input 
                type='text'
                placeholder='Product Name'
                name='name'
                onChange={changeHandler}
                value={formData.name}
                />
                <button className='mx-3' onClick={buttonHandler}>Search</button>
              </div>

              {role === 'seller' ? <button onClick={() => router.push('/uploadproduct')} className='mx-8'>Upload Product</button> : <li></li>}


                <li className='mx-8 cursor-pointer' onClick={() => router.push('/firstpageserverside')}>Home</li>
                <li className='mx-8 cursor-pointer' onClick={() => router.push('/categorypageserverside')}>By Category</li>


                <li className='relative flex mx-2 cursor-pointer' onClick={() => router.push('/cart')}>
                  <Counter />  <FontAwesomeIcon icon={faCartShopping} /></li>

                  {
                    role === 'customer' ? <button onClick={() => router.push('/customerprofile')} className='mx-8'>Profile</button>: <li></li>
                  }


                  {accessToken ? <button onClick={() => handleSignOut()}>LogOut</button> : <button onClick={() => signIn()} className='mx-2'>SignIn</button>}

                  

            </ul>
        </nav>

        </div>
  )
}

export default Header
