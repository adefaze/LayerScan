/**
 * Layer Intelligence - Fixers Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
    applyFix,
    applyAllFixes,
    storeUndo,
    getLastUndo,
    clearUndoHistory,
} from '../src/core/fixers';
import type { Issue } from '../src/core/types';

describe('Fixers', () => {
    beforeEach(() => {
        clearUndoHistory();
    });

    describe('applyFix', () => {
        it('should return true when fix succeeds', async () => {
            const issue: Issue = {
                id: 'test-1',
                node: { id: 'n1' },
                ruleId: 'test',
                title: 'Test issue',
                description: '',
                severity: 'warning',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => { },
            };

            const result = await applyFix(issue);

            expect(result).toBe(true);
        });

        it('should return false when canAutoFix is false', async () => {
            const issue: Issue = {
                id: 'test-1',
                node: { id: 'n1' },
                ruleId: 'test',
                title: 'Test issue',
                description: '',
                severity: 'warning',
                category: 'layout',
                canAutoFix: false,
            };

            const result = await applyFix(issue);

            expect(result).toBe(false);
        });

        it('should return false when no fixAction provided', async () => {
            const issue: Issue = {
                id: 'test-1',
                node: { id: 'n1' },
                ruleId: 'test',
                title: 'Test issue',
                description: '',
                severity: 'warning',
                category: 'layout',
                canAutoFix: true,
                // No fixAction
            };

            const result = await applyFix(issue);

            expect(result).toBe(false);
        });
    });

    describe('applyAllFixes', () => {
        it('should apply multiple fixes and return counts', async () => {
            const issues: Issue[] = [
                {
                    id: 'test-1',
                    node: { id: 'n1' },
                    ruleId: 'test',
                    title: '',
                    description: '',
                    severity: 'warning',
                    category: 'layout',
                    canAutoFix: true,
                    fixAction: async () => { },
                },
                {
                    id: 'test-2',
                    node: { id: 'n2' },
                    ruleId: 'test',
                    title: '',
                    description: '',
                    severity: 'warning',
                    category: 'layout',
                    canAutoFix: true,
                    fixAction: async () => { },
                },
                {
                    id: 'test-3',
                    node: { id: 'n3' },
                    ruleId: 'test',
                    title: '',
                    description: '',
                    severity: 'warning',
                    category: 'layout',
                    canAutoFix: false, // Should be skipped
                },
            ];

            const result = await applyAllFixes(issues);

            expect(result.success).toBe(2);
            expect(result.failed).toBe(0);
        });
    });

    describe('undo functionality', () => {
        it('should store and retrieve undo entries', () => {
            storeUndo('issue-1', 'node-1', 'width', 100);
            storeUndo('issue-2', 'node-2', 'height', 50);

            const entry = getLastUndo('issue-1');

            expect(entry).toBeDefined();
            expect(entry?.issueId).toBe('issue-1');
            expect(entry?.nodeId).toBe('node-1');
            expect(entry?.property).toBe('width');
            expect(entry?.previousValue).toBe(100);
        });

        it('should return undefined for non-existent undo', () => {
            storeUndo('issue-1', 'node-1', 'width', 100);

            const entry = getLastUndo('non-existent');

            expect(entry).toBeUndefined();
        });

        it('should clear undo history', () => {
            storeUndo('issue-1', 'node-1', 'width', 100);
            clearUndoHistory();

            const entry = getLastUndo('issue-1');

            expect(entry).toBeUndefined();
        });
    });
});
