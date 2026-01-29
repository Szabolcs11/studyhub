import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINTS } from "../../constans";
import type { Note } from "../../types/courses";

function NotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchNote = async () => {
    const response = await axios.get(ENDPOINTS.NOTE + id, { withCredentials: true });
    if (response.data) {
      setNote(response.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  if (isLoading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div>
      <p>Note page</p>
      <p>{JSON.stringify(note)}</p>
    </div>
  );
}

export default NotePage;
