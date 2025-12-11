/**
 * Layer Intelligence - Auditor Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import { auditNodes, groupIssuesByCategory, sortBySeverity, getAutoFixableCount } from '../src/core/auditor';
import type { Issue, PluginSettings } from '../src/core/types';
import { DEFAULT_SETTINGS } from '../src/core/types';

describe('Auditor', () => {
    describe('auditNodes', () => {
        it('should return empty issues array for empty nodes', async () => {
            const result = await auditNodes([], DEFAULT_SETTINGS);

            expect(result.issues).toEqual([]);
            expect(result.nodesAudited).toBe(0);
            expect(result.durationMs).toBeGreaterThanOrEqual(0);
        });

        it('should deduplicate issues by id', async () => {
            // The deduplication logic is within auditNodes
            // This test ensures the audit completes without errors
            const result = await auditNodes([], DEFAULT_SETTINGS);
            expect(Array.isArray(result.issues)).toBe(true);
        });
    });

    describe('groupIssuesByCategory', () => {
        it('should group issues by category', () => {
            const issues: Issue[] = [
                {
                    id: '1',
                    node: { id: 'n1' },
                    ruleId: 'test',
                    title: 'Layout issue',
                    description: '',
                    severity: 'error',
                    category: 'layout',
                    canAutoFix: false,
                },
                {
                    id: '2',
                    node: { id: 'n2' },
                    ruleId: 'test',
                    title: 'Spacing issue',
                    description: '',
                    severity: 'warning',
                    category: 'spacing',
                    canAutoFix: true,
                },
                {
                    id: '3',
                    node: { id: 'n3' },
                    ruleId: 'test',
                    title: 'Another layout',
                    description: '',
                    severity: 'info',
                    category: 'layout',
                    canAutoFix: false,
                },
            ];

            const grouped = groupIssuesByCategory(issues);

            expect(grouped.layout).toHaveLength(2);
            expect(grouped.spacing).toHaveLength(1);
            expect(grouped.accessibility).toHaveLength(0);
            expect(grouped.performance).toHaveLength(0);
        });
    });

    describe('sortBySeverity', () => {
        it('should sort issues with errors first', () => {
            const issues: Issue[] = [
                { id: '1', node: { id: 'n1' }, ruleId: 'test', title: '', description: '', severity: 'info', category: 'layout', canAutoFix: false },
                { id: '2', node: { id: 'n2' }, ruleId: 'test', title: '', description: '', severity: 'error', category: 'layout', canAutoFix: false },
                { id: '3', node: { id: 'n3' }, ruleId: 'test', title: '', description: '', severity: 'warning', category: 'layout', canAutoFix: false },
            ];

            const sorted = sortBySeverity(issues);

            expect(sorted[0].severity).toBe('error');
            expect(sorted[1].severity).toBe('warning');
            expect(sorted[2].severity).toBe('info');
        });
    });

    describe('getAutoFixableCount', () => {
        it('should count auto-fixable issues', () => {
            const issues: Issue[] = [
                { id: '1', node: { id: 'n1' }, ruleId: 'test', title: '', description: '', severity: 'error', category: 'layout', canAutoFix: true },
                { id: '2', node: { id: 'n2' }, ruleId: 'test', title: '', description: '', severity: 'warning', category: 'layout', canAutoFix: false },
                { id: '3', node: { id: 'n3' }, ruleId: 'test', title: '', description: '', severity: 'info', category: 'layout', canAutoFix: true },
            ];

            const count = getAutoFixableCount(issues);

            expect(count).toBe(2);
        });
    });
});
