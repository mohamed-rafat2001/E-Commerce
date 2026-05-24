import { motion } from 'framer-motion';
import { Card, Button, Input } from '../../../shared/ui/index.js';
import { UserIcon } from '../../../shared/constants/icons.jsx';

const PersonalInfoForm = ({ profileForm, isEditing, isUpdating, onSubmit, onCancelEdit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = profileForm;

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2">
            <Card>
                <Card.Header>
                    <Card.Title>Personal Information</Card.Title>
                </Card.Header>
                <Card.Content>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input label="First Name" disabled={!isEditing || isUpdating} icon={<UserIcon />} error={errors.firstName?.message} {...register('firstName')} />
                            <Input label="Last Name" disabled={!isEditing || isUpdating} error={errors.lastName?.message} {...register('lastName')} />
                            <Input label="Email Address" type="email" disabled={!isEditing || isUpdating} error={errors.email?.message} {...register('email')} />
                            <Input label="Phone Number" disabled={!isEditing || isUpdating} error={errors.phoneNumber?.message} {...register('phoneNumber')} />
                        </div>
                        {isEditing && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Button variant="ghost" type="button" onClick={() => { onCancelEdit(); reset(); }} disabled={isUpdating}>Cancel</Button>
                                <Button variant="primary" type="submit" isLoading={isUpdating}>Save Changes</Button>
                            </motion.div>
                        )}
                    </form>
                </Card.Content>
            </Card>
        </motion.div>
    );
};

export default PersonalInfoForm;
