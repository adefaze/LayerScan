/**
 * Rule: LowContrastText
 * Flags text for manual contrast verification
 * Note: Framer's plugin API doesn't expose text color data,
 * so this rule suggests manual verification for accessibility
 */

import type { Rule, Issue, FramerNode, AuditContext } from '../types';
import { isTextNode, createNodeRef } from '../../utils/nodeHelpers';

export const lowContrastTextRule: Rule = {
    id: 'low-contrast-text',
    category: 'accessibility',
    name: 'Check Text Contrast',
    description: 'Flags text elements for manual contrast verification (WCAG AA)',
    enabledByDefault: false, // Disabled by default since it's manual check only

    async check(node: FramerNode, _context: AuditContext): Promise<Issue | null> {
        // Only check text nodes
        if (!isTextNode(node)) {
            return null;
        }

        // Since Framer API doesn't expose text colors, flag for manual check
        // This rule is disabled by default and can be enabled by users who want reminders
        return {
            id: `${this.id}-${node.id}`,
            node: createNodeRef(node),
            ruleId: this.id,
            title: 'Verify text contrast',
            description: 'Check that this text meets WCAG AA contrast requirements (4.5:1 for body text, 3:1 for large text). Use a contrast checker tool to verify.',
            severity: 'info',
            category: 'accessibility',
            canAutoFix: false,
            metadata: {
                recommendation: 'Use WebAIM Contrast Checker or similar tool',
                wcagRequirement: '4.5:1 for body text, 3:1 for 18px+ or 14px+ bold',
            },
        };
    },
};

export default lowContrastTextRule;
