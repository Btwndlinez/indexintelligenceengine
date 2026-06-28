const navItems = [
  { label: "Overview", href: "/dashboard", active: true },
  { label: "Search", href: "/dashboard/search" },
  { label: "Markets", href: "/dashboard/markets" },
  { label: "Campaigns", href: "/dashboard/campaigns" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Billing", href: "/dashboard/billing" },
];

export default function Sidebar() {
  return (
    <div className="h-screen px-6 py-8">
      <div className="text-2xl font-bold mb-10">IIE</div>

      <nav className="space-y-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`block ${
              item.active ? "text-red-500" : "text-zinc-400 hover:text-white"
            } transition-colors`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
