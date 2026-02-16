import { BadRequestException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { RetryOptions } from 'src/modules/infrastructure/app/types/app.types';

export function throwRandomException(probability = 0.3): void {
  if (Math.random() > probability) return;

  const exceptions: HttpException[] = [
    new BadRequestException('Random bad request'),
    new InternalServerErrorException('Random internal error'),
  ];

  const randomIndex = Math.floor(Math.random() * exceptions.length);
  throw exceptions[randomIndex];
}

export const configureCorsAllowedOriginsList = (
  corsAllowedOriginsString: string,
  delimiter: string = ',',
): string[] => {
  return corsAllowedOriginsString // The string of allowed origins separated by a delimiter
    .split(delimiter) // Split the string by a specified delimiter
    .filter(origin => origin) // Filter possible undefined values
    .map(origin => origin.trim()); // Remove the extreme empty spaces of received strings
};

export const sleep = async (duration: number) =>
  new Promise(resolve => setTimeout(resolve, duration));

export async function retryWithExponentialBackoff<T>(
  callback: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    retries = 5,
    baseDelayMs = 500,
    maxDelayMs = 10_000,
    factor = 2,
    jitter = true,
    shouldRetry = () => true,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await callback();
    } catch (error) {
      attempt++;

      if (attempt > retries || !shouldRetry(error)) {
        throw error;
      }

      if (error.status) {
        console.log(
          `Received response with status code ${error.status}. Exponential retry was triggered...`,
        );
      }

      let delay = Math.min(baseDelayMs * factor ** (attempt - 1), maxDelayMs);

      if (jitter) {
        delay = Math.random() * delay;
      }

      await sleep(delay);
    }
  }
}
