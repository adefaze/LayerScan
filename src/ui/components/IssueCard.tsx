/**
 * Layer Intelligence - Issue Card Component
 * With professional SVG severity icons
 */

import { memo } from 'react';
import type { Issue } from '../../core/types';
import { ErrorIcon, WarningIcon, InfoIcon, EyeIcon, SparklesIcon } from './Icons';

interface IssueCardProps {
    issue: Issue;
    isHighlighted: boolean;
    onHover: (issueId: string | null) => void;
    onFix: (issue: Issue) => void;
    onShow: (nodeId: string) => void;
}

const SeverityIcon = ({ severity }: { severity: string }) => {
    switch (severity) {
        case 'error':
            return <ErrorIcon />;
        case 'warning':
            return <WarningIcon />;
        default:
            return <InfoIcon />;
    }
};

export const IssueCard = memo(function IssueCard({
    issue,
    isHighlighted,
    onHover,
    onFix,
    onShow,
}: IssueCardProps) {
    return (
        <div
            className={`issue-card ${isHighlighted ? 'highlighted' : ''}`}
            onMouseEnter={() => onHover(issue.id)}
            onMouseLeave={() => onHover(null)}
        >
            <div className="issue-severity">
                <span className={`severity-badge severity-${issue.severity}`}>
                    <SeverityIcon severity={issue.severity} />
                </span>
            </div>

            <div className="issue-content">
                <div className="issue-title">{issue.title}</div>
                <div className="issue-description">{issue.description}</div>

                {issue.node.path && (
                    <div className="issue-path" title={issue.node.path}>
                        {issue.node.name || issue.node.path}
                    </div>
                )}

                <div className="issue-actions">
                    {issue.canAutoFix && (
                        <button
                            className="btn btn-default btn-sm"
                            onClick={() => onFix(issue)}
                            title="Apply automatic fix"
                        >
                            <SparklesIcon size={12} />
                            Fix
                        </button>
                    )}
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => onShow(issue.node.id)}
                        title="Select and show in canvas"
                    >
                        <EyeIcon size={12} />
                        Show
                    </button>
                </div>
            </div>
        </div>
    );
});
