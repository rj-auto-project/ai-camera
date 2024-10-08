/*
  Warnings:

  - Made the column `objectType` on table `Class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "objectType" SET NOT NULL;

-- AlterTable
ALTER TABLE "OperationLog" ADD COLUMN     "operationStatus" "Status" NOT NULL DEFAULT 'ACTIVE';
