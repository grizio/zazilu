import AWS from "aws-sdk"
import type { ObjectStorageConf } from "$server/conf/Conf"

type Dependencies = {
  conf: ObjectStorageConf
}
export class ObjectStorage {
  private readonly conf: ObjectStorageConf
  private readonly s3: AWS.S3

  constructor({ conf }: Dependencies) {
    this.conf = conf
    this.s3 = new AWS.S3({
      endpoint: conf.endpoint,
      accessKeyId: conf.accessKeyId,
      secretAccessKey: conf.secretAccessKey,
      s3ForcePathStyle: true,
      signatureVersion: "v4"
    })
  }

  getObject = async (key: string): Promise<AWS.S3.Types.GetObjectOutput> => {
    return this.s3.getObject({ Bucket: this.conf.bucket, Key: key }).promise()
  }

  list = async (): Promise<AWS.S3.Types.ListObjectsV2Output> => {
    return this.s3.listObjectsV2({ Bucket: this.conf.bucket }).promise()
  }

  putObject = async (request: Omit<AWS.S3.Types.PutObjectRequest, "Bucket">): Promise<AWS.S3.Types.PutObjectOutput> => {
    return this.s3.putObject({ ...request, Bucket: this.conf.bucket }).promise()
  }
}