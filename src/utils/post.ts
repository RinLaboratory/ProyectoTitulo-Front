import { env } from "~/env/shared";

/**
 *
 * @param url string
 * @param data object
 * @returns object
 */
export default async function post<T>(url: string, data: object = {}) {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json() as Promise<
    | {
        status: "success";
        data: T;
        token?: string;
      }
    | { status: "failed"; msg: string }
  >;
}
