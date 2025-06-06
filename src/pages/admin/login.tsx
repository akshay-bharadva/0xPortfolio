import SupabaseLogin from '@/components/admin/auth/SupabaseLogin';
import Layout from '@/components/layout'; // Import Layout

export default function AdminLoginPage() {
  return (
    <Layout> {/* Added Layout */}
      <div className="font-space"> {/* Ensure font-space is applied if not inherited */}
        <SupabaseLogin />
      </div>
    </Layout>
  );
}