/*
  Warnings:

  - You are about to drop the column `operationLogId` on the `Camera` table. All the data in the column will be lost.
  - You are about to drop the column `operationData` on the `OperationLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Camera" DROP CONSTRAINT "Camera_operationLogId_fkey";

-- AlterTable
ALTER TABLE "Camera" DROP COLUMN "operationLogId";

-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "operationData",
ADD COLUMN     "operationRequestData" JSON,
ADD COLUMN     "operationResponseData" JSON,
ALTER COLUMN "operationType" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "_OperationCameras" (
    "A" VARCHAR(30) NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OperationCameras_AB_unique" ON "_OperationCameras"("A", "B");

-- CreateIndex
CREATE INDEX "_OperationCameras_B_index" ON "_OperationCameras"("B");

-- AddForeignKey
ALTER TABLE "_OperationCameras" ADD CONSTRAINT "_OperationCameras_A_fkey" FOREIGN KEY ("A") REFERENCES "Camera"("cameraId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationCameras" ADD CONSTRAINT "_OperationCameras_B_fkey" FOREIGN KEY ("B") REFERENCES "OperationLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
