-- AlterEnum
ALTER TYPE "IncidentType" ADD VALUE 'WATERLOGGING';

-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "areaName" VARCHAR(255);

-- AlterTable
ALTER TABLE "IncidentLogs" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false;
