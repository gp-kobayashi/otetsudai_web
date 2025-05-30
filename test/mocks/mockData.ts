// Recruitmentsのモックデータ（profilesなし）
export const mockRecruitments = [
  { 
    id: 1, 
    user_id: 'test-user-1', 
    title: '動画test', 
    explanation: '動画の編集をお願いしたいです', 
    tag: 'Video', 
    status: '募集中', 
    created_at: '2025-05-27T12:00:00Z', 
    updated_at: '2025-05-27T12:00:00Z'
  },
  { 
    id: 2, 
    user_id: 'test-user-2', 
    title: '絵test', 
    explanation: '動画に使う絵を描いてほしいです', 
    tag: 'design', 
    status: '対応中', 
    created_at: '2025-05-27T13:00:00Z', 
    updated_at: '2025-05-27T13:00:00Z'
  },
];

// profiles付きRecruitmentsのモックデータ
export const mockRecruitmentsWithProfiles = [
  { 
    id: 1, 
    user_id: 'test-user-1', 
    title: '動画test', 
    explanation: '動画の編集をお願いしたいです', 
    tag: 'Video', 
    status: '募集中', 
    created_at: '2025-05-27T12:00:00Z', 
    updated_at: '2025-05-27T12:00:00Z',
    profiles: {
      avatar_url: 'test-avatar.jpg',
      username: 'testuser1'
    }
  },
  { 
    id: 2, 
    user_id: 'test-user-2', 
    title: '絵test', 
    explanation: '動画に使う絵を描いてほしいです', 
    tag: 'design', 
    status: '対応中', 
    created_at: '2025-05-27T13:00:00Z', 
    updated_at: '2025-05-27T13:00:00Z',
    profiles: {
      avatar_url: 'test-avatar2.jpg',
      username: 'testuser2'
    }
  },
]; 