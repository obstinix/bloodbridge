import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, QrCode } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  bloodGroup: string;
  time: string;
}

export default function QRCheckIn() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  const mockScan = () => {
    const names = ['Karan Malhotra', 'Sneha Deshmukh', 'Aditya Joshi', 'Priya Kulkarni'];
    const groups = ['O+', 'A-', 'B+', 'AB+'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    const randomId = `D${Math.floor(Math.random() * 90000) + 10000}`;

    const newAttendee: Attendee = {
      id: randomId,
      name: randomName,
      bloodGroup: randomGroup,
      time: new Date().toLocaleTimeString(),
    };

    setAttendees((prev) => [newAttendee, ...prev]);
  };

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 shadow-sm space-y-4 text-xs font-body">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider">
            QR Event Check-In
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Scan to log attendance coordinates</p>
        </div>
        <button
          onClick={() => setQrCodeOpen(!qrCodeOpen)}
          className="p-1.5 border border-border dark:border-border-dk rounded-[6px] text-gray-500 hover:text-[#A4161A]"
          title="Show QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>

      {qrCodeOpen && (
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded border border-border dark:border-border-dk">
          <QRCodeSVG value="bloodbridge://checkin/event-101" size={120} />
          <span className="text-[9px] font-mono text-gray-400 mt-2">QR: EVENT-101-CHECKIN</span>
        </div>
      )}

      {/* Real-time stats */}
      <div className="grid grid-cols-2 gap-4 text-center font-mono">
        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded border border-border dark:border-border-dk">
          <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Checked In</span>
          <span className="text-lg font-bold text-[#A4161A] dark:text-red-400">{attendees.length}</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded border border-border dark:border-border-dk">
          <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Scanned Rate</span>
          <span className="text-lg font-bold text-emerald-600">100%</span>
        </div>
      </div>

      {/* Button to simulate mock scan */}
      <button
        onClick={mockScan}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-[6px] transition-colors"
      >
        Simulate Scan Event
      </button>

      {/* Scanned List */}
      <div className="space-y-2 max-h-36 overflow-y-auto">
        {attendees.map((att) => (
          <div key={att.id} className="flex justify-between items-center p-2 bg-[#FAFAFA] dark:bg-slate-800 rounded border border-border/60 dark:border-border-dk/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <div>
                <span className="font-semibold block">{att.name}</span>
                <span className="text-[8px] text-gray-400 font-mono">#{att.id} • Group: {att.bloodGroup}</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-gray-400">{att.time}</span>
          </div>
        ))}
        {attendees.length === 0 && (
          <div className="text-center py-6 text-[10px] text-gray-400">
            No check-in entries logged yet.
          </div>
        )}
      </div>
    </div>
  );
}
