import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/applications', label: 'Applications' },
  { to: '/applications/new', label: 'Add New' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 border-r border-gray-200 bg-white">
        <div className="p-5">
          <h1 className="text-lg font-bold text-gray-900">Job Tracker</h1>
          <p className="text-xs text-gray-400">Track &middot; Organize &middot; Follow up</p>
        </div>
        <nav className="mt-2 flex flex-col gap-0.5 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
