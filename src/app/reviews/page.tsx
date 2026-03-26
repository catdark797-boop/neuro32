import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export const metadata = {
  title: "Отзывы",
  description: "Отзывы участников практических встреч НЕЙРО32 в Новозыбкове",
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <Badge variant="accent" className="mb-6">Отзывы</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Что говорят <span className="gradient-text">участники</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl">
              Проект только запущен, но скоро здесь появятся отзывы первых участников.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Placeholder */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-4xl px-6">
          <Card>
            <CardContent className="pt-16 pb-16 text-center">
              <div className="inline-flex p-4 bg-[#27272a] rounded-full mb-6">
                <MessageSquare className="h-8 w-8 text-[#a1a1aa]" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Отзывы скоро появятся</h2>
              <p className="text-[#a1a1aa] max-w-md mx-auto">
                Проект НЕЙРО32 только начинает работу. После первых встреч здесь появятся 
                отзывы участников.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
