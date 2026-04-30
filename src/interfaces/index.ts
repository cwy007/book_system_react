const BASE_URL = "/api";

export interface UserPayload {
  username: string;
  password: string;
}

export interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
  cover: string;
}

export type BookPayload = Omit<Book, "id">;

interface RequestOptions {
  method?: string;
  data?: unknown;
  query?: Record<string, string | undefined>;
}

async function request<T>(url: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", data, query } = opts;
  let fullUrl = BASE_URL + url;
  if (query) {
    const sp = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== "") sp.append(k, v);
    });
    const qs = sp.toString();
    if (qs) fullUrl += `?${qs}`;
  }
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `请求失败 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function register(payload: UserPayload) {
  return request<UserPayload>("/user/register", { method: "POST", data: payload });
}

export function login(payload: UserPayload) {
  return request<UserPayload>("/user/login", { method: "POST", data: payload });
}

export function listBooks(name?: string) {
  return request<Book[]>("/book", { query: { name } });
}

export function getBook(id: number) {
  return request<Book>(`/book/${id}`);
}

export function createBook(payload: BookPayload) {
  return request<Book>("/book", { method: "POST", data: payload });
}

export function updateBook(id: number, payload: BookPayload) {
  return request<Book>(`/book/${id}`, { method: "PUT", data: { id, ...payload } });
}

export function deleteBook(id: number) {
  return request<Book>(`/book/${id}`, { method: "DELETE" });
}

export async function uploadCover(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE_URL}/book/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    throw new Error((await res.text()) || `上传失败 (${res.status})`);
  }
  const text = await res.text();
  // 后端可能返回纯字符串路径，也可能返回 JSON
  try {
    const json = JSON.parse(text);
    if (typeof json === "string") return json;
    if (json && typeof json.url === "string") return json.url;
    if (json && typeof json.path === "string") return json.path;
  } catch {
    // 非 JSON，按纯文本处理
  }
  return text.trim().replace(/^"|"$/g, "");
}
