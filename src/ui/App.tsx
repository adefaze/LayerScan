/**
 * Layer Intelligence - App Component
 * Root panel with selection subscription and audit state management
 */

import { useState, useEffect, useCallback } from 'react';
import { framer } from 'framer-plugin';
import { Toolbar } from './components/Toolbar';
import { IssuesPanel } from './panels/IssuesPanel';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';
import { auditNodes, groupIssuesByCategory } from '../core/auditor';
import { applyFix, applyAllFixes } from '../core/fixers';
import type { Issue, PluginSettings, AuditResult, FramerNode, GroupedIssues } from '../core/types';
import { DEFAULT_SETTINGS } from '../core/types';
import { debounce } from '../utils/perf';

export default function App() {
    // State
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [groupedIssues, setGroupedIssues] = useState<GroupedIssues | null>(null);
    const [highlightedIssueId, setHighlightedIssueId] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);
    const [toast, setToast] = useState<{ message: string; action?: () => void } | null>(null);
    const [selectedNodes, setSelectedNodes] = useState<FramerNode[]>([]);

    // Show toast helper
    const showToast = useCallback((message: string, action?: () => void) => {
        setToast({ message, action });
        setTimeout(() => setToast(null), 4000);
    }, []);

    // Audit selection
    const auditSelection = useCallback(async () => {
        if (selectedNodes.length === 0) {
            showToast('Select one or more layers to audit');
            return;
        }

        setIsAuditing(true);
        try {
            const result = await auditNodes(selectedNodes, settings);
            setAuditResult(result);
            setGroupedIssues(groupIssuesByCategory(result.issues) as unknown as GroupedIssues);
        } catch (error) {
            console.error('Audit failed:', error);
            showToast('Audit failed. Please try again.');
        } finally {
            setIsAuditing(false);
        }
    }, [selectedNodes, settings, showToast]);

    // Audit full page
    const auditPage = useCallback(async () => {
        setIsAuditing(true);
        try {
            // Get all nodes from canvas root
            const canvasRoot = await framer.getCanvasRoot();
            const nodes = canvasRoot ? [canvasRoot as unknown as FramerNode] : [];

            if (nodes.length === 0) {
                showToast('No layers found on page');
                setIsAuditing(false);
                return;
            }

            const result = await auditNodes(nodes, settings);
            setAuditResult(result);
            setGroupedIssues(groupIssuesByCategory(result.issues) as unknown as GroupedIssues);
        } catch (error) {
            console.error('Page audit failed:', error);
            showToast('Page audit failed. Please try again.');
        } finally {
            setIsAuditing(false);
        }
    }, [settings, showToast]);

    // Fix single issue
    const handleFix = useCallback(async (issue: Issue) => {
        const success = await applyFix(issue);
        if (success) {
            showToast('Fixed · Undo', () => {
                // Would trigger undo via Framer API
                console.log('Undo requested');
            });
            // Re-audit to update issues list
            auditSelection();
        } else {
            showToast('Fix failed. Please try manually.');
        }
    }, [auditSelection, showToast]);

    // Fix all issues
    const handleFixAll = useCallback(async () => {
        if (!auditResult || auditResult.issues.length === 0) return;

        const fixableIssues = auditResult.issues.filter((i) => i.canAutoFix);
        if (fixableIssues.length === 0) {
            showToast('No issues can be auto-fixed');
            return;
        }

        setIsAuditing(true);
        const result = await applyAllFixes(fixableIssues);
        setIsAuditing(false);

        showToast(`Fixed ${result.success} issue${result.success !== 1 ? 's' : ''}`);

        // Re-audit
        auditSelection();
    }, [auditResult, auditSelection, showToast]);

    // Show node in canvas
    const handleShowNode = useCallback(async (nodeId: string) => {
        try {
            // Use zoomIntoView to navigate to and highlight the node
            await framer.zoomIntoView([nodeId]);
        } catch (error) {
            console.error('[LayerIntelligence] Failed to zoom to node:', error);
            showToast('Could not navigate to layer');
        }
    }, [showToast]);

    // Subscribe to selection changes
    useEffect(() => {
        const debouncedUpdate = debounce(async () => {
            try {
                const selection = await framer.getSelection();
                setSelectedNodes(selection as unknown as FramerNode[]);
            } catch (error) {
                console.error('Failed to get selection:', error);
            }
        }, 300);

        // Initial selection
        debouncedUpdate();

        // Subscribe to changes
        const unsubscribe = framer.subscribeToSelection(debouncedUpdate);

        return () => {
            unsubscribe();
        };
    }, []);

    // Calculate counts
    const totalIssues = auditResult?.issues.length ?? 0;
    const fixableCount = auditResult?.issues.filter((i) => i.canAutoFix).length ?? 0;
    const errorCount = auditResult?.issues.filter((i) => i.severity === 'error').length ?? 0;
    const warningCount = auditResult?.issues.filter((i) => i.severity === 'warning').length ?? 0;

    return (
        <div className="plugin-container">
            {/* Header */}
            <header className="plugin-header">
                <div className="plugin-brand">
                    <img src="/logo.svg" alt="LayerScan" className="plugin-logo" />
                    <h1 className="plugin-title">LayerScan</h1>
                </div>
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setSettingsOpen(true)}
                    aria-label="Settings"
                >
                    ⛭
                </button>
            </header>

            {/* Toolbar */}
            <Toolbar
                onScanSelection={auditSelection}
                onScanPage={auditPage}
                onFixAll={handleFixAll}
                isAuditing={isAuditing}
                hasSelection={selectedNodes.length > 0}
                fixableCount={fixableCount}
            />

            {/* Issues Panel */}
            <IssuesPanel
                isAuditing={isAuditing}
                groupedIssues={groupedIssues}
                highlightedIssueId={highlightedIssueId}
                onIssueHover={setHighlightedIssueId}
                onFix={handleFix}
                onShow={handleShowNode}
                maxDisplayed={settings.maxDisplayedIssues}
            />

            {/* Stats Bar */}
            {auditResult && !isAuditing && (
                <div className="stats-bar">
                    <span className="stat-item">
                        <strong>{auditResult.nodesAudited}</strong> nodes
                    </span>
                    <span className="stat-item">
                        <strong>{totalIssues}</strong> issue{totalIssues !== 1 ? 's' : ''}
                    </span>
                    {errorCount > 0 && (
                        <span className="stat-item" style={{ color: 'var(--color-error)' }}>
                            {errorCount} error{errorCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    {warningCount > 0 && (
                        <span className="stat-item" style={{ color: 'var(--color-warning)' }}>
                            {warningCount} warning{warningCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    <span className="stat-item" style={{ marginLeft: 'auto', opacity: 0.7 }}>
                        {auditResult.durationMs.toFixed(0)}ms
                    </span>
                </div>
            )}

            {/* Settings Modal */}
            {settingsOpen && (
                <SettingsModal
                    settings={settings}
                    onSave={(newSettings) => {
                        setSettings(newSettings);
                        setSettingsOpen(false);
                    }}
                    onClose={() => setSettingsOpen(false)}
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    action={toast.action}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
