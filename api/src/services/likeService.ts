import { likeQuerries } from "../database/likeQuerries";

export const likeService = {
  async likeNote(noteId: number, userId: number): Promise<boolean> {
    const liked = await likeQuerries.findLike(noteId, userId);
    if (liked) {
      await likeQuerries.deleteLike(noteId, userId);
      return false;
    }
    return await likeQuerries.insertLike(noteId, userId);
  },
};
