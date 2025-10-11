import React from "react";

// SVG icons
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 012.153 1.252A4.902 4.902 0 0122 8.514c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.252 2.153 4.902 4.902 0 01-2.153 1.252c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-2.153-1.252A4.902 4.902 0 012 15.486c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.252-2.153A4.902 4.902 0 016.514 2c.636-.247 1.363-.416 2.427-.465C9.968 2.013 10.323 2 12.315 2zm-1.127 6.552a4.425 4.425 0 100 8.85 4.425 4.425 0 000-8.85zm-6.023 4.425a6.023 6.023 0 1112.046 0 6.023 6.023 0 01-12.046 0zm12.336-5.505a1.424 1.424 0 100 2.848 1.424 1.424 0 000-2.848z"
      clipRule="evenodd"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.206v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.282 8.905H4.056v-8.59h2.563v8.59zM17.635 2H6.365A4.365 4.365 0 002 6.365v11.27A4.365 4.365 0 006.365 22h11.27A4.365 4.365 0 0022 17.635V6.365A4.365 4.365 0 0017.635 2z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 to-purple-700 opacity-90 font-sans text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold text-white">CampusCupid</h2>
            <p className="mt-4 text-pink-100/90">
              Connecting students, one campus at a time. Find friends, study
              partners, and maybe something more.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white">Product</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#features" className="text-pink-100/90 hover:text-white transition-colors">Features</a></li>
              <li><a href="#testimonials" className="text-pink-100/90 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#safety" className="text-pink-100/90 hover:text-white transition-colors">Safety</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#about" className="text-pink-100/90 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#careers" className="text-pink-100/90 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#press" className="text-pink-100/90 hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#privacy" className="text-pink-100/90 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-pink-100/90 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#guidelines" className="text-pink-100/90 hover:text-white transition-colors">Community Guidelines</a></li>
            </ul>
          </div>

          {/* 🆕 Contact Section */}
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <p className="mt-4 text-pink-100/90 text-sm">
              Get in touch with us or follow our updates on social platforms:
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://www.instagram.com/manan_kuchhal/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-pink-100/90 hover:text-white transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://x.com/Aggarwalmanan1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-pink-100/90 hover:text-white transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/manan-aggarwal-a4b21a283/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-pink-100/90 hover:text-white transition-colors"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-pink-100/90">
            © {new Date().getFullYear()} CampusCupid. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
