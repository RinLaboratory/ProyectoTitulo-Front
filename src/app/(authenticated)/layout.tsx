import NavBar from "~/components/nav-bar/nav-bar";

export default function AuthenticatedLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      <div className="super">
        <div className="main">{props.children}</div>
      </div>
    </div>
  );
}
