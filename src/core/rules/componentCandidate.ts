/**
 * Rule: ComponentCandidate
 * Detects repeated group structures that could be components
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, createNodeRef, getChildren } from '../../utils/nodeHelpers';

const MIN_REPETITIONS = 3;

export const componentCandidateRule: Rule = {
    id: 'component-candidate',
    category: 'hierarchy',
    name: 'Component Candidate',
    description: 'Detects repeated structures that could be converted to components',
    enabledByDefault: true,

    async check(node: FramerNode, _context: AuditContext): Promise<Issue | null> {
        // Only check frame nodes with multiple children
        if (!isFrameNode(node)) {
            return null;
        }

        const children = getChildren(node).filter(isFrameNode);

        if (children.length < MIN_REPETITIONS) {
            return null;
        }

        // Create structure signatures for children
        const signatures = children.map((child) => getStructureSignature(child));

        // Count occurrences of each signature
        const signatureCounts = new Map<string, number>();

        for (const sig of signatures) {
            signatureCounts.set(sig, (signatureCounts.get(sig) || 0) + 1);
        }

        // Find signatures that repeat
        for (const [signature, count] of signatureCounts) {
            if (count >= MIN_REPETITIONS && signature !== 'empty') {
                return {
                    id: `${this.id}-${node.id}`,
                    node: createNodeRef(node),
                    ruleId: this.id,
                    title: 'Repeated structure detected',
                    description: `This frame contains ${count} similar child structures. Consider converting them to a reusable component.`,
                    severity: 'info',
                    category: 'hierarchy',
                    canAutoFix: false, // Component creation requires user judgment
                    metadata: {
                        repetitionCount: count,
                        signature,
                    },
                };
            }
        }

        return null;
    },
};

/**
 * Generate a signature for a node's structure (children types and names)
 */
function getStructureSignature(node: FramerNode): string {
    const children = getChildren(node);

    if (children.length === 0) {
        return 'empty';
    }

    // Create signature from child types
    const childSignatures = children.map((child) => {
        const type = child.__class.replace('Node', '');
        const hasChildren = getChildren(child).length > 0;
        return `${type}${hasChildren ? '+' : ''}`;
    });

    return childSignatures.join(',');
}

export default componentCandidateRule;
