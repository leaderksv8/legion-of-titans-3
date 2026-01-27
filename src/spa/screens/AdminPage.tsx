import { Helmet } from "react-helmet-async";
import AdminPanel from "@/spa/screens/AdminPanel";

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <title>Admin — ГО «ЛЕГІОН ТИТАНІВ»</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="/admin" />
      </Helmet>
      <AdminPanel />
    </>
  );
}

