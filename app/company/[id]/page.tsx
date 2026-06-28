export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <a href="/dashboard" className="text-zinc-500 hover:text-white transition-colors text-sm">
          ← Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold mt-4">Company {id}</h1>
      </div>
    </div>
  );
}
