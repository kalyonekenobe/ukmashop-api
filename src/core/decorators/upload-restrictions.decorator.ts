import {
  BadRequestException,
  ExecutionContext,
  HttpStatus,
  UnsupportedMediaTypeException,
  createParamDecorator,
} from '@nestjs/common';
import * as _ from 'lodash';
import { UploadRestriction } from 'src/core/types/upload-restrictions.types';

export const UploadRestrictions = createParamDecorator(
  async (restrictions: UploadRestriction[], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const files = _.concat(...(Object.values(request.files ?? {}) as Express.Multer.File[]));
    files.forEach(file => {
      const currentFileRestrictions = restrictions.find(
        restriction => restriction.fieldname === file.fieldname,
      );

      if (
        (currentFileRestrictions?.minFileSize && currentFileRestrictions.minFileSize > file.size) ||
        (currentFileRestrictions?.maxFileSize && currentFileRestrictions.maxFileSize < file.size)
      ) {
        throw new BadRequestException({
          message: `The received file with fieldname '${file.fieldname}' has size that does not meet the restriction`,
          error: `The received file with fieldname '${file.fieldname}' has that does not meet the restriction`,
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        });
      }

      if (
        currentFileRestrictions?.allowedMimeTypes &&
        !currentFileRestrictions.allowedMimeTypes.includes(file.mimetype)
      ) {
        throw new UnsupportedMediaTypeException({
          message: `The received file with fieldname '${file.fieldname}' has unsupported media type`,
          error: `The received file with fieldname '${file.fieldname}' has unsupported media type`,
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        });
      }
    });
  },
);