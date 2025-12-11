/**
 * Layer Intelligence - Toast Component
 */

import { memo } from 'react';

interface ToastProps {
    message: string;
    action?: () => void;
    onClose: () => void;
}

export const Toast = memo(function Toast({ message, action, onClose }: ToastProps) {
    return (
        <div className="toast toast-success">
            <span>{message}</span>
            {action && (
                <button className="toast-action" onClick={action}>
                    Undo
                </button>
            )}
            <button
                className="btn btn-ghost btn-icon"
                onClick={onClose}
                style={{ padding: '4px', marginLeft: '8px' }}
            >
                ✕
            </button>
        </div>
    );
});
