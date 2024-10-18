-- AlterTable
ALTER TABLE "IncidentLogs" ADD COLUMN     "alerts" INTEGER,
ADD COLUMN     "wrongDetection" BOOLEAN NOT NULL DEFAULT false;
