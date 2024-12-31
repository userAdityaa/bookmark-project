import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function deleteBookmarkAndItems(bookmarkId: number, userId: number) {
  try {
    // First verify the bookmark belongs to the user
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: userId
      }
    });

    if (!bookmark) {
      throw new Error('Bookmark not found or unauthorized');
    }

    // Use a transaction to ensure both operations complete or none do
    const result = await prisma.$transaction(async (tx) => {
      // Delete all related list items first
      await tx.listItem.deleteMany({
        where: {
          bookmarkId: bookmarkId
        }
      });

      // Then delete the bookmark
      const deletedBookmark = await tx.bookmark.delete({
        where: {
          id: bookmarkId
        }
      });

      return deletedBookmark;
    });

    return result;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
}