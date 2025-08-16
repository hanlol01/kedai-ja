import connectDB from './db';

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Retry mechanism untuk operasi database
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    onRetry
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Ensure connection before operation
      await connectDB();
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Log the error
      console.error(`Database operation attempt ${attempt + 1} failed:`, error);

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if error is retryable
      if (!isRetryableError(error as Error)) {
        console.log('Non-retryable error, throwing immediately');
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      
      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown error occurred during retry operation');
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: Error): boolean {
  const retryablePatterns = [
    'MongoNetworkTimeoutError',
    'MongoServerSelectionError',
    'connection timed out',
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'connection refused',
    'network timeout',
    'socket timeout'
  ];

  const errorMessage = error.message.toLowerCase();
  const errorName = error.constructor.name;

  return retryablePatterns.some(pattern => 
    errorMessage.includes(pattern.toLowerCase()) || 
    errorName.includes(pattern)
  );
}

/**
 * Wrapper untuk API routes dengan automatic retry
 */
export async function apiWithRetry<T>(
  handler: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return withDbRetry(handler, {
    maxRetries: 2, // Default untuk API
    baseDelay: 500,
    maxDelay: 5000,
    onRetry: (error, attempt) => {
      console.log(`API retry attempt ${attempt} due to:`, error.message);
    },
    ...options
  });
}
