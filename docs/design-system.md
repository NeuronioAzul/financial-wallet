# Design System - Financial Wallet

## Color Palette

### Primary Colors

#### Ocean Blue
- **Usage**: Main primary color, highlight elements, important card backgrounds
- **Default**: `#003161` - Deep ocean blue
- **Light**: `#3D58B6` - Royal blue
- **Dark**: `#001F3D` - Dark ocean blue

#### Forest Green
- **Usage**: Secondary color, success actions, positive values
- **Default**: `#00610D` - Forest green
- **Light**: `#70E080` - Mint green
- **Dark**: `#004008` - Dark forest green

#### Golden Sand
- **Usage**: Accent color, highlights, premium elements
- **Default**: `#DAB655` - Golden sand
- **Light**: `#F0D685` - Light gold
- **Dark**: `#B89640` - Dark gold

### Semantic Colors

#### Success
- **Default**: `#00610D` - Forest green
- **Light**: `#70E080` - Mint green
- **Usage**: Positive transactions, received deposits, confirmations

#### Danger (Error)
- **Default**: `#610019` - Burgundy red
- **Light**: `#8B0025` - Light burgundy
- **Usage**: Errors, negative values, critical alerts

#### Royal Blue
- **Default**: `#3D58B6` - Royal blue
- **Light**: `#5D78D6` - Light royal blue
- **Dark**: `#2D4896` - Dark royal blue
- **Usage**: Links, secondary actions, information

### Neutral Colors

#### Silver Gray
- **Default**: `#B3B6CA` - Silver gray
- **Light**: `#D3D6EA` - Light silver gray
- **Dark**: `#9396AA` - Dark silver gray
- **Usage**: Borders, dividers, disabled elements

#### Charcoal Gray
- **Default**: `#686A75` - Charcoal gray
- **Light**: `#888A95` - Light charcoal gray
- **Dark**: `#484A55` - Dark charcoal gray
- **Usage**: Secondary text, icons, placeholders

## Utility Classes

### Gradients

```css
.gradient-primary   /* Ocean blue → Royal blue → Ocean blue dark */
.gradient-success   /* Forest green → Mint green */
.gradient-accent    /* Golden sand → Golden sand dark */
.gradient-text      /* Ocean blue → Royal blue (for text) */
```

### Buttons

```css
.btn-primary        /* Ocean blue/royal gradient, white text */
.btn-secondary      /* Forest green/mint gradient, white text */
.btn-outline        /* Ocean blue border, hover with background */
```

### Components

```css
.card               /* White card with shadow */
.input-field        /* Input with silver gray border, royal blue focus */
```

## Usage Mapping

### Authentication Screens
- Left background: `gradient-primary` (Ocean blue → Royal blue)
- Logo: `ocean-blue` with `white/10` background
- Main buttons: `gradient-primary`
- Links: `ocean-blue` with `ocean-blue/80` hover

### Dashboard
- WalletCard background: `gradient-primary`
- Deposit button: White with `ocean-blue` text
- Transfer button: White with `ocean-blue` text
- History button: White outline, inverted on hover

### Transactions
- Positive values: `forest-green` or `mint-green`
- Negative values: `burgundy-red`
- Received icon: `mint-green`
- Sent icon: `royal-blue`
- Deposit icon: `mint-green`
- Completed badge: `forest-green` light background

## Accessibility

### Color Contrast
- Ocean blue (#003161) on white: ✅ AAA (Excellent)
- Forest green (#00610D) on white: ✅ AAA (Excellent)
- Royal blue (#3D58B6) on white: ✅ AA (Good)
- Golden sand (#DAB655) on ocean-blue: ✅ AAA (Excellent)

### Recommendations
- Always use white text on dark colors (ocean-blue, forest-green)
- Use complementary colors to ensure readability
- Maintain minimum 4.5:1 contrast for interactive elements
- Use icons along with colors to indicate states (don't rely on color alone)

## Quick Tailwind Reference

```javascript
// Colors in Tailwind
bg-ocean-blue
bg-forest-green
bg-golden-sand
bg-royal-blue
bg-mint-green
bg-silver-gray
bg-charcoal-gray

// With variations
bg-ocean-blue-light
bg-ocean-blue-dark
text-forest-green
border-royal-blue
```
