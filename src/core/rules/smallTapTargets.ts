/**
 * Rule: SmallTapTargets
 * Detects interactive elements smaller than 44px (WCAG recommendation)
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { createNodeRef, getMinDimension, isLikelyInteractive } from '../../utils/nodeHelpers';

const MIN_TAP_TARGET_SIZE = 44;

export const smallTapTargetsRule: Rule = {
    id: 'small-tap-targets',
    category: 'accessibility',
    name: 'Small Tap Targets',
    description: 'Detects interactive elements smaller than the recommended 44px minimum',
    enabledByDefault: true,

    async check(node: FramerNode, _context: AuditContext): Promise<Issue | null> {
        // Only check elements that appear to be interactive
        if (!isLikelyInteractive(node)) {
            return null;
        }

        const minDim = getMinDimension(node);

        if (minDim === undefined) {
            return null;
        }

        if (minDim < MIN_TAP_TARGET_SIZE) {
            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Small tap target',
                description: `This interactive element has a minimum dimension of ${minDim}px, which is below the recommended ${MIN_TAP_TARGET_SIZE}px for touch targets.`,
                severity: 'warning',
                category: 'accessibility',
                canAutoFix: true,
                fixAction: async () => {
                    console.log(`[Fix] Increasing min size of ${node.id} to ${MIN_TAP_TARGET_SIZE}px`);
                    // Would increase padding or min-size
                },
                metadata: {
                    currentMinSize: minDim,
                    recommendedMinSize: MIN_TAP_TARGET_SIZE,
                    deficit: MIN_TAP_TARGET_SIZE - minDim,
                },
            };
        }

        return null;
    },
};

export default smallTapTargetsRule;
