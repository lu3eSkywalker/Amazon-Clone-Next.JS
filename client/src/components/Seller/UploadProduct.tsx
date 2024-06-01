import { useRouter } from 'next/navigation';
import React, { FormEvent, useState, ChangeEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


interface FormData {
  name: string,
  price: number,
  description: string,
  category: string,
}



const UploadProduct = () => {
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    description: '',
    category: '',
  });

  const router = useRouter();


  const redirectToFrontPage = () => {
    const role = localStorage.getItem('role');
    if(role === 'customer') {
      router.push('/firstpage')
    }
  }

useEffect(() => {
  redirectToFrontPage();
}, [])


  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
    }));
};




  const postItemPhoto = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault();
    const files = event.target.files;
    if (!files) return;

    const file = files[0];

    const userId = localStorage.getItem('id');
    console.log(userId)

    const imageData = new FormData();

    imageData.append('image', file)
    imageData.append('sellerId', userId || '')
    imageData.append('name', formData.name)
    imageData.append('price', String(formData.price))
    imageData.append('description', formData.description)
    imageData.append('category', formData.category)

    const token = localStorage.getItem('accessToken')

    try {
      // const savedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload`, {
      const savedResponse = await fetch(`http://localhost:4000/api/v1/upload`, {

        method: "POST",
        headers: {
          'Authorization': `${token}`
      },
        body: imageData
      });

      const res = await savedResponse.json()
      console.log(token)
      console.log(res)
      console.log(res.data)
    }
    catch(error) {
      console.log("Error: ", error)
    }
    // console.log(imageData)
  }


  return (
    <div>

<div className='flex justify-center py-2'>

      
      <form className='flex flex-col py-2'>
        <input
        type='text' 
        name='name'
        placeholder='name'
        value={formData.name}
        onChange={changeHandler}
        className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
        />

      <label>Price</label>
        <input
        type='number' 
        name='price'
        placeholder='price'
        value={formData.price}
        onChange={changeHandler}
        className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
        />

        <input
        type='text' 
        name='description'
        placeholder='description'
        value={formData.description}
        onChange={changeHandler}
        className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
        />

        <input
        type='text' 
        name='category'
        placeholder='category'
        value={formData.category}
        onChange={changeHandler}
        className='border border-gray-300 rounded h-9 w-75 placeholder: px-2 mb-2'
        />


      <input type='file' onChange={postItemPhoto} id='fileInput' />

        <label htmlFor='fileInput'>
          <button type='button' >Upload</button>
        </label>

      </form>

      </div>
    </div>
  )
}

export default UploadProduct