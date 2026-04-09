import { useState } from "react";
import "./CommentForm.css";

interface CommentFormProps {
  onSubmit?: (content: string) => void;
  isSubmitting?: boolean;
}

export default function CommentForm({ onSubmit, isSubmitting = false }: CommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent("");
    }
  };

  const isFormValid = content.trim().length > 0;

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form-group">
        <textarea
          id="content"
          className="comment-form-input"
          placeholder="Írj egy megjegyzést..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="comment-form-footer">
        <button type="submit" className="comment-form-btn" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? "Küldés..." : "Megjegyzés küldése"}
        </button>
      </div>
    </form>
  );
}
