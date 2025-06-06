import SupabaseLogin from "@/components/admin/auth/SupabaseLogin";
import Layout from "@/components/layout";

export default function AdminLoginPage() {
  return (
    <Layout>
      {/* font-space is applied globally by Layout, but can be re-asserted if needed */}
      <div className="font-space">
        <SupabaseLogin />
      </div>
    </Layout>
  );
}
