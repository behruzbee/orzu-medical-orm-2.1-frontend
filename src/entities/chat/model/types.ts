export interface IMessage {
  id: string;
  sender: "operator" | "patient";
  text?: string;
  type: "text" | "audio" | "image" | "video" | "document";
  timestamp: string;
  status: "sent" | "read" | "received";
  mediaUrl?: string;
  duration?: string;
}