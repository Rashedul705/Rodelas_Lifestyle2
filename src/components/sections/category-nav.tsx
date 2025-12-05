import Link from "next/link";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data";

export function CategoryNav() {
  return (
    <section id="categories" className="py-12 md:py-16 bg-background">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {categories.map((category) => (
            <Button asChild key={category.id} variant="outline" size="lg" className="text-lg">
              <Link href={`#${category.id}`}>{category.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
