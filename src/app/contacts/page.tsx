import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata = {
  title: "Контакты",
  description: "Свяжитесь с НЕЙРО32, чтобы записаться на практические встречи по освоению навыков работы с нейросетями",
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Свяжитесь с <span className="gradient-text">нами</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-xl text-[#a1a1aa] max-w-3xl">
              Готовы начать? Заполните форму или свяжитесь с нами любым удобным способом
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 bg-[#18181b]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Info */}
            <ScrollReveal>
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Контактная информация</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#06B6D4]/10 rounded-xl text-[#06B6D4]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-[#a1a1aa]">г. Новозыбков, Брянская область</p>
                      <p className="text-sm text-[#71717a]">Офлайн-встречи по договорённости</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#8B5CF6]/10 rounded-xl text-[#8B5CF6]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <p className="text-[#a1a1aa]">+7 (___) ___-__-__</p>
                      <p className="text-sm text-[#71717a]">Звоните или пишите</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#EC4899]/10 rounded-xl text-[#EC4899]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-[#a1a1aa]">info@neuro32.ru</p>
                      <p className="text-sm text-[#71717a]">Ответим в течение дня</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#06B6D4]/10 rounded-xl text-[#06B6D4]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Время работы</h3>
                      <p className="text-[#a1a1aa]">По договорённости</p>
                      <p className="text-sm text-[#71717a]">Гибкий график для вашего удобства</p>
                    </div>
                  </div>
                </div>

                <Card variant="glass" className="p-6">
                  <p className="text-[#a1a1aa] text-sm">
                    <strong className="text-white">ИП Марьянович Д.С.</strong><br />
                    Самозанятый<br />
                    г. Новозыбков, Брянская обл.
                  </p>
                </Card>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={200}>
              <div>
                <h2 className="text-2xl font-bold mb-8">Оставьте заявку</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-12">Частые вопросы</h2>
          </ScrollReveal>
          <div className="space-y-4">
            {[
              {
                q: "Как записаться на встречу?",
                a: "Заполните форму на этой странице или позвоните нам. Мы свяжемся с вами для уточнения деталей.",
              },
              {
                q: "Где проходят встречи?",
                a: "Офлайн в Новозыбкове. Точное место и время согласовываются индивидуально.",
              },
              {
                q: "Сколько стоят занятия?",
                a: "Стоимость зависит от программы и формата. Свяжитесь с нами для уточнения.",
              },
              {
                q: "Нужно ли оборудование?",
                a: "Желательно иметь смартфон или ноутбук. Всё остальное предоставим.",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{item.q}</h3>
                    <p className="text-[#a1a1aa] text-sm">{item.a}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
