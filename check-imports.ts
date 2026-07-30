import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from './components/ui/button';
import { LayoutDashboard, Briefcase } from 'lucide-react';

console.log('SignInButton:', !!SignInButton);
console.log('SignedIn:', !!SignedIn);
console.log('SignedOut:', !!SignedOut);
console.log('UserButton:', !!UserButton);
console.log('Button:', !!Button);
console.log('LayoutDashboard:', !!LayoutDashboard);
console.log('Briefcase:', !!Briefcase);
