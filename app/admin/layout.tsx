import AdminNavbar from './components/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}