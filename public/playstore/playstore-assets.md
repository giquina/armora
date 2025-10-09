# Google Play Store Assets

This directory contains all required assets for publishing both Armora apps to the Google Play Store.

## Created Assets

### App Icons (512x512 PNG)

#### 1. Armora Client App Icon
- **File**: `armora-icon-512.png`
- **Dimensions**: 512x512 pixels
- **Format**: PNG (32-bit RGBA)
- **Size**: 28KB
- **Description**: Premium gold (#FFD700) shield with "A" emblem on navy background (#1a1a2e)
- **Design Elements**:
  - Rounded rectangular gold shield border
  - Navy inner shield with gold "A" lettermark
  - Subtle circular glow effect for depth
  - Matches Armora brand colors and premium positioning

#### 2. Armora CPO App Icon
- **File**: `armoracpo-icon-512.png`
- **Dimensions**: 512x512 pixels
- **Format**: PNG (32-bit RGBA)
- **Size**: 33KB
- **Description**: Orange variant (#FFA500) with CPO badge to differentiate from client app
- **Design Elements**:
  - Orange shield border (distinguishes from client app)
  - Navy inner shield with orange "A" lettermark
  - Gold "CPO" badge in bottom-right corner
  - Professional distinction for Protection Officer app

### Feature Graphics (1024x500 PNG)

#### 3. Armora Client Feature Graphic
- **File**: `armora-feature-graphic.png`
- **Dimensions**: 1024x500 pixels
- **Format**: PNG (32-bit RGBA)
- **Size**: 68KB
- **Description**: Full-width banner featuring shield logo and app branding
- **Text Content**:
  - Primary: "ARMORA" (72pt, gold)
  - Secondary: "Security Transport" (36pt, gold)
  - Tagline: "Premium Executive Protection" (28pt, gold)
- **Layout**: Shield logo left, text right, gradient navy background

#### 4. Armora CPO Feature Graphic
- **File**: `armoracpo-feature-graphic.png`
- **Dimensions**: 1024x500 pixels
- **Format**: PNG (32-bit RGBA)
- **Size**: 70KB
- **Description**: CPO-focused variant with orange branding
- **Text Content**:
  - Primary: "ARMORA CPO" (72pt, orange)
  - Secondary: "Console" (36pt, orange)
  - Tagline: "Professional Security Network" (28pt, orange)
- **Layout**: Shield logo with CPO badge left, text right, gradient navy background

## Google Play Store Requirements

### App Icon Requirements
- **Minimum**: 512x512 pixels ✅
- **Format**: 32-bit PNG with alpha channel ✅
- **File size**: Under 1MB ✅
- **Design**: Must follow Material Design guidelines for adaptive icons
- **Safe zone**: Icon should have important elements within center 66% circle

### Feature Graphic Requirements
- **Exact size**: 1024x500 pixels ✅
- **Format**: PNG or JPEG ✅
- **File size**: Under 1MB ✅
- **Usage**: Displayed at top of store listing on tablets and web
- **Safe zones**: Keep important content away from edges (allow 64px margin)

## Brand Colors Used

From `/src/styles/brandConstants.ts`:

- **Primary Gold**: #FFD700
- **Secondary Gold/Orange**: #FFA500
- **Accent Gold**: #FF8C00
- **Navy Primary**: #1a1a2e
- **Navy Secondary**: #16213e
- **Navy Tertiary**: #1e1e3a

## Tools Used

All assets created using **ImageMagick** (convert command):
- Vector shapes and gradients
- DejaVu-Sans-Bold font for typography
- Alpha transparency for glow effects
- Professional security industry aesthetic

## Upload Instructions

### For Armora Client App (com.armora.protection)

1. **App Icon**: Upload `armora-icon-512.png` in Play Console → Store presence → App icon
2. **Feature Graphic**: Upload `armora-feature-graphic.png` in Play Console → Store presence → Feature graphic

### For Armora CPO App (com.armora.protectioncpo)

1. **App Icon**: Upload `armoracpo-icon-512.png` in Play Console → Store presence → App icon
2. **Feature Graphic**: Upload `armoracpo-feature-graphic.png` in Play Console → Store presence → Feature graphic

## Additional Assets Needed (Future)

For a complete Play Store listing, you will also need:

### Screenshots (Required)
- **Phone**: Minimum 2 screenshots, maximum 8
- **Dimensions**: 16:9 or 9:16 aspect ratio
- **Minimum**: 320px on shortest side
- **Maximum**: 3840px on longest side
- **Recommendation**: Use 1080x1920 (portrait) or 1920x1080 (landscape)

### Promo Video (Optional)
- **YouTube URL**: Link to promotional video
- **Length**: 30 seconds to 2 minutes recommended

### Hi-res Icon (Required for older Android versions)
- **Dimensions**: 512x512 pixels
- **Note**: We've already created these - use the same icon files

## Notes

- All assets use Armora's brand colors and professional security aesthetic
- CPO app uses orange accent to visually distinguish from client app
- Icons include subtle depth effects (circular glow, shield layers)
- Feature graphics use gradient backgrounds for premium appearance
- Typography matches brand standards (bold sans-serif, high letter-spacing)

## Verification

Run verification command:
```bash
identify /workspaces/armora/public/playstore/*.png
```

Expected output:
```
armora-icon-512.png PNG 512x512 512x512+0+0 16-bit sRGB
armoracpo-icon-512.png PNG 512x512 512x512+0+0 16-bit sRGB
armora-feature-graphic.png PNG 1024x500 1024x500+0+0 16-bit sRGB
armoracpo-feature-graphic.png PNG 1024x500 1024x500+0+0 16-bit sRGB
```

## Recommendations for Designer Enhancement

While these programmatically-generated assets meet all Play Store requirements, consider professional design enhancement for:

1. **Icon Depth**: Add more sophisticated 3D shield effects, metallic textures, and lighting
2. **Typography**: Use actual Arial Black or custom security-themed font
3. **Feature Graphics**: Add additional visual elements:
   - Security badge/credential elements
   - Subtle background patterns (circuit boards, shields)
   - Professional photography or illustrations
   - More sophisticated gradients and lighting effects

4. **Screenshots**: Create actual app screenshots showing:
   - Hub/dashboard view
   - Protection assignment booking flow
   - Real-time CPO tracking
   - Professional interface elements

5. **Promo Video**: Create 30-60 second promotional video showing:
   - App interface walkthrough
   - Key features demonstration
   - Professional security positioning
   - Call to action

## File Manifest

```
/workspaces/armora/public/playstore/
├── armora-icon-512.png              (28KB, 512x512 PNG)
├── armoracpo-icon-512.png           (33KB, 512x512 PNG)
├── armora-feature-graphic.png       (68KB, 1024x500 PNG)
├── armoracpo-feature-graphic.png    (70KB, 1024x500 PNG)
└── playstore-assets.md              (this file)
```

**Total size**: ~199KB (well within Play Store limits)

---

**Created**: 2025-10-09
**Tool**: ImageMagick convert CLI
**Status**: Ready for Play Store upload
**Next Steps**: Create app screenshots for complete store listing
