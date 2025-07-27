/**
 *
 * @param {string} url
 * @param {Object} data
 * @returns {Object}
 */
export default async function postFile(url: string, data: File) {
  const formData = new FormData();
  formData.append("archivo", data);

  const response = await fetch(url, {
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
