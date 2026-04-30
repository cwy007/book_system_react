const BASE_URL = "/api";

export interface UserPayload {
  username: string;
  password: string;
}

async function request<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `请求失败 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function register(payload: UserPayload) {
  return request<UserPayload>("/user/register", payload);
}

export function login(payload: UserPayload) {
  return request<UserPayload>("/user/login", payload);
}
