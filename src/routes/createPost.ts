import * as yup from 'yup'
import { NewPost, Post } from '../types/Post'
import headers from '../utils/cors'

declare const POSTS: KVNamespace

export default async (request: Request): Promise<Response> => {
  const schema = yup.object().shape({
    type: yup.string().required(),
    title: yup.string().required(),
    username: yup.string().required(),
    tag: yup.string(),
    content: yup.string(),
    poll: yup.object({
      pollOptions: yup.array(yup.object({
        option: yup.string().required(),
        id: yup.string().required(),
        votes: yup.number().required()
      })).required(),
      totalVotes: yup.number().required()
    }),
    imageUrl: yup.string()
  })

  const body: NewPost = await request.json()
  const inputValid = schema.isValidSync(body, {
    strict: true,
    stripUnknown: true,
  })
  if (inputValid) {
    const time = new Date()
    const { title, username, tag, type } = body

    const newPost: Post = {
      type,
      title,
      username,
      tag,
      date: time.toISOString(),
    };

    switch (newPost.type) {
      case 'text':
        newPost.content = body.content;
        break;
      case 'poll':
        newPost.poll = body.poll;
        break;
      case 'image':
        newPost.imageUrl = body.imageUrl;
        break;
      default:
        break;
    }
    
    await POSTS.put(`posts:${time.toISOString()}`, JSON.stringify(newPost))
    return new Response(JSON.stringify(newPost), { headers })
  } else {
    return new Response('Bad request. Empty body or wrong properties sent', {
      status: 400,
    })
  }
}
