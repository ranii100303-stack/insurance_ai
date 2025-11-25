# Design Guidelines: AI-Powered Insurance Claims Dashboard

## Design Approach
**System Selected:** Linear/Modern SaaS Dashboard Pattern
**Rationale:** This is a productivity tool requiring clear information hierarchy, efficient workflows, and professional credibility. Drawing from Linear's clean aesthetics with enterprise dashboard conventions.

## Typography System
**Font Family:** Inter (Google Fonts CDN)
- Headings (H1): 24px, semibold (600)
- Headings (H2): 20px, semibold (600)
- Headings (H3): 16px, medium (500)
- Body text: 14px, regular (400)
- Small text (metadata/labels): 12px, medium (500)
- Monospace (Claim IDs, amounts): 'Roboto Mono', 14px

## Layout System
**Spacing Scale:** Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: gap-4 to gap-6
- Card spacing: p-6
- Agent message spacing: gap-3

**Container Structure:**
- Dashboard: Full-width with max-w-7xl container
- Claim Detail: Two-column layout (lg:grid-cols-3) - 2/3 main content, 1/3 sidebar
- Mobile: Single column stack

## Component Library

### Dashboard View
**Claims Table/List:**
- Card-based rows with hover state elevation
- Each claim card includes: Badge for status, claim ID (monospace), claimant name (semibold), summary (2-line truncate), reported amount (large, right-aligned)
- Status badges: Small pill shapes with subtle backgrounds (Pending, Processing, Closed, Overridden)
- Responsive: Stack columns on mobile

### Claim Detail View
**Layout:**
- Left column (2/3): Claim details, photo grid, AI assessment section
- Right sidebar (1/3): Claimant info card (sticky position)

**Claimant Info Card:**
- White/elevated card with subtle border
- Profile section with name, contact, policy number
- Metadata list: Submitted date, claim ID, vehicle info

**Photo Grid:**
- 2-column grid on desktop (grid-cols-2), single column mobile
- Placeholder tiles: 16:9 aspect ratio, dashed border, centered icon
- Light background with "Photo [1-4]" label

**AI Assessment Section:**
- Contained within bordered card
- "Run AI Assessment" button: Large, primary, full-width within card
- Agent messages: Sequential list with left-aligned icon, agent name (bold), message text

### Agent Simulation Display
**Message Structure:**
- Each agent message in its own row
- Icon (left): 24px circle with agent initial or symbol
- Content (right): Agent name header + message text
- Stagger animation: Fade in from top, 500ms delay between messages
- Progress indicator during processing

**Results Card:**
- Elevated card appearing after messages complete
- Grid layout for metrics (grid-cols-2 gap-4):
  - Recommended Payout (large, prominent)
  - Confidence % (with visual bar)
  - Fraud Score (color-coded indicator)
  - Suggested Path (badge style)

### Action Controls
**Button Pair:**
- Two-button layout at bottom of results
- "Accept Recommendation": Primary button (solid)
- "Override": Secondary button (outlined)
- Mobile: Stack vertically, full-width

### Navigation
**Header:**
- Fixed top bar with app title
- Back button on detail view (← Back to Dashboard)
- Minimal, text-only navigation

## Icons
**Library:** Heroicons (CDN)
- Claims dashboard: DocumentTextIcon, CheckCircleIcon
- Agent icons: UserIcon, CalculatorIcon, ShieldCheckIcon, ClipboardDocumentCheckIcon
- Actions: CheckIcon, XMarkIcon, ArrowLeftIcon

## Animations
**Minimal approach:**
- Agent messages: Stagger fade-in only (no complex animations)
- Button states: Standard hover/active (framework default)
- Card interactions: Subtle hover elevation change
- No page transitions or decorative animations

## Accessibility
- All interactive elements have proper focus states
- Status badges use semantic colors with text labels
- Button contrast meets WCAG AA standards
- Form inputs with visible labels

## No Images Required
This is a data-focused dashboard - no hero images or marketing photography needed. Photo placeholders in claim detail are represented as bordered tiles with icons/text only.