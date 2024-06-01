-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'delivered');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "custId" INTEGER NOT NULL,
    "prodId" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_custId_fkey" FOREIGN KEY ("custId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
