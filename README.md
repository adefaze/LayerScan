# LayerScan 🔍

> The smart design linter for Framer.

LayerScan acts as your automated design QA engineer. It instantly scans your Framer project to detect layout inconsistencies, accessibility oversight, and performance bottlenecks—helping you ship pixel-perfect sites faster.

![LayerScan Banner](https://via.placeholder.com/1200x600?text=LayerScan+Preview)

## ✨ Features

- **🛡️ Layout Audits**: Detects broken responsiveness (e.g., fixed width inside fill), fractional pixels, and unnecessary nesting.
- **♿ Accessibility Checks**: Flags small tap targets (<44px) and suggests text contrast verification.
- **⚡ Performance Tips**: Identifies oversized images and complex layer trees.
- **🪄 One-Click Fixes**: Automatically roundup pixels, remove nesting, and fix common layout bugs.
- **🎨 Native Experience**: Professional dark-mode UI that feels native to Framer.

## 🚀 Getting Started

1. **Install**: Add LayerScan to your Framer project.
2. **Select**: Click on any layer or Frame you want to check.
3. **Scan**:
    - Click **"Selection"** to audit specific layers.
    - Click **"Page"** to audit the entire current page.
4. **Fix**: Review the issues list/warnings and click **"Fix"** or **"Show"** to resolve them.


## Rules

### Layout
| Rule | Description | Severity | Auto-Fix |
|------|-------------|----------|----------|
| Fixed Inside Fill | Fixed-width child in fluid parent | ⚠️ Warning | ✅ |
| Absolute in Auto-Layout | Absolute element ignored by auto-layout | 🔴 Error | ✅ |
| Negative Gap | Negative or unusually large gaps | ⚠️ Warning | ✅ |
| Unnecessary Nesting | Redundant wrapper frames | ℹ️ Info | ✅ |
| Overflowing Text | Text exceeds container bounds | 🔴 Error | ✅ |
| Should Auto-Layout | Evenly spaced elements could use auto-layout | ℹ️ Info | ✅ |

### Spacing
| Rule | Description | Severity | Auto-Fix |
|------|-------------|----------|----------|
| Inconsistent Spacing | Varying gaps between siblings | ⚠️ Warning | ✅ |
| Mixed Radii | Different border radii among siblings | ℹ️ Info | ✅ |

### Accessibility
| Rule | Description | Severity | Auto-Fix |
|------|-------------|----------|----------|
| Low Contrast Text | Text below WCAG AA ratio | ⚠️ Warning | ❌ |
| Small Tap Targets | Interactive elements < 44px | ⚠️ Warning | ✅ |

### Performance
| Rule | Description | Severity | Auto-Fix |
|------|-------------|----------|----------|
| Oversized Image | Image resolution >> displayed size | ℹ️ Info | ❌ |

### Heuristics
| Rule | Description | Severity | Auto-Fix |
|------|-------------|----------|----------|
| Component Candidate | Repeated structures could be components | ℹ️ Info | ❌ |

## Installation

### For Development

```bash
# Clone the repository
cd "framer plugin"

# Install dependencies
npm install

# Start development server
npm run dev
```

### In Framer

1. Open your Framer project
2. Go to **Plugins > Development > Import from Folder**
3. Select this project folder
4. The plugin will appear in your plugins list

## Usage

1. **Select layers** you want to audit (or select nothing to scan entire page)
2. Click **🔍 Selection** or **📄 Page**
3. Review issues grouped by category
4. Click **✨ Fix** to auto-fix individual issues
5. Click **Fix All** to apply all safe fixes at once
6. Use **Cmd+Z** to undo any fix

## Building for Production

```bash
npm run build
```

The built plugin will be in the `dist/` folder.

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage
```

## Privacy

**Layer Intelligence analyzes layers locally in your editor and does not upload your designs outside your machine.** No assets are sent to third parties by default.

Optional anonymous usage analytics are opt-in only and can be disabled in Settings.

## Development

### Project Structure

```
src/
├── main.tsx              # Plugin entry point
├── styles.css            # Global styles
├── core/
│   ├── types.ts          # TypeScript types
│   ├── auditor.ts        # Rule engine
│   ├── fixers.ts         # Auto-fix implementations
│   └── rules/            # Individual audit rules
├── ui/
│   ├── App.tsx           # Root component
│   ├── components/       # UI components
│   └── panels/           # Panel components
└── utils/
    ├── nodeHelpers.ts    # Node property helpers
    └── perf.ts           # Performance utilities
```

### Adding New Rules

1. Create a new file in `src/core/rules/`
2. Implement the `Rule` interface
3. Export from `src/core/rules/index.ts`

```typescript
import type { Rule, Issue, FramerNode, AuditContext } from '../types';

export const myNewRule: Rule = {
  id: 'my-new-rule',
  category: 'layout',
  name: 'My New Rule',
  description: 'Description of what this rule checks',
  enabledByDefault: true,

  async check(node: FramerNode, context: AuditContext): Promise<Issue | null> {
    // Check logic here
    return null;
  },
};
```

## License

MIT

---

Made with ❤️ by Abiodun Adefila for Framer developers
