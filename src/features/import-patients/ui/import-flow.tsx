import { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core"; // 🔥 Импортируем лоадер из Mantine
import {
  useCancelImport,
  useCommitImport,
  usePreviewData,
  useUploadPreview,
} from "../api";
import { FileDropzone } from "@/shared/ui/file-dropzone";
import { PreviewTable } from "./preview-table";

export const ImportFlow = () => {
  const uploadPreview = useUploadPreview();
  const commitImport = useCommitImport();
  const cancelImport = useCancelImport();

  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem("import_session_id") || null;
  });

  const { data: previewData, isLoading: isPreviewLoading } =
    usePreviewData(sessionId);

  // 1. Сохранение сессии
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("import_session_id", sessionId);
    } else {
      localStorage.removeItem("import_session_id");
    }
  }, [sessionId]);

  // 2. Защита от перезагрузки страницы (F5 или закрытие вкладки)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        uploadPreview.isPending ||
        commitImport.isPending ||
        cancelImport.isPending
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [uploadPreview.isPending, commitImport.isPending, cancelImport.isPending]);

  // 🔥 ОБЩИЙ СТАТУС ЗАГРУЗКИ (если хоть один запрос идет, блокируем экран)
  const isProcessing =
    uploadPreview.isPending || commitImport.isPending || cancelImport.isPending;

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return alert("Faqat Excel fayllari (.xlsx, .xls) qabul qilinadi");
    }
    uploadPreview.mutate(file, {
      onSuccess: (data) => setSessionId(data.sessionId),
      // Ошибки теперь обрабатываются глобально через notifications в хуке!
    });
  };

  const handleCommit = () => {
    if (!sessionId) return;
    commitImport.mutate(sessionId, {
      onSuccess: () => setSessionId(null),
    });
  };

  const handleCancel = () => {
    if (!sessionId) return;
    cancelImport.mutate(sessionId, {
      onSettled: () => setSessionId(null),
    });
  };

  return (
    <div style={{ position: "relative", minHeight: "400px" }}>
      <LoadingOverlay
        visible={isProcessing}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "teal", type: "bars" }}
      />

      {!sessionId ? (
        <FileDropzone
          onFileSelect={handleFileSelect}
          isLoading={uploadPreview.isPending}
          accept=".xlsx, .xls"
          label="Bemorlarning Excel faylini bu yerga tashlang yoki tanlash uchun bosing"
        />
      ) : (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3>Ma'lumotlarni oldindan ko'rish</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                style={{
                  background: "#f44336",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCommit}
                disabled={isProcessing}
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Bazaga saqlash
              </button>
            </div>
          </div>

          {isPreviewLoading ? (
            <p>Jadval yuklanmoqda...</p>
          ) : (
            previewData && (
              <>
                {/* 📊 STATISTIKA PANELLARI */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 15px",
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <strong>Jami:</strong> {previewData.stats.total} ta
                  </div>
                  <div
                    style={{
                      padding: "10px 15px",
                      background: "#e8f5e9",
                      borderRadius: "8px",
                      border: "1px solid #c8e6c9",
                      color: "#2e7d32",
                    }}
                  >
                    <strong>Importga tayyor:</strong> {previewData.stats.valid}{" "}
                    ta
                  </div>
                  <div
                    style={{
                      padding: "10px 15px",
                      background: "#ffebee",
                      borderRadius: "8px",
                      border: "1px solid #ffcdd2",
                      color: "#c62828",
                    }}
                  >
                    <strong>Xatolik mavjud (loglarga):</strong>{" "}
                    {previewData.stats.errors} ta
                  </div>

                  {previewData.stats.errors > 0 && (
                    <div
                      style={{
                        padding: "10px 15px",
                        background: "#fff3e0",
                        borderRadius: "8px",
                        border: "1px solid #ffe0b2",
                        fontSize: "14px",
                        flexBasis: "100%",
                      }}
                    >
                      <strong>Xatolar tafsiloti:</strong>
                      <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                        {previewData.stats.categories.ACTIVE_REQUEST_EXISTS >
                          0 && (
                          <li>
                            Bemorning faol arizasi mavjud:{" "}
                            {previewData.stats.categories.ACTIVE_REQUEST_EXISTS}{" "}
                            ta
                          </li>
                        )}
                        {previewData.stats.categories.DUPLICATE_FILE > 0 && (
                          <li>
                            Fayl ichida takrorlanganlar:{" "}
                            {previewData.stats.categories.DUPLICATE_FILE} ta
                          </li>
                        )}
                        {previewData.stats.categories.INVALID_PHONE > 0 && (
                          <li>
                            Noto'g'ri telefon raqami kiritilgan:{" "}
                            {previewData.stats.categories.INVALID_PHONE} ta
                          </li>
                        )}
                        {previewData.stats.categories.MISSING_DATA > 0 && (
                          <li>
                            Ism yoki telefon raqami yo'q:{" "}
                            {previewData.stats.categories.MISSING_DATA} ta
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <PreviewTable rows={previewData.rows} />
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};
