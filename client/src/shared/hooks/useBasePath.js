import { useLocation } from 'react-router-dom';

export default function useBasePath() {
  const location = useLocation();
  const pathname = location.pathname || '';
  if (pathname.startsWith('/admin')) return '/admin';
  if (pathname.startsWith('/seller')) return '/seller';
  if (pathname.startsWith('/customer')) return '/customer';
  return '/';
}

