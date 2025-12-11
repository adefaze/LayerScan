/**
 * Layer Intelligence - Rules Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import { fixedInsideFillRule } from '../src/core/rules/fixedInsideFill';
import { absoluteInAutoLayoutRule } from '../src/core/rules/absoluteInAutoLayout';
import { negativeGapRule } from '../src/core/rules/negativeGap';
import { overflowingTextRule } from '../src/core/rules/overflowingText';
import { inconsistentSpacingRule } from '../src/core/rules/inconsistentSpacing';
import { smallTapTargetsRule } from '../src/core/rules/smallTapTargets';
import { shouldAutoLayoutRule } from '../src/core/rules/shouldAutoLayout';
import type { FramerNode, FramerFrameNode, AuditContext, PluginSettings } from '../src/core/types';
import { DEFAULT_SETTINGS } from '../src/core/types';

// Mock context factory
function createContext(
    parent?: FramerNode,
    siblings?: FramerNode[],
    settings: PluginSettings = DEFAULT_SETTINGS
): AuditContext {
    return {
        allNodes: [],
        parent,
        siblings: siblings ?? [],
        settings,
    };
}

// Mock node factories
function createFrameNode(overrides: Partial<FramerFrameNode> = {}): FramerFrameNode {
    return {
        __class: 'FrameNode',
        id: `frame-${Math.random().toString(36).slice(2)}`,
        name: 'Test Frame',
        visible: true,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        children: [],
        ...overrides,
    };
}

function createTextNode(overrides: Partial<FramerNode> = {}): FramerNode {
    return {
        __class: 'TextNode',
        id: `text-${Math.random().toString(36).slice(2)}`,
        name: 'Test Text',
        visible: true,
        width: 100,
        height: 20,
        x: 0,
        y: 0,
        text: 'Sample text',
        ...overrides,
    } as FramerNode;
}

// ============================================================================
// FixedInsideFill Rule Tests
// ============================================================================

describe('FixedInsideFill Rule', () => {
    it('should detect fixed-width child inside fill parent', async () => {
        const parent = createFrameNode({ width: 'fill' });
        const child = createFrameNode({ width: 100 });
        const context = createContext(parent);

        const issue = await fixedInsideFillRule.check(child, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('warning');
        expect(issue?.ruleId).toBe('fixed-inside-fill');
        expect(issue?.canAutoFix).toBe(true);
    });

    it('should not flag when parent has fixed width', async () => {
        const parent = createFrameNode({ width: 200 });
        const child = createFrameNode({ width: 100 });
        const context = createContext(parent);

        const issue = await fixedInsideFillRule.check(child, context);

        expect(issue).toBeNull();
    });

    it('should not flag when child uses fill width', async () => {
        const parent = createFrameNode({ width: 'fill' });
        const child = createFrameNode({ width: 'fill' });
        const context = createContext(parent);

        const issue = await fixedInsideFillRule.check(child, context);

        expect(issue).toBeNull();
    });
});

// ============================================================================
// AbsoluteInAutoLayout Rule Tests
// ============================================================================

describe('AbsoluteInAutoLayout Rule', () => {
    it('should detect absolute child inside auto-layout parent', async () => {
        const parent = createFrameNode({ layoutMode: 'horizontal' });
        const child = createFrameNode({ position: 'absolute' });
        const context = createContext(parent);

        const issue = await absoluteInAutoLayoutRule.check(child, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('error');
        expect(issue?.ruleId).toBe('absolute-in-auto-layout');
    });

    it('should not flag relative children in auto-layout', async () => {
        const parent = createFrameNode({ layoutMode: 'horizontal' });
        const child = createFrameNode({ position: 'relative' });
        const context = createContext(parent);

        const issue = await absoluteInAutoLayoutRule.check(child, context);

        expect(issue).toBeNull();
    });

    it('should not flag absolute children in non-auto-layout', async () => {
        const parent = createFrameNode({ layoutMode: 'none' });
        const child = createFrameNode({ position: 'absolute' });
        const context = createContext(parent);

        const issue = await absoluteInAutoLayoutRule.check(child, context);

        expect(issue).toBeNull();
    });
});

// ============================================================================
// NegativeGap Rule Tests
// ============================================================================

describe('NegativeGap Rule', () => {
    it('should detect negative gap in auto-layout frame', async () => {
        const frame = createFrameNode({
            layoutMode: 'horizontal',
            layoutGap: -10,
        });
        const context = createContext();

        const issue = await negativeGapRule.check(frame, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('warning');
        expect(issue?.ruleId).toBe('negative-gap');
    });

    it('should detect unusually large gap', async () => {
        const frame = createFrameNode({
            layoutMode: 'vertical',
            layoutGap: 150,
        });
        const context = createContext();

        const issue = await negativeGapRule.check(frame, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('info');
    });

    it('should not flag normal gaps', async () => {
        const frame = createFrameNode({
            layoutMode: 'horizontal',
            layoutGap: 16,
        });
        const context = createContext();

        const issue = await negativeGapRule.check(frame, context);

        expect(issue).toBeNull();
    });
});

// ============================================================================
// OverflowingText Rule Tests
// ============================================================================

describe('OverflowingText Rule', () => {
    it('should detect text overflowing parent height', async () => {
        const parent = createFrameNode({ height: 50 });
        const text = createTextNode({ height: 100 }); // Taller than parent
        const context = createContext(parent);

        const issue = await overflowingTextRule.check(text, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('error');
        expect(issue?.ruleId).toBe('overflowing-text');
    });

    it('should not flag when text fits within parent', async () => {
        const parent = createFrameNode({ height: 100 });
        const text = createTextNode({ height: 20 });
        const context = createContext(parent);

        const issue = await overflowingTextRule.check(text, context);

        expect(issue).toBeNull();
    });
});

// ============================================================================
// SmallTapTargets Rule Tests
// ============================================================================

describe('SmallTapTargets Rule', () => {
    it('should detect small interactive elements', async () => {
        const button = createFrameNode({
            name: 'Submit Button',
            width: 30,
            height: 30,
        });
        const context = createContext();

        const issue = await smallTapTargetsRule.check(button, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('warning');
        expect(issue?.ruleId).toBe('small-tap-targets');
        expect(issue?.metadata?.currentMinSize).toBe(30);
    });

    it('should not flag large interactive elements', async () => {
        const button = createFrameNode({
            name: 'Submit Button',
            width: 100,
            height: 48,
        });
        const context = createContext();

        const issue = await smallTapTargetsRule.check(button, context);

        expect(issue).toBeNull();
    });

    it('should ignore non-interactive elements', async () => {
        const div = createFrameNode({
            name: 'Container',
            width: 30,
            height: 30,
        });
        const context = createContext();

        const issue = await smallTapTargetsRule.check(div, context);

        expect(issue).toBeNull();
    });
});

// ============================================================================
// ShouldAutoLayout Rule Tests
// ============================================================================

describe('ShouldAutoLayout Rule', () => {
    it('should detect evenly spaced horizontal children', async () => {
        const frame = createFrameNode({
            layoutMode: 'none',
            children: [
                createFrameNode({ x: 0, y: 0, width: 50, height: 50 }),
                createFrameNode({ x: 66, y: 0, width: 50, height: 50 }),
                createFrameNode({ x: 132, y: 0, width: 50, height: 50 }),
            ],
        });
        const context = createContext();

        const issue = await shouldAutoLayoutRule.check(frame, context);

        expect(issue).not.toBeNull();
        expect(issue?.severity).toBe('info');
        expect(issue?.metadata?.direction).toBe('horizontal');
    });

    it('should not flag frames already using auto-layout', async () => {
        const frame = createFrameNode({
            layoutMode: 'horizontal',
            children: [
                createFrameNode({ x: 0, y: 0, width: 50, height: 50 }),
                createFrameNode({ x: 66, y: 0, width: 50, height: 50 }),
                createFrameNode({ x: 132, y: 0, width: 50, height: 50 }),
            ],
        });
        const context = createContext();

        const issue = await shouldAutoLayoutRule.check(frame, context);

        expect(issue).toBeNull();
    });
});
