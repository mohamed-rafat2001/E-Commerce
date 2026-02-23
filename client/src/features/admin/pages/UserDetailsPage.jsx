import { Link } from 'react-router-dom';
import { Button, LoadingSpinner } from '../../../shared/ui/index.js';
import { FiArrowLeft, FiUser, FiInfo, FiShoppingBag, FiPackage, FiMapPin, FiTag } from 'react-icons/fi';
import { useUserDetailsPage } from '../hooks/index.js';
import UserHeader from '../components/UserHeader.jsx';
import { 
  AccordionSection, 
  ContactInformation, 
  AccountInformation, 
  CustomerInformation, 
  PurchaseHistory, 
  Addresses, 
  SellerInformation 
} from '../components/users/details/index.js';

const UserDetailsPage = () => {
  const {
    user,
    userLoading,
    error,
    openSections,
    toggleSection,
    ordersPage,
    setOrdersPage,
    orders,
    purchasedProducts,
    ordersLoading,
    ordersTotalPages,
    brandsPage,
    setBrandsPage,
    brands,
    brandsTotal,
    brandsTotalPages,
    brandsLoading
  } = useUserDetailsPage();

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading user details..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
        <p className="text-red-600 font-medium">Failed to load user details. Please try again later.</p>
        <Link to="/admin/users">
          <Button variant="secondary" className="mt-4">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Back Navigation */}
      <div>
        <Link to="/admin/users" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-4">
          <FiArrowLeft className="w-4 h-4 mr-1" />
          Back to Users
        </Link>
        <UserHeader user={user} />
      </div>

      <div className="space-y-4">
        {/* Contact Information */}
        <AccordionSection 
          title="Contact Information" 
          icon={<FiUser className="w-5 h-5 text-indigo-500" />}
          isOpen={openSections.contact}
          onToggle={() => toggleSection('contact')}
        >
          <ContactInformation user={user} />
        </AccordionSection>

        {/* Account Information */}
        <AccordionSection 
          title="Account Information" 
          icon={<FiInfo className="w-5 h-5 text-indigo-500" />}
          isOpen={openSections.account}
          onToggle={() => toggleSection('account')}
        >
          <AccountInformation user={user} />
        </AccordionSection>

        {/* Customer Information (if applicable) */}
        {(user.role === 'Customer' || user.role === 'Seller') && (
          <AccordionSection 
            title="Customer Profile" 
            icon={<FiShoppingBag className="w-5 h-5 text-indigo-500" />}
            isOpen={openSections.customer}
            onToggle={() => toggleSection('customer')}
          >
            <CustomerInformation user={user} />
          </AccordionSection>
        )}

        {/* Orders Section */}
        <AccordionSection 
          title="Orders & Purchases" 
          icon={<FiPackage className="w-5 h-5 text-indigo-500" />}
          isOpen={openSections.orders}
          onToggle={() => toggleSection('orders')}
        >
          <PurchaseHistory 
            orders={orders} 
            purchasedProducts={purchasedProducts} 
            isLoadingOrders={ordersLoading} 
            page={ordersPage} 
            setPage={setOrdersPage} 
            totalPages={ordersTotalPages} 
          />
        </AccordionSection>

        {/* Addresses Section */}
        {user.addresses && user.addresses.length > 0 && (
          <AccordionSection 
            title={`Addresses (${user.addresses.length})`} 
            icon={<FiMapPin className="w-5 h-5 text-indigo-500" />}
            isOpen={openSections.addresses}
            onToggle={() => toggleSection('addresses')}
          >
            <Addresses user={user} />
          </AccordionSection>
        )}

        {/* Seller Information (if applicable) */}
        {user.role === 'Seller' && (
          <AccordionSection 
            title="Seller Profile" 
            icon={<FiTag className="w-5 h-5 text-indigo-500" />}
            isOpen={openSections.seller}
            onToggle={() => toggleSection('seller')}
          >
            <SellerInformation 
              user={user} 
              brands={brands} 
              total={brandsTotal} 
              totalPages={brandsTotalPages} 
              loadingBrands={brandsLoading} 
              page={brandsPage} 
              setPage={setBrandsPage} 
            />
          </AccordionSection>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;
