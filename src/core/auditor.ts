/**
 * Layer Intelligence - Auditor
 * Main audit engine that runs rules against nodes
 */

import type { FramerNode, Issue, Rule, AuditResult, AuditContext, PluginSettings } from './types';
import { DEFAULT_SETTINGS } from './types';
import { allRules } from './rules';
import { getChildren } from '../utils/nodeHelpers';

/**
 * Run all enabled rules against a list of nodes
 */
export async function auditNodes(
    nodes: FramerNode[],
    settings: PluginSettings = DEFAULT_SETTINGS
): Promise<AuditResult> {
    const startTime = performance.now();
    const issues: Issue[] = [];
    const errors: string[] = [];
    const seenIssues = new Set<string>();

    // Get enabled rules
    const enabledRules = getEnabledRules(settings);

    // Build context - flatten nodes asynchronously using Framer API
    const allNodesFlat = await flattenNodes(nodes);

    for (const node of allNodesFlat) {
        const context = buildContext(node, allNodesFlat, settings);

        for (const rule of enabledRules) {
            try {
                const issue = await rule.check(node, context);

                if (issue) {
                    // Deduplicate by issue id
                    if (!seenIssues.has(issue.id)) {
                        seenIssues.add(issue.id);
                        issues.push(issue);
                    }
                }
            } catch (error) {
                const errorMsg = `Rule "${rule.id}" failed on node "${node.id}": ${error instanceof Error ? error.message : String(error)}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }
    }

    const durationMs = performance.now() - startTime;

    return {
        issues,
        nodesAudited: allNodesFlat.length,
        durationMs,
        errors: errors.length > 0 ? errors : undefined,
    };
}

/**
 * Flatten a node tree into a flat array using Framer API
 */
async function flattenNodes(nodes: FramerNode[]): Promise<FramerNode[]> {
    const result: FramerNode[] = [];

    async function traverse(node: FramerNode) {
        result.push(node);

        // Try to get children via Framer API
        try {
            const { framer } = await import('framer-plugin');
            const children = await framer.getChildren(node.id);
            if (children && Array.isArray(children)) {
                for (const child of children) {
                    await traverse(child as unknown as FramerNode);
                }
            }
        } catch (error) {
            // If API fails, try local children property
            const localChildren = getChildren(node);
            for (const child of localChildren) {
                await traverse(child);
            }
        }
    }

    for (const node of nodes) {
        await traverse(node);
    }

    return result;
}

/**
 * Build audit context for a node
 */
function buildContext(
    node: FramerNode,
    allNodes: FramerNode[],
    settings: PluginSettings
): AuditContext {
    // Find parent and siblings
    let parent: FramerNode | undefined;
    let siblings: FramerNode[] = [];

    for (const potentialParent of allNodes) {
        const children = getChildren(potentialParent);
        if (children.some((child) => child.id === node.id)) {
            parent = potentialParent;
            siblings = children.filter((child) => child.id !== node.id);
            break;
        }
    }

    return {
        allNodes,
        parent,
        siblings,
        settings,
    };
}

/**
 * Get list of enabled rules based on settings
 */
function getEnabledRules(settings: PluginSettings): Rule[] {
    return allRules.filter((rule: Rule) => {
        // If explicitly disabled, skip
        if (settings.disabledRules.includes(rule.id)) {
            return false;
        }

        // If specific rules are enabled, only use those
        if (settings.enabledRules.length > 0) {
            return settings.enabledRules.includes(rule.id);
        }

        // Otherwise, use default setting
        return rule.enabledByDefault;
    });
}

/**
 * Group issues by category for UI display
 */
export function groupIssuesByCategory(issues: Issue[]): Record<string, Issue[]> {
    const grouped: Record<string, Issue[]> = {
        layout: [],
        spacing: [],
        hierarchy: [],
        accessibility: [],
        performance: [],
    };

    for (const issue of issues) {
        if (grouped[issue.category]) {
            grouped[issue.category].push(issue);
        }
    }

    return grouped;
}

/**
 * Get count of auto-fixable issues
 */
export function getAutoFixableCount(issues: Issue[]): number {
    return issues.filter((issue) => issue.canAutoFix).length;
}

/**
 * Get issues sorted by severity (errors first, then warnings, then info)
 */
export function sortBySeverity(issues: Issue[]): Issue[] {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return [...issues].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
