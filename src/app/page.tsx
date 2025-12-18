"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { CategoryNav } from "@/components/sections/category-nav";
import { ProductCatalog } from "@/components/sections/product-catalog";
import { TrustInfo } from "@/components/sections/trust-info";
import { WhyUs } from "@/components/sections/why-us";
import { Faq } from "@/components/sections/faq";
import { ContactForm } from "@/components/sections/contact-form";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryNav />
        <ProductCatalog />
        <TrustInfo />
        <WhyUs />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
