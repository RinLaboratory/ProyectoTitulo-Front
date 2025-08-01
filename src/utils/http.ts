/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cookies } from "next/headers";
import { env } from "~/env/shared";

interface HttpError extends Error {
  status: number;
  statusText: string;
  data?: unknown;
}

export class FetchError extends Error implements HttpError {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
    message?: string
  ) {
    super(
      message ??
        `Request failed (${status}): ${statusText}; ${typeof data === "string" ? data : ""}`
    );
    this.name = "FetchError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

async function handleResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!response.ok) {
    throw new FetchError(response.status, response.statusText, text);
  }
  let _response = undefined;

  try {
    _response = JSON.parse(text);
  } catch {
    throw new FetchError(500, "Invalid JSON response", text);
  }

  if (
    "error" in _response &&
    _response.error !== "" &&
    _response.error !== undefined &&
    !("id" in _response)
  ) {
    throw new FetchError(
      400, // In the future this should come from the backend with response.status
      "API returned error",
      _response.error
    );
  }
  return Promise.resolve(_response);
}

async function request<T>(
  url: string,
  method: RequestMethod,
  body?: any,
  file?: FormData
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Cookie: `jwt=${token}`,
    ...(file ? { "content-length": `${body.size}` } : {}),
  };

  let bodyValue: any = JSON.stringify(body);
  if (file) {
    bodyValue = file;
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers,
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: bodyValue,
  });

  const data = handleResponse(response);

  return data as T;
}

export const get = async <T>(url: string) => {
  return request<T>(url, "GET", undefined);
};

export const post = async <T>(url: string, body: any) => {
  return request<T>(url, "POST", body);
};

export const postFile = async <T>(url: string, body: File) => {
  const formData = new FormData();
  formData.append("archivo", body);
  return request<T>(url, "POST", body, formData);
};

export const patch = async <T>(url: string, body: any) => {
  return request<T>(url, "PATCH", body);
};

export const put = async <T>(url: string, body: any) => {
  return request<T>(url, "PUT", body);
};

export const putFile = async <T>(url: string, body: File) => {
  const formData = new FormData();
  formData.append("archivo", body);
  return request<T>(url, "PUT", body, formData);
};

export const del = async <T>(url: string, body?: any) => {
  return request<T>(url, "DELETE", body);
};
