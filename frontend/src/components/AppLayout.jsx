import TopNavbar from "./TopNavbar";
import "../styles/layout/header.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-root">
      <TopNavbar />
      <main className="app-main">{children}</main>
    </div>
  );
}
