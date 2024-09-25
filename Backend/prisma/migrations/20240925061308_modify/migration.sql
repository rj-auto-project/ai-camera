/*
  Warnings:

  - You are about to drop the column `resolved` on the `IncidentLogs` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `IncidentLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IncidentLogs" DROP COLUMN "resolved",
DROP COLUMN "resolvedAt",
ADD COLUMN     "modelResolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modelResolvedAt" TIMESTAMP(3),
ADD COLUMN     "userResolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userResolvedAt" TIMESTAMP(3);
