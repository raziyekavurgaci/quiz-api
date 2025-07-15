/*
  Warnings:

  - You are about to drop the column `correct` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `wrong` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "correct",
DROP COLUMN "wrong",
ADD COLUMN     "correctQuestionId" TEXT[],
ADD COLUMN     "wrongQuestionId" TEXT[];
