import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useRegister from './useRegister.jsx';

const STEP_ANIMATION_VARIANTS = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
};

const TOTAL_STEPS = 4;

const useRegisterPage = () => {
    const { registerUser, isRegistering } = useRegister();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        mode: 'onChange',
        defaultValues: { role: 'Customer', gender: 'male' },
    });

    const selectedRole = form.watch('role');
    const selectedGender = form.watch('gender');
    const progressWidth = `${(step / TOTAL_STEPS) * 100}%`;

    const onNextStep = async () => {
        if (step === 1) {
            if (selectedRole === 'Customer' || selectedRole === 'Seller') setStep(2);
        } else if (step === 2) {
            const isValid = await form.trigger(['email', 'password', 'confirmPassword']);
            if (isValid) setStep(3);
        } else if (step === 3) {
            const isValid = await form.trigger(['firstName', 'lastName', 'phoneNumber', 'gender']);
            if (isValid) setStep(4);
        }
    };

    const onPrevStep = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const onSubmit = (data) => {
        registerUser(data);
    };

    const stepTitle = step === 1 ? 'Choose your role'
        : step === 2 ? 'Create account'
            : step === 3 ? 'Your profile'
                : selectedRole === 'Seller' ? 'Business Details' : 'Shipping Address';

    const stepSubtitle = step === 1 ? 'Select if you want to buy or sell'
        : step === 2 ? 'Enter your account details'
            : step === 3 ? 'Just a few more details'
                : selectedRole === 'Seller' ? 'Complete your seller profile' : 'Tell us where to deliver';

    return {
        form, step, onSubmit, onNextStep, onPrevStep,
        isRegistering, selectedRole, selectedGender,
        showPassword, setShowPassword,
        showConfirmPassword, setShowConfirmPassword,
        progressWidth, stepTitle, stepSubtitle,
        variants: STEP_ANIMATION_VARIANTS,
    };
};

export default useRegisterPage;
