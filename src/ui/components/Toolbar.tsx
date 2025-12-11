/**
 * Layer Intelligence - Toolbar Component
 * With professional SVG icons
 */

import { memo } from 'react';
import { LayersIcon, FileIcon, SparklesIcon } from './Icons';

interface ToolbarProps {
    onScanSelection: () => void;
    onScanPage: () => void;
    onFixAll: () => void;
    isAuditing: boolean;
    hasSelection: boolean;
    fixableCount: number;
}

export const Toolbar = memo(function Toolbar({
    onScanSelection,
    onScanPage,
    onFixAll,
    isAuditing,
    hasSelection,
    fixableCount,
}: ToolbarProps) {
    return (
        <div className="toolbar">
            <button
                className={`btn ${hasSelection ? 'btn-primary' : 'btn-default'}`}
                onClick={onScanSelection}
                disabled={isAuditing || !hasSelection}
                title={hasSelection ? 'Scan selected layers' : 'Select layers to scan'}
            >
                <LayersIcon size={14} />
                Selection
            </button>

            <button
                className="btn btn-outline"
                onClick={onScanPage}
                disabled={isAuditing}
                title="Scan entire page"
            >
                <FileIcon size={14} />
                Page
            </button>

            <button
                className="btn btn-default"
                onClick={onFixAll}
                disabled={isAuditing || fixableCount === 0}
                title={fixableCount > 0 ? `Fix ${fixableCount} issue${fixableCount !== 1 ? 's' : ''}` : 'No auto-fixable issues'}
            >
                <SparklesIcon size={14} />
                Fix All
                {fixableCount > 0 && <span className="badge">{fixableCount}</span>}
            </button>
        </div>
    );
});
