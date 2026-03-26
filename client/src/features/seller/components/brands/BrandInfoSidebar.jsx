import { FiMail, FiPhone, FiCalendar, FiShare2, FiUsers } from 'react-icons/fi';

const BrandInfoSidebar = ({ brand, onShareLink }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Information</h3>
        </div>
        <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><FiMail className="w-4 h-4" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Business Email</p>
                    <a href={`mailto:${brand.businessEmail || brand.email}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors break-all">
                        {brand.businessEmail || brand.email || 'N/A'}
                    </a>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><FiPhone className="w-4 h-4" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</p>
                    <a href={`tel:${brand.businessPhone || brand.phone}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                        {brand.businessPhone || brand.phone || 'N/A'}
                    </a>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><FiCalendar className="w-4 h-4" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Joined Date</p>
                    <p className="text-sm font-medium text-gray-900">
                        {new Date(brand.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0"><FiUsers className="w-4 h-4" /></div>
                <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Followers</p>
                    <p className="text-sm font-medium text-gray-900">{brand.followersCount || 0}</p>
                </div>
            </div>
            <div className="pt-2">
                <button onClick={onShareLink} className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                    <FiShare2 className="w-4 h-4" /> Share Brand
                </button>
            </div>
        </div>
    </div>
);

export default BrandInfoSidebar;
