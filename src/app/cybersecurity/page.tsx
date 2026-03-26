import Link from "next/link";
import { ArrowRight, Key, Shield, Eye, Lock, Smartphone, AlertTriangle, FileWarning, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollReveal, ScrollRevealGroup } from "@/components/animations/ScrollReveal";

const topics = [
  {
    icon: Key,
    title: "Пароли и аутентификация",
    description: "Создание надёжных уникальных паролей, менеджеры паролей, настройка двухфакторной аутентификации (2FA) для всех аккаунтов.",
    color: "cyan",
    level: "базовый",
  },
  {
    icon: Shield,
    title: "Защита аккаунтов",
    description: "Как защитить ВКонтакте, Telegram, почту и банковские приложения от взлома. Проверка на утечки.",
    color: "purple",
    level: "базовый",
  },
  {
    icon: Eye,
    title: "Приватность в интернете",
    description: "Что видно о вас в сети, как это найти и ограничить. Настройка приватности в соцсетях и браузерах.",
    color: "pink",
    level: "базовый",
  },
  {
    icon: Lock,
    title: "Шифрование и защита данных",
    description: "Основы шифрования файлов и переписки. Резервное копирование и защита от потери данных.",
    color: "cyan",
    level: "продвинутый",
  },
  {
    icon: Smartphone,
    title: "Безопасность устройств",
    description: "Защита телефона и компьютера: обновления, антивирусы, блокировка, App Lock.",
    color: "purple",
    level: "базовый",
  },
  {
    icon: AlertTriangle,
    title: "Мошенничество и обман",
    description: "Распознавание фишинга, социальной инженерии, фейковых сайтов и мошеннических схем. Реальные примеры.",
    color: "pink",
    level: "базовый",
  },
];

const ageGroups = [
  {
    title: "Дети 7-12 лет",
    description: "Безопасное поведение в интернете, защита от кибербуллинга, незнакомцев и вредоносного контента",
    color: "cyan",
  },
  {
    title: "Подростки 13-17 лет",
    description: "Защита аккаунтов, цифровая репутация, распознавание мошенничества, приватность данных",
    color: "purple",
  },
  {
    title: "Взрослые 18+",
    description: "Защита семьи, финансовая безопасность, бизнес-безопасность, безопасность близких",
    color: "pink",
  },
];

export const metadata = {
  title: "Кибербезопасность",
  description: "Практические встречи по кибербезопасности для детей, подростков и взрослых в Новозыбкове. Защита данных, пароли, безопасность в интернете.",
};

export default function CybersecurityPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <ScrollReveal>
            <Badge variant="accent" className="mb-6">Кибербезопасность</Badge>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Кибербезопасность</span> для каждого
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mb-4">
              Каждый день мошенники крадут деньги, данные и аккаунты. 
              Большинство атак легко предотвратить — если знать, как они работают.
            </p>
            <p className="text-lg text-[#71717a] max-w-3xl mb-8">
              На наших встречах вы не просто услышите «ставьте сложные пароли». 
              Мы на практике разберём реальные атаки, потренируемся их распознавать 
              и настроим защиту для ваших устройств.
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

      {/* Warning Banner */}
      <section className="py-6 bg-[#ef4444]/10 border-y border-[#ef4444]/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4 text-[#ef4444]">
            <FileWarning className="h-6 w-6 flex-shrink-0" />
            <p className="text-sm">
              <strong>90% взломов</strong> — результат слабых паролей и невнимательности. 
              Одно занятие по безопасности может уберечь от потери данных, денег и времени.
            </p>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-4">Что будем изучать</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-center max-w-2xl mx-auto mb-16">
              6 тем, от базовых до продвинутых. Каждая — с практикой на ваших устройствах
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerDelay={80}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <Card key={topic.title} className="group">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex p-2 rounded-lg ${
                        topic.color === "cyan" ? "bg-[#06B6D4]/10 text-[#06B6D4]" :
                        topic.color === "purple" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                        "bg-[#EC4899]/10 text-[#EC4899]"
                      }`}>
                        <topic.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        topic.level === "базовый" ? "bg-[#06B6D4]/10 text-[#06B6D4]" : "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                      }`}>
                        {topic.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#06B6D4] transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-[#a1a1aa]">{topic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-16">Для кого это</h2>
          </ScrollReveal>
          <ScrollRevealGroup staggerDelay={100}>
            <div className="grid md:grid-cols-3 gap-8">
              {ageGroups.map((group) => (
                <Card key={group.title}>
                  <div className={`h-1 ${
                    group.color === "cyan" ? "bg-[#06B6D4]" :
                    group.color === "purple" ? "bg-[#8B5CF6]" :
                    "bg-[#EC4899]"
                  }`} />
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">{group.title}</h3>
                    <p className="text-sm text-[#a1a1aa]">{group.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollRevealGroup>
        </div>
      </section>

      {/* What You Leave With */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <Card variant="glass">
              <CardContent className="pt-8">
                <h3 className="text-xl font-semibold mb-6">Что вы получите после встречи</h3>
                <div className="space-y-4">
                  {[
                    "Настроенный менеджер паролей (1Password / Bitwarden)",
                    "Включённая двухфакторная аутентификация на важных аккаунтах",
                    "Проверка ваших данных на утечки",
                    "Настроенные уведомления о подозрительной активности",
                    "План действий при обнаружении взлома",
                    "Памятка по кибербезопасности для семьи",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
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
            <h2 className="text-3xl font-bold mb-6">Защитите себя и своих близких</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-[#a1a1aa] text-lg mb-8">
              Одно занятие может уберечь от серьёзных проблем. 
              Запишитесь на практическую встречу по кибербезопасности.
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
