import axios from "axios";
import { ENDPOINTS } from "../constans";

class FileService {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(ENDPOINTS.UPLOAD_FILE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || "Hiba történt a fájl feltöltése közben";
      throw new Error(errorMessage);
    }
  }
}

const fileService = new FileService();
export default fileService;