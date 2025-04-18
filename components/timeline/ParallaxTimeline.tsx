'use client';

import { useEffect, useRef, useState } from 'react';

export default function ParallaxTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ];
  
  // Track which sections are visible and active
  const [visibleSections, setVisibleSections] = useState([false, false, false]);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Function to check if an element is in viewport with offset
    const isInViewport = (element: HTMLElement, offset = 200) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= window.innerHeight - offset &&
        rect.bottom >= offset
      );
    };

    // Function to get section closest to center of viewport
    const getActiveSection = () => {
      let closestSection = 0;
      let closestDistance = Infinity;
      
      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = index;
          }
        }
      });
      
      return closestSection;
    };

    const handleScroll = () => {
      if (!timelineRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Update visibility of each section
      const newVisibleSections = [...visibleSections];
      sectionRefs.forEach((ref, index) => {
        if (ref.current) {
          newVisibleSections[index] = isInViewport(ref.current, 250);
        }
      });
      
      if (JSON.stringify(newVisibleSections) !== JSON.stringify(visibleSections)) {
        setVisibleSections(newVisibleSections);
      }
      
      // Find which section is closest to center
      const newActiveSection = getActiveSection();
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
      
      // Apply scroll-based transformations to each section
      sectionRefs.forEach((ref, index) => {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distanceFromCenter = (windowHeight / 2 - sectionCenter) / windowHeight;
        
        // Get elements within this section
        const yearElement = ref.current.querySelector('.year-badge') as HTMLElement;
        const imageElement = ref.current.querySelector('.parallax-image') as HTMLElement;
        const contentElement = ref.current.querySelector('.content-block') as HTMLElement;
        
        if (yearElement) {
          // Fade in year when in view, stronger effect for non-active sections
          const opacity = newVisibleSections[index] 
            ? Math.min(1, 1 - Math.abs(distanceFromCenter) * 1.5)
            : 0;
            
          // Move year with parallax effect
          const translateY = distanceFromCenter * 100;
          
          yearElement.style.opacity = opacity.toString();
          yearElement.style.transform = `translateY(${translateY}px)`;
        }
        
        if (imageElement) {
          // Counter-scrolling for images (slower than normal scroll)
          const imageParallax = -distanceFromCenter * 120;
          const scale = 1 + Math.abs(distanceFromCenter) * 0.1;
          
          imageElement.style.transform = `translateY(${imageParallax}px) scale(${scale})`;
          
          // Adjust opacity for better fade in/out
          const imageOpacity = newVisibleSections[index] 
            ? Math.min(1, 1 - Math.abs(distanceFromCenter) * 2)
            : 0.3;
          
          imageElement.style.opacity = (0.8 + imageOpacity * 0.2).toString();
        }
        
        if (contentElement) {
          // Text becomes more transparent as it moves away from center
          // For non-active sections, make text more transparent
          const isActive = index === newActiveSection;
          const contentOpacity = newVisibleSections[index] 
            ? Math.min(1, 1 - Math.abs(distanceFromCenter) * (isActive ? 1.2 : 2.5))
            : 0;
          
          // More rapid fade for non-active sections
          const finalOpacity = isActive ? contentOpacity : contentOpacity * 0.6;
          
          // Slide content
          const contentTranslate = distanceFromCenter * 60;
          
          contentElement.style.transform = `translateY(${contentTranslate}px)`;
          contentElement.style.opacity = finalOpacity.toString();
        }
      });
    };

    // Snap scrolling function
    const snapToSection = () => {
      if (isScrolling || !sectionRefs[activeSection].current) return;
      
      setIsScrolling(true);
      const targetElement = sectionRefs[activeSection].current;
      const targetPosition = targetElement!.getBoundingClientRect().top + window.scrollY - 
        (window.innerHeight / 2 - targetElement!.offsetHeight / 2);
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Prevent additional snapping during animation
      setTimeout(() => setIsScrolling(false), 800);
    };

    // Debounce function for snap scrolling
    let scrollTimeout: NodeJS.Timeout;
    const debouncedSnap = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isScrolling) {
          snapToSection();
        }
      }, 100);
    };

    // Initial check to set visibility
    handleScroll();

    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', debouncedSnap);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', debouncedSnap);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [visibleSections, activeSection, isScrolling]);

  // Function to navigate to a specific section
  const goToSection = (index: number) => {
    if (!sectionRefs[index].current || isScrolling) return;
    
    setIsScrolling(true);
    setActiveSection(index);
    
    const targetElement = sectionRefs[index].current;
    const targetPosition = targetElement!.getBoundingClientRect().top + window.scrollY - 
      (window.innerHeight / 2 - targetElement!.offsetHeight / 2);
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    setTimeout(() => setIsScrolling(false), 800);
  };

  return (
    <section ref={timelineRef} className="bg-neutral-100 py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Timeline Navigation Dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 transform z-50 hidden md:block">
          <div className="flex flex-col space-y-4">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => goToSection(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 
                  ${activeSection === index ? 'bg-amber-600 scale-150' : 'bg-amber-300 hover:bg-amber-400'}`}
                aria-label={`Go to section ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Timeline Line - now with gradient for better visual effect */}
        <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200"></div>

        {/* 1917 */}
        <div ref={sectionRefs[0]} className="timeline-section relative mb-64 min-h-[70vh] py-16 flex items-center">
          <div className="w-full">
            <div className="mb-12 flex items-center justify-center">
              <div className="year-badge z-10 rounded-full bg-amber-600 px-8 py-3 text-2xl font-medium text-white shadow-lg transition-all duration-700 opacity-0">
                1917
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="content-block order-2 transition-all duration-700 md:order-1 opacity-0">
                <h3 className="mb-4 text-2xl font-medium text-amber-600">Our Beginning</h3>
                <p className="text-neutral-700">
                  In the heart of the city, Zlatarna Popović was founded by master goldsmith Ivan
                  Popović. With only a small workshop and unparalleled dedication to craftsmanship,
                  he began creating unique pieces that would soon become sought after throughout the
                  region.
                </p>
              </div>
              <div className="order-1 overflow-hidden md:order-2">
                <div className="parallax-image relative h-72 overflow-hidden rounded-lg shadow-xl transition-all duration-700 md:h-96 opacity-80">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1627930738566-b55f19e3883b?q=80&w=2069')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1980 */}
        <div ref={sectionRefs[1]} className="timeline-section relative mb-64 min-h-[70vh] py-16 flex items-center">
          <div className="w-full">
            <div className="mb-12 flex items-center justify-center">
              <div className="year-badge z-10 rounded-full bg-amber-600 px-8 py-3 text-2xl font-medium text-white shadow-lg transition-all duration-700 opacity-0">
                1980
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="content-block transition-all duration-700 md:order-2 opacity-0">
                <h3 className="mb-4 text-2xl font-medium text-amber-600">Expanding Our Vision</h3>
                <p className="text-neutral-700">
                  Under the leadership of second-generation owner Maria Popović, our family business
                  expanded into a prominent jewelry store with a reputation for excellence. We began
                  incorporating modern techniques while preserving the traditional craftsmanship
                  that had become our signature.
                </p>
              </div>
              <div className="overflow-hidden md:order-1">
                <div className="parallax-image relative h-72 overflow-hidden rounded-lg shadow-xl transition-all duration-700 md:h-96 opacity-80">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2025 */}
        <div ref={sectionRefs[2]} className="timeline-section relative min-h-[70vh] py-16 flex items-center">
          <div className="w-full">
            <div className="mb-12 flex items-center justify-center">
              <div className="year-badge z-10 rounded-full bg-amber-600 px-8 py-3 text-2xl font-medium text-white shadow-lg transition-all duration-700 opacity-0">
                2025
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="content-block order-2 transition-all duration-700 md:order-1 opacity-0">
                <h3 className="mb-4 text-2xl font-medium text-amber-600">The Future is Bright</h3>
                <p className="text-neutral-700">
                  Today, Zlatarna Popović continues to innovate while honoring our heritage. Our
                  third-generation artisans blend cutting-edge technology with time-honored
                  techniques to create jewelry that transcends trends. As we look to the future, we
                  remain committed to creating pieces that will be cherished for generations to
                  come.
                </p>
              </div>
              <div className="order-1 overflow-hidden md:order-2">
                <div className="parallax-image relative h-72 overflow-hidden rounded-lg shadow-xl transition-all duration-700 md:h-96 opacity-80">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633810542706-90e5ff7557be?q=80&w=2070')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-700"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}