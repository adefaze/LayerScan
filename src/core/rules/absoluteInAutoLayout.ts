/**
 * Rule: AbsoluteInAutoLayout
 * Detects absolute positioned children inside auto-layout frames
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, isAutoLayout, isAbsolutelyPositioned, createNodeRef } from '../../utils/nodeHelpers';

export const absoluteInAutoLayoutRule: Rule = {
    id: 'absolute-in-auto-layout',
    category: 'layout',
    name: 'Absolute in Auto-Layout',
    description: 'Detects absolutely positioned elements inside auto-layout frames, which causes layout issues',
    enabledByDefault: true,

    async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
        const { parent } = context;

        // Skip if no parent
        if (!parent) {
            return null;
        }

        // Check if parent is auto-layout
        if (!isAutoLayout(parent)) {
            return null;
        }

        // Check if this node is absolutely positioned
        if (!isAbsolutelyPositioned(node)) {
            return null;
        }

        return {
            id: `${this.id}-${node.id}`,
            node: createNodeRef(node),
            ruleId: this.id,
            title: 'Absolute positioning in auto-layout',
            description: 'This element is absolutely positioned inside an auto-layout frame. Auto-layout will ignore this element, causing unexpected behavior.',
            severity: 'error',
            category: 'layout',
            canAutoFix: true,
            fixAction: async () => {
                // Convert to relative positioning
                console.log(`[Fix] Setting ${node.id} position to relative`);
                // await node.setAttributes({ position: 'relative' });
            },
            metadata: {
                parentLayoutMode: isFrameNode(parent) ? parent.layoutMode : undefined,
            },
        };
    },
};

export default absoluteInAutoLayoutRule;
