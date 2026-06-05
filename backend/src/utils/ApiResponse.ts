export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;
  public pagination?: any;

  constructor(message: string, data?: T, pagination?: any) {
    this.success = true;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (pagination !== undefined) this.pagination = pagination;
  }
}
