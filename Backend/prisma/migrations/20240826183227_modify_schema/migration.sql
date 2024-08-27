-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "manufacturer" VARCHAR(30),
ADD COLUMN     "routerIp" VARCHAR(30);

-- AlterTable
ALTER TABLE "DetectionLog" ALTER COLUMN "timestamp" SET DATA TYPE VARCHAR(255);
