'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

type TabType = 'assets' | 'asset-categories' | 'depreciation-rules' | 'maintenance-logs' | 'disposals';

export default function FixedAssetsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>('assets');
  const [isAssetModalOpen, setIsAssetModalOpen] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = React.useState(false);
  const [isDisposalModalOpen, setIsDisposalModalOpen] = React.useState(false);

  // Sample data
  const assets = [
    {
      id: 1,
      assetTag: 'EQ-MRI-001',
      name: 'MRI Scanner - Siemens MAGNETOM',
      category: 'Medical Equipment',
      location: 'Radiology - Room 201',
      purchaseDate: '2020-06-15',
      purchaseCost: 2500000,
      currentValue: 1875000,
      depreciationMethod: 'Straight Line',
      usefulLife: 10,
      salvageValue: 250000,
      status: 'active',
      lastMaintenance: '2024-01-15',
    },
    {
      id: 2,
      assetTag: 'EQ-CT-002',
      name: 'CT Scanner - GE Revolution',
      category: 'Medical Equipment',
      location: 'Radiology - Room 203',
      purchaseDate: '2021-03-10',
      purchaseCost: 1800000,
      currentValue: 1440000,
      depreciationMethod: 'Straight Line',
      usefulLife: 10,
      salvageValue: 180000,
      status: 'active',
      lastMaintenance: '2024-01-20',
    },
    {
      id: 3,
      assetTag: 'VH-AMB-003',
      name: 'Ambulance - Mercedes Sprinter',
      category: 'Vehicles',
      location: 'Emergency Bay',
      purchaseDate: '2022-08-01',
      purchaseCost: 150000,
      currentValue: 120000,
      depreciationMethod: 'Declining Balance',
      usefulLife: 7,
      salvageValue: 15000,
      status: 'active',
      lastMaintenance: '2024-01-25',
    },
    {
      id: 4,
      assetTag: 'BL-HVAC-004',
      name: 'HVAC System - Main Building',
      category: 'Building Systems',
      location: 'Rooftop',
      purchaseDate: '2019-01-15',
      purchaseCost: 500000,
      currentValue: 300000,
      depreciationMethod: 'Straight Line',
      usefulLife: 15,
      salvageValue: 50000,
      status: 'active',
      lastMaintenance: '2023-12-10',
    },
  ];

  const assetCategories = [
    {
      id: 1,
      name: 'Medical Equipment',
      description: 'Diagnostic and treatment equipment',
      defaultDepreciationMethod: 'Straight Line',
      defaultUsefulLife: 10,
      glAccount: '1500 - Medical Equipment',
      depreciationAccount: '1599 - Accumulated Depreciation - Medical',
      count: 45,
      totalValue: 8500000,
    },
    {
      id: 2,
      name: 'Vehicles',
      description: 'Ambulances and service vehicles',
      defaultDepreciationMethod: 'Declining Balance',
      defaultUsefulLife: 7,
      glAccount: '1600 - Vehicles',
      depreciationAccount: '1699 - Accumulated Depreciation - Vehicles',
      count: 8,
      totalValue: 950000,
    },
    {
      id: 3,
      name: 'Building Systems',
      description: 'HVAC, electrical, plumbing systems',
      defaultDepreciationMethod: 'Straight Line',
      defaultUsefulLife: 15,
      glAccount: '1700 - Building Systems',
      depreciationAccount: '1799 - Accumulated Depreciation - Building',
      count: 12,
      totalValue: 3200000,
    },
    {
      id: 4,
      name: 'IT Equipment',
      description: 'Computers, servers, networking equipment',
      defaultDepreciationMethod: 'Declining Balance',
      defaultUsefulLife: 5,
      glAccount: '1800 - IT Equipment',
      depreciationAccount: '1899 - Accumulated Depreciation - IT',
      count: 156,
      totalValue: 780000,
    },
  ];

  const depreciationRules = [
    {
      id: 1,
      name: 'Medical Equipment - Standard',
      method: 'Straight Line',
      usefulLife: 10,
      salvagePercent: 10,
      applicableCategories: 'Medical Equipment',
      description: 'Standard depreciation for diagnostic and treatment equipment',
      isActive: true,
    },
    {
      id: 2,
      name: 'Vehicles - Accelerated',
      method: 'Declining Balance',
      usefulLife: 7,
      salvagePercent: 10,
      applicableCategories: 'Vehicles',
      description: 'Accelerated depreciation for vehicles due to heavy use',
      isActive: true,
    },
    {
      id: 3,
      name: 'Building Systems - Long Term',
      method: 'Straight Line',
      usefulLife: 15,
      salvagePercent: 10,
      applicableCategories: 'Building Systems',
      description: 'Extended useful life for building infrastructure',
      isActive: true,
    },
    {
      id: 4,
      name: 'IT Equipment - Fast',
      method: 'Declining Balance',
      usefulLife: 5,
      salvagePercent: 5,
      applicableCategories: 'IT Equipment',
      description: 'Rapid depreciation for technology assets',
      isActive: true,
    },
  ];

  const maintenanceLogs = [
    {
      id: 1,
      assetTag: 'EQ-MRI-001',
      assetName: 'MRI Scanner - Siemens MAGNETOM',
      maintenanceType: 'Preventive',
      scheduledDate: '2024-01-15',
      completedDate: '2024-01-15',
      performedBy: 'ServiceTech Inc.',
      cost: 15000,
      description: 'Annual preventive maintenance and calibration',
      nextDueDate: '2025-01-15',
      status: 'completed',
    },
    {
      id: 2,
      assetTag: 'EQ-CT-002',
      assetName: 'CT Scanner - GE Revolution',
      maintenanceType: 'Preventive',
      scheduledDate: '2024-01-20',
      completedDate: '2024-01-20',
      performedBy: 'GE Healthcare Services',
      cost: 12000,
      description: 'Quarterly maintenance and system diagnostics',
      nextDueDate: '2024-04-20',
      status: 'completed',
    },
    {
      id: 3,
      assetTag: 'VH-AMB-003',
      assetName: 'Ambulance - Mercedes Sprinter',
      maintenanceType: 'Corrective',
      scheduledDate: '2024-01-25',
      completedDate: '2024-01-26',
      performedBy: 'Mercedes Service Center',
      cost: 3500,
      description: 'Brake system repair and replacement',
      nextDueDate: '2024-04-25',
      status: 'completed',
    },
    {
      id: 4,
      assetTag: 'BL-HVAC-004',
      assetName: 'HVAC System - Main Building',
      maintenanceType: 'Preventive',
      scheduledDate: '2024-02-10',
      completedDate: null,
      performedBy: 'Climate Control Systems',
      cost: 8000,
      description: 'Filter replacement and system inspection',
      nextDueDate: '2024-08-10',
      status: 'scheduled',
    },
  ];

  const disposals = [
    {
      id: 1,
      assetTag: 'EQ-XR-005',
      assetName: 'X-Ray Machine - Philips',
      category: 'Medical Equipment',
      originalCost: 450000,
      accumulatedDepreciation: 405000,
      bookValue: 45000,
      disposalDate: '2024-01-10',
      disposalMethod: 'Sale',
      saleProceeds: 50000,
      gainLoss: 5000,
      reason: 'Equipment upgrade to digital system',
      approvedBy: 'CFO',
      status: 'completed',
    },
    {
      id: 2,
      assetTag: 'VH-AMB-001',
      assetName: 'Ambulance - Ford Transit (Old)',
      category: 'Vehicles',
      originalCost: 85000,
      accumulatedDepreciation: 80000,
      bookValue: 5000,
      disposalDate: '2023-12-15',
      disposalMethod: 'Trade-in',
      saleProceeds: 8000,
      gainLoss: 3000,
      reason: 'High mileage, replaced with new vehicle',
      approvedBy: 'COO',
      status: 'completed',
    },
    {
      id: 3,
      assetTag: 'IT-SRV-012',
      assetName: 'Server - Dell PowerEdge R740',
      category: 'IT Equipment',
      originalCost: 25000,
      accumulatedDepreciation: 25000,
      bookValue: 0,
      disposalDate: '2024-01-20',
      disposalMethod: 'Scrap',
      saleProceeds: 0,
      gainLoss: 0,
      reason: 'End of useful life, fully depreciated',
      approvedBy: 'CTO',
      status: 'completed',
    },
  ];

  const handleAssetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating asset:', Object.fromEntries(formData));
    setIsAssetModalOpen(false);
    e.currentTarget.reset();
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating category:', Object.fromEntries(formData));
    setIsCategoryModalOpen(false);
    e.currentTarget.reset();
  };

  const handleMaintenanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating maintenance log:', Object.fromEntries(formData));
    setIsMaintenanceModalOpen(false);
    e.currentTarget.reset();
  };

  const handleDisposalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Creating disposal:', Object.fromEntries(formData));
    setIsDisposalModalOpen(false);
    e.currentTarget.reset();
  };

  const totalAssetValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalCategories = assetCategories.length;
  const activeAssets = assets.filter(a => a.status === 'active').length;
  const maintenanceDue = maintenanceLogs.filter(m => m.status === 'scheduled').length;

  return (
    <ContentArea>
      <VStack size="sm">
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-3xl font-bold text-foreground">Fixed Assets Management</h1>
          <p className="text-sm text-muted-foreground">Track and manage fixed assets, depreciation, and maintenance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
                    🏢
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-primary">{activeAssets}</div>
                  <p className="text-xs text-muted-foreground mt-2">Active Assets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">
                    💰
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-green-600">
                    ${totalAssetValue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Total Asset Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-lg">
                    📂
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-blue-600">{totalCategories}</div>
                  <p className="text-xs text-muted-foreground mt-2">Asset Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-lg">
                    🔧
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xl font-bold text-orange-600">{maintenanceDue}</div>
                  <p className="text-xs text-muted-foreground mt-2">Maintenance Due</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('assets')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'assets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('asset-categories')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'asset-categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Asset Categories
            </button>
            <button
              onClick={() => setActiveTab('depreciation-rules')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'depreciation-rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Depreciation Rules
            </button>
            <button
              onClick={() => setActiveTab('maintenance-logs')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'maintenance-logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Maintenance Logs
            </button>
            <button
              onClick={() => setActiveTab('disposals')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'disposals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Disposals
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'assets' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search assets by tag or name..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Fixed Assets ({assets.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsAssetModalOpen(true)} size="sm">+ New Asset</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Tag</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead className="text-right">Purchase Cost</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-sm font-medium">{asset.assetTag}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell className="text-sm">{asset.location}</TableCell>
                      <TableCell>{asset.purchaseDate}</TableCell>
                      <TableCell className="text-right">${asset.purchaseCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ${asset.currentValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{asset.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">History</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'asset-categories' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Asset Categories ({assetCategories.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsCategoryModalOpen(true)} size="sm">+ New Category</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Depreciation Method</TableHead>
                    <TableHead>Useful Life (Years)</TableHead>
                    <TableHead>GL Account</TableHead>
                    <TableHead className="text-right">Asset Count</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-sm">{category.description}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          {category.defaultDepreciationMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.defaultUsefulLife} years</TableCell>
                      <TableCell className="text-sm">{category.glAccount}</TableCell>
                      <TableCell className="text-right font-medium">{category.count}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ${category.totalValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">View Assets</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'depreciation-rules' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search depreciation rules..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Depreciation Rules ({depreciationRules.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button size="sm">+ New Rule</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Useful Life</TableHead>
                    <TableHead>Salvage %</TableHead>
                    <TableHead>Applicable Categories</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depreciationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-100 text-purple-800">{rule.method}</Badge>
                      </TableCell>
                      <TableCell>{rule.usefulLife} years</TableCell>
                      <TableCell>{rule.salvagePercent}%</TableCell>
                      <TableCell className="text-sm">{rule.applicableCategories}</TableCell>
                      <TableCell className="text-sm">{rule.description}</TableCell>
                      <TableCell>
                        <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.isActive ? 'active' : 'inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          </>
        )}

        {activeTab === 'maintenance-logs' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search maintenance logs..."
                  className="w-full"
                />
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader className="border-b-2 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Maintenance Logs ({maintenanceLogs.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button onClick={() => setIsMaintenanceModalOpen(true)} size="sm">+ Log Maintenance</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Tag</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm font-medium">{log.assetTag}</TableCell>
                      <TableCell className="font-medium text-sm">{log.assetName}</TableCell>
                      <TableCell>
                        <Badge className={log.maintenanceType === 'Preventive' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                          {log.maintenanceType}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.scheduledDate}</TableCell>
                      <TableCell>{log.completedDate || '-'}</TableCell>
                      <TableCell className="text-sm">{log.performedBy}</TableCell>
                      <TableCell className="text-right">${log.cost.toLocaleString()}</TableCell>
                      <TableCell>{log.nextDueDate}</TableCell>
                      <TableCell>
                        <Badge className={log.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
        )}

        {activeTab === 'disposals' && (
          <>
            <Card className="border-2">
              <CardContent className="py-3 px-4">
                <Input
                  type="text"
                  placeholder="Search disposals..."
                  className="w-full"
                />
              </CardContent>
            </Card>

          <Card className="border-2">
            <CardHeader className="border-b-2 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Disposals ({disposals.length})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Export</Button>
                  <Button size="sm" onClick={() => setIsDisposalModalOpen(true)}>+ Record Disposal</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs uppercase tracking-wide">Asset Tag</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Asset Name</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Category</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Disposal Date</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Method</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-right">Book Value</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-right">Sale Proceeds</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide text-right">Gain/Loss</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wide">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disposals.map((disposal) => (
                    <TableRow key={disposal.id} className="hover:bg-slate-50 border-b last:border-b-0">
                      <TableCell className="font-mono text-sm font-medium">{disposal.assetTag}</TableCell>
                      <TableCell className="font-medium">{disposal.assetName}</TableCell>
                      <TableCell>{disposal.category}</TableCell>
                      <TableCell>{disposal.disposalDate}</TableCell>
                      <TableCell>
                        <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">{disposal.disposalMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-right">${disposal.bookValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${disposal.saleProceeds.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-bold ${disposal.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {disposal.gainLoss >= 0 ? '+' : ''}${disposal.gainLoss.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{disposal.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <button className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1">View</button>
                        <button className="text-orange-600 hover:text-orange-800 text-sm px-2 py-1">Edit</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
        )}

        {/* Create Asset Modal */}
        <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title="Create Fixed Asset" size="lg">
          <form onSubmit={handleAssetSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="assetTag" label="Asset Tag" placeholder="EQ-MRI-001" required />
              <Input name="name" label="Asset Name" placeholder="MRI Scanner" required />
              <Select
                name="category"
                label="Category"
                options={[
                  { value: 'Medical Equipment', label: 'Medical Equipment' },
                  { value: 'Vehicles', label: 'Vehicles' },
                  { value: 'Building Systems', label: 'Building Systems' },
                  { value: 'IT Equipment', label: 'IT Equipment' },
                ]}
                required
              />
              <Input name="location" label="Location" placeholder="Radiology - Room 201" required />
              <Input name="purchaseDate" type="date" label="Purchase Date" required />
              <Input name="purchaseCost" type="number" step="0.01" label="Purchase Cost" placeholder="2500000.00" required />
              <Select
                name="depreciationMethod"
                label="Depreciation Method"
                options={[
                  { value: 'Straight Line', label: 'Straight Line' },
                  { value: 'Declining Balance', label: 'Declining Balance' },
                  { value: 'Units of Production', label: 'Units of Production' },
                ]}
                required
              />
              <Input name="usefulLife" type="number" label="Useful Life (Years)" placeholder="10" required />
              <Input name="salvageValue" type="number" step="0.01" label="Salvage Value" placeholder="250000.00" required />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsAssetModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Asset</Button>
            </div>
          </form>
        </Modal>

        {/* Create Category Modal */}
        <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Create Asset Category" size="lg">
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" label="Category Name" placeholder="Medical Equipment" required />
              <Select
                name="defaultDepreciationMethod"
                label="Default Depreciation Method"
                options={[
                  { value: 'Straight Line', label: 'Straight Line' },
                  { value: 'Declining Balance', label: 'Declining Balance' },
                  { value: 'Units of Production', label: 'Units of Production' },
                ]}
                required
              />
              <Input name="defaultUsefulLife" type="number" label="Default Useful Life (Years)" placeholder="10" required />
              <Input name="glAccount" label="GL Account" placeholder="1500 - Medical Equipment" required />
              <Input name="depreciationAccount" label="Depreciation Account" placeholder="1599 - Accumulated Depreciation" required />
            </div>
            <Input name="description" label="Description" placeholder="Diagnostic and treatment equipment" required />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Create Category</Button>
            </div>
          </form>
        </Modal>

        {/* Create Maintenance Log Modal */}
        <Modal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} title="Log Maintenance" size="lg">
          <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="assetTag" label="Asset Tag" placeholder="EQ-MRI-001" required />
              <Select
                name="maintenanceType"
                label="Maintenance Type"
                options={[
                  { value: 'Preventive', label: 'Preventive' },
                  { value: 'Corrective', label: 'Corrective' },
                  { value: 'Emergency', label: 'Emergency' },
                  { value: 'Inspection', label: 'Inspection' },
                ]}
                required
              />
              <Input name="scheduledDate" type="date" label="Scheduled Date" required />
              <Input name="completedDate" type="date" label="Completed Date" />
              <Input name="performedBy" label="Performed By" placeholder="ServiceTech Inc." required />
              <Input name="cost" type="number" step="0.01" label="Cost" placeholder="15000.00" required />
              <Input name="nextDueDate" type="date" label="Next Due Date" />
            </div>
            <Input name="description" label="Description" placeholder="Annual preventive maintenance and calibration" required />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsMaintenanceModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Log Maintenance</Button>
            </div>
          </form>
        </Modal>

        {/* Create Disposal Modal */}
        <Modal isOpen={isDisposalModalOpen} onClose={() => setIsDisposalModalOpen(false)} title="Record Asset Disposal" size="lg">
          <form onSubmit={handleDisposalSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="assetTag" label="Asset Tag" placeholder="EQ-XR-005" required />
              <Input name="disposalDate" type="date" label="Disposal Date" required />
              <Select
                name="disposalMethod"
                label="Disposal Method"
                options={[
                  { value: 'Sale', label: 'Sale' },
                  { value: 'Trade-in', label: 'Trade-in' },
                  { value: 'Scrap', label: 'Scrap' },
                  { value: 'Donation', label: 'Donation' },
                  { value: 'Write-off', label: 'Write-off' },
                ]}
                required
              />
              <Input name="bookValue" type="number" step="0.01" label="Book Value" placeholder="45000.00" required />
              <Input name="saleProceeds" type="number" step="0.01" label="Sale Proceeds" placeholder="50000.00" required />
              <Input name="approvedBy" label="Approved By" placeholder="CFO" required />
            </div>
            <Input name="reason" label="Reason for Disposal" placeholder="Equipment upgrade to digital system" required />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDisposalModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Record Disposal</Button>
            </div>
          </form>
        </Modal>
      </VStack>
    </ContentArea>
  );
}
