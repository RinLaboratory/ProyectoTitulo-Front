export async function fetcher<T>(url: string) {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

  const json = (await response.json()) as {
    status: "success";
    data: { data: T };
  };

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return json.data.data;
}
