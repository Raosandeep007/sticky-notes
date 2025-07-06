import { AdminPage } from "~/components/sticky-board/admin-page";

export function meta() {
  return [
    { title: "Admin Dashboard - Sticky Notes" },
    {
      name: "description",
      content: "Manage all created sticky notes workspaces",
    },
  ];
}

export default function Admin() {
  return <AdminPage />;
}
