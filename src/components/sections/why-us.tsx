import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WhyUs() {
  const heading = "Why Choose Rodelas lifestyle?";
  const text = "We believe in more than just clothing; we believe in a lifestyle of elegance and quality. Our collections are curated with a keen eye for premium materials, timeless design, and the latest fashion insights to ensure you look and feel your absolute best.";

  return (
    <section id="why-us" className="pt-16 md:pt-24 pb-8 md:pb-12 bg-background scroll-mt-20">
      <div className="container">
        <Card className="bg-card/50 border-2 border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl">{heading}</CardTitle>
          </CardHeader>
          <CardContent className="text-center max-w-3xl mx-auto text-lg text-muted-foreground">
            <p>
              {text}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
