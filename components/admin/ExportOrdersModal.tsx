'use client';
import React, { useState, useMemo } from 'react';
import { InvoiceOrder } from './OrderInvoice';

interface ExportOrdersModalProps {
  orders: InvoiceOrder[];
  onClose: () => void;
}

export default function ExportOrdersModal({ orders, onClose }: ExportOrdersModalProps) {
  const [datePreset, setDatePreset] = useState<'all' | 'this_month' | 'last_month' | 'last_30' | 'fy'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Handle Preset selection
  const handlePresetChange = (preset: 'all' | 'this_month' | 'last_month' | 'last_30' | 'fy') => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'last_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
    } else if (preset === 'last_30') {
      const past30 = new Date();
      past30.setDate(past30.getDate() - 30);
      setStartDate(past30.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (preset === 'fy') {
      // Indian Financial Year: 1st April of current/prev year
      const currentYear = now.getFullYear();
      const fyStartYear = now.getMonth() >= 3 ? currentYear : currentYear - 1;
      const fyStart = new Date(fyStartYear, 3, 1); // 1st April
      setStartDate(fyStart.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  // Filter matching orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter === 'tax_eligible') {
        // Confirmed, Shipped, or Delivered (exclude cancelled)
        if (order.status === 'cancelled') return false;
      } else if (statusFilter !== 'all') {
        if (order.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Date filter
      if (startDate) {
        const orderDateStr = order.created_at?.split('T')[0];
        if (orderDateStr < startDate) return false;
      }
      if (endDate) {
        const orderDateStr = order.created_at?.split('T')[0];
        if (orderDateStr > endDate) return false;
      }

      return true;
    });
  }, [orders, statusFilter, startDate, endDate]);

  const totalFilteredRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Generate and trigger CSV download
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders found matching the selected filter criteria.');
      return;
    }

    const headers = [
      'Invoice_No',
      'Order_ID',
      'Order_Date',
      'Order_Time',
      'Customer_Name',
      'Customer_Phone',
      'Customer_Email',
      'Delivery_Address',
      'Landmark',
      'City',
      'State_Place_Of_Supply',
      'Pincode',
      'Products_Summary',
      'Total_Units',
      'Subtotal_INR',
      'Shipping_Fee_INR',
      'Discount_INR',
      'Total_Invoice_Amount_INR',
      'Payment_Method',
      'Payment_Status',
      'Payment_Ref_ID',
      'Order_Status'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredOrders.map(order => {
      const dateObj = new Date(order.created_at);
      const orderDate = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const orderTime = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const discount = Math.max(0, (order.subtotal + (order.shipping || 0)) - order.total);
      const isPrepaid = order.payment_method?.toLowerCase() === 'prepaid';

      const itemsSummary = order.items?.map(item => {
        const parts = [item.name];
        if (item.size) parts.push(`Size: ${item.size}`);
        if (item.color) parts.push(`Color: ${item.color}`);
        parts.push(`Qty: ${item.quantity}`);
        parts.push(`Price: ₹${item.price}`);
        return parts.join(' | ');
      }).join('; ') || '';

      const totalUnits = order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;

      return [
        escapeCSV(`INV-${order.order_number}`),
        escapeCSV(order.order_number),
        escapeCSV(orderDate),
        escapeCSV(orderTime),
        escapeCSV(order.customer_name),
        escapeCSV(order.customer_phone),
        escapeCSV(order.customer_email),
        escapeCSV(order.address),
        escapeCSV(order.landmark || ''),
        escapeCSV(order.city),
        escapeCSV(order.state || 'Maharashtra'),
        escapeCSV(order.pincode),
        escapeCSV(itemsSummary),
        escapeCSV(totalUnits),
        escapeCSV(order.subtotal || 0),
        escapeCSV(order.shipping || 0),
        escapeCSV(discount),
        escapeCSV(order.total || 0),
        escapeCSV(order.payment_method?.toUpperCase() || 'COD'),
        escapeCSV(isPrepaid ? 'PAID' : 'COLLECT_ON_DELIVERY'),
        escapeCSV(order.razorpay_payment_id || ''),
        escapeCSV(order.status)
      ].join(',');
    });

    // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const dateTag = startDate && endDate ? `${startDate}_to_${endDate}` : 'all_orders';
    link.href = url;
    link.download = `Sanjpriya_Sales_Orders_${dateTag}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #ebe8e2' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Export Orders for CA & Tax Filing</h3>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#777' }}>
              Download formatted Excel/CSV data with all invoice, customer, and tax details
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Content Form */}
        <div style={{ padding: '24px' }}>
          {/* Quick Date Range Presets */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '8px' }}>
              Select Date Range
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'all', label: 'All Time' },
                { id: 'this_month', label: 'This Month' },
                { id: 'last_month', label: 'Last Month' },
                { id: 'last_30', label: 'Last 30 Days' },
                { id: 'fy', label: 'Financial Year (FY26)' },
              ].map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetChange(preset.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: datePreset === preset.id ? 'none' : '1px solid #ddd',
                    background: datePreset === preset.id ? '#c95d3c' : '#f8f7f4',
                    color: datePreset === preset.id ? '#fff' : '#444',
                    cursor: 'pointer',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => { setStartDate(e.target.value); setDatePreset('all'); }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  background: '#faf9f7',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setDatePreset('all'); }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  background: '#faf9f7',
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '6px' }}>
              Order Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '13px',
                fontWeight: 600,
                background: '#faf9f7',
              }}
            >
              <option value="all">All Orders (Include all statuses)</option>
              <option value="tax_eligible">Tax Eligible Only (Confirmed, Shipped, Delivered)</option>
              <option value="delivered">Delivered Only</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="pending">Pending Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
          </div>

          {/* Summary Box */}
          <div style={{ padding: '14px 18px', background: '#fdfbf7', border: '1px solid #eee5d8', borderRadius: '8px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#8c593b', fontWeight: 700, textTransform: 'uppercase' }}>
                MATCHING ORDERS
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginTop: '2px' }}>
                {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#8c593b', fontWeight: 700, textTransform: 'uppercase' }}>
                TOTAL VALUE
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#c95d3c', marginTop: '2px' }}>
                ₹{totalFilteredRevenue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                background: '#fff',
                color: '#555',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredOrders.length === 0}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: filteredOrders.length === 0 ? '#ccc' : '#c95d3c',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: filteredOrders.length === 0 ? 'none' : '0 2px 8px rgba(201, 93, 60, 0.3)',
              }}
            >
              📥 Download CSV for Excel / CA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
