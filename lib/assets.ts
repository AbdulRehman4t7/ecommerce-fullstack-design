/** Build a public URL for files served from /public/assets */
export function asset(...parts: string[]): string {
  return `/assets/${parts.map((p) => encodeURIComponent(p)).join("/")}`;
}

export const IMAGES = {
  logo: asset("Layout", "Brand", "logo-colored.png"),
  heroBanner: asset("Image", "backgrounds", "Banner-board-800x420 2.png"),
  heroProduct: asset("Image", "tech", "image 86.png"),
  dealThumb: asset("Image", "tech", "6.png"),
  promoBanner: asset("Image", "backgrounds", "Mask group.png"),
  appStore: asset("Layout", "Misc", "market-button.png"),
  googlePlay: asset("Layout", "Misc", "Group.png"),

  tech: [
    asset("Image", "tech", "6.png"),
    asset("Image", "tech", "8.png"),
    asset("Image", "tech", "image 23.png"),
    asset("Image", "tech", "image 29.png"),
    asset("Image", "tech", "image 32.png"),
    asset("Image", "tech", "image 33.png"),
    asset("Image", "tech", "image 34.png"),
    asset("Image", "tech", "image 85.png"),
    asset("Image", "tech", "image 86.png"),
    asset("Layout", "alibaba", "Image", "tech", "image 85.png"),
    asset("Layout", "alibaba", "Image", "tech", "image 86.png"),
  ],

  cloth: [
    asset("Layout", "alibaba", "Image", "cloth", "Bitmap.png"),
    asset("Layout", "alibaba", "Image", "cloth", "Bitmap (2).png"),
    asset("Layout", "alibaba", "Image", "cloth", "image 24.png"),
    asset("Layout", "alibaba", "Image", "cloth", "image 26.png"),
    asset("Layout", "alibaba", "Image", "cloth", "image 30.png"),
    asset("Layout", "alibaba", "Image", "cloth", "2 1.png"),
  ],

  interior: [
    asset("Image", "interior", "1.png"),
    asset("Image", "interior", "3.png"),
    asset("Image", "interior", "6.png"),
    asset("Image", "interior", "7.png"),
    asset("Image", "interior", "8.png"),
    asset("Image", "interior", "9.png"),
    asset("Image", "interior", "image 89.png"),
    asset("Image", "interior", "image 93.png"),
    asset("Layout", "alibaba", "Image", "interior", "image 90.png"),
  ],

  serviceBgs: [
    asset("Image", "backgrounds", "Group 969.png"),
    asset("Image", "backgrounds", "Group 982.png"),
    asset("Image", "backgrounds", "image 98.png"),
    asset("Image", "backgrounds", "image 106.png"),
  ],

  flags: {
    China: asset("Layout1", "Image", "flags", "CN@2x.png"),
    "United States": asset("Layout1", "Image", "flags", "US@2x.png"),
    France: asset("Layout1", "Image", "flags", "FR@2x.png"),
    Russia: asset("Layout1", "Image", "flags", "RU@2x.png"),
    Denmark: asset("Layout1", "Image", "flags", "DK@2x.png"),
    Italy: asset("Layout1", "Image", "flags", "IT@2x.png"),
    Germany: asset("Layout1", "Image", "flags", "DE@2x.png"),
    "United Kingdom": asset("Layout1", "Image", "flags", "GB@2x.png"),
    UAE: asset("Layout1", "Image", "flags", "AE@2x.png"),
  } as Record<string, string>,
};

export function gallery(pool: string[], startIndex: number): string[] {
  return Array.from({ length: 5 }, (_, i) => pool[(startIndex + i) % pool.length]);
}

export function techImage(index: number): string {
  return IMAGES.tech[index % IMAGES.tech.length];
}

export function clothImage(index: number): string {
  return IMAGES.cloth[index % IMAGES.cloth.length];
}
