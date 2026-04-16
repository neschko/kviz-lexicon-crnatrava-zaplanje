import { createFileRoute } from "@tanstack/react-router";
import { MapPin, BookOpen, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/o-recniku")({
  head: () => ({
    meta: [
      { title: "О речнику — Црнотравски речник" },
      { name: "description", content: "Информације о Црнотравском речнику, аутору Радосаву Стојановићу и говору Црне Траве." },
      { property: "og:title", content: "О речнику — Црнотравски речник" },
      { property: "og:description", content: "Информације о Црнотравском речнику и говору Црне Траве." },
    ],
  }),
  component: ORecnikuPage,
});

function ORecnikuPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">О речнику</h1>

      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">Црнотравски речник</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong>Црнотравски речник</strong> је дело Радосава Стојановића, објављено 2010. године као 
              LVII књига Српског дијалектолошког зборника, у издању Српске академије наука и уметности 
              и Института за српски језик САНУ.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Речник садржи хиљаде речи, израза и фраза из говора Црне Траве — општине у 
              југоисточној Србији, на граници са Бугарском. Свака одредница обухвата граматичку 
              категорију, значење на стандардном српском и аутентичне примере употребе из свакодневног живота.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Ово дигитално издање обухвата прве странице речника (слова А и Б) и биће допуњавано 
              додатним садржајем.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">Аутор</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              <strong>Радосав Стојановић</strong> је српски писац и лексикограф родом из Црне Траве. 
              Познат је по својим романима и причама који описују живот у овом крају, а Црнотравски 
              речник представља круну његовог дугогодишњег рада на очувању дијалекта свог завичаја.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Речник је посвећен „свим црнотравским неимарима и печалбарима, који у XX веку у овој 
              земљи оставише невероватне трагове својих градитељских руку, и женама Црнотравкама, 
              које на оскудној црнотравској земљи однеговаше часне градитеље и браниоце српске земље."
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-foreground">Црна Трава</h2>
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Црна Трава је општина у Јабланичком округу, у југоисточној Србији. Смештена је на 
              обронцима Чемерника и Стрешера, на надморској висини од преко 1.000 метара. 
            </p>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Говор Црне Траве припада призренско-тимочким (торлачким) дијалектима српског језика. 
              Одликује се богатом лексиком турског, грчког и бугарског порекла, специфичним 
              граматичким облицима и архаичним речима које су нестале из стандардног језика.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Овај речник чува лингвистичко благо региона који се брзо расељава — од преко 
              18.000 становника средином XX века, данас у Црној Трави живи мање од 2.000 људи.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Издавачи</p>
            <p className="font-heading text-lg font-bold text-foreground">
              Српска академија наука и уметности
            </p>
            <p className="text-foreground/70">и</p>
            <p className="font-heading text-lg font-bold text-foreground">
              Институт за српски језик САНУ
            </p>
            <p className="text-sm text-muted-foreground mt-3">Београд, 2010 · ISSN 0353-8257</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
