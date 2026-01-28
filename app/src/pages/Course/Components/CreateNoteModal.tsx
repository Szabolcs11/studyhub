import React, { useState } from "react";

interface CreateNoteModalProps {
  onClose: () => void;
  onSubmit: (data: { Title: string; Description: string; AttachmentUrl: string }) => Promise<void>;
  isLoading: boolean;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    AttachmentUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Title.trim()) {
      alert("A cím mező kötelező!");
      return;
    }

    await onSubmit(formData);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Új jegyzet létrehozása</h2>
          <button className="modal-close-button" onClick={onClose}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Cím *
            </label>
            <input
              type="text"
              id="title"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              className="form-input"
              placeholder="Add meg a jegyzet címét..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Leírás
            </label>
            <textarea
              id="description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Add meg a jegyzet leírását..."
              rows={5}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="attachmentUrl">
              Melléklet URL
            </label>
            <input
              type="url"
              id="attachmentUrl"
              name="AttachmentUrl"
              value={formData.AttachmentUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/document.pdf"
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-button secondary" onClick={onClose} disabled={isLoading}>
              Mégse
            </button>
            <button type="submit" className="modal-button primary" disabled={isLoading}>
              {isLoading ? "Létrehozás..." : "Jegyzet létrehozása"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;
