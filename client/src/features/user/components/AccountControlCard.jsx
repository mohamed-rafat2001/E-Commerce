import { Card, Button } from '../../../shared/ui/index.js';
import { TrashIcon } from '../../../shared/constants/icons.jsx';

const AccountControlCard = ({ onDeactivate }) => (
    <Card>
        <Card.Header>
            <Card.Title>Account Control</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <p className="text-sm font-semibold text-orange-800 mb-1">Session Management</p>
                <p className="text-xs text-orange-600 mb-4">You are currently logged into this device.</p>
                <Button variant="outline" size="sm" className="w-full bg-white border-orange-200 text-orange-700 hover:bg-orange-100">Log out everywhere</Button>
            </div>
            <div className="pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-red-600 mb-2">Danger Zone</p>
                <p className="text-xs text-gray-500 mb-4">Deleting your account will deactivate your profile. All your data will be archived.</p>
                <Button variant="danger" size="sm" className="w-full" onClick={onDeactivate}>Deactivate Account</Button>
            </div>
        </Card.Content>
    </Card>
);

export default AccountControlCard;
