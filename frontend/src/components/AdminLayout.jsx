import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <Outlet />
    </div>
  );
}
