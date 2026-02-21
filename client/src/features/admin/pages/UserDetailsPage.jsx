import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiMail, FiPhone, FiCalendar, FiMapPin, FiDollarSign, FiStar, FiInfo, FiUserCheck, FiCreditCard, FiArrowLeft, FiShoppingBag, FiPackage, FiTag, FiChevronDown, FiChevronUp, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useUserDetails from '../hooks/useUserDetails.js';
import useAccordionSections from '../hooks/useAccordionSections.js';
import useUserOrders from '../hooks/useUserOrders.js';
import UserHeader from '../components/UserHeader.jsx';

// Accordion Section Component
const AccordionSection = ({ title, icon, children, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {isOpen ? <FiChevronUp className="w-5 h-5 text-gray-500" /> : <FiChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { height: "auto", opacity: 1 },
              collapsed: { height: 0, opacity: 0 }
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Contact Information Component
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

// Account Information Component
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

// Customer Information Component
const CustomerInformation = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {(user.loyaltyPoints !== undefined || user.loyaltyPoints !== null) && (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Loyalty Points</p>
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FiStar className="w-4 h-4 text-amber-500 shrink-0" />
          {user.loyaltyPoints || 0}
        </p>
      </div>
    )}
    {user.addresses && user.addresses.length > 0 && (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Addresses</p>
        <p className="text-sm font-semibold text-gray-800 flex items-start gap-2">
          <FiMapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>{user.addresses.length} address{user.addresses.length !== 1 ? 'es' : ''}</span>
        </p>
      </div>
    )}
  </div>
);

// Purchase History Component
const PurchaseHistory = ({ orders, purchasedProducts, isLoadingOrders }) => {
  if (isLoadingOrders) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No orders found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800 mb-3">Purchased Products</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Product</th>
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Price</th>
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Quantity</th>
              <th className="py-3 px-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Order ID</th>
            </tr>
          </thead>
          <tbody>
            {purchasedProducts.map((product, idx) => (
              <tr key={`${product.id}-${idx}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    {product.image && <img src={product.image} alt="" className="w-8 h-8 rounded object-cover" />}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-semibold">${product.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm">{product.quantity}</td>
                <td className="py-3 px-4 text-sm text-indigo-600 font-medium">
                  <span title={product.order}>{product.order.substring(0, 8)}...</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-3">Order History</h4>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-800" title={order.id}>{order.id.substring(0, 8)}...</p>
                  <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">${order.total.toFixed(2)}</p>
                  <p className="text-xs font-semibold text-gray-500">{order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Addresses Component
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

// Seller Information Component
const SellerInformation = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Company</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiInfo className="w-4 h-4 text-indigo-500 shrink-0" />
        {user.companyName || '—'}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Email</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiMail className="w-4 h-4 text-emerald-500 shrink-0" />
        {user.businessEmail || user.email}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Business Phone</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiPhone className="w-4 h-4 text-purple-500 shrink-0" />
        {user.businessPhone || user.phoneNumber || '—'}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiUserCheck className="w-4 h-4 text-blue-500 shrink-0" />
        {user.status || '—'}
      </p>
    </div>
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Verification</p>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        <FiCreditCard className="w-4 h-4 text-green-500 shrink-0" />
        {user.verificationStatus || '—'}
      </p>
    </div>
    {user.ratingAverage !== undefined && (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rating</p>
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FiStar className="w-4 h-4 text-amber-500 shrink-0" />
          {user.ratingAverage.toFixed(1)} ({user.ratingCount || 0} reviews)
        </p>
      </div>
    )}
    {user.balance && (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Balance</p>
        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FiDollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
          ${user.balance.amount?.toFixed(2) || '0.00'} {user.balance.currency || 'USD'}
        </p>
      </div>
    )}
  </div>
);

// Main Component
const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { orders, purchasedProducts, isLoading: isLoadingOrders } = useUserOrders(userId);
  const { user, loading } = useUserDetails(userId);
  const { openSections, toggleSection } = useAccordionSections();
  
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading user details..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-6">The user you're looking for doesn't exist or may have been removed.</p>
          <Link to="/admin/users">
            <Button variant="secondary">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Go Back to Users
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-3 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-500 mt-1">Complete details for {user.firstName} {user.lastName}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-slate-100/50 overflow-hidden">
        <UserHeader user={user} />

        <div className="p-6 space-y-6">
          <AccordionSection
            title="Contact Information"
            icon={<FiMail className="w-5 h-5 text-indigo-500" />}
            isOpen={openSections.contact}
            onToggle={() => toggleSection('contact')}
          >
            <ContactInformation user={user} />
          </AccordionSection>

          <AccordionSection
            title="Account Information"
            icon={<FiUserCheck className="w-5 h-5 text-purple-500" />}
            isOpen={openSections.account}
            onToggle={() => toggleSection('account')}
          >
            <AccountInformation user={user} />
          </AccordionSection>

          {user.role === 'Customer' && (
            <>
              <AccordionSection
                title="Customer Information"
                icon={<FiUser className="w-5 h-5 text-blue-500" />}
                isOpen={openSections.customer}
                onToggle={() => toggleSection('customer')}
              >
                <CustomerInformation user={user} />
              </AccordionSection>

              <AccordionSection
                title="Purchase History"
                icon={<FiShoppingBag className="w-5 h-5 text-emerald-500" />}
                isOpen={openSections.orders}
                onToggle={() => toggleSection('orders')}
              >
                {isLoadingOrders ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <PurchaseHistory 
                    orders={orders} 
                    purchasedProducts={purchasedProducts} 
                    isLoadingOrders={isLoadingOrders} 
                  />
                )}
              </AccordionSection>
            </>
          )}

          {user.role === 'Customer' && user.addresses && user.addresses.length > 0 && (
            <AccordionSection
              title="Addresses"
              icon={<FiMapPin className="w-5 h-5 text-blue-500" />}
              isOpen={openSections.addresses}
              onToggle={() => toggleSection('addresses')}
            >
              <Addresses user={user} />
            </AccordionSection>
          )}

          {user.role === 'Seller' && (
            <AccordionSection
              title="Seller Information"
              icon={<FiShoppingBag className="w-5 h-5 text-emerald-500" />}
              isOpen={openSections.seller}
              onToggle={() => toggleSection('seller')}
            >
              <SellerInformation user={user} />
            </AccordionSection>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button variant="primary">
                Edit User
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;