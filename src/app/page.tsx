import Link from "next/link";
import { ArrowRight, Brain, Users, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const features = [
  {
    icon: Brain,
    title: "Современные инструменты",
    description: "ChatGPT, Claude, Midjourney и другие — всё, что актуально прямо сейчас",
    color: "cyan",
  },
  {
    icon: Users,
    title: "Для всех возрастов",
    description: "Детям, подросткам и взрослым — у каждого своя программа",
    color: "purple",
  },
  {
    icon: Target,
    title: "Только практика",
    description: "70% встречи — работа с реальными задачами и проектами",
    color: "pink",
  },
  {
    icon: Shield,
    title: "Кибербезопасность",
    description: "Защита данных, пароли и безопасность в интернете",
    color: "cyan",
  },
];

const programs = [
  {
    title: "Детям 7-12 лет",
    description: "Через игры и творчество — первые шаги в мире ИИ",
    href: "/kids",
    badge: "7-12 лет",
    color: "cyan",
  },
  {
    title: "Подросткам 13-17 лет",
    description: "Промптинг, контент и собственный итоговый проект",
    href: "/teens",
    badge: "13-17 лет",
    color: "purple",
  },
  {
    title: "Взрослым 18+",
    description: "Бизнес-применение и автоматизация рутины",
    href: "/adults",
    badge: "18+ лет",
    color: "pink",
  },
  {
    title: "Кибербезопасность",
    description: "Защита данных, пароли и безопасность в интернете",
    href: "/cybersecurity",
    badge: "для всех",
    color: "cyan",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b] pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center">
          <div className="animate-fade-in-up">
            <Badge className="mb-6">
              Лаборатория ИИ-технологий в Новозыбкове
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up delay-100">
            <span className="gradient-text">НЕЙРО32</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#a1a1aa] max-w-2xl mx-auto mb-4 animate-fade-in-up delay-200">
            Практические встречи по освоению навыков работы с нейросетями
          </p>
          
          <p className="text-lg text-[#71717a] max-w-xl mx-auto mb-10 animate-fade-in-up delay-300">
            Для детей, подростков и взрослых. Офлайн в Новозыбкове, Брянская область.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
            <Link href="/programs">
              <Button size="lg">
                Смотреть программы
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contacts">
              <Button variant="outline" size="lg">
                Записаться
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#06B6D4]/5 rounded-full blur-3xl float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl float" style={{ animationDelay: "2s" }} />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Что вы получите
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              На наших встречах вы освоите практические навыки работы с современными ИИ-инструментами
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center hover:border-[#06B6D4]/30 transition-colors">
                  <CardContent className="pt-8">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${
                      feature.color === "cyan" ? "bg-[#06B6D4]/10 text-[#06B6D4]" :
                      feature.color === "purple" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                      "bg-[#EC4899]/10 text-[#EC4899]"
                    }`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#a1a1aa]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Программы для вас
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              Выберите направление, подходящее вашему возрасту и целям
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {programs.map((program) => (
                <Card key={program.href} variant="glass" className="group">
                  <CardContent className="pt-6">
                    <Badge className="mb-3 text-xs">{program.badge}</Badge>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#06B6D4] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-[#a1a1aa] text-sm mb-4">
                      {program.description}
                    </p>
                    <Link href={program.href}>
                      <Button variant="outline" size="sm" className="w-full group-hover:border-[#06B6D4]">
                        Подробнее
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <Link href="/programs">
                <Button variant="secondary">
                  Все программы
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы освоить <span className="gradient-text">ИИ-технологии</span>?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8 max-w-2xl mx-auto">
              Запишитесь на первую встречу и начните свой путь в мир искусственного интеллекта
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contacts">
              <Button size="lg" className="glow-cyan">
                Записаться на встречу
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
        
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}
