# Social Media Preview Image Requirements

## Status: ⚠️ PENDING - Phase 10

### Required File

**Location**: `public/og-image.jpg`

**Specifications** (2025 Standards):
- **Dimensions**: 1200 x 630 pixels (Facebook/LinkedIn standard)
- **Format**: JPG or PNG
- **File Size**: < 5MB (< 1MB recommended for performance)
- **Aspect Ratio**: 1.91:1
- **Safe Zone**: Keep important content within 1200x600px center

### What to Include

1. **Vecia Logo** (prominent, top-left or center)
2. **Tagline**: "AI Automation Agency - Save 20+ Hours per Week"
3. **Brand Colors**: Use primary (#5B8BFF) and secondary (#C755FF)
4. **High Contrast**: Ensure text is readable on all backgrounds

### Alternative Options

If custom og-image.jpg doesn't exist, the system currently falls back to:
- `public/vecia_logo_long_contour.png` (used in BaseLayout line 37)

### Testing Tools

Once created, validate with:
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### Current Implementation

BaseLayout.astro (line 37):
```astro
const ogImage = new URL('/vecia_logo_long_contour.png', Astro.site || 'https://vecia.com');
```

Blog posts (optional custom images):
```astro
const ogImage = post.data.image || '/images/og/blog-article-default.jpg';
```

### Action Required

**Before going live:**
1. Create `public/og-image.jpg` (1200x630px)
2. Optionally create `public/images/og/blog-article-default.jpg` for blog posts
3. Test with social media validators
4. Verify on actual social posts (Facebook, LinkedIn, Twitter)

**Created**: 2025-01-15
**Priority**: Medium (works with current logo, but custom image is better)
