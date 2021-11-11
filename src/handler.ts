import { Router } from 'itty-router'
import createPost from './routes/createPost'
import getImageURL from './routes/getImageURL'
import getPosts from './routes/getPosts'
import preflightCheck from './routes/preflightCheck'
import voteOnPost from './routes/voteOnPost'

const router = Router()

router
  .get('/posts', getPosts)
  .post('/posts', createPost)
  .post('/votes', voteOnPost)
  .post('/imageurl', getImageURL)
  .options('*', preflightCheck)

export async function handleRequest(request: Request): Promise<Response> {
  return router.handle(request)
}
