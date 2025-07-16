'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ArrowLeft, FileText, User, Calendar, Clock, Phone, CheckCircle, AlertTriangle, Download, Edit, Maximize, Minimize } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PatientInfo {
    name: string
    patientId: string
    age: string
    gender: string
    phone: string
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
    unit: string
    referenceRange: string
}

interface ReportData {
    patientInfo: PatientInfo
    labInfo: LabInfo
    testResults: TestResult[]
}

export default function ReportDetailsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reportId = searchParams.get('id')
    const { user } = useAuth()
    
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(true)
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

    // Mock extracted data - this would come from your API
    const mockReportData: ReportData = {
        patientInfo: {
            name: "សាន សេងយាន",
            patientId: "PT001871",
            age: "72 Y",
            gender: "Female",
            phone: "069366717"
        },
        labInfo: {
            labId: "LT001235",
            requestedBy: "Dr. CHHORN Sophy",
            requestedDate: "17/03/2024 12:57",
            collectedDate: "17/03/2024 13:36",
            analysisDate: "17/03/2024 13:36",
            validatedBy: "SREYNEANG - B.Sc"
        },
        testResults: [
            {
                category: "BIOCHEMISTRY",
                testName: "Glucose",
                result: "6.5",
                flag: null,
                unit: "mmol/L",
                referenceRange: "(3.9-6.1)"
            },
            {
                category: "BIOCHEMISTRY",
                testName: "Creatinine",
                result: "85",
                flag: "HIGH",
                unit: "umol/L",
                referenceRange: "(44-80)"
            },
            {
                category: "BIOCHEMISTRY",
                testName: "Urea",
                result: "5.5",
                flag: null,
                unit: "mmol/L",
                referenceRange: "(2.8-8.3)"
            },
            {
                category: "HEMATOLOGY",
                testName: "Hemoglobin",
                result: "12.5",
                flag: null,
                unit: "g/dL",
                referenceRange: "(12.0-15.5)"
            },
            {
                category: "HEMATOLOGY",
                testName: "White Blood Cells",
                result: "8.2",
                flag: null,
                unit: "×10³/μL",
                referenceRange: "(4.0-11.0)"
            },
            {
                category: "LIPID PROFILE",
                testName: "Total Cholesterol",
                result: "5.8",
                flag: "HIGH",
                unit: "mmol/L",
                referenceRange: "(<5.2)"
            }
        ]
    }

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setReportData(mockReportData)
            setLoading(false)
        }, 1000)
    }, [reportId])

    // Group test results by category
    const groupedResults = reportData?.testResults.reduce((acc, test) => {
        if (!acc[test.category]) {
            acc[test.category] = []
        }
        acc[test.category].push(test)
        return acc
    }, {} as Record<string, TestResult[]>)

    const getTestResultFlag = (flag: string | null, result: string, referenceRange: string) => {
        if (flag === "HIGH") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    High
                </span>
            )
        }
        if (flag === "LOW") {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low
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
                </div>
            </DashboardLayout>
        )
    }

    if (!reportData) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Report not found</p>
                </div>
            </DashboardLayout>
        )
    }

    // Mock PDF URL - this would come from your API
    const pdfUrl = "/api/placeholder/400/600" // Replace with actual PDF URL

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
                            <p className="mt-1 text-gray-600">Lab Report ID: {reportData.labInfo.labId}</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Data
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Patient & Lab Info */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Patient & Lab Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Patient Information Card */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-blue-600" />
                                        Patient Information
                                    </h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Patient Name</label>
                                            <p className="mt-1 text-sm text-gray-900">{reportData.patientInfo.name}</p>
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
                                                {reportData.patientInfo.phone}
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
                                            <p className="mt-1 text-sm text-gray-900">{reportData.labInfo.validatedBy}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Results by Category */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Test Results</h3>
                            
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
                                                            {test.unit}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {test.referenceRange}
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
                                    <span>Page 1 of 2</span>
                                    <button
                                        onClick={() => window.open(pdfUrl, '_blank')}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Open Full PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card
                        <div className="bg-white shadow rounded-lg mt-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Verified
                                </button>
                                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Extracted Data
                                </button>
                                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export to Excel
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}