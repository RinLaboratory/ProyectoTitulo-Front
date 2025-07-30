import { env } from "~/env/shared";

/**
 *
 * @param url string
 * @param data object
 * @returns object
 */
export default async function postFile(url: string, data: File) {
  const formData = new FormData();
  formData.append("archivo", data);

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "content-length": `${data.size}`,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: formData,
  });
  return response.json() as Promise<
    | {
        status: "success";
        linea: number;
      }
    | { status: "failed"; msg: string }
  >;
}
