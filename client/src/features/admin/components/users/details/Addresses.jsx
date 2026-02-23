import React from 'react';

const Addresses = ({ user }) => (
  <div className="space-y-4">
    {user.addresses.map((address, index) => (
      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">{address.firstName} {address.lastName}</p>
            <p className="text-sm text-gray-600">{address.street}</p>
            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
            <p className="text-sm text-gray-600">{address.country}</p>
            {address.phoneNumber && (
              <p className="text-sm text-gray-600 mt-1">Phone: {address.phoneNumber}</p>
            )}
          </div>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
            address.type === 'billing' ? 'bg-indigo-100 text-indigo-800' :
            address.type === 'shipping' ? 'bg-emerald-100 text-emerald-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {address.type}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default Addresses;
