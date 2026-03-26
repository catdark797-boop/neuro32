import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "Личный кабинет",
  description: "Личный кабинет ученика НЕЙРО32",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Card>
          <CardContent className="pt-16 pb-16 text-center">
            <div className="inline-flex p-4 bg-[#27272a] rounded-full mb-6">
              <Lock className="h-8 w-8 text-[#a1a1aa]" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
            <p className="text-[#a1a1aa] mb-8">
              Личный кабинет появится после регистрации через социальные сети. 
              Функционал в разработке.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
