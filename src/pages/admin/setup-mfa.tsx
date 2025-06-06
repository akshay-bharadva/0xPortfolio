import SupabaseMFASetup from '@/components/admin/auth/SupabaseMFASetup';
import Layout from '@/components/layout'; // Import Layout

export default function AdminMFASetupPage() {
  return (
    <Layout> {/* Added Layout */}
      <div className="font-space"> {/* Ensure font-space is applied if not inherited */}
        <SupabaseMFASetup />
      </div>
    </Layout>
  );
}