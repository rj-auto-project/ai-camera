/*
  Warnings:

  - The `crowdCountThreshold` column on the `Camera` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `vehicleCountThreshold` column on the `Camera` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Camera" DROP COLUMN "crowdCountThreshold",
ADD COLUMN     "crowdCountThreshold" INTEGER DEFAULT 0,
DROP COLUMN "vehicleCountThreshold",
ADD COLUMN     "vehicleCountThreshold" INTEGER DEFAULT 0;
