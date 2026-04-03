import { motion } from 'framer-motion';
import { Card, Button, Input } from '../../../shared/ui/index.js';
import { LockIcon, ShieldIcon } from '../../../shared/constants/icons.jsx';

const SecuritySection = ({ passwordForm, isChangingPassword, setIsChangingPassword, isUpdatingPassword, onPasswordSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = passwordForm;

    return (
        <Card className="lg:col-span-2">
            <Card.Header className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-300"><ShieldIcon className="w-5 h-5" /></div>
                    <Card.Title>Security Settings</Card.Title>
                </div>
                {!isChangingPassword && (
                    <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>Change Password</Button>
                )}
            </Card.Header>
            <Card.Content className="pt-6">
                {!isChangingPassword ? (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400"><LockIcon className="w-6 h-6" /></div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">Password Control</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Regularly update your password to stay secure.</p>
                                </div>
                            </div>
                            <div className="text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />SECURE
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Change</p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">6 months ago</p>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Security Score</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[85%]" /></div>
                                    <span className="text-xs font-bold text-emerald-600">85%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <Input type="password" label="Current Password" placeholder="Enter your current password" error={errors.currentPassword?.message} {...register('currentPassword', { required: 'Current password is required' })} />
                            </div>
                            <Input type="password" label="New Password" placeholder="Minimum 8 characters" error={errors.newPassword?.message} {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Minimum 8 characters' }, validate: (value) => { const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; return strongRegex.test(value) || 'Must contain uppercase, lowercase, number and special character'; } })} />
                            <Input type="password" label="Confirm New Password" placeholder="Repeat your new password" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Please confirm your new password', validate: (value) => value === watch('newPassword') || 'Passwords do not match' })} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                            <Button variant="ghost" type="button" onClick={() => { setIsChangingPassword(false); reset(); }} disabled={isUpdatingPassword}>Cancel</Button>
                            <Button variant="primary" type="submit" isLoading={isUpdatingPassword}>Update Password</Button>
                        </div>
                    </form>
                )}
            </Card.Content>
        </Card>
    );
};

export default SecuritySection;
