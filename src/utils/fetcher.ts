"use server";

import { cookies } from "next/headers";
import { env } from "~/env/shared";

export async function fetcher<T>(url: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: `jwt=${token}`,
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
