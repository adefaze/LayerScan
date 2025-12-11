/**
 * Layer Intelligence - Rules Index
 * Export all audit rules
 */

import type { Rule } from '../types';

import { fixedInsideFillRule } from './fixedInsideFill';
import { absoluteInAutoLayoutRule } from './absoluteInAutoLayout';
import { negativeGapRule } from './negativeGap';
import { unnecessaryNestingRule } from './unnecessaryNesting';
import { overflowingTextRule } from './overflowingText';
import { inconsistentSpacingRule } from './inconsistentSpacing';
import { mixedRadiiRule } from './mixedRadii';
import { lowContrastTextRule } from './lowContrastText';
import { smallTapTargetsRule } from './smallTapTargets';
import { oversizedImageRule } from './oversizedImage';
import { componentCandidateRule } from './componentCandidate';
import { shouldAutoLayoutRule } from './shouldAutoLayout';

/**
 * All available audit rules
 */
export const allRules: Rule[] = [
    // Layout rules
    fixedInsideFillRule,
    absoluteInAutoLayoutRule,
    negativeGapRule,
    unnecessaryNestingRule,
    overflowingTextRule,
    shouldAutoLayoutRule,

    // Spacing rules
    inconsistentSpacingRule,
    mixedRadiiRule,

    // Accessibility rules
    lowContrastTextRule,
    smallTapTargetsRule,

    // Performance rules
    oversizedImageRule,

    // Hierarchy/heuristic rules
    componentCandidateRule,
];

/**
 * Get rules by category
 */
export function getRulesByCategory(category: string): Rule[] {
    return allRules.filter((rule) => rule.category === category);
}

/**
 * Get a rule by ID
 */
export function getRuleById(id: string): Rule | undefined {
    return allRules.find((rule) => rule.id === id);
}

/**
 * Export individual rules
 */
export {
    fixedInsideFillRule,
    absoluteInAutoLayoutRule,
    negativeGapRule,
    unnecessaryNestingRule,
    overflowingTextRule,
    inconsistentSpacingRule,
    mixedRadiiRule,
    lowContrastTextRule,
    smallTapTargetsRule,
    oversizedImageRule,
    componentCandidateRule,
    shouldAutoLayoutRule,
};
