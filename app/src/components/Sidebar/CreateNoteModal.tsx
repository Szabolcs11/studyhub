import React, { useState, useRef } from "react";
import fileService from "../../services/fileService";

interface CreateNoteModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; attachmentUrl: string }) => Promise<void>;
  isLoading: boolean;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attachmentUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      attachmentUrl: ""
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
      return formData.attachmentUrl;
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
    
    if (!formData.title.trim()) {
      alert("A cím mező kötelező!");
      return;
    }

    try {
      let attachmentUrl = formData.attachmentUrl;
      
      if (selectedFile) {
        attachmentUrl = await uploadFile();
      }

      await onSubmit({
        ...formData,
        attachmentUrl
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Hiba történt a jegyzet létrehozása közben";
      alert(errorMessage);
    }
  };

  return (
    <div className="modal-header">
      <h2 className="modal-title">Új jegyzet létrehozása</h2>
      <button className="modal-close-button" onClick={onClose}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Cím *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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
            name="description"
            value={formData.description}
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
            name="attachmentUrl"
            value={formData.attachmentUrl}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/document.pdf"
            disabled={isLoading}
          />
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="modal-button secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            Mégse
          </button>
          <button 
            type="submit" 
            className="modal-button primary" 
            disabled={isLoading}
          >
            {isLoading ? "Létrehozás..." : "Jegyzet létrehozása"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNoteModal;