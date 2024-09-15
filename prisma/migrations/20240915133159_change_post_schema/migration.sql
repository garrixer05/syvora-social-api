/*
  Warnings:

  - The `likes` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "likes",
ADD COLUMN     "likes" TEXT[];
