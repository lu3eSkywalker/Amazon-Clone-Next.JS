-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "custId" INTEGER NOT NULL,
    "prodId" INTEGER NOT NULL,
    "review" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_custId_fkey" FOREIGN KEY ("custId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
