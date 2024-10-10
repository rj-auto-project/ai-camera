-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "crowdCountThreshold" VARCHAR(10),
ADD COLUMN     "imageCoordinates" JSONB,
ADD COLUMN     "vehicleCountThreshold" VARCHAR(10);
