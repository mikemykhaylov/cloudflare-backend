import { Post } from '../types/Post';
import headers from '../utils/cors'

declare const POSTS: KVNamespace

export default async (): Promise<Response> => {
  const keys = await POSTS.list({ prefix: 'posts' })
  keys.keys.reverse();
  const posts: Post[] = []
  for (const key of keys.keys) {
    const post = (await POSTS.get(key.name, 'json')) as Post;
    posts.push(post)
  }
  return new Response(JSON.stringify(posts), { headers })
}
