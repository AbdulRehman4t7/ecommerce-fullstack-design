"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Minus, Plus, Truck } from "lucide-react";
import StarRating from "@/components/shared/StarRating";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/shared/ProductCard";
import PromoBanner from "@/components/shared/PromoBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { Product } from "@/types";
import { productReviews, relatedProducts } from "@/data/mockData";

const colors = [
  { name: "Purple", class: "bg-purple-600" },
  { name: "Orange", class: "bg-accent" },
  { name: "Black", class: "bg-gray-900" },
];

const sizes = ["XS", "S", "M", "L", "XL"];

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  const tabs = ["description", "reviews", "shipping", "about seller"];

  return (
    <div className="mx-auto max-w-7xl px-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: product.category, href: "/products" },
          { label: product.subcategory },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative mx-auto aspect-square max-w-[400px] rounded border border-border bg-white p-4">
            <Image
              src={product.images[selectedImage] || product.image}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="400px"
              priority
            />
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {product.images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`relative h-[60px] w-[60px] overflow-hidden rounded border-2 ${
                  selectedImage === i ? "border-primary" : "border-border"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="60px" />
              </button>
            ))}
          </div>
          <Link
            href="#reviews"
            className="mt-2 block text-center text-sm text-primary hover:underline"
          >
            {product.reviews} reviews
          </Link>
        </div>

        <div className="lg:col-span-3">
          <p className="text-sm text-grey-text">
            ✅ {product.seller} (1) — {product.sellerFlag}{" "}
            {product.sellerCountry}
          </p>
          <h1 className="mt-2 text-xl font-bold text-dark-text md:text-2xl">
            {product.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating rating={product.rating} showValue />
            <span className="text-sm text-grey-text">
              | {product.sold} orders
            </span>
            {product.freeShipping && (
              <span className="flex items-center gap-1 text-sm text-success">
                <Truck size={16} /> Free Shipping
              </span>
            )}
          </div>

          <div className="mt-4 rounded border border-primary/30 bg-blue-50 p-4">
            {product.originalPrice && (
              <p className="text-sm text-grey-text line-through">
                Was: ${product.originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-bold text-accent">
              Now: ${product.price.toFixed(2)}
            </p>
            {discount && (
              <span className="mt-1 inline-block rounded bg-success px-2 py-0.5 text-xs text-white">
                Save {discount}%
              </span>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">
              Color: <span className="text-grey-text">{selectedColor}</span>
            </p>
            <div className="mt-2 flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`h-8 w-8 rounded border-2 ${c.class} ${
                    selectedColor === c.name
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                  }`}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">
              Size: <span className="text-grey-text">{selectedSize}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[40px] rounded border px-3 py-1.5 text-sm ${
                    selectedSize === s
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center rounded border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-page-bg"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[40px] text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 hover:bg-page-bg"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-sm text-grey-text">{product.unit}s</span>
            {product.stock <= 10 && (
              <span className="text-sm text-accent">
                In Stock: {product.stock} left
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded border border-primary py-2.5 text-sm font-medium text-primary hover:bg-blue-50"
            >
              <MessageCircle size={18} /> Send message
            </button>
            <button
              type="button"
              onClick={() => addToCart(product, quantity)}
              className="w-full rounded bg-success py-3 text-sm font-semibold text-white hover:bg-success/90"
            >
              🛒 Add to cart
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1 text-sm text-grey-text hover:text-dark-text"
            >
              <Heart size={16} /> Save for later
            </button>
          </div>

          <div className="mt-4 space-y-2 rounded border border-border p-4 text-sm">
            <p>
              🚚 Shipping: $7.00 to United States via AliExpress
            </p>
            <p>✅ Buyer Protection: Money back guarantee</p>
            <p className="text-grey-text">Returns: 15-day returns</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex flex-wrap gap-2 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm capitalize ${
                activeTab === tab
                  ? "border-b-2 border-primary font-semibold text-primary"
                  : "text-grey-text hover:text-dark-text"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6" id="reviews">
          {activeTab === "description" && (
            <div>
              <p className="text-sm leading-relaxed text-grey-text">
                {product.description} Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris.
              </p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-dark-text">
                <li>Some cool feature one</li>
                <li>Another important feature two</li>
                <li>Premium quality material</li>
                <li>Machine washable</li>
              </ul>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-3 border-b border-border pb-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.name}</span>
                      <span>{review.flag}</span>
                      <StarRating rating={review.rating} size={12} />
                      <span className="text-xs text-grey-text">
                        {review.date}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-grey-text">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "shipping" && (
            <p className="text-sm text-grey-text">
              Standard shipping 7-15 business days. Express shipping available
              for additional fee. Free shipping on orders over $50.
            </p>
          )}
          {activeTab === "about seller" && (
            <p className="text-sm text-grey-text">
              {product.seller} is a verified supplier from {product.sellerCountry}{" "}
              {product.sellerFlag} with excellent ratings and fast response times.
            </p>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold">You may also like</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="mt-8">
        <PromoBanner />
      </div>
    </div>
  );
}
