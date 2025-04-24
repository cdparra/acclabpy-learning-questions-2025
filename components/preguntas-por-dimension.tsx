"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { type Pregunta, getDimensionesUnicas } from "@/data/preguntas"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PreguntasPorDimensionProps {
  data: Pregunta[]
}

export function PreguntasPorDimension({ data }: PreguntasPorDimensionProps) {
  const dimensionesUnicas = getDimensionesUnicas()
  const [activeDimension, setActiveDimension] = useState(dimensionesUnicas[0])
  const [searchTerm, setSearchTerm] = useState("")

  // Función para obtener preguntas por dimensión
  const getPreguntasPorDimension = (dimension: string): Pregunta[] => {
    return data.filter((pregunta) =>
      pregunta.dimensiones
        .split(",")
        .map((dim) => dim.trim())
        .includes(dimension),
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeDimension} onValueChange={setActiveDimension}>
        <div className="border rounded-md overflow-hidden mb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="bg-[#0057B8]/10 w-max min-w-full p-1">
              {dimensionesUnicas.map((dimension) => (
                <TabsTrigger
                  key={dimension}
                  value={dimension}
                  className="flex-shrink-0 data-[state=active]:bg-[#0057B8] data-[state=active]:text-white px-3 py-1.5 text-sm"
                >
                  {dimension}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        {dimensionesUnicas.map((dimension) => {
          const preguntasDimension = getPreguntasPorDimension(dimension)
          const filteredPreguntas = searchTerm
            ? preguntasDimension.filter(
                (p) =>
                  p.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm),
              )
            : preguntasDimension

          return (
            <TabsContent key={dimension} value={dimension} className="space-y-4">
              <Card className="border-[#0057B8]/20 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <CardTitle className="text-[#0057B8]">Preguntas de la Dimensión: {dimension}</CardTitle>
                      <CardDescription>Total: {preguntasDimension.length} preguntas</CardDescription>
                    </div>
                    <Input
                      placeholder="Buscar pregunta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs border-[#0057B8]/30 focus-visible:ring-[#0057B8]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredPreguntas.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredPreguntas.map((pregunta) => (
                        <AccordionItem key={pregunta.id} value={`item-${pregunta.id}`} className="border-[#0057B8]/20">
                          <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-2 text-left">
                              <span className="text-sm sm:text-base">
                                {pregunta.id}.{" "}
                                {pregunta.pregunta.length > 80
                                  ? `${pregunta.pregunta.substring(0, 80)}...`
                                  : pregunta.pregunta}
                              </span>
                              <div className="flex flex-wrap gap-1 sm:gap-2 self-start sm:self-auto">
                                {pregunta.cicloAprendizaje && (
                                  <Badge className="bg-[#00AEEF]/20 text-[#00AEEF] hover:bg-[#00AEEF]/30 shrink-0 text-xs">
                                    {pregunta.cicloAprendizaje}
                                  </Badge>
                                )}
                                <Badge
                                  className={`shrink-0 ${
                                    pregunta.rangoPuntaje.includes("Alto")
                                      ? "bg-[#3F7E44]/20 text-[#3F7E44]"
                                      : pregunta.rangoPuntaje.includes("Medio")
                                        ? "bg-[#FFC20E]/20 text-[#FFC20E]/80"
                                        : "bg-[#E5243B]/20 text-[#E5243B]"
                                  }`}
                                >
                                  {pregunta.sumaPuntajesPonderados.toFixed(1)}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 p-4 bg-[#0057B8]/5 rounded-md">
                              <div>
                                <h4 className="font-semibold text-[#0057B8]">Pregunta completa:</h4>
                                <p>{pregunta.pregunta}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-[#0057B8]">Dimensiones:</h4>
                                  <p>{pregunta.dimensiones}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-[#0057B8]">Ciclo de Aprendizaje:</h4>
                                  <p>{pregunta.cicloAprendizaje || "No asignado"}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Esfuerzo</h5>
                                  <p className="font-medium">{pregunta.esfuerzoAsumido.toFixed(3)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Recursos</h5>
                                  <p className="font-medium">{pregunta.recursosDisponibles.toFixed(3)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Apropiación</h5>
                                  <p className="font-medium">{pregunta.apropiacion.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Impacto</h5>
                                  <p className="font-medium">{pregunta.impacto.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Factibilidad</h5>
                                  <p className="font-medium">{pregunta.factibilidad.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Potencial</h5>
                                  <p className="font-medium">{pregunta.potencialAprendizaje.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Pertinencia</h5>
                                  <p className="font-medium">{pregunta.pertinencia.toFixed(2)}</p>
                                </div>
                                <div className="p-2 bg-white rounded shadow-sm border border-[#0057B8]/10">
                                  <h5 className="text-xs text-gray-500">Viabilidad</h5>
                                  <p className="font-medium">{pregunta.viabilidad.toFixed(2)}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#0057B8]">Suma de Puntajes Ponderados:</h4>
                                <p className="text-lg font-bold">
                                  {pregunta.sumaPuntajesPonderados.toFixed(1)} - {pregunta.rangoPuntaje}
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">No se encontraron preguntas que coincidan con la búsqueda.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
