import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClientOnlyAdmin } from "@/components/admin/ClientOnlyAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnlyAdmin>
      <AuthProvider>
        <AdminShell>{children}</AdminShell>
      </AuthProvider>
    </ClientOnlyAdmin>
  );
}
