/*
  Warnings:

  - The `metaCoords` column on the `IncidentLogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "IncidentLogs" DROP COLUMN "metaCoords",
ADD COLUMN     "metaCoords" DOUBLE PRECISION[];
