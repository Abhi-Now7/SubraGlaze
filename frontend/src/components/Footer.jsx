import React from 'react';
import { Mail, Globe, Code } from 'lucide-react';

function Footer() {
  return (
    <footer className="fade-in mt-20 bg-ink text-stone py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="card p-6">
            <h3 className="font-display font-bold text-white mb-4">SubraGlaze</h3>
            <p className="text-stone/60">
              A modern blogging platform where voices meet ideas. Built for writers who care about craft and community.
            </p>
          </div>
          {/* Nav */}
          <div>
            <p className="font-semibold text-white mb-3">Navigate</p>
            <a href="/" className="link-animate block text-stone/60 hover:text-white">Home</a>
            <a href="/dashboard" className="link-animate block text-stone/60 hover:text-white">Dashboard</a>
            <a href="/settings" className="link-animate block text-stone/60 hover:text-white">Settings</a>
          </div>
          {/* Social */}
          <div className="space-y-2">
            <p className="font-semibold text-white mb-3">Connect</p>
            <div className="flex items-center gap-3 link-animate">
              <Mail size={20} /> hello@subraglaze.com
            </div>
            <div className="flex items-center gap-3 link-animate">
              <Globe size={20} /> subraglaze.com
            </div>
            <div className="flex items-center gap-3 link-animate">
              <Code size={20} /> GitHub: @subraglaze
            </div>
          </div>
          {/* Subscribe */}
          <div className="card p-6 space-y-2">
            <p className="font-semibold text-white mb-3">Stay updated</p>
            <form id="subscribe-form" className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-md border border-stone/20 bg-paper/70 px-3 py-2 text-stone/80 placeholder-stone/30 focus:outline-none focus:ring-2 focus:ring-ochre"
                required
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-sm text-stone/40">
              We'll send you a monthly digest of the best stories. No spam, ever.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-stone/20 text-center text-sm text-stone/40">
          © {new Date().getFullYear()} SubraGlaze. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;