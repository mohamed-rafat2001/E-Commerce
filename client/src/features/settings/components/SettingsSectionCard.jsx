import { motion } from 'framer-motion';
import { Card, Button } from '../../../shared/ui/index.js';
import SettingsToggle from './SettingsToggle.jsx';

const SettingsSectionCard = ({ section, sectionIndex }) => (
    <motion.div
        key={section.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: sectionIndex * 0.1 }}
    >
        <Card variant="elevated">
            <Card.Header>
                <div className="flex flex-col gap-1">
                    <Card.Title>{section.title}</Card.Title>
                    <p className="text-sm text-gray-500">{section.description}</p>
                </div>
            </Card.Header>
            <Card.Content className="divide-y divide-gray-100">
                {section.settings.map((setting) => (
                    <div key={setting.name} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-gray-900 font-medium">{setting.name}</p>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {setting.type === 'toggle' ? (
                                <SettingsToggle enabled={setting.enabled} />
                            ) : (
                                <Button variant="outline" size="sm">{setting.buttonText}</Button>
                            )}
                        </div>
                    </div>
                ))}
            </Card.Content>
        </Card>
    </motion.div>
);

export default SettingsSectionCard;
