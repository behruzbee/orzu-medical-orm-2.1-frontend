import type { IPatientRequest } from "@/entities/patient";
import type { User } from "@/entities/user";

export type DoctorMessageStatus = "pending" | "done";

export interface DoctorPatientMessage {
  id: string;
  message: string;
  status: DoctorMessageStatus;
  requestId: string;
  request?: IPatientRequest;
  senderId?: string | null;
  sender?: User | null;
  resolvedById?: string | null;
  resolvedBy?: User | null;
  doneAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorMessageEvent {
  type: "created" | "done";
  message: DoctorPatientMessage;
}
