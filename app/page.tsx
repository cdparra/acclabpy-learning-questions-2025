"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumenGeneral } from "@/components/resumen-general"
import { TablaPreguntasPonderadas } from "@/components/tabla-preguntas-ponderadas"
import { RankingPreguntas } from "@/components/ranking-preguntas"
import { PreguntasPorCiclo } from "@/components/preguntas-por-ciclo"
import { data } from "@/data/preguntas"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PreguntasPorDimension } from "@/components/preguntas-por-dimension"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("resumen")

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-[#0057B8] px-4 py-3 text-white shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg md:text-xl font-semibold">Sistematización de Preguntas - AccLabPy</h1>

          {/* Menú móvil */}
          <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#0057B8]/80">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] bg-white">
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4 text-[#0057B8]">Navegación</h2>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={activeTab === "resumen" ? "default" : "outline"}
                      onClick={() => setActiveTab("resumen")}
                      className={activeTab === "resumen" ? "bg-[#0057B8]" : ""}
                    >
                      Resumen General
                    </Button>
                    <Button
                      variant={activeTab === "tabla" ? "default" : "outline"}
                      onClick={() => setActiveTab("tabla")}
                      className={activeTab === "tabla" ? "bg-[#0057B8]" : ""}
                    >
                      Tabla Ponderada
                    </Button>
                    <Button
                      variant={activeTab === "ranking" ? "default" : "outline"}
                      onClick={() => setActiveTab("ranking")}
                      className={activeTab === "ranking" ? "bg-[#0057B8]" : ""}
                    >
                      Ranking
                    </Button>
                    <Button
                      variant={activeTab === "ciclos" ? "default" : "outline"}
                      onClick={() => setActiveTab("ciclos")}
                      className={activeTab === "ciclos" ? "bg-[#0057B8]" : ""}
                    >
                      Ciclos de Aprendizaje
                    </Button>
                    <Button
                      variant={activeTab === "dimensiones" ? "default" : "outline"}
                      onClick={() => setActiveTab("dimensiones")}
                      className={activeTab === "dimensiones" ? "bg-[#0057B8]" : ""}
                    >
                      Dimensiones
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 p-3 md:p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Tabs para pantallas medianas y grandes */}
          <div className="hidden md:block mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-[#0057B8]/10">
                <TabsTrigger
                  value="resumen"
                  className="data-[state=active]:bg-[#0057B8] data-[state=active]:text-white"
                >
                  Resumen General
                </TabsTrigger>
                <TabsTrigger value="tabla" className="data-[state=active]:bg-[#0057B8] data-[state=active]:text-white">
                  Tabla Ponderada
                </TabsTrigger>
                <TabsTrigger
                  value="ranking"
                  className="data-[state=active]:bg-[#0057B8] data-[state=active]:text-white"
                >
                  Ranking
                </TabsTrigger>
                <TabsTrigger value="ciclos" className="data-[state=active]:bg-[#0057B8] data-[state=active]:text-white">
                  Ciclos de Aprendizaje
                </TabsTrigger>
                <TabsTrigger
                  value="dimensiones"
                  className="data-[state=active]:bg-[#0057B8] data-[state=active]:text-white"
                >
                  Dimensiones
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Indicador de sección actual para móviles */}
          <div className="block md:hidden mb-4">
            <h2 className="text-lg font-semibold text-[#0057B8] border-b border-[#0057B8]/20 pb-2">
              {activeTab === "resumen" && "Resumen General"}
              {activeTab === "tabla" && "Tabla Ponderada"}
              {activeTab === "ranking" && "Ranking"}
              {activeTab === "ciclos" && "Ciclos de Aprendizaje"}
              {activeTab === "dimensiones" && "Dimensiones"}
            </h2>
          </div>

          {/* Contenido */}
          <div className="space-y-4">
            {activeTab === "resumen" && <ResumenGeneral data={data} />}
            {activeTab === "tabla" && <TablaPreguntasPonderadas data={data} />}
            {activeTab === "ranking" && <RankingPreguntas data={data} />}
            {activeTab === "ciclos" && <PreguntasPorCiclo data={data} />}
            {activeTab === "dimensiones" && <PreguntasPorDimension data={data} />}
          </div>
        </div>
      </main>
    </div>
  )
}
