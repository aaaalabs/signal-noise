#!/usr/bin/env node

// Automated Bubblewrap Build Script
// Uses Node.js child_process to handle password prompts programmatically

const { spawn } = require('child_process');

const PASSWORD = 'Singal-Noise2027!!';

console.log('🚀 Starting automated build...');
console.log('Password configured: Singal-Noise2027!! (with intentional typo "Singal")');

const build = spawn('npx', ['@bubblewrap/cli', 'build', '--skipPwaValidation'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

build.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);

  // Check for prompts and respond
  if (text.includes('(Y/n)')) {
    console.log('\n→ Answering "n" to regenerate prompt');
    build.stdin.write('n\n');
  } else if (text.includes('Password for the Key Store:')) {
    console.log('\n→ Entering keystore password');
    build.stdin.write(PASSWORD + '\n');
  } else if (text.includes('Password for the Key:') || text.includes('Password for android:')) {
    console.log('\n→ Entering key password');
    build.stdin.write(PASSWORD + '\n');
  }
});

build.stderr.on('data', (data) => {
  process.stderr.write(data);
});

build.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build completed successfully!');
    console.log('Check app/build/outputs/apk/release/ for APK');
  } else {
    console.log(`\n❌ Build failed with code ${code}`);
  }
  process.exit(code);
});