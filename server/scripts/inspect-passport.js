import path from 'path';
import fs from 'fs';

console.log('process.cwd():', process.cwd());

try {
  // Use dynamic import to be ESM-compatible
  const passportModule = await import('passport');
  const passport = passportModule.default || passportModule;
  console.log('passport._strategies:', Object.keys(passport._strategies || {}));

  // Resolve package.json for passport
  const passportPkgPath = new URL('../../node_modules/passport/package.json', import.meta.url).pathname;
  if (fs.existsSync(passportPkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(passportPkgPath, 'utf8'));
    console.log('passport version:', pkg.version || '<unknown>');
  }
} catch (err) {
  console.error('Error inspecting passport:', err && err.stack ? err.stack : err.message || err);
}
