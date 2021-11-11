import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Provider, Credentials } from "@aws-sdk/types";

declare const AWS_ACCESS_KEY_ID: string
declare const AWS_SECRET_ACCESS_KEY: string

async function myCredentialProvider() {
  return {
      // use wrangler secrets to provide these global variables
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
}

class AmazonS3API {
  private awsRegion: string
  private bucketName: string
  private s3Client: S3Client
  // On class instancing we set up used vars
  constructor() {
    this.awsRegion = 'us-west-2'
    this.bucketName = 'cloudflare-challenge'
    this.s3Client = new S3Client({
      region: this.awsRegion,
      credentialDefaultProvider: () => myCredentialProvider
    })
  }
  async getSignedURL(filename: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `images/${filename}`,
    })
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
    return url
  }
}

export default AmazonS3API
