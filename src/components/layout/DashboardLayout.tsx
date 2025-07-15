import Navbar from './Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    clinic: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}