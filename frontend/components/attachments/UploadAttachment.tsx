"use client";

import axios from "@/lib/axios";
import { useState } from "react";
import { Upload } from "lucide-react";

interface UploadAttachmentProps {
  taskId: number;
  onUploaded?: () => void;
}

export default function UploadAttachment({
  taskId,
  onUploaded,
}: UploadAttachmentProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);

      await axios.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUploaded?.();
      e.target.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      alert("Dosya yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
      <Upload size={16} />
      {loading ? "Yükleniyor..." : "Dosya Yükle"}
      <input type="file" multiple hidden onChange={handleUpload} />
    </label>
  );
}
