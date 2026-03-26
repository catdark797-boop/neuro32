import Link from "next/link";
import { ArrowRight, Brain, Sparkles, Shield, Clock, MapPin, Users, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const programs = [
  {
    title: "Детям 7-12 лет",
    description: "Первые шаги в мире ИИ через игры, творчество и эксперименты. Без скучной теории.",
    icon: Star,
    color: "cyan",
    href: "/kids",
    features: ["Общение с ChatGPT", "Рисование с ИИ", "Создание историй"],
  },
  {
    title: "Подросткам 13-17 лет",
    description: "Промптинг, создание контента и собственный итоговый проект. Практика уровня «будущее уже здесь».",
    icon: Sparkles,
    color: "purple",
    href: "/teens",
    features: ["Мастерство промптинга", "Генерация изображений", "Свой проект"],
  },
  {
    title: "Взрослым 18+",
    description: "Бизнес-применение, автоматизация рутины, создание контента. То, что сэкономит часы каждую неделю.",
    icon: Zap,
    color: "pink",
    href: "/adults",
    features: ["Автоматизация задач", "Контент-маркетинг", "Аналитика данных"],
  },
  {
    title: "Кибербезопасность",
    description: "Защита данных, паролей и аккаунтов. Практические навыки для безопасной жизни в интернете.",
    icon: Shield,
    color: "cyan",
    href: "/cybersecurity",
    features: ["Надёжные пароли", "Защита аккаунтов", "Распознавание мошенников"],
  },
];

const advantages = [
  { icon: Brain, title: "Актуальные инструменты", description: "Работаем с ChatGPT, Claude, Midjourney и другими" },
  { icon: Users, title: "Малые группы", description: "До 6-8 человек — внимания хватит всем" },
  { icon: Clock, title: "Практика сразу", description: "70% времени — работа с реальными задачами" },
  { icon: MapPin, title: "Офлайн в Новозыбкове", description: "Живое общение, без экрана как преграды" },
];

export const metadata = {
  title: "Программы",
  description: "Программы практических встреч по освоению навыков работы с нейросетями для детей, подростков и взрослых в Новозыбкове",
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <ScrollReveal>
            <Badge variant="accent" className="mb-6">Программы</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Выберите свою <span className="gradient-text">программу</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl">
              Практические встречи для разных возрастов и целей. Каждая программа адаптирована 
              под уровень участников. Выбирайте направление и записывайтесь.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid md:grid-cols-2 gap-8">
              {programs.map((program) => (
                <Card key={program.href} className="group overflow-hidden">
                  <div className={`h-1.5 bg-gradient-to-r ${
                    program.color === "cyan" ? "from-[#06B6D4] to-[#0891b2]" :
                    program.color === "purple" ? "from-[#8B5CF6] to-[#7c3aed]" :
                    "from-[#EC4899] to-[#db2777]"
                  }`} />
                  <CardContent className="pt-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`p-3 rounded-xl ${
                        program.color === "cyan" ? "bg-[#06B6D4]/10 text-[#06B6D4]" :
                        program.color === "purple" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                        "bg-[#EC4899]/10 text-[#EC4899]"
                      }`}>
                        <program.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-[#06B6D4] transition-colors">
                          {program.title}
                        </h3>
                        <p className="text-[#a1a1aa] text-sm">{program.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2.5 text-sm text-[#a1a1aa]">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            program.color === "cyan" ? "bg-[#06B6D4]" :
                            program.color === "purple" ? "bg-[#8B5CF6]" :
                            "bg-[#EC4899]"
                          }`} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href={program.href}>
                      <Button variant="outline" className="w-full group-hover:border-[#06B6D4]">
                        Узнать больше
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-16">Почему НЕЙРО32</h2>
          </ScrollReveal>
          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((adv) => (
                <Card key={adv.title} className="text-center">
                  <CardContent className="pt-8">
                    <div className="inline-flex p-3 bg-[#06B6D4]/10 rounded-xl mb-4">
                      <adv.icon className="h-6 w-6 text-[#06B6D4]" />
                    </div>
                    <h3 className="font-semibold mb-2">{adv.title}</h3>
                    <p className="text-sm text-[#a1a1aa]">{adv.description}</p>
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
            <h2 className="text-3xl font-bold mb-6">Не знаете, что выбрать?</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8">
              Свяжитесь с нами, и мы поможем подобрать программу под ваши цели 
              или цели вашего ребёнка.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contacts">
              <Button size="lg">
                Получить консультацию
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
