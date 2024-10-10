/*
  Warnings:

  - You are about to alter the column `crowdCountThreshold` on the `Camera` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - You are about to alter the column `vehicleCountThreshold` on the `Camera` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "Camera" ALTER COLUMN "crowdCountThreshold" DROP DEFAULT,
ALTER COLUMN "crowdCountThreshold" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "vehicleCountThreshold" DROP DEFAULT,
ALTER COLUMN "vehicleCountThreshold" SET DATA TYPE VARCHAR(10);
