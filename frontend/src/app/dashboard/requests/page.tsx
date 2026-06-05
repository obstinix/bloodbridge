'use client';

import React, { useState } from 'react';
import { Kanban, List, Plus, Clock, ArrowRight, CheckCircle2, ChevronRight, X } from 'lucide-react';
import BloodGroupBadge from '@/components/shared/BloodGroupBadge';
import StatusBadge from '@/components/shared/StatusBadge';
import UrgencyIndicator from '@/components/shared/UrgencyIndicator';
import { BloodRequest } from '@/types/request';
import { formatDate } from '@/lib/utils';
import { BloodGroup } from '@/constants/bloodGroups';

export default function RequestsPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // Mock Request data representing active tickets
  const [requests, setRequests] = useState<BloodRequest[]>([
    {
      id: 'R04910',
      patientName: 'Amit Shah',
      bloodGroup: 'O+',
      units: 2,
      hospital: 'Sion Hospital, Mumbai',
      urgency: 'Critical',
      status: 'Pending',
      requestedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      notes: 'Urgent bypass surgery scheduled.',
    },
    {
      id: 'R04911',
      patientName: 'Rohan Jha',
      bloodGroup: 'A-',
      units: 1,
      hospital: 'KEM Hospital, Pune',
      urgency: 'Urgent',
      status: 'Matched',
      requestedAt: new Date(Date.now() - 90 * 60000).toISOString(),
      matchedDonor: 'Arjun Mehta',
    },
    {
      id: 'R04912',
      patientName: 'Priyanka Sen',
      bloodGroup: 'B+',
      units: 3,
      hospital: 'Fortis Mulund, Mumbai',
      urgency: 'Routine',
      status: 'In Transit',
      requestedAt: new Date(Date.now() - 180 * 60000).toISOString(),
      notes: 'Regular thalassemia transfusion.',
    },
    {
      id: 'R04913',
      patientName: 'Aditya Roy',
      bloodGroup: 'AB+',
      units: 2,
      hospital: 'Holy Spirit Hospital',
      urgency: 'Routine',
      status: 'Fulfilled',
      requestedAt: new Date(Date.now() - 360 * 60000).toISOString(),
    },
  ]);

  const columns = ['Pending', 'Matched', 'In Transit', 'Fulfilled'] as const;

  // Move request step handlers
  const handleMoveStatus = (id: string, nextStatus: typeof columns[number]) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  return (
    <div className="space-y-6 font-body relative">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
          Blood Demands coordinator
        </h2>
        <div className="flex items-center gap-3">
          {/* View Toggler */}
          <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded border border-border dark:border-border-dk">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-[4px] text-gray-500 hover:text-gray-900 ${
                viewMode === 'kanban' ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : ''
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-[4px] text-gray-500 hover:text-gray-900 ${
                viewMode === 'table' ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : ''
              }`}
              title="Table Feed"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => alert('New request coordinates creator.')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#A4161A] text-white rounded-[6px] text-xs font-semibold hover:bg-[#660708] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Submit Request
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((col) => {
            const columnRequests = requests.filter((r) => r.status === col);
            return (
              <div key={col} className="bg-gray-50 dark:bg-[#151D30] rounded-card border border-border dark:border-border-dk p-4 flex flex-col gap-4 min-h-[450px]">
                {/* Column Header */}
                <div className="flex justify-between items-center border-b border-border/60 dark:border-border-dk/60 pb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-heading">{col}</span>
                  <span className="font-mono text-[10px] bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full font-bold">
                    {columnRequests.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnRequests.length === 0 ? (
                    <div className="text-center py-10 text-[10px] text-gray-400">
                      No dispatches in this column
                    </div>
                  ) : (
                    columnRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={`bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded p-4 shadow-sm hover:translate-y-[-1px] hover:shadow-card transition-all cursor-pointer border-l-4 ${
                          req.urgency === 'Critical'
                            ? 'border-l-red-600'
                            : req.urgency === 'Urgent'
                            ? 'border-l-amber-500'
                            : 'border-l-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <BloodGroupBadge group={req.bloodGroup} size="sm" />
                          <span className="text-[9px] font-mono text-gray-400">#{req.id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[var(--color-text)] dark:text-white truncate">
                          {req.hospital}
                        </h4>
                        <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400">
                          <span>{req.units} units required</span>
                          <span className="font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 15m ago
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE LIST VIEW */}
      {viewMode === 'table' && (
        <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]">
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Ticket ID</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Hospital Location</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Blood Group</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Volume Units</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Urgency level</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading">Fulfillment Status</th>
                  <th className="p-3 text-xs font-bold text-gray-400 font-heading text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-border-dk/40">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="p-3 font-mono text-xs text-gray-500">#{req.id}</td>
                    <td className="p-3 text-xs font-semibold text-[var(--color-text)] dark:text-white">{req.hospital}</td>
                    <td className="p-3">
                      <BloodGroupBadge group={req.bloodGroup} size="sm" />
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-700 dark:text-white tabular-nums">{req.units}</td>
                    <td className="p-3">
                      <UrgencyIndicator level={req.urgency} />
                    </td>
                    <td className="p-3">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-slate-800 border border-border dark:border-border-dk text-[10px] font-semibold text-gray-500 hover:text-[#A4161A] rounded transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out detail Drawer/Panel */}
      {selectedRequest && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setSelectedRequest(null)} />
          <div className="fixed top-0 right-0 h-screen w-80 md:w-96 bg-white dark:bg-[#1E293B] border-l border-border dark:border-border-dk z-50 p-6 shadow-lift flex flex-col justify-between animate-slide-in">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400">Request ID: #{selectedRequest.id}</span>
                  <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white mt-1">
                    {selectedRequest.hospital}
                  </h3>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status details */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Target Group</span>
                  <BloodGroupBadge group={selectedRequest.bloodGroup} size="sm" />
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Required Volume</span>
                  <span className="font-semibold font-mono text-gray-700 dark:text-white">{selectedRequest.units} units</span>
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Urgency coordinates</span>
                  <UrgencyIndicator level={selectedRequest.urgency} />
                </div>
                <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                  <span className="text-gray-400">Active status</span>
                  <StatusBadge status={selectedRequest.status} size="sm" />
                </div>
                {selectedRequest.matchedDonor && (
                  <div className="flex justify-between border-b border-border dark:border-border-dk pb-2">
                    <span className="text-gray-400">Matched Donor</span>
                    <span className="font-semibold text-emerald-500">{selectedRequest.matchedDonor}</span>
                  </div>
                )}
                {selectedRequest.notes && (
                  <div className="space-y-1">
                    <span className="text-gray-400 block">Notes/Health Details</span>
                    <p className="p-2 bg-gray-50 dark:bg-slate-800 rounded border border-border dark:border-border-dk text-gray-600 dark:text-gray-300 leading-normal">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Kanban Action Steps */}
            <div className="space-y-3 pt-6 border-t border-border dark:border-border-dk">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Fulfillment coordinates
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedRequest.status === 'Pending' && (
                  <button
                    onClick={() => handleMoveStatus(selectedRequest.id, 'Matched')}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    Match Donor
                  </button>
                )}
                {selectedRequest.status === 'Matched' && (
                  <button
                    onClick={() => handleMoveStatus(selectedRequest.id, 'In Transit')}
                    className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    Dispatch Blood
                  </button>
                )}
                {selectedRequest.status === 'In Transit' && (
                  <button
                    onClick={() => handleMoveStatus(selectedRequest.id, 'Fulfilled')}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    Mark Fulfilled
                  </button>
                )}
                <button
                  onClick={() => handleMoveStatus(selectedRequest.id, 'Cancelled')}
                  className="py-2 border border-border dark:border-border-dk text-xs font-semibold rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Cancel Ticket
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Slide-out Panel animations */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
