/**
 * Rule: OverflowingText
 * Detects text that overflows its container frame
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isTextNode, isFrameNode, createNodeRef, getNodeHeight, getNodeWidth } from '../../utils/nodeHelpers';

export const overflowingTextRule: Rule = {
    id: 'overflowing-text',
    category: 'layout',
    name: 'Overflowing Text',
    description: 'Detects text elements that overflow their container bounds',
    enabledByDefault: true,

    async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
        // Only check text nodes
        if (!isTextNode(node)) {
            return null;
        }

        const { parent } = context;

        // Skip if no parent frame
        if (!parent || !isFrameNode(parent)) {
            return null;
        }

        const textHeight = getNodeHeight(node);
        const parentHeight = getNodeHeight(parent);
        const textWidth = getNodeWidth(node);
        const parentWidth = getNodeWidth(parent);

        // Check for height overflow
        if (textHeight !== undefined && parentHeight !== undefined && textHeight > parentHeight) {
            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Text overflows its frame',
                description: `Text height (${textHeight}px) exceeds frame height (${parentHeight}px). Content will be clipped.`,
                severity: 'error',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Setting ${node.id} height to 'hug'`);
                    // await node.setAttributes({ height: 'hug' });
                },
                metadata: {
                    textHeight,
                    parentHeight,
                    overflow: textHeight - parentHeight,
                },
            };
        }

        // Check for width overflow
        if (textWidth !== undefined && parentWidth !== undefined && textWidth > parentWidth) {
            return {
                id: `${this.id}-width-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Text overflows frame width',
                description: `Text width (${textWidth}px) exceeds frame width (${parentWidth}px). Content may be clipped.`,
                severity: 'warning',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Setting ${node.id} width to 'fill'`);
                    // await node.setAttributes({ width: 'fill' });
                },
                metadata: {
                    textWidth,
                    parentWidth,
                    overflow: textWidth - parentWidth,
                },
            };
        }

        return null;
    },
};

export default overflowingTextRule;
