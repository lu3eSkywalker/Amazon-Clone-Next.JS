/*
  Warnings:

  - The `cart` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "cart",
ADD COLUMN     "cart" INTEGER[];
