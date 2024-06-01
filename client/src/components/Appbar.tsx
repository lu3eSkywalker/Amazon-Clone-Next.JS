"use client";
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Appbar = () => {
    const {data: session} = useSession();

    const accessToken = session?.user?.accessToken;
    const router = useRouter()

    const handleSignOut = () => {
        signOut();
        localStorage.clear();
        router.push('/logingeneral')
    }



    const setAccessTokenToLocalStorage = () => {
        const accessToken = session?.user?.accessToken;
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
    };

    // Call the function to set access token when session changes
    useEffect(() => {
        setAccessTokenToLocalStorage();
    }, [session]);



    return <div>
        {/* <button onClick={() => {
            signIn()
        }}>
            SignIn
        </button> */}


        
        {/* {accessToken ? <button onClick={() => handleSignOut()}>Logout</button> : <button onClick={() => signIn()}>Login</button>} */}

        {/* {JSON.stringify(session?.user?.)} */}
        {/* <div>Name: {JSON.stringify(session?.user?.name)}</div> */}
        {/* <div>JWT Token: {JSON.stringify(session?.user?.accessToken)}</div> */}
        

    </div>
}