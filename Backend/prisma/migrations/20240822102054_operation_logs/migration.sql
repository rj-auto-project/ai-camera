/*
  Warnings:

  - The `cameraId` column on the `OperationLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "cameraId",
ADD COLUMN     "cameraId" VARCHAR(20)[];
