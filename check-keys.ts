import * as clerkNextjs from '@clerk/nextjs';
console.log('--- @clerk/nextjs keys ---');
console.log(Object.keys(clerkNextjs).filter(k => k.includes('Sign')));
