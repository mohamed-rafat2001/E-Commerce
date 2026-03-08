import { Link } from 'react-router-dom';
import { Button, PageHeader, Skeleton, Card } from '../../../shared/ui/index.js';
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
      <div className="space-y-8">
        <Skeleton variant="text" className="w-1/4 h-10" />
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="text" count={5} />
      </div>
    );
  }

  if (error || !user) {
    return (
      <Card className="text-center py-12 border-rose-100 bg-rose-50">
        <p className="text-rose-600 font-bold font-display">User Not Found</p>
        <p className="text-rose-500 mt-2">Failed to load user details. Please try again later.</p>
        <Link to="/admin/users" className="mt-6 inline-block">
          <Button variant="danger">Back to Directory</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4">
        <Link to="/admin/users" className="group inline-flex items-center text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
          <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to User Directory
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
