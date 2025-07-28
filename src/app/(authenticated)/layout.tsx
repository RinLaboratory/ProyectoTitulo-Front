import { AccountContextProvider } from "~/components/account-context/account-context";
import NavBar from "~/components/navbar/navbar";
import { getAccountInfo } from "./actions";

export default async function AuthenticatedLayout(props: {
  children: React.ReactNode;
}) {
  const currentUser = await getAccountInfo();

  return (
    <AccountContextProvider user={currentUser}>
      <NavBar />
      <div className="super">
        <div className="main">{props.children}</div>
      </div>
    </AccountContextProvider>
  );
}
