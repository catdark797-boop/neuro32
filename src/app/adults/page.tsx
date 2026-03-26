import Link from "next/link";
import { ArrowRight, Briefcase, FileText, Mail, Settings, CheckCircle, Users, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const cases = [
  {
    icon: Briefcase,
    title: "Бизнес и предпринимательство",
    description: "Автоматизация рутины, генерация идей, анализ рынка и конкурентов. Сокращение времени на отчётность и документооборот.",
    color: "cyan",
  },
  {
    icon: FileText,
    title: "Контент и маркетинг",
    description: "Создание постов, статей, email-рассылок, рекламных текстов и описаний товаров. Контент-план на месяц за один день.",
    color: "purple",
  },
  {
    icon: Settings,
    title: "Автоматизация рабочих процессов",
    description: "Настройка workflow для повторяющихся задач. Шаблоны документов, автоматические напоминания, обработка заявок.",
    color: "pink",
  },
  {
    icon: Mail,
    title: "Коммуникации и продажи",
    description: "Написание писем, ответов клиентам, коммерческих предложений и презентаций. Деловая переписка на высшем уровне.",
    color: "cyan",
  },
  {
    icon: User,
    title: "HR и управление персоналом",
    description: "Составление вакансий, проведение собеседований, адаптация сотрудников, оценка резюме.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Аналитика и планирование",
    description: "Обработка данных, создание отчётов, визуализация информации, прогнозирование.",
    color: "pink",
  },
];

const formatOptions = [
  { label: "Групповая встреча", value: "до 6 человек, 2-3 часа", icon: Users },
  { label: "Индивидуально", value: "персональный темп, фокус на вас", icon: User },
  { label: "Корпоративная", value: "для команды или компании", icon: Briefcase },
];

export const metadata = {
  title: "Взрослым 18+",
  description: "Практические встречи по освоению навыков работы с нейросетями для взрослых в Новозыбкове. Бизнес-применение, автоматизация, контент.",
};

export default function AdultsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <ScrollReveal>
            <Badge variant="pink" className="mb-6">18+ лет</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Взрослым <span className="gradient-text">18+ лет</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mb-4">
              Нейросети экономят время. Тот, кто научился с ними работать — тратит 
              на рутину в 3-5 раз меньше времени, чем коллеги.
            </p>
            <p className="text-lg text-[#71717a] max-w-3xl mb-8">
              На наших встречах вы освоите практические навыки: от написания 
              промптов до настройки автоматизаций. Без воды, только то, 
              что можно применить сразу.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Link href="/contacts">
              <Button size="lg">
                Записаться
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Format */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-16">Выберите формат</h2>
          </ScrollReveal>
          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {formatOptions.map((option) => (
                <Card key={option.label} className="text-center cursor-pointer hover:border-[#06B6D4]/30 transition-colors">
                  <CardContent className="pt-8">
                    <div className="inline-flex p-3 bg-[#06B6D4]/10 rounded-xl mb-4">
                      <option.icon className="h-6 w-6 text-[#06B6D4]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{option.label}</h3>
                    <p className="text-sm text-[#a1a1aa]">{option.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-4">Где пригодятся навыки</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              Реальные сценарии применения ИИ в вашей работе и бизнесе
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={80}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((useCase) => (
                <Card key={useCase.title} className="group">
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-2 rounded-lg mb-3 ${
                      useCase.color === "cyan" ? "bg-[#06B6D4]/10 text-[#06B6D4]" :
                      useCase.color === "purple" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                      "bg-[#EC4899]/10 text-[#EC4899]"
                    }`}>
                      <useCase.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#06B6D4] transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-[#a1a1aa]">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-bold mb-6">Что вы получите</h2>
                <p className="text-[#a1a1aa] text-lg mb-8">
                  Не абстрактные знания, а готовые решения. После каждой встречи 
                  вы унесёте с собой рабочие промпты, шаблоны и автоматизации.
                </p>
                <div className="space-y-4">
                  {[
                    "Экономия 3-5 часов в неделю на рутинных задачах",
                    "20+ готовых промптов для вашей сферы",
                    "3-5 автоматизаций, настроенных под ваши процессы",
                    "Понимание возможностей и ограничений нейросетей",
                    "Навык, который останется актуальным на годы",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Card variant="glass" className="p-8">
                <h3 className="text-xl font-semibold mb-6">Формат занятий</h3>
                <div className="space-y-4">
                  {[
                    { label: "Продолжительность", value: "2-3 часа" },
                    { label: "Размер группы", value: "до 6 человек" },
                    { label: "Индивидуально", value: "возможно" },
                    { label: "Практика", value: "70% практики" },
                    { label: "Результат", value: "готовые шаблоны" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 border-b border-[#27272a]">
                      <span className="text-[#a1a1aa]">{item.label}</span>
                      <span className="font-medium text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-6">Хотите автоматизировать свою работу?</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8">
              Запишитесь на консультацию. Мы обсудим ваши задачи и подберём 
              оптимальный формат обучения.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contacts">
              <Button size="lg">
                Записаться
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
