/**
 * Layer Intelligence - Core Types
 * Type definitions for the audit engine, issues, and node references
 */

// ============================================================================
// Severity & Categories
// ============================================================================

export type Severity = 'info' | 'warning' | 'error';

export type IssueCategory =
    | 'layout'
    | 'spacing'
    | 'hierarchy'
    | 'accessibility'
    | 'performance';

// ============================================================================
// Node Reference
// ============================================================================

/**
 * Reference to a node in the Framer canvas
 */
export interface NodeRef {
    /** Unique node identifier */
    id: string;
    /** Display name of the node */
    name?: string;
    /** Node type (frame, text, image, component, etc.) */
    type?: string;
    /** Human-readable path in the layer tree (e.g., "Page > Section > Frame") */
    path?: string;
}

// ============================================================================
// Issue
// ============================================================================

/**
 * An issue detected by an audit rule
 */
export interface Issue {
    /** Unique issue identifier (usually ruleId + nodeId) */
    id: string;
    /** Reference to the affected node */
    node: NodeRef;
    /** ID of the rule that detected this issue */
    ruleId: string;
    /** Short issue title */
    title: string;
    /** Detailed description of the issue */
    description: string;
    /** Issue severity level */
    severity: Severity;
    /** Issue category for grouping */
    category: IssueCategory;
    /** Whether this issue can be automatically fixed */
    canAutoFix: boolean;
    /** Function to apply the fix (undefined if canAutoFix is false) */
    fixAction?: () => Promise<void>;
    /** Additional metadata (e.g., expected vs actual values) */
    metadata?: Record<string, unknown>;
}

// ============================================================================
// Rules
// ============================================================================

/**
 * A rule that checks nodes for specific issues
 */
export interface Rule {
    /** Unique rule identifier */
    id: string;
    /** Rule category */
    category: IssueCategory;
    /** Human-readable rule name */
    name: string;
    /** Rule description */
    description: string;
    /** Whether the rule is enabled by default */
    enabledByDefault: boolean;
    /** Check a node and return an issue if found */
    check: (node: FramerNode, context: AuditContext) => Promise<Issue | null>;
}

// ============================================================================
// Framer Node Types (approximation based on Framer Plugin API)
// ============================================================================

/**
 * Base properties shared by all Framer nodes
 */
export interface FramerNodeBase {
    id: string;
    name?: string;
    visible?: boolean;
    locked?: boolean;
}

/**
 * Frame/container node properties
 */
export interface FramerFrameNode extends FramerNodeBase {
    __class: 'FrameNode';
    width?: number | 'fill' | 'hug';
    height?: number | 'fill' | 'hug';
    x?: number;
    y?: number;
    rotation?: number;
    opacity?: number;
    borderRadius?: number | { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number };
    backgroundColor?: string;

    // Layout properties
    layoutMode?: 'none' | 'horizontal' | 'vertical';
    layoutAlign?: 'start' | 'center' | 'end' | 'stretch';
    layoutGap?: number;
    padding?: number | { top: number; right: number; bottom: number; left: number };

    // Positioning
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky';

    // Children
    children?: FramerNode[];
}

/**
 * Text node properties
 */
export interface FramerTextNode extends FramerNodeBase {
    __class: 'TextNode';
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number | string;
    lineHeight?: number | string;
    letterSpacing?: number;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    width?: number | 'fill' | 'hug';
    height?: number | 'fill' | 'hug';
    x?: number;
    y?: number;
}

/**
 * Image node properties
 */
export interface FramerImageNode extends FramerNodeBase {
    __class: 'ImageNode';
    src?: string;
    width?: number | 'fill';
    height?: number | 'fill';
    x?: number;
    y?: number;
    naturalWidth?: number;
    naturalHeight?: number;
}

/**
 * Component instance node
 */
export interface FramerComponentNode extends FramerNodeBase {
    __class: 'ComponentNode';
    componentId?: string;
    width?: number | 'fill' | 'hug';
    height?: number | 'fill' | 'hug';
    x?: number;
    y?: number;
    children?: FramerNode[];
}

/**
 * Union type for all Framer node types
 */
export type FramerNode =
    | FramerFrameNode
    | FramerTextNode
    | FramerImageNode
    | FramerComponentNode;

// ============================================================================
// Audit Context & Results
// ============================================================================

/**
 * Context passed to rules during audit
 */
export interface AuditContext {
    /** All nodes being audited */
    allNodes: FramerNode[];
    /** Parent node (if available) */
    parent?: FramerNode;
    /** Sibling nodes (if available) */
    siblings?: FramerNode[];
    /** User settings */
    settings: PluginSettings;
}

/**
 * Result of an audit operation
 */
export interface AuditResult {
    /** All issues found */
    issues: Issue[];
    /** Number of nodes audited */
    nodesAudited: number;
    /** Time taken in milliseconds */
    durationMs: number;
    /** Any errors that occurred during audit */
    errors?: string[];
}

// ============================================================================
// Plugin Settings
// ============================================================================

/**
 * User-configurable plugin settings
 */
export interface PluginSettings {
    /** Spacing grid base (4 or 8) */
    spacingGrid: 4 | 8;
    /** Whether to show confirmation before auto-fixes */
    confirmAutoFix: boolean;
    /** Enabled rule IDs (empty = all enabled by default) */
    enabledRules: string[];
    /** Disabled rule IDs */
    disabledRules: string[];
    /** Whether analytics are enabled (opt-in) */
    analyticsEnabled: boolean;
    /** Maximum issues to display before "show all" */
    maxDisplayedIssues: number;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: PluginSettings = {
    spacingGrid: 8,
    confirmAutoFix: true,
    enabledRules: [],
    disabledRules: [],
    analyticsEnabled: false,
    maxDisplayedIssues: 100,
};

// ============================================================================
// UI State
// ============================================================================

/**
 * Panel/UI state for the plugin
 */
export interface PluginState {
    /** Whether an audit is currently running */
    isAuditing: boolean;
    /** Current audit results */
    auditResult: AuditResult | null;
    /** Currently selected node IDs in Framer */
    selectedNodeIds: string[];
    /** Currently highlighted issue (for hover states) */
    highlightedIssueId: string | null;
    /** Whether settings modal is open */
    settingsOpen: boolean;
    /** Current settings */
    settings: PluginSettings;
    /** Last error message */
    error: string | null;
}

/**
 * Grouped issues by category for UI display
 */
export interface GroupedIssues {
    layout: Issue[];
    spacing: Issue[];
    hierarchy: Issue[];
    accessibility: Issue[];
    performance: Issue[];
}
