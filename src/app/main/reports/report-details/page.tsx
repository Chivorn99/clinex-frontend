'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ArrowLeft, FileText, User, Calendar, Clock, Phone, CheckCircle, AlertTriangle, Download, Edit, Maximize, Minimize } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'

interface PatientInfo {
    name: string
    patientId: string
    age: string
    gender: string
    phone: string | null
}

interface LabInfo {
    labId: string
    requestedBy: string
    requestedDate: string
    collectedDate: string
    analysisDate: string
    validatedBy: string
}

interface TestResult {
    category: string
    testName: string
    result: string
    flag: string | null
    unit: string | null
    referenceRange: string | null
}

interface ReportData {
    patientInfo: PatientInfo
    labInfo: LabInfo
    testResults: TestResult[]
}

interface ReportMetadata {
    id: number
    originalFilename: string
    status: string
    verifiedAt: string | null
    verifiedBy: string | null
    notes: string | null
    batchName: string
    uploaderName: string
}

export default function ReportDetailsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reportId = searchParams.get('id')
    const { user } = useAuth()
    
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [reportMetadata, setReportMetadata] = useState<ReportMetadata | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)

    // Mock user data
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

    useEffect(() => {
        if (reportId) {
            fetchReportDetails()
        }
    }, [reportId])

    const fetchReportDetails = async () => {
        try {
            setLoading(true)
            setError('')
            
            console.log('🚀 Fetching report details for ID:', reportId)
            const response = await apiClient.get(`/lab-reports/${reportId}`)
            console.log('✅ API Response:', response)

            if (response.success && response.data?.lab_report) {
                const labReport = response.data.lab_report
                const extractedData = response.data.extracted_data

                // Transform the data to match our interface
                const transformedReportData: ReportData = {
                    patientInfo: {
                        name: extractedData.patientInfo?.name || 'N/A',
                        patientId: extractedData.patientInfo?.patientId || 'N/A',
                        age: extractedData.patientInfo?.age || 'N/A',
                        gender: extractedData.patientInfo?.gender || 'N/A',
                        phone: extractedData.patientInfo?.phone || null
                    },
                    labInfo: {
                        labId: extractedData.labInfo?.labId || 'N/A',
                        requestedBy: extractedData.labInfo?.requestedBy || 'N/A',
                        requestedDate: extractedData.labInfo?.requestedDate || 'N/A',
                        collectedDate: extractedData.labInfo?.collectedDate || 'N/A',
                        analysisDate: extractedData.labInfo?.analysisDate || 'N/A',
                        validatedBy: extractedData.labInfo?.validatedBy || 'N/A'
                    },
                    testResults: extractedData.testResults || []
                }

                const transformedMetadata: ReportMetadata = {
                    id: labReport.id,
                    originalFilename: labReport.original_filename,
                    status: labReport.status,
                    verifiedAt: labReport.verified_at,
                    verifiedBy: labReport.verifier?.name || null,
                    notes: labReport.notes,
                    batchName: labReport.batch?.name || 'Unknown Batch',
                    uploaderName: labReport.uploader?.name || 'Unknown'
                }

                setReportData(transformedReportData)
                setReportMetadata(transformedMetadata)
                
                console.log('✅ Data transformed successfully:', {
                    patientName: transformedReportData.patientInfo.name,
                    labId: transformedReportData.labInfo.labId,
                    testResultsCount: transformedReportData.testResults.length
                })
            } else {
                throw new Error('Invalid response structure')
            }

        } catch (err: any) {
            console.error('💥 Failed to fetch report details:', err)
            let errorMessage = 'Failed to load report details'
            
            if (err.response?.status === 404) {
                errorMessage = 'Report not found'
            } else if (err.response?.status === 401) {
                errorMessage = 'Authentication failed. Please log in again.'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.message) {
                errorMessage = err.message
            }
            
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // Group test results by category
    const groupedResults = reportData?.testResults.reduce((acc, test) => {
        if (!acc[test.category]) {
            acc[test.category] = []
        }
        acc[test.category].push(test)
        return acc
    }, {} as Record<string, TestResult[]>)

    const getTestResultFlag = (flag: string | null, result: string, referenceRange: string | null) => {
        if (flag === "HIGH" || flag === "H") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    High
                </span>
            )
        }
        if (flag === "LOW" || flag === "L") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low
                </span>
            )
        }
        if (flag === "CRITICAL" || flag === "C") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Critical
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Normal
            </span>
        )
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading report details...</span>
                </div>
            </DashboardLayout>
        )
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </DashboardLayout>
        )
    }

    if (!reportData || !reportMetadata) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Report not found</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </DashboardLayout>
        )
    }

    // Add handler for verify button
    const handleVerifyReport = () => {
        if (reportMetadata) {
            // Navigate to verification page with the batch ID and auto-select this report
            // You might need to extract batch ID from the metadata
            const batchId = reportMetadata.batchName.match(/\d+/)?.[0] || reportMetadata.id
            router.push(`/main/verification?batchId=${batchId}&reportId=${reportId}`)
        }
    }

    // Mock PDF URL - you might want to get this from your API
    const pdfUrl = "/api/placeholder/400/600" // Replace with actual PDF URL from storage_path

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Reports
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
                            <div className="mt-1 flex items-center space-x-4">
                                <p className="text-gray-600">Lab Report ID: {reportData.labInfo.labId}</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    reportMetadata.status === 'verified' 
                                        ? 'bg-green-100 text-green-800' 
                                        : (reportMetadata.status === 'processing' || reportMetadata.status === 'processed')
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {reportMetadata.status === 'processed' ? 'Needs Verification' : reportMetadata.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        {/* Show Verify button for processing OR processed status */}
                        {(reportMetadata.status === 'processing' || reportMetadata.status === 'processed') && (
                            <button 
                                onClick={handleVerifyReport}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify Report
                            </button>
                        )}
                        
                        {/* Show Edit button only for verified reports or admins */}
                        {(reportMetadata.status === 'verified' || currentUser.name.includes('Dr.')) && (
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Data
                            </button>
                        )}
                        
                        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Report Metadata - Enhanced for processing/processed status */}
                <div className={`border rounded-lg p-4 ${
                    (reportMetadata.status === 'processing' || reportMetadata.status === 'processed')
                        ? 'bg-blue-50 border-blue-200' 
                        : reportMetadata.status === 'verified'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                }`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className={`font-medium ${
                                (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-900' :
                                reportMetadata.status === 'verified' ? 'text-green-900' :
                                'text-yellow-900'
                            }`}>Batch:</span>
                            <span className={`ml-2 ${
                                (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-700' :
                                reportMetadata.status === 'verified' ? 'text-green-700' :
                                'text-yellow-700'
                            }`}>{reportMetadata.batchName}</span>
                        </div>
                        <div>
                            <span className={`font-medium ${
                                (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-900' :
                                reportMetadata.status === 'verified' ? 'text-green-900' :
                                'text-yellow-900'
                            }`}>Uploaded by:</span>
                            <span className={`ml-2 ${
                                (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-700' :
                                reportMetadata.status === 'verified' ? 'text-green-700' :
                                'text-yellow-700'
                            }`}>{reportMetadata.uploaderName}</span>
                        </div>
                        {reportMetadata.verifiedBy && (
                            <div>
                                <span className={`font-medium ${
                                    (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-900' :
                                    reportMetadata.status === 'verified' ? 'text-green-900' :
                                    'text-yellow-900'
                                }`}>Verified by:</span>
                                <span className={`ml-2 ${
                                    (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-700' :
                                    reportMetadata.status === 'verified' ? 'text-green-700' :
                                    'text-yellow-700'
                                }`}>{reportMetadata.verifiedBy}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Special message for processing/processed status */}
                    {(reportMetadata.status === 'processing' || reportMetadata.status === 'processed') && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-900">Status:</span>
                                <span className="ml-2 text-blue-700">
                                    This report has been processed and data extracted. Click "Verify Report" to review and approve the extracted data.
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {reportMetadata.notes && (
                        <div className={`mt-2 pt-2 border-t ${
                            (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'border-blue-200' :
                            reportMetadata.status === 'verified' ? 'border-green-200' :
                            'border-yellow-200'
                        }`}>
                            <span className={`font-medium ${
                                (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-900' :
                                reportMetadata.status === 'verified' ? 'text-green-900' :
                                'text-yellow-900'
                            }`}>Notes:</span>
                            <p className={`mt-1 ${
                                (reportMetadata.status === 'processing' || reportMetadata.status === 'processed') ? 'text-blue-700' :
                                reportMetadata.status === 'verified' ? 'text-green-700' :
                                'text-yellow-700'
                            }`}>{reportMetadata.notes}</p>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Patient & Lab Info */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Processing/Processed Status Alert */}
                        {(reportMetadata.status === 'processing' || reportMetadata.status === 'processed') && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Verification Required
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>
                                                This report has been processed and the data has been extracted successfully. 
                                                Please review the extracted information below and click "Verify Report" 
                                                to complete the verification process.
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                onClick={handleVerifyReport}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Go to Verification Page
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Patient & Lab Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Patient Information Card */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-blue-600" />
                                        Patient Information
                                        {(reportMetadata.status === 'processing' || reportMetadata.status === 'processed') && (
                                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Needs Review
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.patientInfo.name || 'Not extracted'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Patient ID</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.patientInfo.patientId}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Age</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.patientInfo.age}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Gender</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.patientInfo.gender}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                                {reportData.patientInfo.phone || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lab Information Card */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-green-600" />
                                        Laboratory Information
                                        {(reportMetadata.status === 'processing' || reportMetadata.status === 'processed') && (
                                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Needs Review
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Lab ID</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.labInfo.labId}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Requested By</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.labInfo.requestedBy}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Requested Date</label>
                                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                {reportData.labInfo.requestedDate}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Collected Date</label>
                                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                {reportData.labInfo.collectedDate}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Analysis Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.labInfo.analysisDate}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Validated By</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.labInfo.validatedBy || 'Not validated'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Results by Category */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Test Results</h3>
                                {(reportMetadata.status === 'processing' || reportMetadata.status === 'processed') && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Needs Verification
                                    </span>
                                )}
                            </div>
                            
                            {groupedResults && Object.entries(groupedResults).map(([category, tests]) => (
                                <div key={category} className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-900 uppercase tracking-wide">
                                            {category}
                                        </h4>
                                        <p className="text-sm text-gray-500">{tests.length} test(s) in this category</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Test Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Result
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Unit
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Reference Range
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {tests.map((test, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {test.testName}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                            {test.result}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {test.unit || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {test.referenceRange || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {getTestResultFlag(test.flag, test.result, test.referenceRange)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}

                            {(!groupedResults || Object.keys(groupedResults).length === 0) && (
                                <div className="bg-white shadow rounded-lg p-8 text-center">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No test results found for this report</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - PDF Preview */}
                    <div className="xl:col-span-1">
                        <div className="bg-white shadow rounded-lg sticky top-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-orange-600" />
                                        Original PDF
                                    </h3>
                                    <button
                                        onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                                        title={isPreviewExpanded ? "Minimize" : "Expand"}
                                    >
                                        {isPreviewExpanded ? (
                                            <Minimize className="h-4 w-4" />
                                        ) : (
                                            <Maximize className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className={`${isPreviewExpanded ? 'h-96' : 'h-80'} transition-all duration-300`}>
                                    <iframe
                                        src={pdfUrl}
                                        className="w-full h-full rounded-md border border-gray-200"
                                        title="PDF Preview"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                    <span>Original: {reportMetadata.originalFilename}</span>
                                    <button
                                        onClick={() => window.open(pdfUrl, '_blank')}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Open Full PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}