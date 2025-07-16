/*
  Warnings:

  - You are about to drop the column `questionPoolId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `correctQuestionId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `wrongQuestionId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the `QuestionPool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `questionText` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_questionPoolId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionPool" DROP CONSTRAINT "QuestionPool_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_quizId_fkey";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "questionPoolId",
DROP COLUMN "quizId",
ADD COLUMN     "questionText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "correctQuestionId",
DROP COLUMN "points",
DROP COLUMN "quizId",
DROP COLUMN "wrongQuestionId",
ADD COLUMN     "correctCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wrongCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "QuestionPool";

-- DropTable
DROP TABLE "Quiz";

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
