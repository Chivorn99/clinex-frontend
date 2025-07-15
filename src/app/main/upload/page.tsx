'use client'
import { useState, useRef } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Upload, FileText, Trash2, Eye, Download, AlertCircle, CheckCircle, X } from 'lucide-react'

interface UploadedFile {
    id: string
    name: string
    size: number
    file: File
    status: 'uploading' | 'completed' | 'error'
    progress: number
}

interface PDFTemplate {
    id: string
    name: string
    description: string
}

export default function UploadPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const miniUploadInputRef = useRef<HTMLInputElement>(null) // Add separate ref for mini upload

    // Mock user data
    const user = {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@smithclinic.com',
        clinic: 'Smith Medical Clinic'
    }

    // PDF Templates
    const pdfTemplates: PDFTemplate[] = [
        {
            id: 'lab-report',
            name: 'Laboratory Report',
            description: 'Extract patient information, test results, reference ranges, and medical values from laboratory reports.'
        },
        {
            id: 'xray-report',
            name: 'X-Ray Report',
            description: 'Process radiological findings, impressions, and diagnostic conclusions from X-ray examination reports.'
        },
        {
            id: 'blood-test',
            name: 'Blood Test Report',
            description: 'Parse blood work results including CBC, chemistry panels, and other hematological analyses.'
        },
        {
            id: 'prescription',
            name: 'Prescription',
            description: 'Extract medication names, dosages, instructions, and prescriber information from prescription documents.'
        },
        {
            id: 'consultation',
            name: 'Consultation Notes',
            description: 'Process patient consultation records, symptoms, diagnoses, and treatment plans from medical notes.'
        }
    ]

    const selectedTemplateInfo = pdfTemplates.find(template => template.id === selectedTemplate)

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        Array.from(files).forEach((file) => {
            if (file.type === 'application/pdf') {
                const newFile: UploadedFile = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    size: file.size,
                    file: file,
                    status: 'uploading',
                    progress: 0
                }

                setUploadedFiles(prev => [...prev, newFile])

                // Simulate upload progress
                simulateUpload(newFile.id)
            }
        })
    }

    const simulateUpload = (fileId: string) => {
        const interval = setInterval(() => {
            setUploadedFiles(prev =>
                prev.map(file => {
                    if (file.id === fileId) {
                        const newProgress = file.progress + Math.random() * 30
                        if (newProgress >= 100) {
                            clearInterval(interval)
                            return { ...file, progress: 100, status: 'completed' }
                        }
                        return { ...file, progress: newProgress }
                    }
                    return file
                })
            )
        }, 200)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const removeFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
        if (selectedFilePreview === fileId) {
            setSelectedFilePreview(null)
            // Clean up the preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
                setPreviewUrl(null)
            }
        }
    }

    // Add this function to handle PDF preview
    const handleFilePreview = (fileId: string) => {
        const file = uploadedFiles.find(f => f.id === fileId)
        if (file && file.status === 'completed') {
            // Clean up previous preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }

            // Create new object URL for the PDF
            const url = URL.createObjectURL(file.file)
            setPreviewUrl(url)
            setSelectedFilePreview(fileId)
        }
    }

    const handleProcess = () => {
        if (!selectedTemplate || uploadedFiles.length === 0) return
        setIsProcessing(true)
        // TODO: Navigate to waiting page after processing
        setTimeout(() => {
            console.log('Processing completed, navigate to waiting page')
        }, 2000)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 10024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const completedFiles = uploadedFiles.filter(file => file.status === 'completed')
    const overallProgress = uploadedFiles.length > 0
        ? uploadedFiles.reduce((acc, file) => acc + file.progress, 0) / uploadedFiles.length
        : 0

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">PDF Upload & Processing</h1>
                    <p className="mt-2 text-gray-600">
                        Upload medical reports and documents for automated data extraction
                    </p>
                </div>

                {/* Template Selection & Description */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                                Document Template
                            </label>
                            <select
                                id="template"
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select template type...</option>
                                {pdfTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Template Description
                            </label>
                            <div className="p-3 bg-gray-50 rounded-md border">
                                {selectedTemplateInfo ? (
                                    <p className="text-sm text-gray-700">{selectedTemplateInfo.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Select a template to see its description</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Progress */}
                {uploadedFiles.length > 0 && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">Upload Progress</h3>
                            <span className="text-sm text-gray-500">
                                {Math.round(overallProgress)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${overallProgress}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            {completedFiles.length} of {uploadedFiles.length} files uploaded successfully
                        </p>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PDF Preview Container */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">PDF Preview</h2>
                        </div>
                        <div className="p-6">
                            {selectedFilePreview && previewUrl ? (
                                <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-full rounded-lg"
                                        title="PDF Preview"
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`aspect-[3/4] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isDragOver
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                    <p className="text-lg font-medium text-gray-900 mb-2">
                                        {uploadedFiles.length > 0 ? 'Select a file to preview' : 'Upload PDF Documents'}
                                    </p>
                                    <p className="text-sm text-gray-500 text-center mb-4">
                                        {uploadedFiles.length > 0
                                            ? 'Click on any completed file to view it here'
                                            : 'Drag and drop PDF files here, or click to select'
                                        }
                                    </p>
                                    {uploadedFiles.length === 0 && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Choose Files
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".pdf"
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Uploaded Files List */}
                    <div className="bg-white shadow rounded-lg flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Uploaded Files ({uploadedFiles.length})
                                </h2>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload
                                </button>
                                <input
                                    ref={miniUploadInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf"
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="flex-1 p-6">
                            {uploadedFiles.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No files uploaded yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Upload PDF files to see them here</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {uploadedFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className={`p-4 border rounded-lg transition-colors ${selectedFilePreview === file.id
                                                ? 'border-blue-300 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                                        <button
                                                            onClick={() => file.status === 'completed' && handleFilePreview(file.id)}
                                                            className={`text-sm font-medium truncate ${file.status === 'completed'
                                                                ? 'text-blue-600 hover:text-blue-800 cursor-pointer'
                                                                : 'text-gray-900 cursor-default'
                                                                }`}
                                                            disabled={file.status !== 'completed'}
                                                        >
                                                            {file.name}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                                        {file.status === 'completed' && (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        )}
                                                        {file.status === 'error' && (
                                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                                        )}
                                                    </div>
                                                    {file.status === 'uploading' && (
                                                        <div className="mt-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-1">
                                                                <div
                                                                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                                                    style={{ width: `${file.progress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    {file.status === 'completed' && (
                                                        <button
                                                            onClick={() => handleFilePreview(file.id)}
                                                            className="p-1 text-gray-400 hover:text-blue-600"
                                                            title="Preview"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeFile(file.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Process Button */}
                        {completedFiles.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleProcess}
                                        disabled={!selectedTemplate || completedFiles.length === 0 || isProcessing}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="h-4 w-4 mr-2" />
                                                Process Documents ({completedFiles.length})
                                            </>
                                        )}
                                    </button>
                                </div>
                                {!selectedTemplate && (
                                    <p className="text-sm text-red-600 mt-2 text-right">
                                        Please select a template before processing
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}