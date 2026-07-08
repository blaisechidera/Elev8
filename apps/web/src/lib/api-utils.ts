import { NextResponse } from 'next/server';

/**
 * Standard API response envelope as defined in the API contract.
 */

export interface ApiSuccessResponse<T> {
  data: T;
  meta: {
    request_id: string;
    next_cursor?: string | null;
  };
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  meta: {
    request_id: string;
  };
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; reason: string }>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

function requestId(): string {
  return crypto.randomUUID();
}

export function success<T>(data: T, status = 200, nextCursor?: string | null) {
  return NextResponse.json(
    {
      data,
      meta: { request_id: requestId(), next_cursor: nextCursor ?? null },
      error: null,
    } satisfies ApiSuccessResponse<T>,
    { status }
  );
}

export function error(
  code: string,
  message: string,
  status = 400,
  details?: Array<{ field: string; reason: string }>
) {
  return NextResponse.json(
    {
      data: null,
      meta: { request_id: requestId() },
      error: { code, message, ...(details ? { details } : {}) },
    } satisfies ApiErrorResponse,
    { status }
  );
}

export function unauthorized(message = 'Authentication required') {
  return error('UNAUTHENTICATED', message, 401);
}

export function notFound(entity = 'Resource') {
  return error('NOT_FOUND', `${entity} not found`, 404);
}

export function validationError(
  details: Array<{ field: string; reason: string }>
) {
  return error('VALIDATION_ERROR', 'Validation failed', 400, details);
}