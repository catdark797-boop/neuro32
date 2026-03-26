import Link from "next/link";
import { ArrowRight, Sparkles, Heart, CheckCircle, Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const meetings = [
  {
    title: "Знакомство с ИИ-ассистентами",
    description: "Ребёнок учится формулировать вопросы и получать полезные ответы от ChatGPT",
    duration: "20 мин",
  },
  {
    title: "Творчество с нейросетями",
    description: "Создаём картинки и истории с помощью ИИ-генераторов",
    duration: "25 мин",
  },
  {
    title: "Практический проект",
    description: "Каждый ребёнок создаёт свой мини-проект: открытку, рассказ или рисунок",
    duration: "30 мин",
  },
  {
    title: "Игра на закрепление",
    description: "Интерактивная игра для закрепления навыков промптинга",
    duration: "15 мин",
  },
];

const skills = [
  "Формулировать запросы к нейросетям",
  "Создавать картинки с помощью ИИ",
  "Писать истории и диалоги",
  "Понимать, как работают нейросети",
  "Безопасно пользоваться интернетом",
  "Работать в команде",
];

const safeTopics = [
  "Никакого контента для взрослых — только детские инструменты и темы",
  "Безопасные ИИ-инструменты, одобренные для возраста",
  "Малые группы — максимум 6 человек",
  "Фокус на развитие логики и творчества",
];

export const metadata = {
  title: "Детям 7-12 лет",
  description: "Практические встречи по освоению навыков работы с нейросетями для детей 7-12 лет в Новозыбкове. Через игры и творчество.",
};

export default function KidsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <ScrollReveal>
            <Badge className="mb-6">7-12 лет</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Детям <span className="gradient-text">7-12 лет</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mb-4">
              Первые шаги в мире искусственного интеллекта — через игры, творчество и 
              эксперименты. Без скучной теории, только практика и открытия.
            </p>
            <p className="text-lg text-[#71717a] max-w-3xl mb-8">
              На встречах ребёнок научится общаться с нейросетями, создавать картинки 
              и истории, а главное — получит навык, который будет востребован всю жизнь.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <Link href="/contacts">
              <Button size="lg">
                Записать ребёнка
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* What Happens at Meeting */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-4">Как проходит встреча</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              Каждая встреча длится около 1.5 часов и делится на 4 блока
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {meetings.map((meeting) => (
                <Card key={meeting.title}>
                  <CardContent className="pt-6">
                    <div className="text-xs text-[#06B6D4] font-medium mb-3">{meeting.duration}</div>
                    <h3 className="text-lg font-semibold mb-2">{meeting.title}</h3>
                    <p className="text-sm text-[#a1a1aa]">{meeting.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-bold mb-6">Что получит ваш ребёнок</h2>
                <p className="text-[#a1a1aa] text-lg mb-8">
                  На наших встречах дети осваивают практические навыки работы с современными 
                  ИИ-инструментами в игровой, увлекательной форме.
                </p>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[#06B6D4] flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Card variant="glass" className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#06B6D4]/10 rounded-xl">
                      <Clock className="h-6 w-6 text-[#06B6D4]" />
                    </div>
                    <div>
                      <div className="font-semibold">1.5 часа</div>
                      <div className="text-sm text-[#a1a1aa]">длительность встречи</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                      <Users className="h-6 w-6 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <div className="font-semibold">до 6 человек</div>
                      <div className="text-sm text-[#a1a1aa]">в группе</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#EC4899]/10 rounded-xl">
                      <Sparkles className="h-6 w-6 text-[#EC4899]" />
                    </div>
                    <div>
                      <div className="font-semibold">Мини-проект</div>
                      <div className="text-sm text-[#a1a1aa]">каждый делает своё</div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <Card variant="glass">
              <CardContent className="pt-8">
                <div className="flex items-start gap-4">
                  <Heart className="h-6 w-6 text-[#EC4899] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Для родителей</h3>
                    <p className="text-[#a1a1aa] mb-6">
                      Мы понимаем ваши опасения. Нейросети — новая технология, и хочется 
                      убедиться, что ребёнок в безопасности. Вот как устроены наши встречи:
                    </p>
                    <div className="space-y-4">
                      {safeTopics.map((topic) => (
                        <div key={topic} className="flex items-start gap-3 text-[#a1a1aa]">
                          <Shield className="h-4 w-4 text-[#06B6D4] flex-shrink-0 mt-1" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-6">Запишите ребёнка на пробную встречу</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8">
              Первая встреча — знакомство. Вы увидите, понравится ли ребёнку, 
              а мы расскажем подробнее о программе.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <Link href="/contacts">
              <Button size="lg">
                Записать ребёнка
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
