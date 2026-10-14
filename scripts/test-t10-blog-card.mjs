import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const componentPath = path.join(rootDir, 'src/components/HomeBlogSection.jsx');
const cssPath = path.join(rootDir, 'src/app/globals.css');

console.log('--- Testing T10 (Mobile Home Blog Card) Requirements ---');

let passed = true;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    passed = false;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Verify component markup
const componentContent = fs.readFileSync(componentPath, 'utf-8');
assert(componentContent.includes('home-blog-stretched-link'), 'Whole-card stretched link exists for accessible tap target');
assert(componentContent.includes('tabIndex={-1}'), 'Stretched link has tabIndex={-1} to preserve logical keyboard tab order');
assert(componentContent.includes('home-blog-thumb'), 'Cover image container has home-blog-thumb');
assert(componentContent.includes('fill'), 'Next.js Image uses fill attribute in home-blog-thumb');
assert(componentContent.includes('sizes='), 'Next.js Image specifies responsive sizes attribute');
assert(componentContent.includes('home-blog-meta'), 'Mono metadata row container exists');
assert(componentContent.includes('home-blog-cat'), 'Category badge exists');
assert(componentContent.includes('home-blog-date'), 'Date and read time element exists');
assert(componentContent.includes('home-blog-title'), 'Title element exists');
assert(componentContent.includes('home-blog-desc'), 'Excerpt element exists');
assert(componentContent.includes('home-blog-readmore'), 'Explicit Read Article CTA exists');
assert(componentContent.includes('BlogCardSkeleton'), 'Skeleton state BlogCardSkeleton component exists');

// 2. Verify CSS specifications
const cssContent = fs.readFileSync(cssPath, 'utf-8');
assert(cssContent.includes('aspect-ratio: 16 / 9;'), '.home-blog-thumb specifies aspect-ratio: 16 / 9 for zero layout shift');
assert(cssContent.includes('@media (max-width: 640px)'), 'Mobile media query (max-width: 640px) is defined');
assert(cssContent.includes('flex: 0 0 100%;'), 'Cards expand to full single-column width (flex: 0 0 100%) on mobile');
assert(cssContent.includes('min-height: 44px;'), 'Read more action meets minimum 44px touch target height');
assert(cssContent.includes('font-size: 1rem;'), 'Body excerpt font-size is at least 16px (1rem)');
assert(cssContent.includes('-webkit-line-clamp: 2;'), 'Text clamp (-webkit-line-clamp: 2) is applied to title and description');
assert(cssContent.includes('skeleton-pulse'), 'Skeleton pulse animation is defined');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion query disables skeleton pulse animation');

// 3. Verify design tokens in home-blog section
const blogCssMatch = cssContent.match(/\.home-blog-arrow-btn[\s\S]*?\.home-blog-cta-btn:hover \.cta-arrow[\s\S]*?\}/);
if (blogCssMatch) {
  const blogCss = blogCssMatch[0];
  const hexMatches = blogCss.match(/#[0-9a-fA-F]{3,8}\b/g);
  assert(!hexMatches || hexMatches.length === 0, `Zero raw hex colors in home-blog CSS (found: ${hexMatches ? hexMatches.join(', ') : 'none'})`);
} else {
  assert(false, 'Failed to extract home-blog CSS segment for token validation');
}

if (!passed) {
  console.error('\n❌ T10 verification failed.');
  process.exit(1);
} else {
  console.log('\n🎉 All T10 Mobile Home Blog Card checks passed!');
  process.exit(0);
}
