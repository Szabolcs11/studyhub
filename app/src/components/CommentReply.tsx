import type { Comment } from "../types/comments";
import "./CommentReply.css";

interface CommentReplyProps {
  comment: Comment;
  depth?: number;
}

export default function CommentReply({ comment, depth = 0 }: CommentReplyProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="comment-reply" style={{ marginLeft: `${depth * 24}px` }}>
      <div className="comment-header">
        <span className="comment-author">{comment.Username}</span>
        <span className="comment-date">{formatDate(comment.CreatedAt)}</span>
      </div>
      <div className="comment-content">{comment.Text}</div>
    </div>
  );
}
