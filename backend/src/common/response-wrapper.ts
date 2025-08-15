export class ApiResponseWrapper {
  static success<T>(data: T, message?: string, status = 200) {
    return {
      data,
      message,
      status,
    };
  }

  static created<T>(data: T, message?: string) {
    return {
      data,
      message,
      status: 201,
    };
  }

  static deleted(message = 'Resource deleted successfully') {
    return {
      data: null,
      message,
      status: 200,
    };
  }

  static error(message: string, status = 500) {
    return {
      data: null,
      message,
      status,
    };
  }
}
