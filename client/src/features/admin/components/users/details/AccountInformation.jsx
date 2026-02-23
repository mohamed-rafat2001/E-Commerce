import React from 'react';

const AccountInformation = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">User ID</p>
      <p className="text-sm font-semibold text-gray-800 font-mono break-all">{user._id}</p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
      <p className="text-sm font-semibold text-gray-800 capitalize">{user.status}</p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Role</p>
      <p className="text-sm font-semibold text-gray-800 capitalize">{user.role}</p>
    </div>
  </div>
);

export default AccountInformation;
