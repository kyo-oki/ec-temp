import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    // If it's already a GraphQLError, return it as is
    if (exception instanceof GraphQLError) {
      return exception;
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : (response as { message?: string }).message || exception.message;

      return new GraphQLError(message, {
        extensions: {
          code: this.getErrorCode(status),
          statusCode: status,
          originalError: response,
        },
      });
    }

    // Handle generic errors
    const error = exception as Error;
    return new GraphQLError(error.message || 'Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
        originalError: error.stack,
      },
    });
  }

  private getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHENTICATED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return errorCodes[status] || 'INTERNAL_SERVER_ERROR';
  }
}
