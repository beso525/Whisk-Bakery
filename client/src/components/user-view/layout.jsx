import { Outlet } from "react-router-dom";
import UserHeader from "./header";

function UserLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden h-full">
      <UserHeader />
      <main className="flex flex-col w-full h-[70%]">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;