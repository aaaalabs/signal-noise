# Asset Replacement Guide for Article 11

**Article:** The Three Things Productivity System
**HTML File:** `/Volumes/Vault/GitHub/signalnoise/signal-noise/blog-three-things-productivity-system.html`
**Status:** Ready for final assets (images + optional video)

---

## 📸 Image Assets Required (4 Total)

### 1. Hero Image (REQUIRED)
- **Location:** Line ~762 in HTML
- **File path:** `/blog-images/article-11/hero-image.jpg`
- **Dimensions:** 1600×900px (16:9 ratio)
- **Format:** WebP primary + JPG fallback
- **Size target:** <200KB
- **Alt text:** "Three transformational tasks highlighted in minimalist workspace with deep focus environment"
- **Description:** Minimalist desk setup with 3 key items representing transformational tasks, clean background, dark aesthetic matching Signal/Noise brand
- **Current state:** Red-bordered placeholder visible

**Search suggestions:**
- Unsplash: "minimalist workspace focus"
- Pexels: "desk productivity dark theme"
- Custom design: 3 objects on dark desk (symbolic of Three Things)

---

### 2. Ivy Lee Portrait (RECOMMENDED)
- **Location:** Line ~781 in HTML
- **File path:** `/blog-images/article-11/ivy-lee-portrait.jpg`
- **Dimensions:** 560×700px (portrait orientation)
- **Format:** WebP primary + JPG fallback
- **Size target:** <150KB
- **Alt text:** "Ivy Lee, productivity consultant who developed the foundational task prioritization method in 1918"
- **Description:** Historical portrait or professional photo of Ivy Lee (public domain or licensed)
- **Current state:** Placeholder with floating text layout (image-with-text class)

**Search suggestions:**
- Wikimedia Commons: "Ivy Lee"
- Library of Congress archives
- Historical business photography collections
- **Alternative:** Use vintage productivity-themed image (typewriter, desk from 1918 era)

---

### 3. Compound Effect Chart (REQUIRED)
- **Location:** Line ~857 in HTML
- **File path:** `/blog-images/article-11/compound-effect-chart.jpg`
- **Dimensions:** 900×500px (wide chart)
- **Format:** WebP primary + JPG fallback
- **Size target:** <150KB
- **Alt text:** "Line graph showing 37× improvement from 3 daily transformational tasks over one year versus flat growth from maintenance work"
- **Description:** Line chart comparing exponential growth (1.01^365) vs. flat maintenance work, dark background, green accent for growth line
- **Current state:** Placeholder

**Options:**
1. **Use HTML generator:** `blog-research/infographic-generators/Compound-Effect-Chart.html` exists - screenshot this!
2. **Design tool:** Figma/Canva with brand colors
3. **Code:** Python matplotlib with dark theme

---

### 4. Pyramid Comparison (REQUIRED)
- **Location:** Line ~893 in HTML
- **File path:** `/blog-images/article-11/pyramid-comparison.jpg`
- **Dimensions:** 900×450px (2:1 ratio)
- **Format:** WebP primary + JPG fallback
- **Size target:** <150KB
- **Alt text:** "Comparison of traditional task distribution (80% maintenance) versus Three Things system (70% transformation)"
- **Description:** Side-by-side pyramids showing task level distribution, left pyramid (traditional) is inverted compared to right (Three Things), color-coded by task level
- **Current state:** Placeholder

**Options:**
1. **Use HTML generator:** `blog-research/infographic-generators/Three-Levels-Pyramid.html` exists - screenshot this!
2. **Design manually:** Two triangles with percentages labeled

---

## 🎥 Video Embeds (OPTIONAL - Already Added as Placeholders!)

✅ **Video placeholders have been added to the HTML** with green-bordered notices and example code.

### Video Placeholder #1: Historical Context
**Location:** Line ~840 (after Ivy Lee Method story)
**Current state:** Green placeholder with instructions visible
**Suggested topics:**
- Ivy Lee Method history and evolution
- Three Things productivity explainer
- Task prioritization fundamentals

**Replacement instructions:**
1. Find the `<!-- VIDEO EMBED PLACEHOLDER #1 -->` section
2. Replace the `.video-placeholder-notice` div with the commented-out `.video-embed-container` code
3. Update `YOUR_VIDEO_ID` with actual YouTube video ID
4. Update video title attribute

### Video Placeholder #2: Implementation Tutorial
**Location:** Line ~1070 (after Four-Step Daily Protocol, before calculator)
**Current state:** Green placeholder with instructions visible
**Suggested topics:**
- Daily routine walkthrough
- How to select your Three Things
- Time blocking demonstration
- Signal/Noise app demo/tutorial

**Replacement instructions:**
1. Find the `<!-- VIDEO EMBED PLACEHOLDER #2 -->` section
2. Replace the `.video-placeholder-notice` div with the commented-out `.video-embed-container` code
3. Update `YOUR_VIDEO_ID` with actual YouTube video ID
4. Update video title attribute

---

## 🛠️ Replacement Instructions

### Step 1: Generate Infographics from HTML Templates

**Compound Effect Chart:**
```bash
# Open in browser
open blog-research/infographic-generators/Compound-Effect-Chart.html

# Screenshot at 1200×600px
# Save as: blog-images/article-11/compound-effect-chart.jpg
```

**Three Levels Pyramid:**
```bash
# Open in browser
open blog-research/infographic-generators/Three-Levels-Pyramid.html

# Screenshot at 1200×800px (then crop to 900×450px)
# Save as: blog-images/article-11/pyramid-comparison.jpg
```

---

### Step 2: Source Hero + Portrait Images

**Hero Image:**
- Visit Unsplash.com or Pexels.com
- Search: "minimalist workspace dark" OR "productivity focus desk"
- Download high-res (1920×1080 minimum)
- Crop to 1600×900px
- Optimize with ImageMagick or Squoosh.app

**Ivy Lee Portrait:**
- Check Wikimedia Commons: https://commons.wikimedia.org/
- Search: "Ivy Lee" or "1918 business portrait"
- If not found: Use vintage office/desk image from 1918 era
- Resize to 560×700px

---

### Step 3: Optimize Images

**Using ImageMagick (CLI):**
```bash
# Convert to WebP
magick hero-image.jpg -quality 85 -resize 1600x900 hero-image.webp

# Optimize JPG fallback
magick hero-image.jpg -quality 85 -resize 1600x900 -strip hero-image.jpg

# Verify file size
ls -lh blog-images/article-11/*.{jpg,webp}
```

**Using Squoosh.app (Web):**
1. Upload image
2. Select WebP format, quality 85
3. Download optimized version
4. Repeat for JPG fallback (quality 80-85)

---

### Step 4: Replace Placeholders in HTML

**Find this:**
```html
<p class="placeholder-notice">📸 IMAGE PLACEHOLDER: Add hero image here<br>
Suggested image: /blog-images/article-11/hero-image.jpg<br>
Alt text: Three transformational tasks highlighted in minimalist workspace with deep focus environment</p>
<!-- <img src="/blog-images/article-11/hero-image.jpg" alt="..."> -->
```

**Replace with:**
```html
<picture>
    <source srcset="/blog-images/article-11/hero-image.webp" type="image/webp">
    <img src="/blog-images/article-11/hero-image.jpg"
         alt="Three transformational tasks highlighted in minimalist workspace with deep focus environment"
         width="1600"
         height="900"
         loading="lazy">
</picture>
```

**Repeat for all 4 image placeholders.**

---

### Step 5: Add Video Embeds (Optional)

**Choose location** (see "Where to Add Video Embeds" above)

**Insert embed code:**
```html
<div class="video-embed" style="margin: 40px 0;">
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
        <iframe
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid var(--surface);"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Three Things Productivity System"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    </div>
    <p class="image-caption">Video explanation of the Three Things productivity system</p>
</div>
```

---

## ✅ Pre-Deployment Checklist

- [ ] All 4 image placeholders replaced with actual images
- [ ] All images optimized (<200KB each)
- [ ] WebP versions created with JPG fallbacks
- [ ] All images have proper alt text
- [ ] All images have width/height attributes (prevent CLS)
- [ ] Video embed added (optional)
- [ ] Test on mobile (images scale correctly)
- [ ] Test on desktop (all images load)
- [ ] Validate HTML (no broken tags)
- [ ] Check Lighthouse score (target 90+)

---

## 📂 Final File Structure

```
blog-images/article-11/
├── hero-image.jpg (1600×900px, <200KB)
├── hero-image.webp (1600×900px, <150KB)
├── ivy-lee-portrait.jpg (560×700px, <150KB)
├── ivy-lee-portrait.webp (560×700px, <100KB)
├── compound-effect-chart.jpg (900×500px, <150KB)
├── compound-effect-chart.webp (900×500px, <100KB)
├── pyramid-comparison.jpg (900×450px, <150KB)
└── pyramid-comparison.webp (900×450px, <100KB)
```

**Total:** 8 image files (4 images × 2 formats)

---

## 🎯 Quick Win Strategy

**If short on time, prioritize:**

1. **Hero image** (most important for social shares)
2. **Compound Effect Chart** (screenshot from HTML generator - 5 minutes)
3. **Pyramid Comparison** (screenshot from HTML generator - 5 minutes)
4. ~~Ivy Lee Portrait~~ (skip if needed, text flows fine without it)

**This gets you 75% of visual impact with 20% of the effort.**

---

## 🚀 Ready to Deploy

Once assets are replaced:
1. Upload HTML file to production
2. Upload `/blog-images/article-11/` folder
3. Test URL in Google Rich Results Test
4. Submit to Search Console for indexing
5. Share on social media (LinkedIn, Twitter)
6. Monitor analytics for first 48 hours

**Estimated time to replace all assets:** 1-2 hours
**Expected result:** Publication-ready SEO-optimized blog article
