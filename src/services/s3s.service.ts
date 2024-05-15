import { randomUUID } from "node:crypto";
import path from "node:path";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

import { config, Logger } from "../common/configs";
import { FileItemTypeEnum } from "../common/enums";

class S3Service {
  constructor(
    private readonly client = new S3Client({
      region: config.AWS_S3_REGION.toString(),
      credentials: {
        accessKeyId: config.AWS_S3_ACCESS_KEY.toString(),
        secretAccessKey: config.AWS_S3_SECRET_KEY.toString(),
      },
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: FileItemTypeEnum,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.name);
      await this.client.send(
        new PutObjectCommand({
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: filePath,
          Body: file.data,
          ContentType: file.mimetype,
          ACL: "public-read",
        }),
      );
      return filePath;
    } catch (e) {
      Logger.error("Error with file upload");
      throw e;
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: config.AWS_S3_BUCKET_NAME.toString(),
          Key: filePath,
        }),
      );
    } catch (e) {
      Logger.error("Error deleting");
      throw e;
    }
  }

  private buildPath(
    itemType: FileItemTypeEnum,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`; // use only  template string
  }
}

export const s3Service = new S3Service();
