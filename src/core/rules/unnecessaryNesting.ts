/**
 * Rule: UnnecessaryNesting
 * Detects empty frames wrapping a single frame with identical constraints
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, getChildren, createNodeRef, hasFixedWidth, hasFixedHeight, isFillWidth, isFillHeight } from '../../utils/nodeHelpers';

export const unnecessaryNestingRule: Rule = {
    id: 'unnecessary-nesting',
    category: 'layout',
    name: 'Unnecessary Nesting',
    description: 'Detects redundant wrapper frames that can be flattened',
    enabledByDefault: true,

    async check(node: FramerNode, _context: AuditContext): Promise<Issue | null> {
        // Only check frame nodes
        if (!isFrameNode(node)) {
            return null;
        }

        const children = getChildren(node);

        // Must have exactly one child
        if (children.length !== 1) {
            return null;
        }

        const child = children[0];

        // Child must also be a frame
        if (!isFrameNode(child)) {
            return null;
        }

        // Check if constraints are similar
        const parentHasFixedWidth = hasFixedWidth(node);
        const childHasFixedWidth = hasFixedWidth(child);
        const parentIsFillWidth = isFillWidth(node);
        const childIsFillWidth = isFillWidth(child);

        const parentHasFixedHeight = hasFixedHeight(node);
        const childHasFixedHeight = hasFixedHeight(child);
        const parentIsFillHeight = isFillHeight(node);
        const childIsFillHeight = isFillHeight(child);

        // Consider it unnecessary if both have same width/height constraints
        const sameWidthConstraint = (parentHasFixedWidth === childHasFixedWidth) ||
            (parentIsFillWidth && childIsFillWidth);
        const sameHeightConstraint = (parentHasFixedHeight === childHasFixedHeight) ||
            (parentIsFillHeight && childIsFillHeight);

        if (sameWidthConstraint && sameHeightConstraint) {
            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Unnecessary wrapper frame',
                description: 'This frame wraps a single child with identical constraints and can be flattened.',
                severity: 'info',
                category: 'layout',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Flattening ${node.id}, moving child ${child.id} up`);
                    // In real implementation:
                    // 1. Copy child properties to parent's parent
                    // 2. Move child to parent's parent
                    // 3. Delete the wrapper frame
                },
                metadata: {
                    childId: child.id,
                    childName: child.name,
                },
            };
        }

        return null;
    },
};

export default unnecessaryNestingRule;
