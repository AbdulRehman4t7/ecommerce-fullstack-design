import { asset, IMAGES } from "@/lib/assets";

/** Named asset paths matched to actual file contents */
export const P = {
  phoneRed: asset("Image", "tech", "image 33.png"),
  phoneXiaomi: asset("Image", "tech", "image 23.png"),
  camera: asset("Image", "tech", "6.png"),
  smartwatch: asset("Image", "tech", "8.png"),
  gamingHeadset: asset("Image", "tech", "image 29.png"),
  headphones: asset("Image", "tech", "image 86.png"),
  headphonesAlt: asset("Layout", "alibaba", "Image", "tech", "image 86.png"),
  laptop: asset("Image", "tech", "image 34.png"),
  tablet: asset("Image", "tech", "image 32.png"),
  polo: asset("Layout", "alibaba", "Image", "cloth", "Bitmap.png"),
  denimShorts: asset("Layout", "alibaba", "Image", "cloth", "Bitmap (2).png"),
  blazer: asset("Layout", "alibaba", "Image", "cloth", "image 30.png"),
  parka: asset("Layout", "alibaba", "Image", "cloth", "2 1.png"),
  wallet: asset("Layout", "alibaba", "Image", "cloth", "image 24.png"),
  backpack: asset("Layout", "alibaba", "Image", "cloth", "image 26.png"),
};

const [i0, i1, i2, i3, i4, i5, i6, i7] = IMAGES.interior;

/** Supabase seed slugs → local /assets images (placehold.co returns SVG; Next Image rejects it) */
export const PRODUCT_IMAGE_BY_SLUG: Record<string, { image: string; images: string[] }> = {
  "samsung-galaxy-s24-ultra": { image: P.phoneRed, images: gal(P.phoneRed, P.phoneXiaomi, P.phoneRed) },
  "iphone-15-pro-max": { image: P.phoneXiaomi, images: gal(P.phoneXiaomi, P.phoneRed, P.smartwatch) },
  "macbook-pro-14-m3": { image: P.laptop, images: gal(P.laptop, P.tablet, P.laptop) },
  "dell-xps-15": { image: P.laptop, images: gal(P.laptop, P.laptop, P.tablet) },
  "canon-eos-r6": { image: P.camera, images: gal(P.camera, P.camera, P.tablet) },
  "gopro-hero12": { image: P.camera, images: gal(P.camera, P.phoneRed) },
  "sony-wh-1000xm5": { image: P.headphones, images: gal(P.headphones, P.headphonesAlt, P.headphones) },
  "jbl-flip-6": { image: P.gamingHeadset, images: gal(P.gamingHeadset, P.headphones) },
  "mens-cotton-tshirt-pack": { image: P.polo, images: gal(P.polo, P.denimShorts, P.polo) },
  "womens-floral-dress": { image: P.denimShorts, images: gal(P.denimShorts, P.polo) },
  "slim-fit-denim-jeans": { image: P.denimShorts, images: gal(P.denimShorts, P.polo) },
  "leather-jacket-mens": { image: P.blazer, images: gal(P.blazer, P.parka, P.blazer) },
  "running-sneakers-unisex": { image: P.backpack, images: gal(P.backpack, P.wallet) },
  "canvas-tote-bag": { image: P.backpack, images: gal(P.backpack, P.wallet, P.backpack) },
  "wool-winter-scarf": { image: P.wallet, images: gal(P.wallet, P.parka) },
  "kids-hooded-sweatshirt": { image: P.parka, images: gal(P.parka, P.polo, P.parka) },
  "modern-fabric-armchair": { image: i0, images: gal(i0, i1, i2) },
  "led-desk-lamp": { image: i1, images: gal(i1, i2, i3) },
  "ceramic-plant-pot-set": { image: i2, images: gal(i2, i3, i4) },
  "wooden-coffee-table": { image: i3, images: gal(i3, i4, i5) },
  "stainless-steel-kettle": { image: i4, images: gal(i4, i5, i6) },
  "wall-art-canvas": { image: i5, images: gal(i5, i6, i7) },
  "bamboo-storage-basket": { image: i6, images: gal(i6, i7, i0) },
  "patio-string-lights": { image: i7, images: gal(i7, i0, i1) },
};

function isUnusableImageUrl(url: string): boolean {
  if (!url) return true;
  return url.includes("placehold.co");
}

export function resolveProductImages(
  slug: string,
  dbImages?: string[] | null
): { image: string; images: string[] } {
  const bySlug = PRODUCT_IMAGE_BY_SLUG[slug];
  if (bySlug) return bySlug;

  const fromDb = dbImages?.filter((u) => u && !isUnusableImageUrl(u)) ?? [];
  if (fromDb.length > 0) {
    return { image: fromDb[0], images: fromDb };
  }

  return { image: P.phoneRed, images: [P.phoneRed] };
}

function gal(...paths: string[]): string[] {
  const unique: string[] = [];
  paths.forEach((p) => {
    if (!unique.includes(p)) unique.push(p);
  });
  let i = 0;
  while (unique.length < 5) {
    unique.push(paths[i % paths.length]);
    i++;
  }
  return unique.slice(0, 5);
}

/** Product id → images that match the product title/description */
export const PRODUCT_IMAGE_MAP: Record<number, { image: string; images: string[] }> = {
  // Mobile accessories
  1: { image: P.phoneRed, images: gal(P.phoneRed, P.phoneXiaomi, P.wallet, P.phoneRed) },
  2: { image: P.phoneXiaomi, images: gal(P.phoneXiaomi, P.phoneRed, P.phoneXiaomi) },
  3: { image: P.phoneRed, images: gal(P.phoneRed, P.phoneXiaomi, P.phoneRed) },
  4: { image: P.gamingHeadset, images: gal(P.gamingHeadset, P.headphones, P.headphonesAlt) },
  5: { image: P.phoneXiaomi, images: gal(P.phoneXiaomi, P.phoneRed, P.smartwatch) },
  6: { image: P.phoneXiaomi, images: gal(P.phoneXiaomi, P.phoneRed, P.phoneXiaomi) },
  7: { image: P.smartwatch, images: gal(P.smartwatch, P.smartwatch, P.phoneRed) },
  8: { image: P.phoneRed, images: gal(P.phoneRed, P.phoneXiaomi) },

  // Cameras
  9: { image: P.camera, images: gal(P.camera, P.camera, P.phoneRed) },
  10: { image: P.camera, images: gal(P.camera, P.camera) },
  11: { image: P.camera, images: gal(P.camera, P.camera, P.tablet) },
  12: { image: P.camera, images: gal(P.camera, P.tablet) },

  // Laptops
  13: { image: P.laptop, images: gal(P.laptop, P.laptop, P.tablet) },
  14: { image: P.laptop, images: gal(P.laptop, P.laptop, P.gamingHeadset) },
  15: { image: P.laptop, images: gal(P.laptop, P.tablet, P.laptop) },
  16: { image: P.tablet, images: gal(P.tablet, P.laptop, P.tablet) },

  // Audio
  17: { image: P.headphones, images: gal(P.headphones, P.headphonesAlt, P.headphones) },
  18: { image: P.gamingHeadset, images: gal(P.gamingHeadset, P.gamingHeadset, P.headphones) },
  19: { image: P.gamingHeadset, images: gal(P.gamingHeadset, P.gamingHeadset, P.headphones) },
  20: { image: P.headphonesAlt, images: gal(P.headphonesAlt, P.headphones, P.headphonesAlt) },

  // Clothing
  21: { image: P.polo, images: gal(P.polo, P.polo, P.denimShorts) },
  22: { image: P.polo, images: gal(P.polo, P.denimShorts, P.polo) },
  23: { image: P.blazer, images: gal(P.blazer, P.blazer, P.polo) },
  24: { image: P.parka, images: gal(P.parka, P.parka, P.backpack) },
};

export function applyProductImages(
  products: { id: number; image: string; images: string[] }[]
): void {
  products.forEach((product) => {
    const mapped = PRODUCT_IMAGE_MAP[product.id];
    if (mapped) {
      product.image = mapped.image;
      product.images = mapped.images;
    }
  });
}