import Link from "next/link";
import { ArrowRight, Brain, Code, Palette, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const skills = [
  {
    icon: Brain,
    title: "Искусственный интеллект",
    description: "ChatGPT, Claude, промптинг, создание контента с помощью ИИ",
  },
  {
    icon: Palette,
    title: "Генеративные нейросети",
    description: "Midjourney, DALL-E, Stable Diffusion — создание изображений и арта",
  },
  {
    icon: Code,
    title: "Автоматизация",
    description: "Workflows, шаблоны, автоматизация рутинных задач",
  },
  {
    icon: TrendingUp,
    title: "Цифровой маркетинг",
    description: "Контент-стратегия, SMM, продвижение в интернете",
  },
];

export const metadata = {
  title: "О Денисе",
  description: "Денис Степан Марьянович — основатель НЕЙРО32, практик и наставник по работе с ИИ-технологиями",
};

export default function ExpertPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <Badge variant="accent" className="mb-6">Основатель</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Денис <span className="gradient-text">Степан Марьянович</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mb-8">
              Основатель лаборатории НЕЙРО32. Самозанятый практик, который помогает 
              людям осваивать навыки работы с искусственным интеллектом и нейросетями.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Link href="/contacts">
              <Button>
                Связаться
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Photo Placeholder */}
      <section className="py-12 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="max-w-md mx-auto">
              <div className="aspect-square rounded-2xl bg-[#27272a] flex items-center justify-center border-2 border-dashed border-[#3f3f46]">
                <div className="text-center">
                  <Brain className="h-16 w-16 text-[#3f3f46] mx-auto mb-4" />
                  <p className="text-[#71717a] text-sm">Фото скоро появится</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-4">Специализация</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              Основные направления работы и экспертизы
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, i) => (
              <ScrollReveal key={skill.title} delay={i * 100}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#06B6D4]/10 rounded-lg">
                        <skill.icon className="h-5 w-5 text-[#06B6D4]" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{skill.title}</h3>
                        <p className="text-sm text-[#a1a1aa]">{skill.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-6">Миссия</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg leading-relaxed mb-8">
              Я верю, что искусственный интеллект должен быть доступен каждому — от школьника 
              до пенсионера, от студента до предпринимателя. Моя цель — сделать передовые 
              технологии понятными и практичными для жителей нашего города.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-[#71717a] text-sm italic">
              Денис Степан Марьянович, основатель НЕЙРО32
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
