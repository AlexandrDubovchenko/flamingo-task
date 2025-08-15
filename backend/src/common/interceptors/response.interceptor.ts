import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        // Skip wrapping for auth controller or non-JSON responses
        if (this.shouldSkipWrapping(context, response)) {
          return data as ApiResponse<T>;
        }

        if (typeof data === 'string') {
          return data as unknown as ApiResponse<T>;
        }

        if (this.isApiResponse(data)) {
          return data;
        }

        if (this.isMessageResponse(data)) {
          return {
            data: null as T,
            message: data.message,
            status: response.statusCode,
          };
        }

        return {
          data: data as T,
          status: response.statusCode,
        };
      }),
    );
  }

  private shouldSkipWrapping(
    context: ExecutionContext,
    response: Response,
  ): boolean {
    const contentType = response.getHeader('content-type') as string;
    return Boolean(contentType && !contentType.includes('application/json'));
  }

  private isApiResponse(data: unknown): data is ApiResponse<T> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'data' in data &&
      'status' in data
    );
  }

  private isMessageResponse(data: unknown): data is { message: string } {
    return (
      data !== null &&
      typeof data === 'object' &&
      'message' in data &&
      !('data' in data)
    );
  }
}
