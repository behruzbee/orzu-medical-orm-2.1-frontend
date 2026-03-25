import { useState, type DragEvent, type ChangeEvent } from "react";

export const ImportPatientsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Обработчики Drag-and-Drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  // Обработчик обычного клика (input type="file")
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // Проверка, что это Excel
  const validateAndSetFile = (selectedFile: File) => {
    if (
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      selectedFile.type === "application/vnd.ms-excel" ||
      selectedFile.name.endsWith(".xlsx") ||
      selectedFile.name.endsWith(".xls")
    ) {
      setFile(selectedFile);
      setIsConfirmModalOpen(true); // Сразу открываем подтверждение
    } else {
      alert("Пожалуйста, загрузите только Excel файл (.xlsx или .xls)");
    }
  };

  // Отправка на сервер
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // По FSD сам запрос лучше вынести в слой features или shared/api,
      // но для наглядности логика здесь:
      const response = await fetch(import.meta.env.VITE_SERVER_API + "/patients/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Файл успешно загружен и пациенты добавлены!");
        setFile(null);
        setIsConfirmModalOpen(false);
      } else {
        alert("Ошибка при загрузке файла на сервер.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Произошла ошибка при отправке.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Импорт пациентов из Excel</h2>

      {/* Зона Drag-and-Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragOver ? "#2196F3" : "#ccc"}`,
          borderRadius: "8px",
          padding: "40px",
          textAlign: "center",
          backgroundColor: isDragOver ? "#e3f2fd" : "#fafafa",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onClick={() => document.getElementById("excel-upload")?.click()}
      >
        <p>Перетащите Excel-файл сюда или кликните для выбора</p>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Модалка/Блок подтверждения */}
      {isConfirmModalOpen && file && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <h3>Подтверждение загрузки</h3>
          <p>
            Вы собираетесь загрузить файл: <strong>{file.name}</strong>
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                padding: "8px 16px",
                background: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {isUploading ? "Загрузка..." : "Подтвердить и загрузить"}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setIsConfirmModalOpen(false);
              }}
              disabled={isUploading}
              style={{
                padding: "8px 16px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
