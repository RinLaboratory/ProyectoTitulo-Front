import { AccountContextProvider } from "~/components/account-context/account-context";
import NavBar from "~/components/navbar/navbar";
import { getAccountInfo } from "./actions";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout(props: {
  children: React.ReactNode;
}) {
  const currentUser = await getAccountInfo();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <AccountContextProvider user={currentUser}>
      <NavBar />
      <div className="super">
        <div className="main">{props.children}</div>
      </div>
    </AccountContextProvider>
  );
}
