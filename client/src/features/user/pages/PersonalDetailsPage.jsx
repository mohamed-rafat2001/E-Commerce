import { motion } from 'framer-motion';
import { Card } from '../../../shared/ui/index.js';
import usePersonalDetailsPage from '../hooks/usePersonalDetailsPage.jsx';
import ProfileHeaderCard from '../components/ProfileHeaderCard.jsx';
import PersonalInfoForm from '../components/PersonalInfoForm.jsx';
import SecuritySection from '../components/SecuritySection.jsx';
import AccountControlCard from '../components/AccountControlCard.jsx';
import PersonalDetailsModals from '../components/PersonalDetailsModals.jsx';

const PersonalDetailsPage = () => {
	const page = usePersonalDetailsPage();

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			<ProfileHeaderCard
				roleTheme={page.roleTheme}
				userData={page.userData}
				fullName={page.fullName}
				userRole={page.userRole}
				isEditing={page.isEditing}
				setIsEditing={page.setIsEditing}
				setIsUploadModalOpen={page.setIsUploadModalOpen}
				setIsDeleteModalOpen={page.setIsDeleteModalOpen}
			/>

			<PersonalDetailsModals
				isUploadModalOpen={page.isUploadModalOpen}
				setIsUploadModalOpen={page.setIsUploadModalOpen}
				previewUrl={page.previewUrl}
				isUploadingAvatar={page.isUploadingAvatar}
				uploadProgress={page.uploadProgress}
				fileInputRef={page.fileInputRef}
				handleFileChange={page.handleFileChange}
				handleUploadAvatar={page.handleUploadAvatar}
				selectedFile={page.selectedFile}
				clearFileSelection={page.clearFileSelection}
				isDeleteModalOpen={page.isDeleteModalOpen}
				setIsDeleteModalOpen={page.setIsDeleteModalOpen}
				handleDeleteAvatar={page.handleDeleteAvatar}
				isAccountDeleteModalOpen={page.isAccountDeleteModalOpen}
				setIsAccountDeleteModalOpen={page.setIsAccountDeleteModalOpen}
				handleAccountDeletion={page.handleAccountDeletion}
				isDeletingAccount={page.isDeletingAccount}
			/>

			{/* Info Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Account Overview */}
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-1">
					<Card className="h-full">
						<Card.Header><Card.Title>Account Overview</Card.Title></Card.Header>
						<Card.Content className="space-y-4">
							<div className="p-4 rounded-xl bg-gray-50">
								<p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Member Since</p>
								<p className="text-gray-900 font-medium mt-1">{page.memberSince}</p>
							</div>
							<div className="p-4 rounded-xl bg-gray-50">
								<p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Status</p>
								<div className="flex items-center gap-2 mt-1">
									<div className={`w-2 h-2 rounded-full ${page.userData?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
									<p className="text-gray-900 font-medium capitalize">{page.userData?.status || 'active'}</p>
								</div>
							</div>
						</Card.Content>
					</Card>
				</motion.div>

				<PersonalInfoForm
					profileForm={page.profileForm}
					isEditing={page.isEditing}
					isUpdating={page.isUpdating}
					onSubmit={page.onSubmit}
					onCancelEdit={() => page.setIsEditing(false)}
				/>

				{/* Security & Password Section */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="md:col-span-3">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<SecuritySection
							passwordForm={page.passwordForm}
							isChangingPassword={page.isChangingPassword}
							setIsChangingPassword={page.setIsChangingPassword}
							isUpdatingPassword={page.isUpdatingPassword}
							onPasswordSubmit={page.onPasswordSubmit}
						/>
						<AccountControlCard
							onDeactivate={() => page.setIsAccountDeleteModalOpen(true)}
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default PersonalDetailsPage;
