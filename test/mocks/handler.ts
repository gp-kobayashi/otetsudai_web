import { rest } from 'msw'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export const handlers = [
  rest.get(`${SUPABASE_URL}/rest/v1/otetsudai_web`, (req, res, ctx) => {
  const userId = req.url.searchParams.get('user_id')
    return res(
      ctx.status(200),
      ctx.json([                             
        { id: 1, user_id: userId, title: '動画test',explanation: '動画の編集をお願いしたいです',tag: 'Video', status: '募集中', created_at: '2025-05-27T12:00:00Z' ,updated_at: '2025-05-27T12:00:00Z' },
        { id: 2, user_id: userId, title: '絵test',explanation: '動画に使う絵を描いてほしいです',tag: 'Video', status: '対応中', created_at: '2025-05-27T13:00:00Z' ,updated_at: '2025-05-27T13:00:00Z' },
      ]),
      ctx.delay(300), )     
  }),
]