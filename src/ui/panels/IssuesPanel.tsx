/**
 * Layer Intelligence - Issues Panel Component
 * With professional SVG icons
 */

import { useState, memo } from 'react';
import type { Issue, GroupedIssues } from '../../core/types';
import { IssueCard } from '../components/IssueCard';
import {
    LayoutIcon,
    SpacingIcon,
    HierarchyIcon,
    AccessibilityIcon,
    PerformanceIcon,
    SearchIcon,
    SuccessIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '../components/Icons';

interface IssuesPanelProps {
    isAuditing: boolean;
    groupedIssues: GroupedIssues | null;
    highlightedIssueId: string | null;
    onIssueHover: (issueId: string | null) => void;
    onFix: (issue: Issue) => void;
    onShow: (nodeId: string) => void;
    maxDisplayed: number;
}

interface CategoryConfig {
    key: keyof GroupedIssues;
    label: string;
    icon: React.ReactNode;
}

const categories: CategoryConfig[] = [
    { key: 'layout', label: 'Layout', icon: <LayoutIcon /> },
    { key: 'spacing', label: 'Spacing', icon: <SpacingIcon /> },
    { key: 'hierarchy', label: 'Hierarchy', icon: <HierarchyIcon /> },
    { key: 'accessibility', label: 'Accessibility', icon: <AccessibilityIcon /> },
    { key: 'performance', label: 'Performance', icon: <PerformanceIcon /> },
];

export const IssuesPanel = memo(function IssuesPanel({
    isAuditing,
    groupedIssues,
    highlightedIssueId,
    onIssueHover,
    onFix,
    onShow,
    maxDisplayed,
}: IssuesPanelProps) {
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [showAll, setShowAll] = useState(false);

    const toggleGroup = (key: string) => {
        setCollapsedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    // Loading state
    if (isAuditing) {
        return (
            <div className="issues-panel">
                <div className="loading-state">
                    <div className="spinner" />
                    <span className="loading-text">Analyzing layers...</span>
                </div>
            </div>
        );
    }

    // Empty state - no audit yet
    if (!groupedIssues) {
        return (
            <div className="issues-panel">
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <SearchIcon size={48} />
                    </div>
                    <div className="empty-state-title">Ready to audit</div>
                    <div className="empty-state-description">
                        Select layers and click "Selection" or scan the entire page
                    </div>
                </div>
            </div>
        );
    }

    // Calculate total issues
    const totalIssues = Object.values(groupedIssues).reduce(
        (sum, issues) => sum + issues.length,
        0
    );

    // Empty state - no issues found
    if (totalIssues === 0) {
        return (
            <div className="issues-panel">
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <SuccessIcon size={48} />
                    </div>
                    <div className="empty-state-title">No issues found</div>
                    <div className="empty-state-description">
                        Great job! Your layers look clean
                    </div>
                </div>
            </div>
        );
    }

    // Collect all issues for "show all" truncation
    let displayedCount = 0;
    const shouldTruncate = !showAll && totalIssues > maxDisplayed;

    return (
        <div className="issues-panel">
            {categories.map(({ key, label, icon }) => {
                const issues = groupedIssues[key];
                if (issues.length === 0) return null;

                const isCollapsed = collapsedGroups.has(key);

                // Handle truncation
                let displayIssues = issues;
                if (shouldTruncate) {
                    const remaining = maxDisplayed - displayedCount;
                    if (remaining <= 0) return null;
                    displayIssues = issues.slice(0, remaining);
                    displayedCount += displayIssues.length;
                }

                return (
                    <div
                        key={key}
                        className={`issue-group ${isCollapsed ? 'collapsed' : ''}`}
                    >
                        <button
                            className="issue-group-header"
                            onClick={() => toggleGroup(key)}
                            aria-expanded={!isCollapsed}
                        >
                            <span className="issue-group-title">
                                {icon}
                                {label}
                            </span>
                            <div className="issue-group-meta">
                                <span className="issue-group-count">{issues.length}</span>
                                <span className="issue-group-chevron">
                                    {isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                                </span>
                            </div>
                        </button>

                        <div className="issue-group-content">
                            {displayIssues.map((issue) => (
                                <IssueCard
                                    key={issue.id}
                                    issue={issue}
                                    isHighlighted={highlightedIssueId === issue.id}
                                    onHover={onIssueHover}
                                    onFix={onFix}
                                    onShow={onShow}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Show all button */}
            {shouldTruncate && (
                <button
                    className="btn btn-ghost"
                    style={{ width: '100%', marginTop: 'var(--space-2)' }}
                    onClick={() => setShowAll(true)}
                >
                    Show all {totalIssues} issues
                </button>
            )}
        </div>
    );
});
