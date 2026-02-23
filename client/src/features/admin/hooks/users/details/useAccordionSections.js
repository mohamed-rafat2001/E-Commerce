import { useState } from 'react';

const useAccordionSections = (initialSections = {}) => {
  const [openSections, setOpenSections] = useState({
    contact: true,
    account: true,
    customer: true,
    seller: true,
    orders: false,
    addresses: false,
    ...initialSections
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setSection = (section, isOpen) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: isOpen
    }));
  };

  return {
    openSections,
    toggleSection,
    setSection
  };
};

export default useAccordionSections;