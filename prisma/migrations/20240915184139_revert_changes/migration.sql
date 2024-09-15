/*
  Warnings:

  - You are about to drop the column `followers` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `following` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "followers",
DROP COLUMN "following";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "followers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "following" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
