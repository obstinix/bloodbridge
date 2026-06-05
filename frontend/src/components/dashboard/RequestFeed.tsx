'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import UrgencyIndicator from '@/components/shared/UrgencyIndicator';
import { BloodRequest } from '@/types/request';
import { formatDate } from '@/lib/utils';

interface RequestFeedProps {
  requests: BloodRequest[];
  onSelectRequest?: (req: BloodRequest) => void;
}

export default function RequestFeed({ requests, onSelectRequest }: RequestFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter & Search Logic
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUrgency = filterUrgency === 'all' || req.urgency === filterUrgency;
      const matchesStatus = filterStatus === 'all' || req.status === filterStatus;

      return matchesSearch && matchesUrgency && matchesStatus;
    });
  }, [requests, searchQuery, filterUrgency, filterStatus]);

  // Pagination Logic
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleExportCSV = () => {
    const headers = 'ID,Patient Name,Blood Group,Units,Hospital,Urgency,Status,Requested At\n';
    const rows = filteredRequests
      .map(
        (r) =>
          `#${r.id},"${r.patientName}",${r.bloodGroup},${r.units},"${r.hospital}",${r.urgency},${r.status},${r.requestedAt}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BloodBridge_Requests_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 font-body">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider">
            Demands Dispatch Feed
          </h3>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border dark:border-border-dk rounded-[6px] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-2 border border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548] rounded-[6px] w-64 text-gray-400">
            <Search className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search by ID, hospital, patient..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-xs outline-none w-full text-[var(--color-text)] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {/* Urgency Filter */}
            <select
              value={filterUrgency}
              onChange={(e) => {
                setFilterUrgency(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] text-gray-500 dark:text-gray-300 rounded px-2.5 py-1.5 outline-none font-medium"
            >
              <option value="all">All Urgency</option>
              <option value="Critical">Critical</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] text-gray-500 dark:text-gray-300 rounded px-2.5 py-1.5 outline-none font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Matched">Matched</option>
              <option value="In Transit">In Transit</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">ID</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">Patient</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">Blood Group</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">Units</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">Hospital</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">Urgency</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">Status</th>
              <th className="p-3 text-xs font-bold text-gray-500 dark:text-gray-400 font-heading text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 dark:divide-border-dk/40">
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-xs text-gray-400">
                  No emergency requests matching current criteria.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-gray-500 dark:text-gray-400">#{req.id}</td>
                  <td className="p-3 text-xs font-semibold text-[var(--color-text)] dark:text-white">
                    {req.patientName}
                  </td>
                  <td className="p-3">
                    <BloodGroupBadge group={req.bloodGroup} size="sm" />
                  </td>
                  <td className="p-3 font-mono text-xs text-gray-700 dark:text-white tabular-nums">
                    {req.units}
                  </td>
                  <td className="p-3 text-xs text-gray-500 dark:text-gray-400 max-w-44 truncate">
                    {req.hospital}
                  </td>
                  <td className="p-3">
                    <UrgencyIndicator level={req.urgency} />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectRequest && onSelectRequest(req)}
                      className="inline-flex items-center gap-1 px-2 py-1 border border-border dark:border-border-dk bg-white dark:bg-[#263548] text-[10px] font-semibold text-gray-500 hover:text-[#A4161A] dark:hover:text-red-400 rounded transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border dark:border-border-dk">
          <span className="text-[10px] text-gray-400">
            Showing Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1 border border-border dark:border-border-dk rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1 border border-border dark:border-border-dk rounded hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
