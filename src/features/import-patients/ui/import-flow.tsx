import { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";
import {
  useCancelImport,
  useCommitImport,
  usePreviewData,
  useUploadPreview,
} from "../api";
import { FileDropzone } from "@/shared/ui/file-dropzone";
import { PreviewTable } from "./preview-table";
import { useTranslation } from "@/shared/i18n";

export const ImportFlow = () => {
  const { tr } = useTranslation();
  const uploadPreview = useUploadPreview();
  const commitImport = useCommitImport();
  const cancelImport = useCancelImport();

  const [sessionId, setSessionId] = useState<string | null>(() => {
    return localStorage.getItem("import_session_id") || null;
  });

  const { data: previewData, isLoading: isPreviewLoading } =
    usePreviewData(sessionId);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("import_session_id", sessionId);
    } else {
      localStorage.removeItem("import_session_id");
    }
  }, [sessionId]);

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

  const isProcessing =
    uploadPreview.isPending || commitImport.isPending || cancelImport.isPending;

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return alert(
        tr(
          "Faqat Excel fayllari (.xlsx, .xls) qabul qilinadi",
          "Принимаются только файлы Excel (.xlsx, .xls)",
        ),
      );
    }
    uploadPreview.mutate(file, {
      onSuccess: (data) => setSessionId(data.sessionId),
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
          label={tr(
            "Bemorlarning Excel faylini bu yerga tashlang yoki tanlash uchun bosing",
            "Перетащите сюда Excel-файл пациентов или нажмите для выбора",
          )}
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
            <h3>
              {tr("Ma'lumotlarni oldindan ko'rish", "Предпросмотр данных")}
            </h3>
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
                {tr("Bekor qilish", "Отмена")}
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
                {tr("Bazaga saqlash", "Сохранить в базу")}
              </button>
            </div>
          </div>

          {isPreviewLoading ? (
            <p>{tr("Jadval yuklanmoqda...", "Таблица загружается...")}</p>
          ) : (
            previewData && (
              <>
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
                    <strong>{tr("Jami:", "Всего:")}</strong>{" "}
                    {previewData.stats.total}
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
                    <strong>
                      {tr("Importga tayyor:", "Готово к импорту:")}
                    </strong>{" "}
                    {previewData.stats.valid}
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
                    <strong>
                      {tr(
                        "Xatolik mavjud (loglarga):",
                        "С ошибками (в журнал):",
                      )}
                    </strong>{" "}
                    {previewData.stats.errors}
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
                      <strong>
                        {tr("Xatolar tafsiloti:", "Подробности ошибок:")}
                      </strong>
                      <ul style={{ margin: "5px 0 0 20px", padding: 0 }}>
                        {previewData.stats.categories.ACTIVE_REQUEST_EXISTS >
                          0 && (
                          <li>
                            {tr(
                              "Bemorning faol arizasi mavjud:",
                              "У пациента есть активная заявка:",
                            )}{" "}
                            {
                              previewData.stats.categories.ACTIVE_REQUEST_EXISTS
                            }{" "}
                          </li>
                        )}
                        {previewData.stats.categories.DUPLICATE_FILE > 0 && (
                          <li>
                            {tr(
                              "Fayl ichida takrorlanganlar:",
                              "Дубликаты внутри файла:",
                            )}{" "}
                            {previewData.stats.categories.DUPLICATE_FILE}
                          </li>
                        )}
                        {previewData.stats.categories.INVALID_PHONE > 0 && (
                          <li>
                            {tr(
                              "Noto'g'ri telefon raqami kiritilgan:",
                              "Неверные номера телефонов:",
                            )}{" "}
                            {previewData.stats.categories.INVALID_PHONE}
                          </li>
                        )}
                        {previewData.stats.categories.MISSING_DATA > 0 && (
                          <li>
                            {tr(
                              "Ism yoki telefon raqami yo'q:",
                              "Отсутствует имя или телефон:",
                            )}{" "}
                            {previewData.stats.categories.MISSING_DATA}
                          </li>
                        )}
                        {/* 🔥 ДОБАВЛЕНО ВЫВОД НОВОЙ ОШИБКИ */}
                        {previewData.stats.categories.INVALID_DATES > 0 && (
                          <li style={{ color: "red", fontWeight: "bold" }}>
                            {tr(
                              "Sanalar xato (manfiy yoki 15 kundan ortiq):",
                              "Некорректные даты (отрицательный период или более 15 дней):",
                            )}{" "}
                            {previewData.stats.categories.INVALID_DATES}
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
