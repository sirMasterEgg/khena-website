"use client";

import type {MouseEvent} from "react";
import {Button} from "@/presentation/components/ui/button";
import {useToast} from "@/presentation/providers/toast-provider";
import {cn} from "@/presentation/lib/cn";
import type {Product} from "@/domain/entities/product";

export type QuickAddButtonProps = {
  product: Product;
  className?: string;
};

/** Tombol "Quick Add" yang muncul saat hover kartu produk — bagian 4.4 issue.md. */
export function QuickAddButton({product, className}: QuickAddButtonProps) {
  const {toast} = useToast();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    // TODO(ISSUE-09): panggil CartProvider.addItem() sungguhan.
    toast(`${product.name} added to bag`);
  }

  return (
    <Button variant="dark" onClick={handleClick} className={cn("w-full", className)}>
      Quick Add
    </Button>
  );
}
