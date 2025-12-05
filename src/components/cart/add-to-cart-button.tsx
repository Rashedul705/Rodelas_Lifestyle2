"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product } from "@/lib/data";
import { useCart } from "./cart-context";

type AddToCartButtonProps = ButtonProps & {
  product: Product;
};

export function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <Button onClick={() => addToCart(product)} {...props}>
      {props.children || "Add to Cart"}
    </Button>
  );
}
