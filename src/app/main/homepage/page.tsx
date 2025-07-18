'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Calendar, Users, Clock, TrendingUp, Plus, X, Eye, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
    const router = useRouter()
    const { user } = useAuth()
    const [showRecentReports, setShowRecentReports] = useState(false)

    const mockUser = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@smithclinic.com',
        clinic: 'Smith Medical Clinic'
    }

    const currentUser = user ? {
        name: user.name,
        email: user.email,
        clinic: 'Smith Medical Clinic'
    } : mockUser

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

    const recentReports = [
        {
            id: 'rpt_001',
            fileName: 'lab_report_john_doe.pdf',
            patientName: 'John Doe',
            reportType: 'Laboratory Report',
            processedDate: '2024-01-15T14:30:00Z',
            status: 'verified'
        },
        {
            id: 'rpt_002',
            fileName: 'xray_chest_jane_smith.pdf',
            patientName: 'Jane Smith',
            reportType: 'X-Ray Report',
            processedDate: '2024-01-15T13:15:00Z',
            status: 'unverified'
        },
        {
            id: 'rpt_003',
            fileName: 'blood_test_mike_johnson.pdf',
            patientName: 'Mike Johnson',
            reportType: 'Blood Test Report',
            processedDate: '2024-01-15T11:45:00Z',
            status: 'verified'
        }
    ]

    return (
        <>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Welcome Header */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Welcome back, {currentUser.name.split(' ')[1]}! 👋
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        Here's what's happening at {currentUser.clinic} today
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowRecentReports(true)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
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
                                    <button onClick={() => router.push('/main/verification/monitoring')} className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        <Clock className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-900">Ready To Verify</span>
                                    </button>
                                    <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-gray-900">View Schedule</span>
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

            {/* Recent Reports Modal */}
            {showRecentReports && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowRecentReports(false)}
                        ></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                                        Recent Reports
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowRecentReports(false)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                                    >
                                        <span className="sr-only">Close</span>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                                <div className="space-y-3">
                                    {recentReports.map((report) => (
                                        <div
                                            key={report.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {report.fileName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {report.patientName} • {report.reportType}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(report.processedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'verified'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                                                    title="View report"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-6 py-4">
                                <div className="flex justify-between space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowRecentReports(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowRecentReports(false)
                                            router.push('/main/reports')
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        View All Reports
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}