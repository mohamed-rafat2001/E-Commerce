import { Card, Button } from '../../../shared/ui/index.js';
import { TrashIcon } from '../../../shared/constants/icons.jsx';

const AccountControlCard = ({ onDeactivate }) => (
    <Card>
        <Card.Header>
            <Card.Title>Account Control</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/40">
                <p className="text-sm font-semibold text-orange-800 mb-1">Session Management</p>
                <p className="text-xs text-orange-600 dark:text-orange-300 mb-4">You are currently logged into this device.</p>
                <Button variant="outline" size="sm" className="w-full bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900/30">Log out everywhere</Button>
            </div>
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-red-600 mb-2">Danger Zone</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Deleting your account will deactivate your profile. All your data will be archived.</p>
                <Button variant="danger" size="sm" className="w-full" onClick={onDeactivate}>Deactivate Account</Button>
            </div>
        </Card.Content>
    </Card>
);

export default AccountControlCard;
