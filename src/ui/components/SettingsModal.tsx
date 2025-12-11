/**
 * Layer Intelligence - Settings Modal Component
 * With improved toggle styling
 */

import { useState, memo } from 'react';
import type { PluginSettings } from '../../core/types';
import { allRules } from '../../core/rules';
import { CloseIcon } from './Icons';

interface SettingsModalProps {
    settings: PluginSettings;
    onSave: (settings: PluginSettings) => void;
    onClose: () => void;
}

export const SettingsModal = memo(function SettingsModal({
    settings,
    onSave,
    onClose,
}: SettingsModalProps) {
    const [localSettings, setLocalSettings] = useState<PluginSettings>(settings);

    const handleToggle = (key: keyof PluginSettings, value: boolean) => {
        setLocalSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleRuleToggle = (ruleId: string, enabled: boolean) => {
        setLocalSettings((prev) => {
            const disabledRules = enabled
                ? prev.disabledRules.filter((id) => id !== ruleId)
                : [...prev.disabledRules, ruleId];
            return { ...prev, disabledRules };
        });
    };

    const isRuleEnabled = (ruleId: string) => {
        return !localSettings.disabledRules.includes(ruleId);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Settings</h2>
                    <button className="modal-close" onClick={onClose}>
                        <CloseIcon size={16} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Spacing Grid */}
                    <div className="form-group">
                        <label className="form-label">Spacing Grid</label>
                        <select
                            className="select"
                            value={localSettings.spacingGrid}
                            onChange={(e) =>
                                setLocalSettings((prev) => ({
                                    ...prev,
                                    spacingGrid: parseInt(e.target.value) as 4 | 8,
                                }))
                            }
                        >
                            <option value="4">4pt grid</option>
                            <option value="8">8pt grid</option>
                        </select>
                        <p className="form-description">
                            Base unit for spacing recommendations
                        </p>
                    </div>

                    {/* Confirm Auto-Fix */}
                    <div className="form-group">
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <div className="toggle-title">Confirm before fixing</div>
                                <div className="toggle-description">
                                    Show confirmation before applying auto-fixes
                                </div>
                            </div>
                            <button
                                className={`toggle-switch ${localSettings.confirmAutoFix ? 'active' : ''}`}
                                onClick={() => handleToggle('confirmAutoFix', !localSettings.confirmAutoFix)}
                                aria-pressed={localSettings.confirmAutoFix}
                            />
                        </div>
                    </div>

                    {/* Analytics */}
                    <div className="form-group">
                        <div className="toggle-row">
                            <div className="toggle-info">
                                <div className="toggle-title">Usage analytics</div>
                                <div className="toggle-description">
                                    Help improve with anonymous usage data
                                </div>
                            </div>
                            <button
                                className={`toggle-switch ${localSettings.analyticsEnabled ? 'active' : ''}`}
                                onClick={() => handleToggle('analyticsEnabled', !localSettings.analyticsEnabled)}
                                aria-pressed={localSettings.analyticsEnabled}
                            />
                        </div>
                    </div>

                    {/* Rules */}
                    <div className="form-group">
                        <label className="form-label">Enabled Rules</label>
                        <div className="rules-list">
                            {allRules.map((rule) => (
                                <div key={rule.id} className="rule-item">
                                    <span className="rule-name">{rule.name}</span>
                                    <button
                                        className={`toggle-switch ${isRuleEnabled(rule.id) ? 'active' : ''}`}
                                        onClick={() => handleRuleToggle(rule.id, !isRuleEnabled(rule.id))}
                                        aria-pressed={isRuleEnabled(rule.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => onSave(localSettings)}>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
});
