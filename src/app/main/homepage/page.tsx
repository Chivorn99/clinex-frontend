'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Calendar, Users, Clock, TrendingUp, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function HomePage() {
    const router = useRouter()

    // Mock user data - this will come from authentication later
    const user = {
        name: 'Dr. Vorn Johnson',
        email: 'sarah@smithclinic.com',
        clinic: 'Smith Medical Clinic'
    }

    // Mock stats data
    const stats = [
        {
            name: 'Total Patients',
            value: '2,345',
            change: '+12%',
            changeType: 'increase',
            icon: Users,
        },
        {
            name: "Today's Upload",
            value: '18',
            change: '+3',
            changeType: 'increase',
            icon: Calendar,
        },
        {
            name: 'Pending Report',
            value: '7',
            change: '-2',
            changeType: 'decrease',
            icon: Clock,
        },
        {
            name: 'Monthly Report',
            value: '$12,543',
            change: '+8.2%',
            changeType: 'increase',
            icon: TrendingUp,
        },
    ]

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Welcome back, {user.name.split(' ')[1]}! 👋
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Here's what's happening at {user.clinic} today
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Recently Reports
                                </button>
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => router.push('/main/upload')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Upload Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.name} className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            {stat.name}
                                        </p>
                                        <div className="flex items-baseline">
                                            <p className="text-2xl font-semibold text-gray-900">
                                                {stat.value}
                                            </p>
                                            <p className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {stat.change}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    <Users className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">View Patient</span>
                                </button>
                                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    <Clock className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">View Queue</span>
                                </button>
                                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">View Queue</span>
                                </button>
                                <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                    <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-900">View Charts</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="flow-root">
                                <ul className="-mb-8">
                                    <li>
                                        <div className="relative pb-8">
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                                        <Users className="h-4 w-4 text-white" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            New patient <span className="font-medium text-gray-900">John Doe</span> registered
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        <time>1h ago</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="relative pb-8">
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                        <Calendar className="h-4 w-4 text-white" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Appointment scheduled with <span className="font-medium text-gray-900">Sarah Wilson</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        <time>2h ago</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="relative">
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                                                        <Clock className="h-4 w-4 text-white" />
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Appointment reminder sent to <span className="font-medium text-gray-900">Michael Brown</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                        <time>3h ago</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}