import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Cursor & Selection Integrity', () => {
  const rootDir = process.cwd();

  it('no CSS file in src/ contains cursor: none', () => {
    const cssFiles = [];
    const walkSync = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkSync(fullPath);
        } else if (file.endsWith('.css')) {
          cssFiles.push(fullPath);
        }
      }
    };
    walkSync(path.join(rootDir, 'src'));

    expect(cssFiles.length).toBeGreaterThan(0);
    const violations = [];

    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf8');
      // Look for cursor: none (ignoring comments)
      const cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, '');
      const match = cleanContent.match(/cursor\s*:\s*none/i);
      if (match) {
        violations.push({ file: path.relative(rootDir, file), match: match[0] });
      }
    }

    expect(violations).toEqual([]);
  });

  it('stylelint disallows cursor: none', () => {
    const stylelintConfigPath = path.join(rootDir, '.stylelintrc.json');
    expect(fs.existsSync(stylelintConfigPath)).toBe(true);
    const config = JSON.parse(fs.readFileSync(stylelintConfigPath, 'utf8'));
    const disallowed = config.rules?.['declaration-property-value-disallowed-list'];
    expect(disallowed).toBeDefined();
    expect(disallowed.cursor).toBeDefined();
    expect(disallowed.cursor).toContain('none');
  });

  it('CustomCursor component adheres to safety and accessibility invariants', () => {
    const customCursorPath = path.join(rootDir, 'src/components/CustomCursor.jsx');
    expect(fs.existsSync(customCursorPath)).toBe(true);
    const code = fs.readFileSync(customCursorPath, 'utf8');

    // 1. Checks (pointer: fine) and (hover: hover)
    expect(code).toContain('(pointer: fine) and (hover: hover)');
    // 2. Checks prefers-reduced-motion
    expect(code).toContain('prefers-reduced-motion');
    // 3. Suppressed over native interactive selectors
    expect(code).toContain('NATIVE_CURSOR_SELECTOR');
    expect(code).toContain('input');
    expect(code).toContain('textarea');
    expect(code).toContain('code');
    // 4. Auto-disables on blur, tab hide, and unhandled window error
    expect(code).toContain("'blur'");
    expect(code).toContain("'visibilitychange'");
    expect(code).toContain("'error'");
  });

  it('::selection has contrast tokens defined in globals.css', () => {
    const globalsPath = path.join(rootDir, 'src/app/globals.css');
    const globals = fs.readFileSync(globalsPath, 'utf8');
    expect(globals).toContain('::selection');
    expect(globals).toContain('--selection-bg');
    expect(globals).toContain('--selection-text');
  });

  it('body element never declares cursor: none in globals.css', () => {
    const globalsPath = path.join(rootDir, 'src/app/globals.css');
    const globals = fs.readFileSync(globalsPath, 'utf8');
    const bodyMatch = globals.match(/body\s*\{[^}]*\}/s);
    expect(bodyMatch).not.toBeNull();
    expect(bodyMatch[0]).not.toContain('cursor: none');
  });
});
