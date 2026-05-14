import { useState, type DragEvent, type ChangeEvent } from "react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  accept?: string;
  label?: string;
}

export const FileDropzone = ({ onFileSelect, isLoading, accept, label }: FileDropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!isLoading && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
      onDrop={handleDrop}
      onClick={() => !isLoading && document.getElementById("file-upload")?.click()}
      style={{
        border: `2px dashed ${isDragOver ? "#2196F3" : "#ccc"}`,
        borderRadius: "8px",
        padding: "40px",
        textAlign: "center",
        backgroundColor: isDragOver ? "#e3f2fd" : "#fafafa",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.6 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <p>{isLoading ? "Обработка..." : label || "Перетащите файл сюда"}</p>
      <input
        id="file-upload"
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  );
};