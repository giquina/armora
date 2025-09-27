# Container Border Standards - Armora Transport Questionnaire

## Critical Rule: Complete 4-Sided Borders

ALL content containers in the questionnaire must display complete borders on all four sides to maintain professional appearance and visual consistency.

### ✅ Required Border Pattern
- **Top**: Always visible
- **Left**: Always visible  
- **Right**: Always visible
- **Bottom**: ⚠️ MUST be explicitly defined and visible (this is the critical issue)

### 🔧 CSS Implementation Standard

For ALL container classes, use this pattern:

```css
.containerClass {
  border: 2px solid rgba(255, 215, 0, 0.4) !important;
  border-top: 2px solid rgba(255, 215, 0, 0.4) !important;
  border-right: 2px solid rgba(255, 215, 0, 0.4) !important;
  border-bottom: 2px solid rgba(255, 215, 0, 0.4) !important; /* EXPLICIT BOTTOM BORDER */
  border-left: 2px solid rgba(255, 215, 0, 0.4) !important;
  box-sizing: border-box !important;
}
```

### 🎨 Armora Brand Colors
- **Standard Golden**: `rgba(255, 215, 0, 0.4)` for content containers
- **Emphasis Golden**: `rgba(255, 215, 0, 0.6)` for important sections
- **Solid Golden**: `#FFD700` for selected states

### 📋 Container Types That MUST Have Complete Borders

1. **Information Sections**
   - `.stepIntroComprehensive`
   - `.whyQuestionnaire` 
   - `.processOverview`
   - `.securityAssurance`
   - `.trustIndicators`

2. **Guidance & Instructions**
   - `.stepGuidance`
   - `.stepInstructions`
   - `.uncertaintySection`
   - `.uncertaintyHelp`

3. **Interactive Containers**
   - `.option` (questionnaire options)
   - `.privacyOption`
   - `.uncertaintyOption`

4. **Status & Progress**
   - `.progressMessage`
   - `.servicePreviewPanel`
   - `.clientExample`

5. **UI Elements**
   - `.badge`
   - `.promptContent`
   - `.nameCollectionSection`

### 🚫 Common Issues to Avoid

1. **Missing Bottom Borders**: The most critical issue - always specify explicitly
2. **Overflow Clipping**: Avoid `overflow: hidden` that cuts off borders
3. **Container Height Issues**: Ensure parent containers don't clip child borders
4. **Z-Index Problems**: Borders rendered behind other elements

### ✅ Testing Checklist

Before deployment, verify:

- [ ] All 9 questionnaire steps show complete container borders
- [ ] Bottom borders visible in default state (not just hover)
- [ ] Mobile responsive (320px+) shows complete borders
- [ ] No container appears "open" at the bottom
- [ ] All information boxes have 4-sided golden borders
- [ ] All option containers show complete rectangles
- [ ] Status messages and progress indicators have full borders

### 🔧 Debugging Border Issues

If borders are missing:

1. Check for conflicting CSS rules
2. Ensure `!important` declarations for border properties
3. Verify parent container isn't clipping borders
4. Test on multiple screen sizes
5. Inspect element borders in browser DevTools

### 📱 Mobile Considerations

- Borders must remain visible on screens as small as 320px
- Touch targets (option boxes) should maintain border visibility
- Responsive design must preserve border integrity
- Test scrolling to ensure borders don't get clipped

### 🎯 Quality Standards

- **Visual Consistency**: Identical border appearance across all steps
- **Professional Appearance**: No "incomplete" or "open" containers
- **Brand Adherence**: Golden borders maintaining Armora premium identity
- **Cross-Browser**: Consistent rendering across modern browsers

## Last Updated
Date: 2025-09-09  
Reason: Systematic fix for missing bottom borders across questionnaire

---

Last updated: 2025-09-27T04:34:01.376Z
