import Image from "next/image";
import { IMAGES } from "@/lib/assets";

export default function TopBar() {
  const items = [
    "Save big on top brands",
    "Get the app",
    "Help",
    "English/USD",
  ];

  return (
    <div className="hidden border-b border-border bg-page-bg sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-end gap-0 px-4 py-1.5">
        {items.map((item, i) => (
          <span key={item} className="flex items-center">
            {i > 0 && <span className="mx-2 text-border">|</span>}
            <button
              type="button"
              className="text-xs text-grey-text hover:text-primary"
            >
              {item}
            </button>
          </span>
        ))}
        <span className="mx-2 text-border">|</span>
        <span className="relative ml-0 inline-block h-3.5 w-5">
          <Image
            src={IMAGES.flags.Germany}
            alt="Germany"
            fill
            className="object-contain"
            sizes="20px"
          />
        </span>
      </div>
    </div>
  );
}
