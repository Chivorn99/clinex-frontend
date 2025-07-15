'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { User, Building2, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Shield, Bell, Globe } from 'lucide-react'

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState<'profile' | 'clinic' | 'security' | 'notifications'>('profile')

    // Mock user data
    const [userData, setUserData] = useState({
        name: 'Dr. Sarah Johnson',
        email: 'sarah@smithclinic.com',
        phone: '+1 (555) 123-4567',
        specialization: 'General Practitioner',
        licenseNumber: 'MD-12345-2023',
        joinDate: '2023-01-15',
        profileImage: '/api/placeholder/150/150'
    })

    const [clinicData, setClinicData] = useState({
        name: 'Smith Medical Clinic',
        address: '123 Healthcare Ave, Medical District',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 987-6543',
        email: 'info@smithclinic.com',
        website: 'www.smithclinic.com',
        establishedYear: '2020',
        specialties: ['General Medicine', 'Pediatrics', 'Cardiology']
    })

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorEnabled: true,
        loginNotifications: true,
        sessionTimeout: '30'
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailReports: true,
        smsAlerts: false,
        pushNotifications: true,
        weeklyDigest: true
    })

    const user = {
        name: userData.name,
        email: userData.email,
        clinic: clinicData.name
    }

    const handleSave = () => {
        setIsEditing(false)
        console.log('Profile updated')
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="mt-2 text-gray-600">Manage your account and clinic information</p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="bg-white shadow rounded-lg">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {[
                                { key: 'profile', label: 'Personal Info', icon: User },
                                { key: 'clinic', label: 'Clinic Details', icon: Building2 },
                                { key: 'security', label: 'Security', icon: Shield },
                                { key: 'notifications', label: 'Notifications', icon: Bell }
                            ].map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as any)}
                                        className={`${activeTab === tab.key
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <img
                                            className="h-24 w-24 rounded-full object-cover"
                                            src={userData.profileImage}
                                            alt="Profile"
                                        />
                                        {isEditing && (
                                            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700">
                                                <Camera className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
                                        <p className="text-sm text-gray-500">{userData.specialization}</p>
                                        <p className="text-sm text-gray-500">Joined {new Date(userData.joinDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Personal Information Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={userData.name}
                                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={userData.email}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={userData.phone}
                                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            value={userData.specialization}
                                            onChange={(e) => setUserData({ ...userData, specialization: e.target.value })}
                                            disabled={!isEditing}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            value={userData.licenseNumber}
                                            onChange={(e) => setUserData({ ...userData, licenseNumber: e.target.value })}
                                            disabled={!isEditing}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Join Date
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="date"
                                                value={userData.joinDate}
                                                disabled={true}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Clinic Details Tab */}
                        {activeTab === 'clinic' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Clinic Name
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={clinicData.name}
                                                onChange={(e) => setClinicData({ ...clinicData, name: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={clinicData.address}
                                                onChange={(e) => setClinicData({ ...clinicData, address: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={clinicData.city}
                                            onChange={(e) => setClinicData({ ...clinicData, city: e.target.value })}
                                            disabled={!isEditing}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            value={clinicData.state}
                                            onChange={(e) => setClinicData({ ...clinicData, state: e.target.value })}
                                            disabled={!isEditing}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code
                                        </label>
                                        <input
                                            type="text"
                                            value={clinicData.zipCode}
                                            onChange={(e) => setClinicData({ ...clinicData, zipCode: e.target.value })}
                                            disabled={!isEditing}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Clinic Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={clinicData.phone}
                                                onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Clinic Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={clinicData.email}
                                                onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="url"
                                                value={clinicData.website}
                                                onChange={(e) => setClinicData({ ...clinicData, website: e.target.value })}
                                                disabled={!isEditing}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex">
                                        <Shield className="h-5 w-5 text-yellow-400" />
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Security Settings
                                            </h3>
                                            <p className="mt-1 text-sm text-yellow-700">
                                                These settings help protect your account and clinic data.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900">
                                                Two-Factor Authentication
                                            </label>
                                            <p className="text-sm text-gray-500">
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSecuritySettings({ ...securitySettings, twoFactorEnabled: !securitySettings.twoFactorEnabled })}
                                            className={`${securitySettings.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span
                                                className={`${securitySettings.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900">
                                                Login Notifications
                                            </label>
                                            <p className="text-sm text-gray-500">
                                                Get notified when someone logs into your account
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSecuritySettings({ ...securitySettings, loginNotifications: !securitySettings.loginNotifications })}
                                            className={`${securitySettings.loginNotifications ? 'bg-blue-600' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span
                                                className={`${securitySettings.loginNotifications ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Session Timeout (minutes)
                                        </label>
                                        <select
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                                            className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900">
                                                Email Reports
                                            </label>
                                            <p className="text-sm text-gray-500">
                                                Receive daily and weekly report summaries via email
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setNotificationSettings({ ...notificationSettings, emailReports: !notificationSettings.emailReports })}
                                            className={`${notificationSettings.emailReports ? 'bg-blue-600' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span
                                                className={`${notificationSettings.emailReports ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900">
                                                SMS Alerts
                                            </label>
                                            <p className="text-sm text-gray-500">
                                                Get urgent notifications via SMS
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setNotificationSettings({ ...notificationSettings, smsAlerts: !notificationSettings.smsAlerts })}
                                            className={`${notificationSettings.smsAlerts ? 'bg-blue-600' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span
                                                className={`${notificationSettings.smsAlerts ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900">
                                                Push Notifications
                                            </label>
                                            <p className="text-sm text-gray-500">
                                                Browser notifications for real-time updates
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setNotificationSettings({ ...notificationSettings, pushNotifications: !notificationSettings.pushNotifications })}
                                            className={`${notificationSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span
                                                className={`${notificationSettings.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-900">
                                                Weekly Digest
                                            </label>
                                            <p className="text-sm text-gray-500">
                                                Weekly summary of activity and reports
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setNotificationSettings({ ...notificationSettings, weeklyDigest: !notificationSettings.weeklyDigest })}
                                            className={`${notificationSettings.weeklyDigest ? 'bg-blue-600' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span
                                                className={`${notificationSettings.weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                                                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}