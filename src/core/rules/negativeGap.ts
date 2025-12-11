/**
 * Rule: NegativeGap
 * Detects negative or extremely large gaps in auto-layout frames
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, isAutoLayout, getLayoutGap, createNodeRef, nearestGridValue } from '../../utils/nodeHelpers';

export const negativeGapRule: Rule = {
    id: 'negative-gap',
    category: 'layout',
    name: 'Invalid Gap',
    description: 'Detects negative or unusually large gaps in auto-layout frames',
    enabledByDefault: true,

    async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
        // Only check frame nodes with auto-layout
        if (!isFrameNode(node) || !isAutoLayout(node)) {
            return null;
        }

        const gap = getLayoutGap(node);

        // Skip if no gap defined
        if (gap === undefined) {
            return null;
        }

        // Check for negative gap
        if (gap < 0) {
            const suggestedGap = nearestGridValue(Math.abs(gap), context.settings.spacingGrid);

            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Negative gap value',
                description: `This frame has a negative gap of ${gap}px, which may cause overlapping elements.`,
                severity: 'warning',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Setting ${node.id} gap to ${suggestedGap}`);
                    // await node.setAttributes({ layoutGap: suggestedGap });
                },
                metadata: {
                    currentGap: gap,
                    suggestedGap,
                },
            };
        }

        // Check for unusually large gap (> 100px)
        if (gap > 100) {
            const suggestedGap = nearestGridValue(gap, context.settings.spacingGrid);

            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Unusually large gap',
                description: `This frame has a very large gap of ${gap}px. Consider if this is intentional.`,
                severity: 'info',
                category: 'layout',
                canAutoFix: false,
                metadata: {
                    currentGap: gap,
                    suggestedGap,
                },
            };
        }

        return null;
    },
};

export default negativeGapRule;
