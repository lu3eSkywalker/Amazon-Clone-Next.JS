import ProductCard from '@/components/WebsitePage/ProductCard';
import { useRouter } from 'next/router';
import React from 'react'


interface Product {
    name: string;
    description: string;
    cloudinaryUrl: string;
    id: string;
    price: string;
}

interface PageProps {
    initialData: Product[];
}

const categorypageserverside = ({ initialData}: PageProps) => {
    const router = useRouter();
    const { page, category } = router.query;

    const handlePageChange = (newPage: number) => {
        router.push(`/categorypageserverside/?category=${category}&page=${newPage}&limit=5`);
    };

    const handleCategoryChange = (newCategory: string) => {
        router.push(`/categorypageserverside/?category=${newCategory}&page=1&limit=5`);
    }

  return (
    <div>

        <div className='flex mx-5 py-5 px-5'>
            <button onClick={() => handleCategoryChange('video_game')} className="mx-4 relative inline-block px-4 py-2 font-medium group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white">Video Games</span>
            </button>

            <br></br>

            <button onClick={() => handleCategoryChange('clothes')} className="mx-4 relative inline-block px-4 py-2 font-medium group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white">Clothes</span>
            </button>

            <br></br> 


            <button onClick={() => handleCategoryChange('electronics')} className="mx-4 relative inline-block px-4 py-2 font-medium group">
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-black group-hover:text-white">Electronics</span>
            </button>

            </div>
         

        <ProductCard data={initialData} />

        <div className='flex justify-center'>
            {[...Array(5)].map((_, index) => (
                <button key={index} 
                className={`mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${parseInt(page as string, 10) === index + 1 ? 'bg-gray-200' : ''}`}
                onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    </div>
  )
}

export async function getServerSideProps(context: { query: { page?: string, category?: string }}) {
    const { page = '1', category='electronics'} = context.query;

    const fetchData = async (page: number): Promise<Product[]> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bycategory/${category}?page=${page}&limit=5`);
            const data = await response.json();
            return data.data || [];
        }
        catch(error) {
            console.log("Error: ", error);
            return [];
        }
    }

    const initialData = await fetchData(parseInt(page, 10));

    return {
        props: {
            initialData,
            initialPage: parseInt(page, 10)
        }
    };

}

export default categorypageserverside