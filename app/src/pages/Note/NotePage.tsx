import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINTS } from "../../constans";
import type { Note } from "../../types/courses";

function NotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = async () => {
    try {
      const response = await axios.get(ENDPOINTS.NOTE + id, { withCredentials: true });
      if (response.data) {
        setNote(response.data);
      }
    } catch (err) {
      setError("Hiba történt a jegyzet betöltése közben");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="course-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Jegyzet betöltése...</div>
          <div className="loading-subtext">Egy pillanat, összegyűjtjük a jegyzet adatait</div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="course-detail-layout">
        <div className="error-container">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="error-title">Hiba történt</div>
          <div className="error-message">{error || "A keresett jegyzet nem található"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-layout">
      <div className="course-detail-container">
        <section className="course-info-section">
          <div className="course-info-header">
            <div className="course-info-content">
              <h1>{note.Title}</h1>
              <div className="subtitle">
                <span className="course-breadcrumb">Jegyzet részletei</span>
              </div>
            </div>
          </div>

          {note.Description && (
            <div className="course-description">
              <h3>Leírás</h3>
              <p>{note.Description}</p>
            </div>
          )}

          <div className="course-meta">
            <div className="meta-item">
              <span className="meta-label">Jegyzet azonosító:</span>
              <span className="meta-value">#{note.Id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Kurzus azonosító:</span>
              <span className="meta-value">#{note.CourseId}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Feltöltő azonosító:</span>
              <span className="meta-value">#{note.UploaderUserId}</span>
            </div>
          </div>
        </section>

        <section className="notes-section">
          <div className="notes-header">
            <h2 className="notes-title">Jegyzet tartalma</h2>
          </div>

          <div className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.Title}</h3>
            </div>

            {note.Description && <div className="note-description">{note.Description}</div>}

            {note.AttachmentUrl && (
              <a href={note.AttachmentUrl} target="_blank" rel="noopener noreferrer" className="note-attachment">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span>Melléklet megtekintése</span>
              </a>
            )}

            <div className="note-meta">
              <div className="note-date">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Létrehozva: {formatDate(note.CreatedAt)}
              </div>
              {note.LastEdited && (
                <div className="note-date">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Módosítva: {formatDate(note.LastEdited)}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NotePage;
