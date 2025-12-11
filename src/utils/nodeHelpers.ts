/**
 * Layer Intelligence - Node Helpers
 * Utility functions for safely reading and manipulating Framer nodes
 */

import type { FramerNode, FramerFrameNode, NodeRef } from '../core/types';

// ============================================================================
// Type Guards
// ============================================================================

export function isFrameNode(node: FramerNode): node is FramerFrameNode {
    return node.__class === 'FrameNode';
}

export function isTextNode(node: FramerNode): node is FramerNode & { __class: 'TextNode' } {
    return node.__class === 'TextNode';
}

export function isImageNode(node: FramerNode): node is FramerNode & { __class: 'ImageNode' } {
    return node.__class === 'ImageNode';
}

export function isComponentNode(node: FramerNode): node is FramerNode & { __class: 'ComponentNode' } {
    return node.__class === 'ComponentNode';
}

// ============================================================================
// Node Properties
// ============================================================================

/**
 * Parse a dimension value from Framer (can be number, string like "109px", or "fill")
 */
export function parseDimension(value: unknown): number | 'fill' | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        if (value === 'fill' || value === '1fr') return 'fill';
        // Parse "109px" format
        const match = value.match(/^([0-9.]+)px$/);
        if (match) return parseFloat(match[1]);
        // Try parsing as plain number
        const num = parseFloat(value);
        if (!isNaN(num)) return num;
    }
    return undefined;
}

/**
 * Get the width of a node as a number (or undefined if not available)
 */
export function getNodeWidth(node: FramerNode): number | undefined {
    if ('width' in node) {
        const parsed = parseDimension(node.width);
        return typeof parsed === 'number' ? parsed : undefined;
    }
    return undefined;
}

/**
 * Get the height of a node as a number (or undefined if not available)
 */
export function getNodeHeight(node: FramerNode): number | undefined {
    if ('height' in node) {
        const parsed = parseDimension(node.height);
        return typeof parsed === 'number' ? parsed : undefined;
    }
    return undefined;
}

/**
 * Check if a node has fixed dimensions (numeric pixels, not fill/auto)
 */
export function hasFixedWidth(node: FramerNode): boolean {
    if ('width' in node) {
        const parsed = parseDimension(node.width);
        return typeof parsed === 'number';
    }
    return false;
}

export function hasFixedHeight(node: FramerNode): boolean {
    if ('height' in node) {
        const parsed = parseDimension(node.height);
        return typeof parsed === 'number';
    }
    return false;
}

/**
 * Check if node width is set to fill
 */
export function isFillWidth(node: FramerNode): boolean {
    if ('width' in node) {
        const parsed = parseDimension(node.width);
        return parsed === 'fill';
    }
    return false;
}

export function isFillHeight(node: FramerNode): boolean {
    if ('height' in node) {
        const parsed = parseDimension(node.height);
        return parsed === 'fill';
    }
    return false;
}

/**
 * Check if node is using auto-layout
 */
export function isAutoLayout(node: FramerNode): boolean {
    if (isFrameNode(node)) {
        return node.layoutMode === 'horizontal' || node.layoutMode === 'vertical';
    }
    return false;
}

/**
 * Check if node has absolute positioning
 */
export function isAbsolutelyPositioned(node: FramerNode): boolean {
    if ('position' in node) {
        return node.position === 'absolute';
    }
    return false;
}

/**
 * Get the layout gap of a frame node
 */
export function getLayoutGap(node: FramerNode): number | undefined {
    if (isFrameNode(node)) {
        return node.layoutGap;
    }
    return undefined;
}

/**
 * Get border radius as a single number (average if different corners)
 */
export function getBorderRadius(node: FramerNode): number | undefined {
    if (!isFrameNode(node)) return undefined;

    const radius = node.borderRadius;
    if (typeof radius === 'number') return radius;
    if (radius && typeof radius === 'object') {
        const { topLeft, topRight, bottomRight, bottomLeft } = radius;
        return (topLeft + topRight + bottomRight + bottomLeft) / 4;
    }
    return undefined;
}

// ============================================================================
// Node Path & References
// ============================================================================

/**
 * Build a human-readable path for a node
 */
export function buildNodePath(node: FramerNode, ancestors: FramerNode[] = []): string {
    const names = [...ancestors.map((n) => n.name || 'Unnamed'), node.name || 'Unnamed'];
    return names.join(' > ');
}

/**
 * Create a NodeRef from a FramerNode
 */
export function createNodeRef(node: FramerNode, path?: string): NodeRef {
    return {
        id: node.id,
        name: node.name,
        type: node.__class.replace('Node', '').toLowerCase(),
        path,
    };
}

// ============================================================================
// Children & Siblings
// ============================================================================

/**
 * Get children of a node (empty array if no children)
 */
export function getChildren(node: FramerNode): FramerNode[] {
    if ('children' in node && Array.isArray(node.children)) {
        return node.children;
    }
    return [];
}

/**
 * Check if a node has children
 */
export function hasChildren(node: FramerNode): boolean {
    return getChildren(node).length > 0;
}

/**
 * Get visible children only
 */
export function getVisibleChildren(node: FramerNode): FramerNode[] {
    return getChildren(node).filter((child) => child.visible !== false);
}

/**
 * Flatten all descendants of a node
 */
export function getAllDescendants(node: FramerNode): FramerNode[] {
    const descendants: FramerNode[] = [];
    const children = getChildren(node);

    for (const child of children) {
        descendants.push(child);
        descendants.push(...getAllDescendants(child));
    }

    return descendants;
}

// ============================================================================
// Spacing & Layout Analysis
// ============================================================================

/**
 * Get padding as an object with all sides
 */
export function getPadding(node: FramerNode): { top: number; right: number; bottom: number; left: number } | undefined {
    if (!isFrameNode(node)) return undefined;

    const padding = node.padding;
    if (typeof padding === 'number') {
        return { top: padding, right: padding, bottom: padding, left: padding };
    }
    if (padding && typeof padding === 'object') {
        return padding;
    }
    return undefined;
}

/**
 * Calculate the nearest value on a spacing grid
 */
export function nearestGridValue(value: number, gridBase: 4 | 8): number {
    return Math.round(value / gridBase) * gridBase;
}

/**
 * Check if a value is on the spacing grid
 */
export function isOnGrid(value: number, gridBase: 4 | 8): boolean {
    return value % gridBase === 0;
}

// ============================================================================
// Accessibility Helpers
// ============================================================================

/**
 * Calculate the smaller dimension (for tap target checks)
 */
export function getMinDimension(node: FramerNode): number | undefined {
    const width = getNodeWidth(node);
    const height = getNodeHeight(node);

    if (width !== undefined && height !== undefined) {
        return Math.min(width, height);
    }
    return width ?? height;
}

/**
 * Check if a node is likely interactive (button-like)
 */
export function isLikelyInteractive(node: FramerNode): boolean {
    const name = (node.name || '').toLowerCase();
    const interactiveKeywords = ['button', 'btn', 'link', 'cta', 'click', 'tap', 'toggle', 'checkbox', 'radio', 'input'];
    return interactiveKeywords.some((keyword) => name.includes(keyword));
}

// ============================================================================
// Color Helpers
// ============================================================================

/**
 * Parse a color string and return RGB values
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
    // Handle hex colors
    const hexMatch = color.match(/^#([0-9a-fA-F]{6})$/);
    if (hexMatch) {
        const hex = hexMatch[1];
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
        };
    }

    // Handle rgb/rgba
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
        };
    }

    return null;
}

/**
 * Calculate relative luminance from RGB values
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number | null {
    const rgb1 = parseColor(color1);
    const rgb2 = parseColor(color2);

    if (!rgb1 || !rgb2) return null;

    const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}
