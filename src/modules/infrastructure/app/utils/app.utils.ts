import { BadRequestException, InternalServerErrorException, HttpException } from '@nestjs/common';

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
