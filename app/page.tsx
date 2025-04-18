import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';
import ParallaxTimeline from '@/components/timeline/ParallaxTimeline';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navigation />
      <div className="animate-fade-in min-h-screen bg-neutral-50 font-serif text-neutral-900">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-neutral-100 to-neutral-50 py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                  <span className="block">Timeless Elegance,</span>
                  <span className="mt-2 block font-medium text-amber-600">
                    Modern Craftsmanship
                  </span>
                </h1>
                <p className="mx-auto max-w-xl text-lg text-neutral-600 lg:mx-0">
                  Discover our exquisite collection of handcrafted jewelry that combines traditional
                  techniques with contemporary design.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button className="bg-amber-600 text-white hover:bg-amber-700">
                    Explore Collection
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    Book Consultation
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-xl shadow-2xl lg:h-[500px]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=1000')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Parallax Timeline */}
        <ParallaxTimeline />

        {/* Newsletter */}
        <section className="bg-amber-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-light tracking-tight text-neutral-900">
                Join Our Exclusive List
              </h2>
              <p className="mt-4 text-neutral-600">
                Subscribe to receive updates on new collections, special events, and exclusive
                offers.
              </p>
              <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
                <div className="flex-grow">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full rounded-md border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
                <Button className="bg-amber-600 whitespace-nowrap text-white hover:bg-amber-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 py-12 text-neutral-400">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-10 flex flex-col items-center justify-between border-t border-neutral-800 pt-6 sm:flex-row">
              <p>&copy; {new Date().getFullYear()} Zlatarna Popović. All rights reserved.</p>
              <div className="mt-4 flex space-x-4 sm:mt-0">
                <a href="#" className="text-sm transition-colors hover:text-amber-400">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm transition-colors hover:text-amber-400">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
