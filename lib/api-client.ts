import { AnalyzeRequest, AnalyzeResponse, ErrorResponse } from '@/types/analysis';

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Call the analyze API to process user input
 * @param input User's input text
 * @returns Analysis response
 * @throws ApiError if the request fails
 */
export async function analyzeText(input: string): Promise<AnalyzeResponse> {
  try {
    const requestBody: AnalyzeRequest = { input };

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new ApiError(
        errorData.message || '分析失败',
        errorData.code,
        response.status
      );
    }

    return data as AnalyzeResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(error.message, 'NETWORK_ERROR');
    }

    throw new ApiError('未知错误', 'UNKNOWN_ERROR');
  }
}

/**
 * Helper to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Format error message for display to user
 */
export function formatErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    switch (error.code) {
      case 'INVALID_INPUT':
        return '输入格式不正确，请检查后重试';
      case 'MISSING_API_KEY':
        return '服务配置错误，请联系管理员';
      case 'OPENAI_API_ERROR':
        return 'AI 服务暂时不可用，请稍后重试';
      case 'NETWORK_ERROR':
        return '网络连接失败，请检查网络后重试';
      default:
        return error.message;
    }
  }

  return '发生未知错误，请重试';
}
