import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserDetails from './useUserDetails.js';
import useAccordionSections from './useAccordionSections.js';
import useUserOrders from './useUserOrders.js';
import useSellerBrands from '../../brands/useSellerBrands.js';

const useUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // User Details
  const { user, loading: userLoading, error } = useUserDetails(id);
  
  // Accordion state
  const { openSections, toggleSection } = useAccordionSections();
  
  // Orders pagination and data
  const [ordersPage, setOrdersPage] = useState(1);
  const { 
    orders, 
    purchasedProducts, 
    isLoading: ordersLoading, 
    totalPages: ordersTotalPages 
  } = useUserOrders(id, ordersPage, 5);
  
  // Seller brands pagination and data (only if user is seller)
  const [brandsPage, setBrandsPage] = useState(1);
  const sellerId = user?.seller?._id;
  
  // Only fetch brands if we have a sellerId
  const { 
    brands, 
    total: brandsTotal, 
    totalPages: brandsTotalPages, 
    loading: brandsLoading 
  } = useSellerBrands(sellerId, brandsPage, 6);

  return {
    id,
    navigate,
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
  };
};

export default useUserDetailsPage;
