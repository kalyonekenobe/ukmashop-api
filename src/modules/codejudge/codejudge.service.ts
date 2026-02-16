import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import _ from 'lodash';
import { CODEJUDGE_HTTP_SERVICE_TOKEN } from 'src/modules/codejudge/codejudge.constants';
import { RetryOptions } from 'src/modules/infrastructure/app/types/app.types';
import { retryWithExponentialBackoff } from 'src/modules/infrastructure/app/utils/app.utils';
import { LoggerService } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class CodeJudgeService implements OnModuleInit {
  private accessToken: string | undefined;

  constructor(
    @Inject(CODEJUDGE_HTTP_SERVICE_TOKEN) private readonly codejudgeHttpService: HttpService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(CodeJudgeService.name);
  }

  public async onModuleInit(): Promise<void> {
    this.loggerService.log('CodeJudge service was successfully initialized');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async readonlyInteractWithCodejudgeApi(): Promise<void> {
    await this.login();
    await this.getCurrentUser();
    await this.getAssignments();
    await this.getRandomAssignment();
    await this.getRandomAssignmentTestCases();
    await this.getLeaderboard();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async interactWithCodejudgeApi(): Promise<void> {
    await this.createRandomAssignment();
    await this.updateRandomAssignment();
    await this.deleteRandomAssignment();
  }

  private async createRandomAssignment(): Promise<void> {
    console.log(`\n\n============= CREATE RANDOM ASSIGNMENT =================\n\n`);

    try {
      const createRandomAssignmentDto = {
        title: `Assignment #${Date.now()}`,
        description: 'Dummy assignment description',
        difficulty: _.sample(['easy', 'medium', 'hard']),
      };

      const createRandomAssignmentResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.post(`assignments/`, createRandomAssignmentDto, {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(createRandomAssignmentResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n=================================================\n\n`);
  }

  private async updateRandomAssignment(): Promise<void> {
    console.log(`\n\n============= UPDATE RANDOM ASSIGNMENT =================\n\n`);

    try {
      const assignmentsResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.get('assignments'),
        this.defaultRetryStrategyOptions(),
      );

      const ids = assignmentsResponse.data.map(({ id }) => id);
      const randomId = _.sample(ids);

      const randomAssignmentResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.get(`assignments/${randomId}`),
        this.defaultRetryStrategyOptions(),
      );

      const randomAssignment = randomAssignmentResponse.data;
      const updateRandomAssignmentResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.patch(
            `assignments/${randomId}`,
            {
              title: `${randomAssignment.title}, (updated_${Date.now()})`,
            },
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            },
          ),
        this.defaultRetryStrategyOptions(),
      );

      console.log(updateRandomAssignmentResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n=================================================\n\n`);
  }

  private async deleteRandomAssignment(): Promise<void> {
    console.log(`\n\n============= DELETE RANDOM ASSIGNMENT =================\n\n`);

    try {
      const assignmentsResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.get('assignments'),
        this.defaultRetryStrategyOptions(),
      );

      const ids = assignmentsResponse.data.map(({ id }) => id);
      const randomId = _.sample(ids);

      const randomAssignmentResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.get(`assignments/${randomId}`),
        this.defaultRetryStrategyOptions(),
      );

      const randomAssignment = randomAssignmentResponse.data;

      await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.delete(`assignments/${randomId}`, {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(randomAssignment.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n=================================================\n\n`);
  }

  private async login(): Promise<void> {
    try {
      const loginDto = { email: 'instructor@codejudge.edu', password: 'password123' };

      const loginResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.post('auth/login', loginDto),
        this.defaultRetryStrategyOptions(),
      );

      const { access_token: accessToken } = loginResponse.data;
      this.accessToken = accessToken;

      console.log(`User was successfully authorized! Access Token: ${accessToken}`);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }
  }

  private async getCurrentUser(): Promise<void> {
    console.log(`\n\n============= CURRENT USER INFO =================\n\n`);

    try {
      const currentUserResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.get('current_user', {
            headers: { Authorization: `Bearer ${this.accessToken}` },
            params: { inject_error_pct: 20, inject_timeout_pct: 20 },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(currentUserResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n=================================================\n\n`);
  }

  private async getAssignments(): Promise<void> {
    console.log(`\n\n============= ASSIGNMENTS =================\n\n`);

    try {
      const assignmentsResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.get('assignments', {
            params: { inject_error_pct: 20, inject_timeout_pct: 20 },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(assignmentsResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n===========================================\n\n`);
  }

  private async getRandomAssignment(): Promise<void> {
    console.log(`\n\n============= RANDOM ASSIGNMENT =================\n\n`);

    try {
      const assignmentsResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.get('assignments'),
        this.defaultRetryStrategyOptions(),
      );

      const ids = assignmentsResponse.data.map(({ id }) => id);
      const randomId = _.sample(ids);

      const randomAssignmentResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.get(`assignments/${randomId}`, {
            params: { inject_error_pct: 20, inject_timeout_pct: 20 },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(randomAssignmentResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n=================================================\n\n`);
  }

  private async getRandomAssignmentTestCases(): Promise<void> {
    console.log(`\n\n============= RANDOM ASSIGNMENT TEST CASES =================\n\n`);

    try {
      const assignmentsResponse = await retryWithExponentialBackoff(
        () => this.codejudgeHttpService.axiosRef.get('assignments'),
        this.defaultRetryStrategyOptions(),
      );

      const ids = assignmentsResponse.data.map(({ id }) => id);
      const randomId = _.sample(ids);

      const randomAssignmentTestCasesResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.get(`assignments/${randomId}`, {
            params: { inject_error_pct: 20, inject_timeout_pct: 20 },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(randomAssignmentTestCasesResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n============================================================\n\n`);
  }

  private async getLeaderboard(): Promise<void> {
    console.log(`\n\n============= LEADERBOARD =================\n\n`);

    try {
      const leaderboardResponse = await retryWithExponentialBackoff(
        () =>
          this.codejudgeHttpService.axiosRef.get('leaderboard', {
            params: { inject_error_pct: 20, inject_timeout_pct: 20 },
          }),
        this.defaultRetryStrategyOptions(),
      );

      console.log(leaderboardResponse.data);
    } catch (error) {
      console.error(`Request failed with status code: ${error.status}\nMessage: ${error.message}`);
    }

    console.log(`\n\n===========================================\n\n`);
  }

  private defaultRetryStrategyOptions(): RetryOptions {
    return {
      retries: 4,
      baseDelayMs: 1000,
      factor: 2,
      maxDelayMs: 8000,
      shouldRetry: error => {
        const status = error?.status;

        return !status || status >= 500;
      },
    };
  }
}
