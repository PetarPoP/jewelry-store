'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`bg-background/90 border-primary/10 sticky top-0 z-50 w-full backdrop-blur-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex items-center md:w-1/4">
            <Link href="/" className="text-primary text-xl font-bold tracking-tight">
              Zlatarna Popović
            </Link>
          </div>
          <nav className="hidden md:flex md:flex-1 md:justify-center">
            <div className="flex space-x-8">
              <Link href="/" passHref>
                <Button
                  variant="link"
                  className={`text-foreground hover:text-primary ${pathname === '/' ? 'underline underline-offset-4' : ''}`}
                >
                  Home
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button
                  variant="link"
                  className={`text-foreground hover:text-primary ${pathname === '/contact' ? 'underline underline-offset-4' : ''}`}
                >
                  Contact
                </Button>
              </Link>
            </div>
          </nav>
          <div className="md:flex md:w-1/4 md:justify-end">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pt-2 pb-3">
            <Link href="/" passHref>
              <Button
                variant="link"
                className={`text-foreground hover:text-primary block w-full text-left ${
                  pathname === '/' ? 'underline underline-offset-4' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button
                variant="link"
                className={`text-foreground hover:text-primary block w-full text-left ${
                  pathname === '/contact' ? 'underline underline-offset-4' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
