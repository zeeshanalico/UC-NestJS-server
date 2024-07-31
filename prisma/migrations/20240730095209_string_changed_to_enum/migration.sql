/*
  Warnings:

  - The `status` column on the `url` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `url_type` to the `url` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "URLTYPE" AS ENUM ('store', 'product', 'misc');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "url" DROP COLUMN "url_type",
ADD COLUMN     "url_type" "URLTYPE" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'active';
