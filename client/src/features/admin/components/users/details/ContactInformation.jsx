import React from 'react';
import { FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

const ContactInformation = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 break-all">
        <FiMail className="w-4 h-4 text-indigo-500 shrink-0" />
        {user.email}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiPhone className="w-4 h-4 text-emerald-500 shrink-0" />
        {user.phoneNumber || '—'}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Joined</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiCalendar className="w-4 h-4 text-blue-500 shrink-0" />
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Last Updated</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiCalendar className="w-4 h-4 text-amber-500 shrink-0" />
        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
      </p>
    </div>
  </div>
);

export default ContactInformation;
