import { useState } from "react";
import CommentThread from "./CommentThread";
import CommentForm from "./CommentForm";
import "./CommentSection.css";
import { commentService } from "../services/commentService";
import type { Comment } from "../types/comments";

interface CommentSectionProps {
  noteId: number;
  comments: Comment[];
  isLoading?: boolean;
  onCommentAdded?: (comment: Comment) => void;
}

export default function CommentSection({ noteId, comments, isLoading = false, onCommentAdded }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (content: string) => {
    setIsSubmitting(true);
    try {
      const newComment = await commentService.createComment(noteId, {
        content,
      });
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Hiba történt a megjegyzés küldése közben");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h3 className="comment-section-title">
          Megjegyzések ({comments.length}){isLoading && <span className="comment-loading-indicator">...</span>}
        </h3>
        <button
          className="comment-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Megjegyzések elrejtése" : "Megjegyzések megjelenítése"}
        >
          {isExpanded ? "▼" : "▶"}
        </button>
      </div>
      {isExpanded && (
        <div className="comment-section-content">
          <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
          {comments.length === 0 && !isLoading ? (
            <p className="comment-empty">Még nincsenek megjegyzések.</p>
          ) : (
            <CommentThread comments={comments} />
          )}
        </div>
      )}
    </div>
  );
}
