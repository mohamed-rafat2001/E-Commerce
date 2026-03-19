import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useLogin from './useLogin.jsx';
import useCurrentUser from '../../user/hooks/useCurrentUser.js';

const useLoginPage = () => {
    const { login, isLoggingIn } = useLogin();
    const { isAuthenticated, userRole } = useCurrentUser();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userRole) {
            const dashboardPath = `/${userRole.toLowerCase()}/dashboard`;
            navigate(dashboardPath, { replace: true });
        }
    }, [isAuthenticated, userRole, navigate]);

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
