import * as yup from 'yup'
import { Post } from '../types/Post'
import headers from '../utils/cors'

declare const POSTS: KVNamespace

type VoteOnPostBody = {
  postId: string;
  optionId: string;
}

export default async (request: Request): Promise<Response> => {
  const schema = yup.object().shape({
    postId: yup.string().required(),
    optionId: yup.string().required(),
  })

  const body: VoteOnPostBody = await request.json()
  const inputValid = schema.isValidSync(body, {
    strict: true,
    stripUnknown: true,
  })
  if (inputValid) {
    const { postId, optionId } = body;
    const post = (await POSTS.get(`posts:${postId}`, 'json')) as Post;

    if(!post.poll) {
      return new Response('Bad request. Post is not a voting one', {
        status: 400,
      })
    }

    post.poll.pollOptions = post.poll.pollOptions.map((option) => {
      if(option.id === optionId) {
        option.votes++;
      }
      return option;
    })

    post.poll.totalVotes++;
    
    await POSTS.put(`posts:${post.date}`, JSON.stringify(post))
    return new Response(JSON.stringify(post), { headers })
  } else {
    return new Response('Bad request. Empty body or wrong properties sent', {
      status: 400,
    })
  }
}
