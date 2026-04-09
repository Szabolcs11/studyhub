import type { Comment } from "../types/comments";
import CommentReply from "./CommentReply";
import "./CommentThread.css";

interface CommentThreadProps {
  comments: Comment[];
}

export default function CommentThread({ comments }: CommentThreadProps) {
  return (
    <div className="comment-thread">
      {comments.map((comment) => (
        <CommentReply key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  );
}
