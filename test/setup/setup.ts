import { vi } from "vitest";

vi.mock("@/utils/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      data: [],
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "123" } } }),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi
          .fn()
          .mockResolvedValue({ data: { path: "test-path" }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi
          .fn()
          .mockReturnValue({ data: { publicUrl: "http://example.com/avatar.png" } }),
      })),
    },
  })),
}));

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      data: [],
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "123" } } }),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi
          .fn()
          .mockResolvedValue({ data: { path: "test-path" }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi
          .fn()
          .mockReturnValue({ data: { publicUrl: "http://example.com/avatar.png" } }),
      })),
    },
  })),
}));
