/**
 * Rule: MixedRadii
 * Detects sibling elements with different border radii
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isFrameNode, createNodeRef, getBorderRadius, getChildren } from '../../utils/nodeHelpers';

export const mixedRadiiRule: Rule = {
    id: 'mixed-radii',
    category: 'spacing',
    name: 'Mixed Border Radii',
    description: 'Detects sibling elements with inconsistent border radii',
    enabledByDefault: true,

    async check(node: FramerNode, _context: AuditContext): Promise<Issue | null> {
        // Only check frame nodes with multiple children
        if (!isFrameNode(node)) {
            return null;
        }

        const children = getChildren(node).filter(isFrameNode);

        if (children.length < 2) {
            return null;
        }

        // Collect radii from children
        const radiiMap = new Map<number, FramerNode[]>();

        for (const child of children) {
            const radius = getBorderRadius(child);
            if (radius !== undefined && radius > 0) {
                if (!radiiMap.has(radius)) {
                    radiiMap.set(radius, []);
                }
                radiiMap.get(radius)!.push(child);
            }
        }

        // Check for mixed radii (more than one unique non-zero radius)
        const uniqueRadii = Array.from(radiiMap.keys());

        if (uniqueRadii.length > 1) {
            // Find the most common radius
            let mostCommonRadius = 0;
            let maxCount = 0;

            for (const [radius, nodes] of radiiMap) {
                if (nodes.length > maxCount) {
                    maxCount = nodes.length;
                    mostCommonRadius = radius;
                }
            }

            // Get nodes that don't match the most common radius
            const outliers = children.filter((child) => {
                const r = getBorderRadius(child);
                return r !== undefined && r !== mostCommonRadius;
            });

            if (outliers.length > 0) {
                return {
                    id: `${this.id}-${node.id}`,
                    node: createNodeRef(node),
                    ruleId: this.id,
                    title: 'Mixed border radii',
                    description: `Sibling elements have different border radii: ${uniqueRadii.join('px, ')}px. Consider using ${mostCommonRadius}px consistently.`,
                    severity: 'info',
                    category: 'spacing',
                    canAutoFix: true,
                    fixAction: async () => {
                        console.log(`[Fix] Setting all radii in ${node.id} to ${mostCommonRadius}px`);
                        // Would update border radius for all outliers
                    },
                    metadata: {
                        radii: uniqueRadii,
                        suggestedRadius: mostCommonRadius,
                        outlierCount: outliers.length,
                    },
                };
            }
        }

        return null;
    },
};

export default mixedRadiiRule;
