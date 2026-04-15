import { useEffect, useState } from "react";
import CommentThread from "./CommentThread";
import CommentForm from "./CommentForm";
import "./CommentModal.css";
import { commentService } from "../services/commentService";
import type { Comment } from "../types/comments";
import { toast } from "react-toastify";

interface CommentModalProps {
  noteId: number;
  isOpen: boolean;
  onClose: () => void;
  noteTitle: string;
  onCommentAdded: () => void;
}

export default function CommentModal({ noteId, isOpen, onClose, noteTitle, onCommentAdded }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, noteId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await commentService.fetchNoteComments(noteId);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (content: string) => {
    setIsSubmitting(true);
    try {
      const newComment = await commentService.createComment(noteId, {
        content,
      });
      setComments((prev) => [newComment, ...prev]);
      onCommentAdded();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="comment-modal-overlay" onClick={onClose}>
      <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comment-modal-header">
          <h2 className="comment-modal-title">{noteTitle}</h2>
          <button className="comment-modal-close" onClick={onClose} aria-label="Bezárás">
            ✕
          </button>
        </div>

        <div className="comment-modal-body">
          <div className="comment-modal-form-section">
            <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
          </div>

          <div className="comment-modal-list-section">
            <h3 className="comment-modal-subtitle">
              Megjegyzések ({comments.length}){isLoading && <span className="comment-loading-indicator">...</span>}
            </h3>

            {comments.length === 0 && !isLoading ? (
              <p className="comment-modal-empty">Még nincsenek megjegyzések. Légy az első!</p>
            ) : (
              <div className="comment-modal-thread">
                <CommentThread comments={comments} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
