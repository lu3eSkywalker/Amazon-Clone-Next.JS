import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_REVIEWS_BY_PRODUCT_ID = gql`
  query {
    reviewbyproductid(id: 2) {
      review
      prodId
        custId
    }
  }
`;

// Define the type for the review object
interface Review {
  review: string;
  prodId: number;
custId: number;
}

const ReviewsComponent = () => {
  const { loading, error, data } = useQuery(GET_REVIEWS_BY_PRODUCT_ID);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Type assertion for data
  const reviews: Review[] = data.reviewbyproductid;
  console.log(reviews)

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review: Review, index: number) => (
          <li key={index}>
            <p>{review.review}</p>
            <p>{review.prodId}</p>
            <p>{review.custId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewsComponent;