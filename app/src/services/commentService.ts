import axios from "axios";
import { ENDPOINTS } from "../constans";
import type { Comment } from "../types/comments";

export interface CreateCommentRequest {
  content: string;
}

export const commentService = {
  /**
   * Fetch all comments for a note
   */
  fetchNoteComments: async (noteId: number): Promise<Comment[]> => {
    try {
      const response = await axios.get(ENDPOINTS.NOTE_COMMENTS(noteId), {
        withCredentials: true,
      });
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      throw error;
    }
  },

  /**
   * Create a new comment on a note
   */
  createComment: async (noteId: number, data: CreateCommentRequest, parentCommentId?: string): Promise<Comment> => {
    try {
      const payload = {
        ...data,
        parentCommentId: parentCommentId || null,
      };
      const response = await axios.post(ENDPOINTS.NOTE_COMMENTS(noteId), payload, { withCredentials: true });
      if (response.data.success) {
        return response.data.comment;
      } else {
        throw new Error(response.data.message || "Failed to create comment");
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
      throw error;
    }
  },
};
