import Link from "next/link";
import { ArrowRight, Target, CheckCircle, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const modules = [
  {
    title: "Мастерство промптинга",
    description: "Как писать запросы, чтобы получать именно тот результат, который нужен. Типичные ошибки и как их избегать.",
    topics: ["Структура промптов", "Контекст и уточнения", "Ролевое промптирование", "Итерации и улучшения"],
    color: "purple",
  },
  {
    title: "Создание изображений",
    description: "Генерация артов, иллюстраций и концепт-артов через Midjourney, DALL-E и Stable Diffusion.",
    topics: ["Описание желаемого", "Стили и форматы", "Композиция и детали", "Референсы"],
    color: "cyan",
  },
  {
    title: "Видео и анимация",
    description: "Создание коротких роликов и анимаций с помощью ИИ-инструментов.",
    topics: ["Sora и Runway", "Озвучка через ИИ", "Сценарии для видео", "Монтаж и эффекты"],
    color: "pink",
  },
  {
    title: "ИИ в учёбе",
    description: "Как использовать ChatGPT и Claude для подготовки к экзаменам, написания работ и изучения языков.",
    topics: ["Структурирование информации", "Подготовка к ЕГЭ/ОГЭ", "Языковые практики", "Критическая оценка ответов"],
    color: "purple",
  },
  {
    title: "Автоматизация рутины",
    description: "Настройка workflow для автоматизации повторяющихся задач: напоминания, отчёты, рассылки.",
    topics: ["Шаблоны документов", "Автоматизация через API", "Боты и ассистенты", "ChatGPT Plugins"],
    color: "cyan",
  },
  {
    title: "Собственные проекты",
    description: "Каждый участник создаёт и защищает свой итоговый проект — от идеи до презентации.",
    topics: ["Выбор проекта", "Планирование", "Реализация", "Презентация"],
    color: "pink",
  },
];

export const metadata = {
  title: "Подросткам 13-17 лет",
  description: "Практические встречи по освоению навыков работы с нейросетями для подростков 13-17 лет в Новозыбкове. Промптинг, создание контента, проекты.",
};

export default function TeensPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <ScrollReveal>
            <Badge variant="accent" className="mb-6">13-17 лет</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Подросткам <span className="gradient-text">13-17 лет</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mb-4">
              Промптинг, создание изображений, видео и реальные проекты с использованием 
              нейросетей. Не просто «потыкать кнопки», а получить навык, 
              который даст преимущество уже сейчас.
            </p>
            <p className="text-lg text-[#71717a] max-w-3xl mb-8">
              Подростки, которые умеют работать с ИИ, уже сейчас имеют фору: быстрее 
              делают домашние задания, создают контент для соцсетей, автоматизируют 
              рутину и выделяются среди сверстников.
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

      {/* Why It Matters */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-bold mb-6">Почему это важно именно сейчас</h2>
                <div className="space-y-4 text-[#a1a1aa]">
                  <p>
                    ИИ-грамотность становится таким же базовым навыком, как умение пользоваться 
                    компьютером. Те, кто освоит его сейчас — получат преимущество при 
                    поступлении, в карьере и творчестве.
                  </p>
                  <p>
                    На наших встречах подростки не просто «пользуются ChatGPT». 
                    Они учатся мыслить структурно, формулировать задачи и критически 
                    оценивать результаты — навыки, которые пригодятся в любой профессии.
                  </p>
                </div>
                <div className="mt-8 space-y-3">
                  {[
                    "Конкурентное преимущество при поступлении",
                    "Создание портфолио с ИИ-проектами",
                    "Навыки для любой будущей профессии",
                    "Критическое мышление и оценка информации",
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
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-[#06B6D4]" />
                    <div>
                      <div className="font-semibold">1.5-2 часа</div>
                      <div className="text-sm text-[#a1a1aa]">длительность встречи</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="h-6 w-6 text-[#8B5CF6]" />
                    <div>
                      <div className="font-semibold">до 8 человек</div>
                      <div className="text-sm text-[#a1a1aa]">в группе</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Sparkles className="h-6 w-6 text-[#EC4899]" />
                    <div>
                      <div className="font-semibold">Итоговый проект</div>
                      <div className="text-sm text-[#a1a1aa]">защита в конце курса</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Target className="h-6 w-6 text-[#06B6D4]" />
                    <div>
                      <div className="font-semibold">6 модулей</div>
                      <div className="text-sm text-[#a1a1aa]">покрывают все основы</div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-4">Программа обучения</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              6 модулей, каждый — с теорией, практикой и домашним заданием
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={80}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, i) => (
                <Card key={module.title} className="group">
                  <div className={`h-1 ${
                    module.color === "cyan" ? "bg-[#06B6D4]" :
                    module.color === "purple" ? "bg-[#8B5CF6]" :
                    "bg-[#EC4899]"
                  }`} />
                  <CardContent className="pt-6">
                    <div className={`text-xs font-medium mb-3 ${
                      module.color === "cyan" ? "text-[#06B6D4]" :
                      module.color === "purple" ? "text-[#8B5CF6]" :
                      "text-[#EC4899]"
                    }`}>
                      Модуль {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#06B6D4] transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] mb-4">{module.description}</p>
                    <div className="space-y-1.5">
                      {module.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2 text-xs text-[#71717a]">
                          <div className={`w-1 h-1 rounded-full ${
                            module.color === "cyan" ? "bg-[#06B6D4]" :
                            module.color === "purple" ? "bg-[#8B5CF6]" :
                            "bg-[#EC4899]"
                          }`} />
                          {topic}
                        </div>
                      ))}
                    </div>
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
            <h2 className="text-3xl font-bold mb-6">Готовы освоить ИИ-инструменты?</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8">
              Запишитесь на первую встречу. Вы попробуете промптинг, создание изображений 
              и поймёте, подходит ли вам этот формат.
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
