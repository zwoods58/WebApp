/**
 * Footer Component
 * Site footer with links, contact info, and social media.
 */

export interface FooterProps {
  businessName: string;
  footerDescription?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  quickLinks?: Array<{
    label: string;
    href: string;
  }>;
}

export default function Footer({
  businessName,
  footerDescription,
  businessEmail,
  businessPhone,
  businessAddress,
  socialLinks = [
    { platform: "Facebook", url: "#" },
    { platform: "Twitter", url: "#" },
    { platform: "Instagram", url: "#" },
  ],
  quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{businessName}</h3>
            {footerDescription && (
              <p className="text-gray-400">{footerDescription}</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-white transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              {businessEmail && <li>{businessEmail}</li>}
              {businessPhone && <li>{businessPhone}</li>}
              {businessAddress && <li>{businessAddress}</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-gray-400 hover:text-white transition"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {businessName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

