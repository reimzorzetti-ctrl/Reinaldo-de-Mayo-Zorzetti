
export enum Role {
  ATENDENTE = 'Atendente',
  FINANCEIRO = 'Financeiro',
  ASB = 'ASB'
}

export interface Task {
  id: string;
  role: Role;
  text: string;
  category: string;
}

export interface TaskState {
  [taskId: string]: boolean;
}

export interface StorageState {
  tasks: TaskState;
  lastReset: string; // ISO string
  notificationsEnabled: boolean;
  lastNotificationDate: string | null; // Date string (YYYY-MM-DD)
}
