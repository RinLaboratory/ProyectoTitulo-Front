/**
 *
 * @param {string} url
 * @param {Object} data
 * @returns {Object}
 */
export default async function post<T>(url: string, data: object = {}) {
  const response = await fetch(url, {
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
