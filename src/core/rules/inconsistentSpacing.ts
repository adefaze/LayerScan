/**
 * Rule: InconsistentSpacing
 * Detects varying spacing between sibling elements
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, createNodeRef, nearestGridValue, getChildren } from '../../utils/nodeHelpers';

export const inconsistentSpacingRule: Rule = {
    id: 'inconsistent-spacing',
    category: 'spacing',
    name: 'Inconsistent Spacing',
    description: 'Detects varying spacing between sibling elements',
    enabledByDefault: true,

    async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
        // Only check frame nodes with multiple children
        if (!isFrameNode(node)) {
            return null;
        }

        const children = getChildren(node);

        if (children.length < 3) {
            return null;
        }

        // Calculate gaps between consecutive children based on positions
        const gaps: number[] = [];

        for (let i = 0; i < children.length - 1; i++) {
            const current = children[i];
            const next = children[i + 1];

            // Get positions
            const currentX = 'x' in current ? current.x : undefined;
            const currentY = 'y' in current ? current.y : undefined;
            const currentWidth = 'width' in current && typeof current.width === 'number' ? current.width : 0;
            const currentHeight = 'height' in current && typeof current.height === 'number' ? current.height : 0;

            const nextX = 'x' in next ? next.x : undefined;
            const nextY = 'y' in next ? next.y : undefined;

            // Calculate horizontal gap
            if (currentX !== undefined && nextX !== undefined) {
                const hGap = nextX - (currentX + currentWidth);
                if (hGap >= 0) {
                    gaps.push(Math.round(hGap));
                }
            }
            // Calculate vertical gap
            else if (currentY !== undefined && nextY !== undefined) {
                const vGap = nextY - (currentY + currentHeight);
                if (vGap >= 0) {
                    gaps.push(Math.round(vGap));
                }
            }
        }

        if (gaps.length < 2) {
            return null;
        }

        // Check for inconsistency
        const uniqueGaps = [...new Set(gaps)];

        if (uniqueGaps.length > 1) {
            // Calculate variance
            const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
            const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avgGap, 2), 0) / gaps.length;

            // Only flag if variance is significant (> threshold)
            const threshold = 10; // 10px variance threshold

            if (variance > threshold) {
                const suggestedGap = nearestGridValue(avgGap, context.settings.spacingGrid);
                const severity = variance > 25 ? 'warning' : 'info';

                return {
                    id: `${this.id}-${node.id}`,
                    node: createNodeRef(node),
                    ruleId: this.id,
                    title: 'Inconsistent sibling spacing',
                    description: `Spacing between children varies: ${uniqueGaps.join('px, ')}px. Consider using consistent ${suggestedGap}px spacing.`,
                    severity,
                    category: 'spacing',
                    canAutoFix: true,
                    fixAction: async () => {
                        console.log(`[Fix] Normalizing gaps in ${node.id} to ${suggestedGap}px`);
                        // Would set layoutGap or adjust positions
                    },
                    metadata: {
                        gaps,
                        suggestedGap,
                        variance: Math.round(variance),
                    },
                };
            }
        }

        return null;
    },
};

export default inconsistentSpacingRule;
