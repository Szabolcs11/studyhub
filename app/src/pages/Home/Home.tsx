import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommentModal from "../../components/CommentModal";
import notesService from "../../services/notesService";
import { type Course, type Faculty, type Note } from "../../types/courses";
import FeedSkeleton from "./Components/FeedSkeleton";
import "./Home.css";

interface NoteWithCourseInfo extends Note {
  Course?: Course;
  Faculty?: Faculty;
  UploaderName?: string;
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<NoteWithCourseInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");
  const [selectedNoteForComments, setSelectedNoteForComments] = useState<NoteWithCourseInfo | null>(null);

  const getNotes = async () => {
    try {
      setIsLoading(true);
      const notesData = await notesService.getNotes();
      if (notesData) {
        setNotes(notesData);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Hiba történt a jegyzetek betöltése közben");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Ismeretlen időpont";
      }

      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) {
        return "Épp most";
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} perce`;
      } else if (diffInHours < 24) {
        return `${diffInHours} órával ezelőtt`;
      } else if (diffInDays < 7) {
        return `${diffInDays} napja`;
      } else {
        return new Intl.DateTimeFormat("hu-HU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date);
      }
    } catch {
      return "Ismeretlen időpont";
    }
  };

  const handleDownloadAttachment = (note: NoteWithCourseInfo) => {
    if (note.AttachmentUrl) {
      window.open(note.AttachmentUrl, "_blank");
    }
  };

  const likeNote = async (noteId: number) => {
    const result = await notesService.likeNote(noteId);
    if (result.success) {
      toast.success(result.message);
      if ((result as any).liked) {
        setNotes((prev) =>
          prev.map((note) => (note.Id === noteId ? { ...note, LikeCount: note.LikeCount + 1, Liked: true } : note)),
        );
      } else {
        setNotes((prev) =>
          prev.map((note) => (note.Id === noteId ? { ...note, LikeCount: note.LikeCount - 1, Liked: false } : note)),
        );
      }
    } else {
      toast.error(result.message);
    }
  };

  const filteredAndSortedNotes = notes
    .filter(
      (note) =>
        note.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.Course?.Name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
      } else {
        return new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime();
      }
    });

  const increaseNoteCommentCount = (noteId: number) => {
    setNotes((prev) =>
      prev.map((note) => (note.Id === noteId ? { ...note, CommentCount: note.CommentCount + 1 } : note)),
    );
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="home-container">
      <div className="feed-header">
        <h1>StudyHub Feed</h1>
        <p>Fedezd fel a legfrissebb jegyzeteket a közösségtől!</p>
      </div>

      <div className="feed-controls">
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Keresés jegyzetekre, kurzusokra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "recent" | "oldest")}
          className="sort-select"
        >
          <option value="recent">Legfrissebb elöl</option>
          <option value="oldest">Legrégebbi elöl</option>
        </select>
      </div>

      <div className="feed-container">
        {filteredAndSortedNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>{searchQuery ? "Nincs találat" : "Még nincsenek jegyzetek"}</h3>
            <p>
              {searchQuery ? "Próbálj meg más kulcsszavakkal keresni" : "Légy te az első, aki megoszt egy jegyzetet!"}
            </p>
          </div>
        ) : (
          <div className="notes-feed">
            {filteredAndSortedNotes.map((note) => (
              <div key={note.Id} className="note-card">
                <div className="note-header">
                  <div className="user-info">
                    <div className="user-avatar">{note.User?.Nickname?.charAt(0).toUpperCase() || "?"}</div>
                    <div className="user-details">
                      <div className="user-name">{note.User?.Nickname}</div>
                      <div className="course-info">
                        {note.Course?.Name || "Ismeretlen kurzus"} • {note.Faculty?.Name || "Ismeretlen kar"}
                      </div>
                    </div>
                  </div>
                  <div className="note-timestamp">{formatDate(note.CreatedAt)}</div>
                </div>

                <div className="note-content">
                  <h3 className="note-title">{note.Title}</h3>
                  {note.Description && <p className="note-description">{note.Description}</p>}
                </div>

                {note.AttachmentUrl && (
                  <div className="note-attachment">
                    <div className="attachment-info">
                      <svg className="attachment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <span className="attachment-name">Melléklet</span>
                    </div>
                    <button onClick={() => handleDownloadAttachment(note)} className="download-button">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Letöltés
                    </button>
                  </div>
                )}

                <div className="note-actions">
                  <button className="action-button like-button" onClick={() => likeNote(note.Id)}>
                    <svg
                      fill={note.Liked ? "red" : "none"}
                      stroke={note.Liked ? "red" : "currentColor"}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>Kedvelés ({note.LikeCount})</span>
                  </button>

                  <button className="action-button comment-button" onClick={() => setSelectedNoteForComments(note)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>Hozzászólás ({note.CommentCount})</span>
                  </button>

                  <button className="action-button share-button">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    <span>Megosztás</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedNoteForComments && (
        <CommentModal
          noteId={selectedNoteForComments.Id}
          noteTitle={selectedNoteForComments.Title}
          isOpen={!!selectedNoteForComments}
          onClose={() => setSelectedNoteForComments(null)}
          onCommentAdded={() => increaseNoteCommentCount(selectedNoteForComments.Id)}
        />
      )}
    </div>
  );
}

export default Home;
