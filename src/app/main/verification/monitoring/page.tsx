'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { CheckCircle, XCircle, Clock, FileText, AlertTriangle, RefreshCw, Download, Eye, CheckSquare } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface BatchStatus {
    id: number
    name: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    total_reports: number
    processed_reports: number
    failed_reports: number
    verified_reports?: number
    created_at: string
    processing_started_at?: string
    processing_completed_at?: string
    files?: FileStatus[]
}

interface FileStatus {
    id: number
    filename: string
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'processed'
    processed_at?: string
    error_message?: string
    extracted_data?: any
}

export default function VerificationPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const batchId = searchParams.get('batch')
    
    const [batchStatus, setBatchStatus] = useState<BatchStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [autoRefresh, setAutoRefresh] = useState(true)

    useEffect(() => {
        if (!batchId) {
            router.push('/main/upload')
            return
        }

        fetchBatchStatus()
        
        // Set up polling for real-time updates (only if processing)
        let interval: NodeJS.Timeout
        if (autoRefresh) {
            interval = setInterval(() => {
                if (batchStatus?.status === 'processing' || batchStatus?.status === 'pending') {
                    fetchBatchStatus()
                }
            }, 2000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [batchId, autoRefresh, batchStatus?.status])

    const fetchBatchStatus = async () => {
        try {
            const response = await apiClient.get(`/batches/${batchId}/status`)
            setBatchStatus(response.data || response)
            setError('')
        } catch (err: any) {
            console.error('Failed to fetch batch status:', err)
            setError('Failed to fetch batch status')
        } finally {
            setLoading(false)
        }
    }

    const retryFailedFiles = async () => {
        try {
            setLoading(true)
            await apiClient.post(`/batches/${batchId}/retry-failed`)
            await fetchBatchStatus()
        } catch (err: any) {
            setError('Failed to retry failed files')
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
            case 'processed':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />
            case 'processing':
                return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
            default:
                return <Clock className="h-5 w-5 text-yellow-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'processed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    // Get processed files ready for verification
    const processedFiles = batchStatus?.files?.filter(file => 
        file.status === 'processed' || file.status === 'completed'
    ) || []

    if (loading && !batchStatus) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading batch status...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!batchStatus) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Batch Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested batch could not be found.</p>
                    <button
                        onClick={() => router.push('/main/upload')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Upload
                    </button>
                </div>
            </DashboardLayout>
        )
    }

    const progressPercentage = batchStatus.total_reports > 0 
        ? (batchStatus.processed_reports / batchStatus.total_reports) * 100 
        : 0

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Batch Processing Monitor</h1>
                        <p className="mt-2 text-gray-600">
                            Real-time monitoring for batch: {batchStatus.name}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                autoRefresh 
                                    ? 'bg-green-50 border-green-200 text-green-700' 
                                    : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                        >
                            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                        </button>
                        <button
                            onClick={fetchBatchStatus}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Batch Overview */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(batchStatus.status)}`}>
                                {getStatusIcon(batchStatus.status)}
                                <span className="ml-2 capitalize">{batchStatus.status}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>{batchStatus.processed_reports} / {batchStatus.total_reports} files</span>
                                    <span>{Math.round(progressPercentage)}%</span>
                                </div>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Processed Files</h3>
                            <div className="mt-2">
                                <span className="text-lg font-semibold text-green-600">
                                    {batchStatus.processed_reports || 0}
                                </span>
                                <span className="text-sm text-gray-500"> processed</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Failed Files</h3>
                            <div className="mt-2">
                                <span className="text-lg font-semibold text-red-600">
                                    {batchStatus.failed_reports || 0}
                                </span>
                                <span className="text-sm text-gray-500"> failed</span>
                                {batchStatus.failed_reports > 0 && (
                                    <button
                                        onClick={retryFailedFiles}
                                        className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Processed Files Ready for Verification */}
                {processedFiles.length > 0 && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Files Ready for Verification ({processedFiles.length})
                                </h2>
                                <button
                                    onClick={() => router.push(`/main/verification?batch=${batchId}`)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <CheckSquare className="h-4 w-4 mr-2" />
                                    Ready to Verify
                                </button>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {processedFiles.map((file) => (
                                <div key={file.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {file.filename}
                                                </p>
                                                {file.processed_at && (
                                                    <p className="text-xs text-gray-500">
                                                        Processed: {formatDate(file.processed_at)}
                                                    </p>
                                                )}
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Ready for Verification
                                                    </span>
                                                    {file.extracted_data && (
                                                        <span className="text-xs text-gray-500">
                                                            Data Extracted
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => router.push(`/main/verification/review?file=${file.id}&batch=${batchId}`)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                title="Verify This File"
                                            >
                                                <Eye className="h-4 w-4 mr-1 inline" />
                                                Verify
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-800 text-sm"
                                                title="Preview Extracted Data"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    {processedFiles.length} files ready for verification
                                </p>
                                <button
                                    onClick={() => router.push(`/main/verification?batch=${batchId}`)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <CheckSquare className="h-5 w-5 mr-2" />
                                    Start Verification Process
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* All File Details */}
                {batchStatus.files && batchStatus.files.length > 0 && (
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">All File Processing Details</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {batchStatus.files.map((file) => (
                                <div key={file.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {file.filename}
                                                </p>
                                                {file.processed_at && (
                                                    <p className="text-xs text-gray-500">
                                                        Processed: {formatDate(file.processed_at)}
                                                    </p>
                                                )}
                                                {file.error_message && (
                                                    <p className="text-xs text-red-600">
                                                        Error: {file.error_message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(file.status)}
                                            {(file.status === 'completed' || file.status === 'processed') && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => router.push(`/main/verification/review?file=${file.id}&batch=${batchId}`)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                        title="Verify Results"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 text-sm"
                                                        title="Download Results"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Batch Metadata */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Batch Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <dt className="font-medium text-gray-500">Batch ID</dt>
                            <dd className="mt-1 text-gray-900">{batchStatus.id}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500">Document Type</dt>
                            <dd className="mt-1 text-gray-900">Lab Reports</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500">Total Files</dt>
                            <dd className="mt-1 text-gray-900">{batchStatus.total_reports}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500">Created</dt>
                            <dd className="mt-1 text-gray-900">{formatDate(batchStatus.created_at)}</dd>
                        </div>
                        {batchStatus.processing_started_at && (
                            <div>
                                <dt className="font-medium text-gray-500">Started</dt>
                                <dd className="mt-1 text-gray-900">{formatDate(batchStatus.processing_started_at)}</dd>
                            </div>
                        )}
                        {batchStatus.processing_completed_at && (
                            <div>
                                <dt className="font-medium text-gray-500">Completed</dt>
                                <dd className="mt-1 text-gray-900">{formatDate(batchStatus.processing_completed_at)}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => router.push('/main/upload')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Upload More Files
                    </button>
                    {batchStatus.status === 'completed' && processedFiles.length > 0 && (
                        <button
                            onClick={() => router.push(`/main/verification?batch=${batchId}`)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <CheckSquare className="h-4 w-4 mr-2 inline" />
                            Start Verification
                        </button>
                    )}
                    {batchStatus.status === 'completed' && (
                        <button
                            onClick={() => router.push(`/main/results?batch=${batchId}`)}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            View Final Results
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}