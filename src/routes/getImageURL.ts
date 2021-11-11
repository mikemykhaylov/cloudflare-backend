import * as yup from 'yup'
import headers from '../utils/cors'
import AmazonS3API from '../utils/s3Client'

export default async (request: Request): Promise<Response> => {
  const schema = yup.object().shape({
    filename: yup.string().required(),
  })
  let body: { filename: string } = {
    filename: ''
  };
  try {
    body = await request.json();
  } catch (error) {
    return new Response('Bad request. Empty body or wrong properties sent', {
      status: 400,
    })
  }
  const inputValid = schema.isValidSync(body, {
    strict: true,
    stripUnknown: true,
  })
  if (inputValid) {
    const s3Api = new AmazonS3API()
    const presignedUrl = await s3Api.getSignedURL(body.filename)
    return new Response(JSON.stringify({ imageUrl: presignedUrl }), { headers })
  } else {
    return new Response('Bad request. Empty body or wrong properties sent', {
      status: 400,
    })
  }
}
