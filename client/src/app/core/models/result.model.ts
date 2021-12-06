// Data transfer object for general result from backend
export interface Result {
  success: boolean;
  userId?: string;
  token?: string;
  status?: number;
  admin?: boolean;
}
