# TipBase UI/UX Requirements

This document outlines the UI/UX requirements and design system for the TipBase application.

## Design System

### Layout

TipBase uses a fluid layout optimized for mobile screens, as it's primarily designed to be used within the Base Wallet MiniApp framework.

- **Container Padding**: `px-4 py-6`
- **Max Width**: Content areas are constrained to `max-w-md` (448px) for optimal readability
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach

### Color Palette

The color palette is designed to be clean, accessible, and aligned with Base's design language:

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `hsl(210, 30%, 98%)` | Main background color |
| `accent` | `hsl(130, 60%, 45%)` | Success states, highlights |
| `primary` | `hsl(210, 80%, 50%)` | Primary actions, buttons |
| `surface` | `hsl(200, 35%, 95%)` | Card backgrounds, secondary surfaces |
| `text-primary` | `hsl(210, 20%, 15%)` | Main text color |
| `text-secondary` | `hsl(210, 20%, 40%)` | Secondary text, captions |

### Typography

Typography is based on a clear hierarchy with consistent sizing and weights:

| Token | CSS Classes | Usage |
|-------|------------|-------|
| `display` | `text-[36px] font-extrabold` | Main headlines, app title |
| `heading1` | `text-[28px] font-bold` | Section headers |
| `body` | `text-[16px] font-normal` | Body text, general content |
| `caption` | `text-[12px] font-medium` | Labels, metadata |

### Spacing

Consistent spacing tokens are used throughout the application:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Minimal spacing, tight elements |
| `sm` | `8px` | Small spacing between related elements |
| `md` | `12px` | Medium spacing, default spacing |
| `lg` | `16px` | Large spacing between sections |
| `xl` | `24px` | Extra large spacing for major sections |

### Border Radius

Rounded corners are used consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `6px` | Small elements (buttons, inputs) |
| `md` | `10px` | Medium elements |
| `lg` | `16px` | Large elements (cards) |

### Shadows

Subtle shadows provide depth:

| Token | Value | Usage |
|-------|-------|-------|
| `card` | `0 4px 12px hsla(0, 0%, 0%, 0.08)` | Card elevation |

### Motion

Animation timings are consistent:

| Token | Value | Usage |
|-------|-------|-------|
| `base` | `200ms` | Standard transitions |
| `fast` | `100ms` | Quick feedback transitions |

All animations use `ease-in-out` timing function for natural movement.

## Components

### Button

Buttons provide clear call-to-actions with multiple variants:

#### Primary Button
- Background: `primary`
- Text: White
- Hover: Reduced opacity
- Usage: Main actions, confirmations

#### Secondary Button
- Background: `surface`
- Border: `primary`
- Text: `text-primary`
- Hover: `primary` background with white text
- Usage: Alternative actions, options

#### Icon Button
- Background: Transparent
- Hover: `surface`
- Usage: Compact actions, toggles

### Input

Input fields for user data entry:

#### Default Input
- Border: `text-secondary`
- Focus: `primary` border
- Background: `bg`
- Text: `text-primary`
- Placeholder: `text-secondary`

#### Textarea
- Same styling as default input
- Min height: 100px
- Usage: Multi-line text entry (messages)

### Card

Cards group related content:

- Background: `surface`
- Border Radius: `lg`
- Shadow: `card`
- Padding: `p-md`
- Usage: Content containers, sections

### Avatar

User and creator avatars:

#### Default Avatar
- Size: 48px
- Border Radius: Full (circular)
- Usage: Profile displays

#### Small Avatar
- Size: 24px
- Border Radius: Full (circular)
- Usage: Compact displays, lists

### Typography Component

Typography component for consistent text styling:

- Variants: `display`, `heading1`, `body`, `caption`
- Customizable with additional classes
- Usage: All text content

## User Flows

### Home Page

1. App title and tagline prominently displayed
2. Connect wallet button for new users
3. After connection, redirect to onboarding or dashboard

### Onboarding Flow

1. Profile setup form with:
   - Display name input (required)
   - Bio textarea (optional)
   - Avatar preview (from wallet address)
2. Save button to complete profile creation
3. Redirect to dashboard after completion

### Dashboard

1. Profile section with:
   - Avatar and display name
   - Bio and vanity URL
   - Copy link button
   - Total tips received
2. Analytics section with:
   - Key metrics (total tips, amount, unique tippers)
   - Time period selector (7d, 30d, 90d)
   - Visual data representation
3. Recent tips list with:
   - Sender address (truncated)
   - Amount and timestamp
   - Personalized message (if any)

### Creator Profile / Tipping Page

1. Creator info section with:
   - Avatar and display name
   - Bio
2. Tipping section with:
   - Pre-set amount buttons (1, 5, 10 USDC)
   - Custom amount option
   - Message input for personalization
   - Send tip button with transaction flow
3. Success confirmation after tip is sent

## Accessibility Requirements

- Color contrast ratios meet WCAG AA standards
- Interactive elements have appropriate focus states
- Semantic HTML structure for screen readers
- Keyboard navigation support
- Appropriate text sizing and spacing for readability
- Alternative text for visual elements

## Responsive Design

- Mobile-first approach (Base Wallet MiniApp context)
- Fluid layouts that adapt to different screen sizes
- Touch-friendly tap targets (min 44x44px)
- Appropriate spacing on smaller screens

## Loading States

- Skeleton loaders for content areas
- Button loading states during transactions
- Transition animations between states

## Error Handling

- Clear error messages for transaction failures
- Form validation feedback
- Offline state handling
- Recovery options for failed actions

## Success Feedback

- Visual confirmation for successful tips
- Transaction confirmation details
- Animation for completed actions

## Implementation Notes

- Use Tailwind CSS for styling with the defined tokens
- Implement components as React functional components
- Use CSS transitions for animations
- Ensure consistent spacing with Tailwind classes
- Follow the defined color system for all UI elements

