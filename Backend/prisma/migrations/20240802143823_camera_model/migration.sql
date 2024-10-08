-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ACCESSLEVEL" AS ENUM ('ADMIN', 'WORK', 'VIEW', 'SERVER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access_level" "ACCESSLEVEL" NOT NULL DEFAULT 'VIEW';

-- CreateTable
CREATE TABLE "Camera" (
    "cameraId" VARCHAR(30) NOT NULL,
    "cameraIp" VARCHAR(30) NOT NULL,
    "facingAngle" VARCHAR(5) NOT NULL,
    "location" VARCHAR(50) NOT NULL,
    "coordinates" VARCHAR(50) NOT NULL,
    "cameraName" VARCHAR(50) NOT NULL,
    "connectionType" VARCHAR(10) NOT NULL,
    "cameraType" VARCHAR(10) NOT NULL,
    "status" "Status" NOT NULL,
    "installed" TIMESTAMP(3) NOT NULL,
    "lastOnline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("cameraId")
);
