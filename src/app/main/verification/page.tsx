'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ArrowLeft, FileText, User, Calendar, Clock, Phone, Plus, Trash2, Edit, Save, X, Eye, CheckCircle, AlertTriangle, Maximize, Minimize, Clock as ClockIcon } from 'lucide-react'

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
    id: string
    category: string
    testName: string
    result: string
    unit: string
    referenceRange: string
    flag: 'normal' | 'high' | 'low' | 'critical' | null
}

interface ProcessedReport {
    id: string
    fileName: string
    status: 'processing' | 'completed' | 'verified'
    patientInfo: PatientInfo
    labInfo: LabInfo
    testResults: TestResult[]
    pdfUrl: string
    processingProgress: number
}

export default function VerificationPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const batchId = searchParams.get('batch')

    const [isProcessing, setIsProcessing] = useState(true)
    const [reports, setReports] = useState<ProcessedReport[]>([])
    const [selectedReport, setSelectedReport] = useState<ProcessedReport | null>(null)
    const [editingField, setEditingField] = useState<string | null>(null)
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
    const [processingAnimation, setProcessingAnimation] = useState(true)

    // Modal states
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Mock user data
    const user = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@smithclinic.com',
        clinic: 'Smith Medical Clinic'
    }

    // Mock processed reports data
    const mockReports: ProcessedReport[] = [
        {
            id: 'rpt_001',
            fileName: 'lab_report_john_doe.pdf',
            status: 'completed',
            processingProgress: 100,
            pdfUrl: '/api/placeholder/400/600',
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
                    id: '1',
                    category: "BIOCHEMISTRY",
                    testName: "Glucose",
                    result: "6.5",
                    unit: "mmol/L",
                    referenceRange: "(3.9-6.1)",
                    flag: "high"
                },
                {
                    id: '2',
                    category: "BIOCHEMISTRY",
                    testName: "Creatinine",
                    result: "85",
                    unit: "umol/L",
                    referenceRange: "(44-80)",
                    flag: "high"
                },
                {
                    id: '3',
                    category: "HEMATOLOGY",
                    testName: "Hemoglobin",
                    result: "12.5",
                    unit: "g/dL",
                    referenceRange: "(12.0-15.5)",
                    flag: "normal"
                }
            ]
        },
        {
            id: 'rpt_002',
            fileName: 'blood_test_jane_smith.pdf',
            status: 'completed',
            processingProgress: 100,
            pdfUrl: '/api/placeholder/400/600',
            patientInfo: {
                name: "Jane Smith",
                patientId: "PT001872",
                age: "45 Y",
                gender: "Female",
                phone: "012345678"
            },
            labInfo: {
                labId: "LT001236",
                requestedBy: "Dr. John Wilson",
                requestedDate: "18/03/2024 10:30",
                collectedDate: "18/03/2024 11:00",
                analysisDate: "18/03/2024 11:30",
                validatedBy: "MARY - B.Sc"
            },
            testResults: [
                {
                    id: '4',
                    category: "LIPID PROFILE",
                    testName: "Total Cholesterol",
                    result: "5.8",
                    unit: "mmol/L",
                    referenceRange: "(<5.2)",
                    flag: "high"
                }
            ]
        },
        {
            id: 'rpt_003',
            fileName: 'urine_test_mike_johnson.pdf',
            status: 'processing',
            processingProgress: 75,
            pdfUrl: '/api/placeholder/400/600',
            patientInfo: {
                name: "",
                patientId: "",
                age: "",
                gender: "",
                phone: ""
            },
            labInfo: {
                labId: "",
                requestedBy: "",
                requestedDate: "",
                collectedDate: "",
                analysisDate: "",
                validatedBy: ""
            },
            testResults: []
        }
    ]

    useEffect(() => {
        setTimeout(() => {
            setProcessingAnimation(false)
            setReports(mockReports)
            setIsProcessing(false)
            const firstCompleted = mockReports.find(r => r.status === 'completed')
            if (firstCompleted) {
                setSelectedReport(firstCompleted)
            }
        }, 3000)
    }, [])

    const updatePatientInfo = (field: keyof PatientInfo, value: string) => {
        if (!selectedReport) return

        const updatedReport = {
            ...selectedReport,
            patientInfo: {
                ...selectedReport.patientInfo,
                [field]: value
            }
        }

        setSelectedReport(updatedReport)
        setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r))
    }

    const updateLabInfo = (field: keyof LabInfo, value: string) => {
        if (!selectedReport) return

        const updatedReport = {
            ...selectedReport,
            labInfo: {
                ...selectedReport.labInfo,
                [field]: value
            }
        }

        setSelectedReport(updatedReport)
        setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r))
    }

    const updateTestResult = (testId: string, field: keyof TestResult, value: string | null) => {
        if (!selectedReport) return

        const updatedReport = {
            ...selectedReport,
            testResults: selectedReport.testResults.map(test =>
                test.id === testId ? { ...test, [field]: value } : test
            )
        }

        setSelectedReport(updatedReport)
        setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r))
    }

    const addTestResult = (category: string) => {
        if (!selectedReport) return

        const newTest: TestResult = {
            id: Date.now().toString(),
            category,
            testName: '',
            result: '',
            unit: '',
            referenceRange: '',
            flag: null
        }

        const updatedReport = {
            ...selectedReport,
            testResults: [...selectedReport.testResults, newTest]
        }

        setSelectedReport(updatedReport)
        setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r))
    }

    const removeTestResult = (testId: string) => {
        if (!selectedReport) return

        const updatedReport = {
            ...selectedReport,
            testResults: selectedReport.testResults.filter(test => test.id !== testId)
        }

        setSelectedReport(updatedReport)
        setReports(prev => prev.map(r => r.id === selectedReport.id ? updatedReport : r))
    }

    const addNewCategory = () => {
        setShowCategoryModal(true)
        setNewCategoryName('')
    }

    const handleCategorySubmit = () => {
        if (newCategoryName.trim() && selectedReport) {
            addTestResult(newCategoryName.trim().toUpperCase())
            setShowCategoryModal(false)
            setNewCategoryName('')
        }
    }

    const handleVerifyLater = async () => {
        if (!selectedReport) return

        setIsSubmitting(true)

        // TODO: Save as unverified
        setTimeout(() => {
            console.log('Saving for later verification:', selectedReport)
            setIsSubmitting(false)
            router.push('/main/reports?status=unverified')
        }, 1000)
    }

    const handleSubmitVerification = async () => {
        if (!selectedReport) return

        setIsSubmitting(true)

        // TODO: Submit verified data
        setTimeout(() => {
            console.log('Submitting verified data:', selectedReport)
            setIsSubmitting(false)
            router.push('/main/reports?status=verified')
        }, 1000)
    }

    const getFlagColor = (flag: TestResult['flag']) => {
        switch (flag) {
            case 'high': case 'critical': return 'bg-red-100 text-red-800'
            case 'low': return 'bg-yellow-100 text-yellow-800'
            case 'normal': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    // Group test results by category
    const groupedTestResults = selectedReport?.testResults.reduce((acc, test) => {
        if (!acc[test.category]) {
            acc[test.category] = []
        }
        acc[test.category].push(test)
        return acc
    }, {} as Record<string, TestResult[]>) || {}

    if (processingAnimation || isProcessing) {
        return (
            <DashboardLayout user={user}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                            <FileText className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">Processing Documents</h2>
                        <p className="mt-2 text-gray-600">Extracting data from your PDF reports...</p>
                        <div className="mt-6 w-64 mx-auto">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>Progress</span>
                                <span>Processing...</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Upload
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Data Verification</h1>
                            <p className="mt-1 text-gray-600">Review and verify extracted data before submission</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleVerifyLater}
                            disabled={!selectedReport || selectedReport.status !== 'completed' || isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    Verify Later
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleSubmitVerification}
                            disabled={!selectedReport || selectedReport.status !== 'completed' || isSubmitting}
                            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Submit Verification
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Reports List - Left Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Reports ({reports.length})</h3>
                            </div>
                            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => report.status === 'completed' && setSelectedReport(report)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedReport?.id === report.id
                                                ? 'border-blue-300 bg-blue-50'
                                                : report.status === 'completed'
                                                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-900 truncate">
                                                {report.fileName}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${report.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : report.status === 'processing'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                            {report.status === 'processing' && (
                                                <span className="text-xs text-gray-500">{report.processingProgress}%</span>
                                            )}
                                        </div>
                                        {report.status === 'processing' && (
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                                <div
                                                    className="bg-yellow-600 h-1 rounded-full transition-all duration-300"
                                                    style={{ width: `${report.processingProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="xl:col-span-2">
                        {selectedReport ? (
                            <div className="space-y-6">
                                {/* Patient Information */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <User className="h-5 w-5 mr-2 text-blue-600" />
                                            Patient Information
                                        </h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-4">
                                        {Object.entries(selectedReport.patientInfo).map(([key, value]) => (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updatePatientInfo(key as keyof PatientInfo, e.target.value)}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Lab Information */}
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <FileText className="h-5 w-5 mr-2 text-green-600" />
                                            Laboratory Information
                                        </h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-4">
                                        {Object.entries(selectedReport.labInfo).map(([key, value]) => (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => updateLabInfo(key as keyof LabInfo, e.target.value)}
                                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Test Results by Category */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900">Test Results</h3>
                                        <button
                                            onClick={addNewCategory}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Category
                                        </button>
                                    </div>

                                    {Object.entries(groupedTestResults).map(([category, tests]) => (
                                        <div key={category} className="bg-white shadow rounded-lg">
                                            <div className="px-6 py-4 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-medium text-gray-900 uppercase tracking-wide">
                                                        {category}
                                                    </h4>
                                                    <button
                                                        onClick={() => addTestResult(category)}
                                                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        Add Test
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference Range</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flag</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {tests.map((test) => (
                                                            <tr key={test.id} className="hover:bg-gray-50">
                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="text"
                                                                        value={test.testName}
                                                                        onChange={(e) => updateTestResult(test.id, 'testName', e.target.value)}
                                                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Test name"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="text"
                                                                        value={test.result}
                                                                        onChange={(e) => updateTestResult(test.id, 'result', e.target.value)}
                                                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Result"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="text"
                                                                        value={test.unit}
                                                                        onChange={(e) => updateTestResult(test.id, 'unit', e.target.value)}
                                                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Unit"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="text"
                                                                        value={test.referenceRange}
                                                                        onChange={(e) => updateTestResult(test.id, 'referenceRange', e.target.value)}
                                                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Reference range"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <select
                                                                        value={test.flag || ''}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value === '' ? null : e.target.value;
                                                                            updateTestResult(test.id, 'flag', value as TestResult['flag']);
                                                                        }}
                                                                        className="block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    >
                                                                        <option value="">Select flag</option>
                                                                        <option value="normal">Normal</option>
                                                                        <option value="high">High</option>
                                                                        <option value="low">Low</option>
                                                                        <option value="critical">Critical</option>
                                                                    </select>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <button
                                                                        onClick={() => removeTestResult(test.id)}
                                                                        className="text-red-600 hover:text-red-800"
                                                                        title="Remove test"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}

                                    {Object.keys(groupedTestResults).length === 0 && (
                                        <div className="bg-white shadow rounded-lg p-8 text-center">
                                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No test results found</p>
                                            <button
                                                onClick={addNewCategory}
                                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Category
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white shadow rounded-lg p-12 text-center">
                                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Report</h3>
                                <p className="text-gray-500">Choose a completed report from the list to start verification</p>
                            </div>
                        )}
                    </div>

                    {/* PDF Preview - Right Sidebar */}
                    <div className="xl:col-span-1">
                        <div className="bg-white shadow rounded-lg sticky top-6">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                        <Eye className="h-5 w-5 mr-2 text-orange-600" />
                                        PDF Preview
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
                                {selectedReport ? (
                                    <>
                                        <div className={`${isPreviewExpanded ? 'h-96' : 'h-64'} transition-all duration-300`}>
                                            <iframe
                                                src={selectedReport.pdfUrl}
                                                className="w-full h-full rounded-md border border-gray-200"
                                                title="PDF Preview"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                            <span>{selectedReport.fileName}</span>
                                            <button
                                                onClick={() => window.open(selectedReport.pdfUrl, '_blank')}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Open Full PDF
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200">
                                        <div className="text-center">
                                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Select a report to preview</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Category Modal */}
                {showCategoryModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div
                                className="fixed inset-0  bg-opacity-10 backdrop-filter backdrop-blur-md transition-opacityy"
                                aria-hidden="true"
                                onClick={() => setShowCategoryModal(false)}
                            ></div>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            {/* Modal panel */}
                            <div className="relative inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <Plus className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Add New Test Category
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Enter the name for the new test category. This will be displayed as a section header for grouping related tests.
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                id="category-name"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleCategorySubmit()
                                                    }
                                                }}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="e.g., BLOOD CHEMISTRY, IMMUNOLOGY"
                                                autoFocus
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Examples: BIOCHEMISTRY, HEMATOLOGY, LIPID PROFILE, THYROID FUNCTION
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={handleCategorySubmit}
                                        disabled={!newCategoryName.trim()}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Category
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}