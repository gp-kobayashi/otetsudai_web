import { http, HttpResponse } from 'msw'
import { mockRecruitments, mockRecruitmentsWithProfiles } from './mockData'

export const handlers = [
  // OPTIONSリクエストをモック（CORSプリフライト）
  http.options(/.*\/rest\/v1\/recruitments.*/, () => {
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, prefer',
      },
    })
  }),

  // recruitments テーブルの select クエリをモック（パターンマッチングを使用）
  http.get(/.*\/rest\/v1\/recruitments.*/, ({ request }) => {
    const url = new URL(request.url)
    const select = url.searchParams.get('select')
    
    // profiles付きのselect クエリの場合
    if (select && select.includes('profiles')) {
      return HttpResponse.json(mockRecruitmentsWithProfiles, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    
    // 通常のselect クエリの場合（profilesなし）
    return HttpResponse.json(mockRecruitments, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }),
]