# LayerScan - Submission Details

## Tagline
The smart design linter for Framer.

## Summary
LayerScan acts as your automated design QA engineer. It instantly scans your Framer project to detect layout inconsistencies, accessibility oversight, and performance bottlenecks—helping you ship pixel-perfect sites faster.

## Review Instructions
To test LayerScan functionalities:

1.  **Open the Plugin**: Launch LayerScan in any Framer project.
2.  **Scan Selection**: Select a few layers on the canvas (e.g., a button, a stack, or a text layer) and click **"Selection"** in the toolbar.
    *   *Test*: Select a button smaller than 44px to trigger "Small tap target".
    *   *Test*: Select a Frame with fractional dimensions (e.g., 100.5px) to trigger "Fractional dimensions".
3.  **Scan Page**: Click the **"Page"** button to audit the entire current webpage.
    *   Note: This may take a moment for large pages.
4.  **Auto-Fix**: Look for issues with a "Sparkles" icon (✨). Click **"Fix"** on an issue card (e.g., to fix fractional pixels).
    *   *Verify*: The layer dimensions are rounded to the nearest integer.
    *   *Verify*: A toast appears confirming the fix.
5.  **Navigation**: Click **"Show"** (Eye icon) on any issue card.
    *   *Verify*: The canvas zooms and focuses on the problematic layer.
6.  **Settings**: Click the gear icon (⛭) in the header.
    *   *Test*: Toggle specific rules on/off.
    *   *Test*: Change "Spacing Grid" preference.

## Full Description
**Ship pixel-perfect Framer sites with confidence.**

LayerScan is the essential quality assurance tool for Framer developers and designers. It works silently in the background or on-demand to continuously audit your layout, accessibility, and performance—catching issues before you publish.

### 🚀 Key Features

**1. Automated Design Audits**
Instantly detect over 10 types of common design and implementation errors:
*   **Layout**: Finds fixed widths inside fill containers, unnecessary nesting, and fractional pixel dimensions.
*   **Accessibility**: Identifies small tap targets, low contrast text (manual check mode), and missing alt text.
*   **Spacing**: Flags inconsistent gaps that don't match your 4pt/8pt grid system.
*   **Performance**: Warns about oversized images and heavy layer structures.

**2. One-Click Auto-Fixes**
Don't just find problems—fix them instantly. LayerScan can automatically:
*   Round fractional dimensions (e.g., `100.5px` → `101px`).
*   Fix deeply nested frames.
*   Normalize spacing gaps.
*   Convert manual stacks to Auto Layout (Stack).

**3. Seamless Workflow**
*   **Context Aware**: Scan just your current selection or the entire page.
*   **Native Feel**: A professional, dark-mode UI that feels right at home inside Framer.
*   **Smart Navigation**: Instantly zoom to any problematic layer with the "Show" button.

**4. Customizable Control**
*   Configure your preferred spacing grid (4px or 8px).
*   Enable/disable specific rules to match your project needs.
*   "Safe Mode" confirmation before applying fixes.

### Why LayerScan?
Framer gives you superpowers, but great power requires great responsibility. LayerScan handles the tedious QA work—checking hex codes, gaps, and responsiveness—so you can focus on creativity. It's like having a senior engineer reviewing your work 24/7.
