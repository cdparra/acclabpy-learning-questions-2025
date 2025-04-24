"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Pregunta, getCiclosUnicos } from "@/data/preguntas"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RankingPreguntasProps {
  data: Pregunta[]
}

// Función para truncar texto manteniendo palabras completas
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "..."
}

export function RankingPreguntas({ data }: RankingPreguntasProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [chartOrientation, setChartOrientation] = useState<"vertical" | "horizontal">("vertical")
  const ciclosUnicos = getCiclosUnicos()

  // Ordenar preguntas por suma de puntajes ponderados (descendente)
  const preguntasOrdenadas = [...data].sort((a, b) => b.sumaPuntajesPonderados - a.sumaPuntajesPonderados)

  // Tomar las 10 preguntas con mayor puntaje
  const top10Preguntas = preguntasOrdenadas.slice(0, 10).map((p) => ({
    id: p.id,
    pregunta: `P${p.id}: ${truncateText(p.pregunta, 30)}`,
    textoCompleto: p.pregunta,
    puntaje: p.sumaPuntajesPonderados,
    ciclo: p.cicloAprendizaje,
    dimensiones: p.dimensiones,
    rangoPuntaje: p.rangoPuntaje,
  }))

  // Preparar datos para gráficos por ciclo
  const datosPorCiclo = ciclosUnicos.reduce(
    (acc, ciclo) => {
      // Mapeo de nombres antiguos a nuevos
      const mapeoNombres: Record<string, string> = {
        "Local Digital": "Digitalización de MIPYMES",
        Tavarandú: "Gobernanza Participativa",
        "Empleo Justo": "Empleabilidad y Juventud",
        "Empleabilidad y Juventud": "Empleabilidad y Juventud",
        "Innovadores Públicos": "Capacidades de Innovación Pública",
        Local: "Productividad y Trabajo Decente en MIPYMES",
        "Gestión Pública Innovadora": "Gestión Pública Innovadora",
        "Ciudades y Movilidad": "Ciudades y Movilidad",
        "Energías Renovables": "Energías Renovables",
      }

      // Filtrar preguntas por ciclo usando el mapeo
      const preguntasCiclo = data
        .filter((p) => {
          const cicloMapeado = mapeoNombres[p.cicloAprendizaje] || p.cicloAprendizaje
          return cicloMapeado === ciclo
        })
        .sort((a, b) => b.sumaPuntajesPonderados - a.sumaPuntajesPonderados)
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          pregunta: `P${p.id}: ${truncateText(p.pregunta, 30)}`,
          textoCompleto: p.pregunta,
          puntaje: p.sumaPuntajesPonderados,
          ciclo: p.cicloAprendizaje,
          dimensiones: p.dimensiones,
          rangoPuntaje: p.rangoPuntaje,
        }))

      acc[ciclo] = preguntasCiclo
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded shadow-md max-w-md">
          <p className="font-bold text-sm mb-2">Pregunta {data.id}</p>
          <p className="text-sm my-2 border-l-2 border-[#0057B8] pl-2">{data.textoCompleto}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div>
              <span className="font-semibold text-[#0057B8]">Puntaje:</span>{" "}
              <span className="font-bold">{data.puntaje.toFixed(1)}</span>
            </div>
            <div>
              <span className="font-semibold text-[#0057B8]">Rango:</span> <span>{data.rangoPuntaje}</span>
            </div>
            {data.ciclo && (
              <div className="col-span-2">
                <span className="font-semibold text-[#0057B8]">Ciclo:</span> <span>{data.ciclo}</span>
              </div>
            )}
            <div className="col-span-2">
              <span className="font-semibold text-[#0057B8]">Dimensiones:</span> <span>{data.dimensiones}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Select
          value={chartOrientation}
          onValueChange={(value) => setChartOrientation(value as "vertical" | "horizontal")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Orientación del gráfico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vertical">Barras horizontales</SelectItem>
            <SelectItem value="horizontal">Barras verticales</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border rounded-md overflow-hidden mb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="bg-[#0057B8]/10 w-max min-w-full p-1">
              <TabsTrigger
                value="general"
                className="flex-shrink-0 data-[state=active]:bg-[#0057B8] data-[state=active]:text-white px-3 py-1.5 text-sm"
              >
                Ranking General
              </TabsTrigger>
              {ciclosUnicos.map((ciclo) => (
                <TabsTrigger
                  key={ciclo}
                  value={ciclo}
                  className="flex-shrink-0 data-[state=active]:bg-[#0057B8] data-[state=active]:text-white px-3 py-1.5 text-sm"
                >
                  {ciclo}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-[#0057B8]/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#0057B8]">Top 10 Preguntas por Puntaje Ponderado</CardTitle>
              <CardDescription>Las preguntas con mayor suma de puntajes ponderados</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] sm:h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top10Preguntas}
                  layout={chartOrientation === "vertical" ? "horizontal" : "vertical"}
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  {chartOrientation === "vertical" ? (
                    <>
                      <XAxis type="number" domain={[0, "dataMax + 1"]} />
                      <YAxis dataKey="pregunta" type="category" width={250} tick={{ fontSize: 12 }} />
                    </>
                  ) : (
                    <>
                      <XAxis
                        dataKey="pregunta"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis type="number" domain={[0, "dataMax + 1"]} />
                    </>
                  )}
                  <Tooltip cursor={{ fill: "rgba(0, 87, 184, 0.1)" }} content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="puntaje"
                    fill="#0057B8"
                    name="Suma de Puntajes Ponderados"
                    barSize={chartOrientation === "vertical" ? 20 : 30}
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="puntaje"
                      position={chartOrientation === "vertical" ? "right" : "top"}
                      formatter={(value: number) => value.toFixed(1)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="text-sm text-gray-600 italic border-t border-[#0057B8]/10 pt-3">
              <p>
                Nota: Las puntuaciones del ranking no reflejan el peso o la importancia inherente de cada problema para
                el desarrollo. Más bien, indican la prioridad relativa del AccLabPy para estudios y acciones,
                considerando criterios analizados y recursos disponibles.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {ciclosUnicos.map((ciclo) => (
          <TabsContent key={ciclo} value={ciclo} className="space-y-4">
            <Card className="border-[#0057B8]/20 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#0057B8]">Top 5 Preguntas del Ciclo {ciclo}</CardTitle>
                <CardDescription>
                  {datosPorCiclo[ciclo] && datosPorCiclo[ciclo].length > 0
                    ? "Las preguntas con mayor puntaje en este ciclo"
                    : "No hay preguntas disponibles para este ciclo"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] sm:h-[500px]">
                {datosPorCiclo[ciclo] && datosPorCiclo[ciclo].length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={datosPorCiclo[ciclo]}
                      layout={chartOrientation === "vertical" ? "horizontal" : "vertical"}
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      {chartOrientation === "vertical" ? (
                        <>
                          <XAxis type="number" domain={[0, "dataMax + 1"]} />
                          <YAxis dataKey="pregunta" type="category" width={250} tick={{ fontSize: 12 }} />
                        </>
                      ) : (
                        <>
                          <XAxis
                            dataKey="pregunta"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis type="number" domain={[0, "dataMax + 1"]} />
                        </>
                      )}
                      <Tooltip cursor={{ fill: "rgba(0, 0, 255, 0.1)" }} content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="puntaje"
                        fill="#00AEEF"
                        name="Suma de Puntajes Ponderados"
                        barSize={chartOrientation === "vertical" ? 20 : 30}
                        isAnimationActive={false}
                      >
                        <LabelList
                          dataKey="puntaje"
                          position={chartOrientation === "vertical" ? "right" : "top"}
                          formatter={(value: number) => value.toFixed(1)}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      No hay preguntas disponibles para este ciclo.
                      <br />
                      Seleccione otro ciclo para ver su ranking.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-sm text-gray-600 italic border-t border-[#0057B8]/10 pt-3">
                <p>
                  Nota: Las puntuaciones del ranking no reflejan el peso o la importancia inherente de cada problema
                  para el desarrollo. Más bien, indican la prioridad relativa del AccLabPy para estudios y acciones,
                  considerando criterios analizados y recursos disponibles.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
