import Link from "next/link";
import { ArrowRight, Brain, Users, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const values = [
  {
    icon: Brain,
    title: "Практика прежде всего",
    description: "Каждая встреча — это реальные задачи и проекты, а не скучная теория",
  },
  {
    icon: Users,
    title: "Индивидуальный подход",
    description: "Учитываем возраст, интересы и цели каждого участника",
  },
  {
    icon: Target,
    title: "Актуальные знания",
    description: "Работаем с современными инструментами: ChatGPT, Claude, Midjourney и другие",
  },
  {
    icon: Award,
    title: "Без лицензий",
    description: "Мы практикуем навыки, а не образовательные услуги. Всё легально.",
  },
];

export const metadata = {
  title: "О лаборатории",
  description: "НЕЙРО32 — практические встречи по освоению навыков работы с нейросетями в Новозыбкове",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <Badge variant="accent" className="mb-6">О лаборатории</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              НЕЙРО32 — Лаборатория <span className="gradient-text">ИИ-технологий</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mb-8">
              Мы проводим практические встречи по освоению навыков работы с нейросетями и ИИ-инструментами. 
              Наша цель — сделать передовые технологии доступными для всех жителей Новозыбкова и Брянской области.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Link href="/contacts">
              <Button>
                Присоединиться
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
                <p className="text-[#a1a1aa] text-lg leading-relaxed mb-6">
                  Искусственный интеллект меняет мир. Мы верим, что каждый может научиться использовать 
                  его возможности — от школьника до предпринимателя.
                </p>
                <p className="text-[#a1a1aa] text-lg leading-relaxed mb-6">
                  НЕЙРО32 — это место, где технологии встречаются с практикой. Мы не читаем лекции — 
                  мы решаем реальные задачи и создаём проекты.
                </p>
                <p className="text-[#a1a1aa] text-lg leading-relaxed">
                  Основатель лаборатории — Денис Степан Марьянович, самозанятый практик с опытом 
                  работы с ИИ-инструментами.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Card variant="glass" className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#06B6D4]/10 rounded-lg">
                      <Brain className="h-5 w-5 text-[#06B6D4]" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Новозыбков, Брянская область</h4>
                      <p className="text-sm text-[#a1a1aa]">Офлайн-встречи для жителей города и области</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
                      <Users className="h-5 w-5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Для всех возрастов</h4>
                      <p className="text-sm text-[#a1a1aa]">Дети, подростки и взрослые — у каждого своя программа</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#EC4899]/10 rounded-lg">
                      <Target className="h-5 w-5 text-[#EC4899]" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Практические навыки</h4>
                      <p className="text-sm text-[#a1a1aa]">Теория + практика на каждой встрече</p>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-4">Наши принципы</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              То, что отличает НЕЙРО32 от других
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-8 text-center">
                    <div className="inline-flex p-3 bg-[#06B6D4]/10 rounded-xl mb-4">
                      <value.icon className="h-6 w-6 text-[#06B6D4]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-[#a1a1aa]">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-6">Хотите узнать больше?</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8">
              Свяжитесь с нами, чтобы обсудить ваши цели и подобрать программу
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contacts">
              <Button size="lg">
                Связаться с нами
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
