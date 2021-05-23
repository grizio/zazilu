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
}