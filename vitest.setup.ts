import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { APIserver } from "./test/server";

// Next.jsのuseRouterをモック
vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }),
  }));

beforeAll(() => APIserver.listen());
afterAll(() => APIserver.close());
afterEach(() => APIserver.resetHandlers());