import { useEffect, useState } from 'react';
import { getReport } from '../../utils/adminApi';

export default function FinancialReport() {
  const [report, setReport] = useState(null);

  useEffect(() => { getReport().then(r => setReport(r.data)); }, []);

  if (!report) return <div className="empty-state">Loading report...</div>;

  const cards = [
    { label: 'Total Invoiced',   value: `₹${report.billing.totalInvoiced}`,  cls: '' },
    { label: 'Total Collected',  value: `₹${report.billing.totalCollected}`, cls: 'green' },
    { label: 'Outstanding',      value: `₹${report.billing.outstanding}`,    cls: 'red' },
    { label: 'Paid Invoices',    value: report.billing.paidInvoices,         cls: 'green' },
    { label: 'Pending Invoices', value: report.billing.pendingInvoices,      cls: 'yellow' },
    { label: 'Partial Invoices', value: report.billing.partialInvoices,      cls: 'yellow' },
    { label: 'Total Complaints', value: report.complaints.total,             cls: '' },
    { label: 'Resolved',         value: report.complaints.resolved,          cls: 'green' },
    { label: 'Pending',          value: report.complaints.pending,           cls: 'red' },
  ];

  return (
    <div>
      <h2 className="section-heading">Financial Report</h2>
      <p className="section-sub">Overview of billing and complaint statistics</p>
      <div className="report-grid">
        {cards.map(c => (
          <div key={c.label} className={`report-card ${c.cls}`}>
            <div className="report-card-label">{c.label}</div>
            <div className="report-card-value">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}