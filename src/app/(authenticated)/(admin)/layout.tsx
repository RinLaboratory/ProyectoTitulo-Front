import { getAccountInfo } from "../actions";
import { notFound, redirect } from "next/navigation";

export default async function AdminLayout(props: {
  children: React.ReactNode;
}) {
  const currentUser = await getAccountInfo();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.rol !== "*") {
    notFound();
  }

  return <>{props.children}</>;
}
