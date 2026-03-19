import { motion } from 'framer-motion';
import { Card, Button, Avatar, Badge, Dropdown } from '../../../shared/ui/index.js';

const ProfileHeaderCard = ({ roleTheme, userData, fullName, userRole, isEditing, setIsEditing, setIsUploadModalOpen, setIsDeleteModalOpen }) => (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="elevated" padding="p-0" className="relative">
            <div className="h-32 sm:h-40 rounded-t-2xl overflow-hidden" style={{ background: roleTheme.gradient }}>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/20" />
                    <div className="absolute bottom-5 right-20 w-32 h-32 rounded-full bg-white/10" />
                </div>
            </div>
            <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                    <div className="relative group">
                        <Dropdown
                            trigger={
                                <div className="relative cursor-pointer">
                                    <Avatar src={userData?.profileImg?.secure_url} name={fullName} size="2xl" ring ringColor="ring-white" className="border-4 border-white shadow-xl transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                            }
                            align="center"
                            width="w-56"
                        >
                            <Dropdown.Item icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>} onClick={() => setIsUploadModalOpen(true)}>Upload Profile Image</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item variant="danger" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} onClick={() => setIsDeleteModalOpen(true)} disabled={!userData?.profileImg?.secure_url}>Delete Image</Dropdown.Item>
                        </Dropdown>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{fullName}</h1>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <Badge variant="primary" className="bg-indigo-50 text-indigo-700">{userRole}</Badge>
                        </div>
                    </div>
                    <Button variant={isEditing ? 'danger' : 'outline'} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>
            </div>
        </Card>
    </motion.div>
);

export default ProfileHeaderCard;
