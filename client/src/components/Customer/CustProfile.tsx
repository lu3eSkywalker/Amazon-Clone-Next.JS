import React, { useEffect, useState } from 'react';

interface UserDetails {
  name: string;
  email: string;
  address?: string;
  company?: string;
  cart?: [];
}

export const useFetchUserProfile = (): [UserDetails | null, () => Promise<void>] => {
  const [userDetail, setUserDetail] = useState<UserDetails | null>(null);

  const fetchCustProfile = async (): Promise<void> => {
    try {
      const userId = localStorage.getItem('id');
      const role = localStorage.getItem('role');

      const url =
        role === 'customer'
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/custprofile/${userId}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/sellerprofile/${userId}`;

      const savedUserResponse = await fetch(`${url}`, {
        method: 'GET',
      });

      const res = await savedUserResponse.json();
      console.log(res.data);
      setUserDetail(res.data);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    fetchCustProfile();
  }, []);

  return [userDetail, fetchCustProfile];
};

const CustProfile: React.FC = () => {
  const [userDetail, fetchCustProfile] = useFetchUserProfile();

  return (
    <div className='flex flex-col items-center'>
      <div className='my-[200px] font-semibold text-2xl'>
      <p className='flex justify-center'>{userDetail?.name}</p>
      <p className='flex justify-center'>{userDetail?.email}</p>
      <p className='flex justify-center'>{userDetail?.address}</p>
      <p className='flex justify-center'>{userDetail?.company}</p>

      </div>
      <button className='flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Order History</button>
      <button className='flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-5'>Track Orders</button>
    </div>
  );
};

export default CustProfile;