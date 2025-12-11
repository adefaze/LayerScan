/**
 * Rule: OversizedImage
 * Detects images where source resolution greatly exceeds rendered size
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isImageNode, createNodeRef, getNodeWidth, getNodeHeight } from '../../utils/nodeHelpers';

const OVERSIZE_THRESHOLD = 3; // 3x the rendered size

export const oversizedImageRule: Rule = {
    id: 'oversized-image',
    category: 'performance',
    name: 'Oversized Image',
    description: 'Detects images with resolution much larger than their displayed size',
    enabledByDefault: true,

    async check(node: FramerNode, _context: AuditContext): Promise<Issue | null> {
        // Only check image nodes
        if (!isImageNode(node)) {
            return null;
        }

        const renderedWidth = getNodeWidth(node);
        const renderedHeight = getNodeHeight(node);
        const naturalWidth = node.naturalWidth;
        const naturalHeight = node.naturalHeight;

        // Skip if we don't have all dimensions
        if (!renderedWidth || !renderedHeight || !naturalWidth || !naturalHeight) {
            return null;
        }

        // Calculate size ratio
        const widthRatio = naturalWidth / renderedWidth;
        const heightRatio = naturalHeight / renderedHeight;
        const maxRatio = Math.max(widthRatio, heightRatio);

        if (maxRatio > OVERSIZE_THRESHOLD) {
            const wastedPixels = (naturalWidth * naturalHeight) - (renderedWidth * renderedHeight);

            return {
                id: `${this.id}-${node.id}`,
                node: createNodeRef(node),
                ruleId: this.id,
                title: 'Oversized image asset',
                description: `Image is ${maxRatio.toFixed(1)}x larger than displayed (${naturalWidth}×${naturalHeight}px vs ${renderedWidth}×${renderedHeight}px). Consider optimizing for faster load times.`,
                severity: 'info',
                category: 'performance',
                canAutoFix: false, // Requires reimporting the image
                metadata: {
                    naturalWidth,
                    naturalHeight,
                    renderedWidth,
                    renderedHeight,
                    sizeRatio: maxRatio.toFixed(1),
                    wastedPixels,
                },
            };
        }

        return null;
    },
};

export default oversizedImageRule;
