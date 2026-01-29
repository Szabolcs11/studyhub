import React, { useState, useRef } from "react";
import fileService from "../../../services/fileService";
import { API_URL } from "../../../constans";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("A fájl mérete nem lehet nagyobb 10MB-nál!");
      return;
    }
    setSelectedFile(file);
    setFormData((prev) => ({
      ...prev,
      AttachmentUrl: "",
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.AttachmentUrl;
    }

    setIsUploading(true);
    try {
      const filename = await fileService.uploadFile(selectedFile);
      return filename;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Title.trim()) {
      alert("A cím mező kötelező!");
      return;
    }

    try {
      let attachmentUrl = formData.AttachmentUrl;

      if (selectedFile) {
        attachmentUrl = await uploadFile();
        attachmentUrl = API_URL + "files/" + attachmentUrl;
      }

      await onSubmit({
        ...formData,
        AttachmentUrl: attachmentUrl,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Hiba történt a jegyzet létrehozása közben";
      alert(errorMessage);
    }
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
            <label className="form-label">Melléklet</label>

            {!selectedFile ? (
              <div
                className={`file-upload-area ${isDragOver ? "drag-over" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="upload-text">Húzd ide a fájlt vagy kattints a feltöltéshez</p>
                <p className="upload-subtext">
                  Támogatott formátumok: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG (Max. 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                  disabled={isLoading || isUploading}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="selected-file">
                <div className="file-info">
                  <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="file-details">
                    <p className="file-name">{selectedFile.name}</p>
                    <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-file-button"
                  onClick={removeFile}
                  disabled={isLoading || isUploading}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {!selectedFile && (
              <div className="url-input-container">
                <label className="form-label" htmlFor="attachmentUrl">
                  Vagy add meg a melléklet URL-jét
                </label>
                <input
                  type="url"
                  id="attachmentUrl"
                  name="AttachmentUrl"
                  value={formData.AttachmentUrl}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/document.pdf"
                  disabled={isLoading || isUploading}
                />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-button secondary"
              onClick={onClose}
              disabled={isLoading || isUploading}
            >
              Mégse
            </button>
            <button type="submit" className="modal-button primary" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? "Feldolgozás..." : "Jegyzet létrehozása"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;
