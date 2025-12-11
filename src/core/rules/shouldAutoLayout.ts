/**
 * Rule: ShouldAutoLayout
 * Detects evenly spaced children that should use auto-layout
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, isAutoLayout, createNodeRef, getChildren, nearestGridValue } from '../../utils/nodeHelpers';

const ALIGNMENT_THRESHOLD = 5; // pixels
const MIN_CHILDREN = 3;

export const shouldAutoLayoutRule: Rule = {
    id: 'should-auto-layout',
    category: 'layout',
    name: 'Should Use Auto-Layout',
    description: 'Detects manually positioned children that could benefit from auto-layout',
    enabledByDefault: true,

    async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
        // Only check frame nodes
        if (!isFrameNode(node)) {
            return null;
        }

        // Skip if already using auto-layout
        if (isAutoLayout(node)) {
            return null;
        }

        const children = getChildren(node);

        if (children.length < MIN_CHILDREN) {
            return null;
        }

        // Analyze child positions
        const positions = children.map((child) => ({
            x: 'x' in child && typeof child.x === 'number' ? child.x : 0,
            y: 'y' in child && typeof child.y === 'number' ? child.y : 0,
            width: 'width' in child && typeof child.width === 'number' ? child.width : 0,
            height: 'height' in child && typeof child.height === 'number' ? child.height : 0,
        }));

        // Check for horizontal alignment
        const horizontalResult = checkHorizontalAlignment(positions);
        if (horizontalResult.aligned) {
            const suggestedGap = nearestGridValue(horizontalResult.avgGap, context.settings.spacingGrid);

            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Consider horizontal auto-layout',
                description: `These ${children.length} children are evenly spaced horizontally. Converting to auto-layout would improve maintainability.`,
                severity: 'info',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Converting ${node.id} to horizontal auto-layout with gap ${suggestedGap}px`);
                    // Would set layoutMode: 'horizontal', layoutGap: suggestedGap
                },
                metadata: {
                    direction: 'horizontal',
                    suggestedGap,
                    childCount: children.length,
                },
            };
        }

        // Check for vertical alignment
        const verticalResult = checkVerticalAlignment(positions);
        if (verticalResult.aligned) {
            const suggestedGap = nearestGridValue(verticalResult.avgGap, context.settings.spacingGrid);

            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Consider vertical auto-layout',
                description: `These ${children.length} children are evenly spaced vertically. Converting to auto-layout would improve maintainability.`,
                severity: 'info',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Converting ${node.id} to vertical auto-layout with gap ${suggestedGap}px`);
                    // Would set layoutMode: 'vertical', layoutGap: suggestedGap
                },
                metadata: {
                    direction: 'vertical',
                    suggestedGap,
                    childCount: children.length,
                },
            };
        }

        return null;
    },
};

interface Position {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface AlignmentResult {
    aligned: boolean;
    avgGap: number;
}

function checkHorizontalAlignment(positions: Position[]): AlignmentResult {
    // Sort by x position
    const sorted = [...positions].sort((a, b) => a.x - b.x);

    // Check if y positions are aligned
    const firstY = sorted[0].y;
    const yAligned = sorted.every((p) => Math.abs(p.y - firstY) < ALIGNMENT_THRESHOLD);

    if (!yAligned) {
        return { aligned: false, avgGap: 0 };
    }

    // Calculate gaps
    const gaps: number[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1].x - (sorted[i].x + sorted[i].width);
        gaps.push(gap);
    }

    // Check if gaps are consistent
    if (gaps.length === 0) {
        return { aligned: false, avgGap: 0 };
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const gapsConsistent = gaps.every((g) => Math.abs(g - avgGap) < ALIGNMENT_THRESHOLD);

    return { aligned: gapsConsistent, avgGap };
}

function checkVerticalAlignment(positions: Position[]): AlignmentResult {
    // Sort by y position
    const sorted = [...positions].sort((a, b) => a.y - b.y);

    // Check if x positions are aligned
    const firstX = sorted[0].x;
    const xAligned = sorted.every((p) => Math.abs(p.x - firstX) < ALIGNMENT_THRESHOLD);

    if (!xAligned) {
        return { aligned: false, avgGap: 0 };
    }

    // Calculate gaps
    const gaps: number[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1].y - (sorted[i].y + sorted[i].height);
        gaps.push(gap);
    }

    // Check if gaps are consistent
    if (gaps.length === 0) {
        return { aligned: false, avgGap: 0 };
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const gapsConsistent = gaps.every((g) => Math.abs(g - avgGap) < ALIGNMENT_THRESHOLD);

    return { aligned: gapsConsistent, avgGap };
}

export default shouldAutoLayoutRule;
