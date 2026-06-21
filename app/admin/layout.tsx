import AdminNavbar from "@/app/components/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-black">
      <AdminNavbar />
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
