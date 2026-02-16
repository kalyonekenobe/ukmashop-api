import { Module } from '@nestjs/common';
import axios from 'axios';
import { CODEJUDGE_HTTP_SERVICE_TOKEN } from 'src/modules/codejudge/codejudge.constants';
import * as http from 'http';
import * as https from 'https';
import { HttpService } from '@nestjs/axios';
import { CodeJudgeService } from 'src/modules/codejudge/codejudge.service';

@Module({
  providers: [
    {
      provide: CODEJUDGE_HTTP_SERVICE_TOKEN,
      useFactory: () => {
        const axiosInstance = axios.create({
          baseURL: `http://host.docker.internal:3000/api/v1`,
          httpAgent: new http.Agent({ family: 4 }),
          httpsAgent: new https.Agent({ family: 4 }),
        });

        return new HttpService(axiosInstance);
      },
    },
    CodeJudgeService,
  ],
  exports: [CodeJudgeService],
})
export class CodeJudgeModule {}
