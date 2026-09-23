"use client";

import { useAuth, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, Video, Map, Briefcase } from 'lucide-react'
import { DropdownMenuContent, DropdownMenuTrigger, DropdownMenu, DropdownMenuItem } from './ui/dropdown-menu'

const Header = () => {
  const { isLoaded, userId } = useAuth();

  return (
    <header className='fixed top-0 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl z-50 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'>
      <nav className='container mx-auto px-4 sm:px-6 h-16 sm:h-16 flex items-center justify-between'>
        <Link href="/" className='flex items-center gap-2 sm:gap-3 group'>
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/30 transition-all rounded-full" />
            <svg 
              viewBox="0 0 100 100" 
              className="w-8 h-8 sm:w-10 sm:h-10 relative z-10 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
              </defs>
              <path 
                d="M30 20 L30 80 M30 50 L70 20 M30 50 L70 80" 
                fill="none" 
                stroke="url(#logoGradient)" 
                strokeWidth="12" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="30" cy="50" r="5" fill="#10b981" className="animate-pulse" />
            </svg>
          </div>
          <div className='flex flex-col min-w-0'>
            <span className='text-lg sm:text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-all leading-none whitespace-nowrap'>
              CareerMind<span className="text-primary"> AI</span>
            </span>
            <span className='text-[7px] sm:text-[8px] font-bold tracking-[0.2em] text-muted-foreground uppercase mt-0.5 sm:mt-1 hidden sm:block whitespace-nowrap'>
              Your AI Career Mentor
            </span>
          </div>
        </Link>
        <div className='flex items-center gap-1 sm:gap-2'>
          {isLoaded && userId && (
            <div className="hidden md:flex items-center gap-4 lg:gap-6 mr-4 lg:mr-6">
              <Link href="/dashboard" className="text-xs lg:text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <LayoutDashboard className='h-3.5 w-3.5 lg:h-4 lg:w-4' />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              <Link href="/tools" className="text-xs lg:text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <Briefcase className='h-3.5 w-3.5 lg:h-4 lg:w-4' />
                <span className="hidden lg:inline">Tools</span>
              </Link>
            </div>
          )}

          {isLoaded && !userId && (
            <>
              <SignInButton mode="modal">
                <Button variant={"ghost"} size="sm" className="text-xs sm:text-sm px-3 sm:px-4">Sign In</Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </>
          )}

          {isLoaded && userId && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold"
                },
              }}
            />
          )}
        </div>
      </nav>

    </header>
  )
}

export default Header