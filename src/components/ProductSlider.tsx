import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/store";

export function ProductSlider({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 py-2">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33%] xl:flex-[0_0_25%]"
            >
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full glass-strong hover:bg-gradient-neon hover:shadow-glow-blue hover:scale-110 transition-smooth z-10 group"
      >
        <ChevronLeft className="h-5 w-5 group-hover:text-white" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 h-12 w-12 items-center justify-center rounded-full glass-strong hover:bg-gradient-neon hover:shadow-glow-blue hover:scale-110 transition-smooth z-10 group"
      >
        <ChevronRight className="h-5 w-5 group-hover:text-white" />
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {snaps.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === selected
                ? "w-10 bg-gradient-neon shadow-glow-blue"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
