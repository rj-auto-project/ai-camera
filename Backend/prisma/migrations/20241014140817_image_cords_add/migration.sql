-- AlterTable
ALTER TABLE "Camera" ADD COLUMN     "illegalParkingCords" JSONB,
ADD COLUMN     "redlightCrossingCords" JSONB,
ADD COLUMN     "wrongwayCords" JSONB;
