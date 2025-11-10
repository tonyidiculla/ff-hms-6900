import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for pharmacy inventory
  const medications = [
    {
      id: 'MED-001',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 450,
      unit: 'Tablets',
      reorderLevel: 100,
      expiryDate: '2026-03-15',
      supplier: 'VetPharm Co.',
      price: 0.85,
      status: 'In Stock'
    },
    {
      id: 'MED-002',
      name: 'Carprofen 100mg',
      category: 'Pain Relief',
      stock: 75,
      unit: 'Tablets',
      reorderLevel: 100,
      expiryDate: '2025-12-20',
      supplier: 'MediVet Ltd.',
      price: 1.20,
      status: 'Low Stock'
    },
    {
      id: 'MED-003',
      name: 'Metronidazole 50mg',
      category: 'Antibiotics',
      stock: 0,
      unit: 'Tablets',
      reorderLevel: 50,
      expiryDate: '2025-11-01',
      supplier: 'PharmaDirect',
      price: 0.65,
      status: 'Out of Stock'
    }
  ];
  return NextResponse.json({ medications });
}
