/*
  Warnings:

  - Changed the type of `coordinates` on the `Camera` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Camera" DROP COLUMN "coordinates",
ADD COLUMN     "coordinates" JSONB NOT NULL;
