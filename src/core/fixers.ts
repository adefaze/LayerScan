/**
 * Layer Intelligence - Fixers
 * Auto-fix implementations with undo support
 */

import type { Issue, FramerNode } from './types';
import { isFrameNode, nearestGridValue } from '../utils/nodeHelpers';

// Store for undo operations
interface UndoEntry {
    issueId: string;
    nodeId: string;
    property: string;
    previousValue: unknown;
    timestamp: number;
}

const undoStack: UndoEntry[] = [];
const MAX_UNDO_ENTRIES = 50;

/**
 * Apply a fix and store undo information
 */
export async function applyFix(issue: Issue): Promise<boolean> {
    if (!issue.canAutoFix || !issue.fixAction) {
        console.warn(`Cannot auto-fix issue ${issue.id}`);
        return false;
    }

    try {
        await issue.fixAction();
        return true;
    } catch (error) {
        console.error(`Failed to apply fix for ${issue.id}:`, error);
        return false;
    }
}

/**
 * Apply multiple fixes (for "Fix All" functionality)
 */
export async function applyAllFixes(
    issues: Issue[],
    onProgress?: (completed: number, total: number) => void
): Promise<{ success: number; failed: number }> {
    const fixableIssues = issues.filter((issue) => issue.canAutoFix && issue.fixAction);
    let success = 0;
    let failed = 0;

    for (let i = 0; i < fixableIssues.length; i++) {
        const issue = fixableIssues[i];
        const result = await applyFix(issue);

        if (result) {
            success++;
        } else {
            failed++;
        }

        if (onProgress) {
            onProgress(i + 1, fixableIssues.length);
        }
    }

    return { success, failed };
}

/**
 * Store an undo entry
 */
export function storeUndo(
    issueId: string,
    nodeId: string,
    property: string,
    previousValue: unknown
): void {
    const entry: UndoEntry = {
        issueId,
        nodeId,
        property,
        previousValue,
        timestamp: Date.now(),
    };

    undoStack.push(entry);

    // Limit stack size
    if (undoStack.length > MAX_UNDO_ENTRIES) {
        undoStack.shift();
    }
}

/**
 * Get the last undo entry for an issue
 */
export function getLastUndo(issueId: string): UndoEntry | undefined {
    return [...undoStack].reverse().find((entry) => entry.issueId === issueId);
}

/**
 * Clear undo history
 */
export function clearUndoHistory(): void {
    undoStack.length = 0;
}

// ============================================================================
// Specific Fix Implementations
// ============================================================================

/**
 * Normalize gap to grid value
 */
export async function normalizeGap(
    node: FramerNode,
    gridBase: 4 | 8
): Promise<void> {
    if (!isFrameNode(node)) return;

    const currentGap = node.layoutGap ?? 0;
    const newGap = nearestGridValue(currentGap, gridBase);

    // Store undo
    storeUndo(`normalize-gap-${node.id}`, node.id, 'layoutGap', currentGap);

    // In real implementation, would call Framer API
    console.log(`[Fix] Setting ${node.id} layoutGap from ${currentGap} to ${newGap}`);
}

/**
 * Set width to fill
 */
export async function setWidthToFill(node: FramerNode): Promise<void> {
    if (!('width' in node)) return;

    const currentWidth = node.width;

    // Store undo
    storeUndo(`set-width-fill-${node.id}`, node.id, 'width', currentWidth);

    console.log(`[Fix] Setting ${node.id} width from ${currentWidth} to 'fill'`);
}

/**
 * Set height to hug
 */
export async function setHeightToHug(node: FramerNode): Promise<void> {
    if (!('height' in node)) return;

    const currentHeight = node.height;

    // Store undo
    storeUndo(`set-height-hug-${node.id}`, node.id, 'height', currentHeight);

    console.log(`[Fix] Setting ${node.id} height from ${currentHeight} to 'hug'`);
}

/**
 * Convert to relative positioning
 */
export async function setPositionRelative(node: FramerNode): Promise<void> {
    if (!('position' in node)) return;

    const currentPosition = node.position;

    // Store undo
    storeUndo(`set-position-${node.id}`, node.id, 'position', currentPosition);

    console.log(`[Fix] Setting ${node.id} position from ${currentPosition} to 'relative'`);
}

/**
 * Make border radii uniform
 */
export async function unifyBorderRadii(
    nodes: FramerNode[],
    targetRadius: number
): Promise<void> {
    for (const node of nodes) {
        if (!isFrameNode(node)) continue;

        const currentRadius = node.borderRadius;

        // Store undo for each node
        storeUndo(`unify-radius-${node.id}`, node.id, 'borderRadius', currentRadius);

        console.log(`[Fix] Setting ${node.id} borderRadius to ${targetRadius}`);
    }
}

/**
 * Convert frame to auto-layout
 */
export async function convertToAutoLayout(
    node: FramerNode,
    direction: 'horizontal' | 'vertical',
    gap: number
): Promise<void> {
    if (!isFrameNode(node)) return;

    // Store undo
    storeUndo(`convert-auto-layout-${node.id}`, node.id, 'layoutMode', node.layoutMode);
    storeUndo(`convert-auto-layout-gap-${node.id}`, node.id, 'layoutGap', node.layoutGap);

    console.log(`[Fix] Converting ${node.id} to ${direction} auto-layout with gap ${gap}px`);
}
