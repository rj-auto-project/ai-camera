/*
  Warnings:

  - You are about to drop the column `cameraId` on the `OperationLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "operationLogId" INTEGER;

-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "cameraId";

-- AddForeignKey
ALTER TABLE "Camera" ADD CONSTRAINT "Camera_operationLogId_fkey" FOREIGN KEY ("operationLogId") REFERENCES "OperationLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
