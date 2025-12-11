/**
 * Rule: FixedInsideFill
 * Detects when a child has fixed width while parent uses fill/fluid width
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, hasFixedWidth, isFillWidth, createNodeRef } from '../../utils/nodeHelpers';

export const fixedInsideFillRule: Rule = {
    id: 'fixed-inside-fill',
    category: 'layout',
    name: 'Fixed Inside Fill',
    description: 'Detects fixed-width children inside fill-width parents, which breaks responsiveness',
    enabledByDefault: true,

    async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
        const { parent } = context;

        // Skip if no parent or parent isn't a frame
        if (!parent || !isFrameNode(parent)) {
            return null;
        }

        // Check if parent has fill width
        if (!isFillWidth(parent)) {
            return null;
        }

        // Check if this node has fixed width
        if (!hasFixedWidth(node)) {
            return null;
        }

        // Get the fixed width value
        const fixedWidth = 'width' in node && typeof node.width === 'number' ? node.width : 0;

        return {
            id: `${this.id}-${node.id}`,
            node: createNodeRef(node),
            ruleId: this.id,
            title: 'Fixed width inside fluid parent',
            description: `This element has a fixed width of ${fixedWidth}px inside a parent with fill width, which may break responsiveness.`,
            severity: 'warning',
            category: 'layout',
            canAutoFix: true,
            fixAction: async () => {
                // In real implementation, this would call Framer API to set width to 'fill' or 'hug'
                console.log(`[Fix] Setting ${node.id} width to fill`);
                // await node.setAttributes({ width: 'fill' });
            },
            metadata: {
                fixedWidth,
                parentId: parent.id,
                suggestedFix: 'fill',
            },
        };
    },
};

export default fixedInsideFillRule;
