import { AdminLayout } from "./_components/AdminLayout";

// Login page renders OUTSIDE the sidebar layout — it uses its own full-screen design.
// All other admin pages (/admin/dashboard, /admin/products, etc.) get the sidebar.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}