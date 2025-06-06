import SupabaseMFAChallenge from '@/components/admin/auth/SupabaseMFAChallenge';
import Layout from '@/components/layout'; // Import Layout

export default function AdminMFAChallengePage() {
  return (
    <Layout> {/* Added Layout */}
       <div className="font-space"> {/* Ensure font-space is applied if not inherited */}
        <SupabaseMFAChallenge />
      </div>
    </Layout>
  );
}