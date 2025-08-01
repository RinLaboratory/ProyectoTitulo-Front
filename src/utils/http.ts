"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cookies } from "next/headers";
import { env } from "~/env/shared";
import { FetchError } from "./http-classes";

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
      _response.error,
    );
  }
  return Promise.resolve(_response);
}

async function request<T>(
  url: string,
  method: RequestMethod,
  body?: any,
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Cookie: `jwt=${token}` } : {}),
  };

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, {
    method,
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers,
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(body),
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

export const patch = async <T>(url: string, body: any) => {
  return request<T>(url, "PATCH", body);
};

export const put = async <T>(url: string, body: any) => {
  return request<T>(url, "PUT", body);
};

export const del = async <T>(url: string, body?: any) => {
  return request<T>(url, "DELETE", body);
};
