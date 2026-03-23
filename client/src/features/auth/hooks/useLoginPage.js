/* Audit Findings:
 - Login page hook auto-redirects authenticated users to role dashboards.
 - Redirect query support is required for guarded routes like /checkout.
*/
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useLogin from './useLogin.jsx';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';

const useLoginPage = () => {
    const { login, isLoggingIn } = useLogin();
    const { isAuthenticated, userRole } = useCurrentUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userRole) {
            const redirect = searchParams.get('redirect');
            if (redirect) {
                navigate(redirect.startsWith('/') ? redirect : `/${redirect}`, { replace: true });
            } else {
                const dashboardPath = `/${userRole.toLowerCase()}/dashboard`;
                navigate(dashboardPath, { replace: true });
            }
        }
    }, [isAuthenticated, userRole, navigate, searchParams]);

    const form = useForm();

    const onSubmit = (data) => {
        login(data);
    };

    return {
        form,
        onSubmit,
        isLoggingIn,
        showPassword,
        setShowPassword,
    };
};

export default useLoginPage;
