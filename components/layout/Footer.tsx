import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, Share2, Rss } from "lucide-react";
import { footerLinks } from "@/data/mockData";
import { IMAGES } from "@/lib/assets";

export default function Footer() {
  const columns = [
    { title: "About", links: footerLinks.about },
    { title: "Partnership", links: footerLinks.partnership },
    { title: "Information", links: footerLinks.information },
    { title: "For users", links: footerLinks.forUsers },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src={IMAGES.logo}
                alt="Brand"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 text-sm text-grey-text">
              Global B2B marketplace connecting buyers with verified suppliers
              worldwide.
            </p>
            <div className="mt-4 flex gap-3">
              {[Globe, Share2, Mail, Rss].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="rounded-full border border-border p-2 text-grey-text hover:border-primary hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-dark-text">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-grey-text hover:text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-dark-text">App</h4>
            <div className="space-y-2">
              <Image
                src={IMAGES.appStore}
                alt="Download on the App Store"
                width={140}
                height={40}
                className="h-10 w-auto object-contain object-left"
              />
              <Image
                src={IMAGES.googlePlay}
                alt="Get it on Google Play"
                width={140}
                height={40}
                className="h-10 w-auto object-contain object-left"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border bg-page-bg py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm text-grey-text">
          <span>© 2023 Ecommerce</span>
          <span>🇩🇪 English ↑</span>
        </div>
      </div>
    </footer>
  );
}
