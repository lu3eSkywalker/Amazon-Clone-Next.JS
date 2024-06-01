import ProductCard from '@/components/WebsitePage/ProductCard';
import React from 'react';
import { useRouter } from 'next/router';

interface Product {
    name: string;
    description: string;
    cloudinaryUrl: string;
    id: string;
    price: string;
}

interface PageProps {
    initialData: Product[];
    initialPage: number;
    initialLimit: number;
}

const FirstPageServerSide = ({ initialData, initialPage}: PageProps) => {
  const router = useRouter();
  const { page } = router.query;

  const handlePageChange = (newPage: number) => {
    router.push(`/firstpageserverside?page=${newPage}&limit=5`);
  };

  return (
    <div>
      <ProductCard data={initialData} />
      
      <div className='flex justify-center'>
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            className={`mx-1 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${parseInt(page as string, 10) === index + 1 ? 'bg-gray-200' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: { query: { page?: string }}) {
    const { page = '1'} = context.query;
    
    const fetchData = async (page: number): Promise<Product[]> => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/productPagination?page=${page}&limit=5`);
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("Error fetching data:", error);
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

export default FirstPageServerSide;