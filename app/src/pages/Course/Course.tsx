import { useState } from "react";
import { useCourseDetail } from "../../hooks/useCourseDetail";
import CreateNoteModal from "./Components/CreateNoteModal";
import { navigator } from "../../navigator";
import { PATHS } from "../../navigator/Routes";

function Course() {
  const {
    course,
    faculty,
    notes,
    isLoading,
    error,
    isAuthenticated,
    isCreatingNote,
    createNote,
    deleteNote,
    formatDate,
  } = useCourseDetail();

  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) {
    return (
      <div className="course-detail-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Kurzus betöltése...</div>
          <div className="loading-subtext">Egy pillanat, összegyűjtjük a kurzus adatait</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
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
          <div className="error-message">{error || "A keresett kurzus nem található"}</div>
        </div>
      </div>
    );
  }

  const handleCreateNote = async (noteData: { Title: string; Description: string; AttachmentUrl: string }) => {
    console.log(noteData);
    const success = await createNote(noteData);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    await deleteNote(noteId);
  };

  return (
    <div className="course-detail-layout">
      <div className="course-detail-container">
        <section className="course-info-section">
          <div className="course-info-header">
            {/* <button className="course-back-button" onClick={() => window.history.back()} title="Vissza a kurzusokhoz">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button> */}
            <div className="course-info-content">
              <h1>{course.Name}</h1>
              <div className="subtitle">
                <span className="course-breadcrumb">Kurzus részletei</span>
              </div>
            </div>
          </div>

          <div className="course-description">
            <h3>Leírás</h3>
            <p>{course.Description || "Nincs leírás megadva ehhez a kurzushoz."}</p>
          </div>

          <div className="course-meta">
            <div className="meta-item">
              <span className="meta-label">Kurzuskód:</span>
              <span className="meta-value">#{course.Id}</span>
            </div>
            {faculty && (
              <div className="meta-item">
                <span className="meta-label">Kar:</span>
                <span className="meta-value">{faculty.Name}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">Jegyzetek száma:</span>
              <span className="meta-value">{notes.length} darab</span>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        <section className="notes-section">
          <div className="notes-header">
            <h2 className="notes-title">Jegyzetek ({notes.length})</h2>
            {isAuthenticated ? (
              <button className="create-note-button" onClick={() => setShowCreateModal(true)} disabled={isCreatingNote}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Új jegyzet
              </button>
            ) : (
              <></>
            )}
          </div>

          {notes.length === 0 ? (
            <div className="empty-container">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="empty-title">Még nincsenek jegyzetek</div>
              <div className="empty-message">
                {isAuthenticated
                  ? "Légy te az első, aki feltölt egy jegyzetet ehhez a kurzushoz!"
                  : "Jelentkezz be, hogy jegyzeteket tölthess fel vagy nézhess meg."}
              </div>
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div
                  key={note.Id}
                  className="note-card"
                  onClick={() => navigator(PATHS.NOTES + note.Id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="note-header">
                    <h3 className="note-title">{note.Title}</h3>
                    {isAuthenticated && (
                      <div className="note-actions">
                        <button
                          className="note-action-button delete"
                          onClick={() => handleDeleteNote(note.Id)}
                          title="Jegyzet törlése"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
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
                      {formatDate(note.CreatedAt)}
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
                        {formatDate(note.LastEdited)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <CreateNoteModal
              onClose={() => setShowCreateModal(false)}
              onSubmit={handleCreateNote}
              isLoading={isCreatingNote}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;
