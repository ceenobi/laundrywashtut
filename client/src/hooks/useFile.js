import { useState } from "react";
import { toast } from "react-toastify";

export function useFile() {
  const [selectedFile, setSelectedFile] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File with maximum size of 5MB is allowed");
      return;
    }
    const validFile = file?.type.startsWith("image/");
    if (!validFile) {
      toast.error("Only image files is allowed");
      return;
    }
    //convert image file to base64 url string
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onerror = () => {
        toast.error("Error reading file");
      };
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  return { selectedFile, setSelectedFile, handleFile };
}
