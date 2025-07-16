'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Calendar, FileText, Users, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Report {
    id: string
    fileName: string
    patientName: string
    reportType: string
    uploadDate: string
    processedDate: string
    status: 'verified' | 'unverified' | 'processing'
    batchId: string
    extractedData?: any
    verifiedBy?: string
    priority: 'low' | 'medium' | 'high'
}

interface Batch {
    id: string
    name: string
    createdAt: string
    reportCount: number
    verifiedCount: number
    status: 'completed' | 'processing' | 'pending'
    templateType: string
}

export default function ReportsPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'unverified' | 'batches'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState('all')
    const router = useRouter()

    // Fallback mock user data
    const mockUser = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@smithclinic.com',
        clinic: 'Smith Medical Clinic'
    }

    // Use auth user if available, otherwise fallback to mock
    const currentUser = user ? {
        name: user.name,
        email: user.email,
        clinic: 'Smith Medical Clinic'
    } : mockUser

    // Mock reports data
    const reports: Report[] = [
        {
            id: 'rpt_001',
            fileName: 'lab_report_john_doe.pdf',
            patientName: 'John Doe',
            reportType: 'Laboratory Report',
            uploadDate: '2024-01-15T10:30:00Z',
            processedDate: '2024-01-15T10:45:00Z',
            status: 'verified',
            batchId: 'batch_001',
            verifiedBy: 'Dr. Smith',
            priority: 'high'
        },
        {
            id: 'rpt_002',
            fileName: 'xray_chest_jane_smith.pdf',
            patientName: 'Jane Smith',
            reportType: 'X-Ray Report',
            uploadDate: '2024-01-15T11:00:00Z',
            processedDate: '2024-01-15T11:15:00Z',
            status: 'unverified',
            batchId: 'batch_001',
            priority: 'medium'
        },
        {
            id: 'rpt_003',
            fileName: 'blood_test_mike_johnson.pdf',
            patientName: 'Mike Johnson',
            reportType: 'Blood Test Report',
            uploadDate: '2024-01-15T12:00:00Z',
            processedDate: '2024-01-15T12:10:00Z',
            status: 'verified',
            batchId: 'batch_002',
            verifiedBy: 'Dr. Johnson',
            priority: 'low'
        },
        {
            id: 'rpt_004',
            fileName: 'consultation_notes_alice_brown.pdf',
            patientName: 'Alice Brown',
            reportType: 'Consultation Notes',
            uploadDate: '2024-01-16T09:30:00Z',
            processedDate: '',
            status: 'processing',
            batchId: 'batch_003',
            priority: 'high'
        }
    ]

    // Mock batches data
    const batches: Batch[] = [
        {
            id: 'batch_001',
            name: 'Morning Reports - Jan 15',
            createdAt: '2024-01-15T10:30:00Z',
            reportCount: 5,
            verifiedCount: 3,
            status: 'completed',
            templateType: 'Laboratory Report'
        },
        {
            id: 'batch_002',
            name: 'Afternoon Reports - Jan 15',
            createdAt: '2024-01-15T14:00:00Z',
            reportCount: 3,
            verifiedCount: 2,
            status: 'completed',
            templateType: 'Mixed Templates'
        },
        {
            id: 'batch_003',
            name: 'Evening Reports - Jan 16',
            createdAt: '2024-01-16T18:00:00Z',
            reportCount: 7,
            verifiedCount: 0,
            status: 'processing',
            templateType: 'X-Ray Report'
        }
    ]

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.patientName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterType === 'all' || report.reportType === filterType
        const matchesTab = activeTab === 'all' ||
            (activeTab === 'verified' && report.status === 'verified') ||
            (activeTab === 'unverified' && report.status === 'unverified')

        return matchesSearch && matchesFilter && matchesTab
    })

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Processing...'
        return new Date(dateString).toLocaleString()
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                    </span>
                )
            case 'unverified':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Unverified
                    </span>
                )
            case 'processing':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Processing
                    </span>
                )
            default:
                return null
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        High
                    </span>
                )
            case 'medium':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Medium
                    </span>
                )
            case 'low':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Low
                    </span>
                )
            default:
                return null
        }
    }

    const getBatchStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                    </span>
                )
            case 'processing':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Processing
                    </span>
                )
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </span>
                )
            default:
                return null
        }
    }

    const stats = {
        total: reports.length,
        verified: reports.filter(r => r.status === 'verified').length,
        unverified: reports.filter(r => r.status === 'unverified').length,
        processing: reports.filter(r => r.status === 'processing').length
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
                    <p className="mt-2 text-gray-600">
                        View and manage all processed medical reports and batch classifications
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Reports</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Verified</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Unverified</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.unverified}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Processing</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs and Filters */}
                <div className="bg-white shadow rounded-lg">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {[
                                { key: 'all', label: 'All Reports', count: stats.total },
                                { key: 'verified', label: 'Verified', count: stats.verified },
                                { key: 'unverified', label: 'Unverified', count: stats.unverified },
                                { key: 'batches', label: 'Batch History', count: batches.length }
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`${activeTab === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Search and Filter Bar */}
                    {activeTab !== 'batches' && (
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                                <div className="flex flex-1 space-x-4">
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search reports..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Laboratory Report">Laboratory Report</option>
                                        <option value="X-Ray Report">X-Ray Report</option>
                                        <option value="Blood Test Report">Blood Test Report</option>
                                        <option value="Consultation Notes">Consultation Notes</option>
                                    </select>
                                </div>
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reports Table */}
                    {activeTab !== 'batches' ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Report Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Processed Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => router.push(`/main/reports/report-details?id=${report.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {report.fileName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Batch: {report.batchId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {report.patientName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {report.reportType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(report.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getPriorityBadge(report.priority)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(report.processedDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => router.push(`/main/reports/report-details?id=${report.id}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-900">
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Batch History Table */
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Batch Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Template Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reports
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {batches.map((batch) => (
                                        <tr key={batch.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {batch.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {batch.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {batch.templateType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {batch.verifiedCount}/{batch.reportCount} verified
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getBatchStatusBadge(batch.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(batch.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-900">
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}