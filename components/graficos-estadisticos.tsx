"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Pregunta, getCiclosUnicos, getPreguntasPorCiclo } from "@/data/preguntas"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
} from "recharts"

interface GraficosEstadisticosProps {
  data: Pregunta[]
}

// Función para truncar texto manteniendo palabras completas
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "..."
}

export function GraficosEstadisticos({ data }: GraficosEstadisticosProps) {
  const ciclosUnicos = getCiclosUnicos()
  const [activeCiclo, setActiveCiclo] = useState(ciclosUnicos[0])
  const [tipoGrafico, setTipoGrafico] = useState("barras")

  // Obtener preguntas del ciclo activo
  const preguntasCiclo = getPreguntasPorCiclo(activeCiclo)

  // Preparar datos para gráfico de barras - Puntajes por pregunta
  const datosPuntajes = preguntasCiclo.map((p) => ({
    id: p.id,
    pregunta: `P${p.id}: ${truncateText(p.pregunta, 30)}`,
    textoCompleto: p.pregunta,
    puntaje: p.sumaPuntajesPonderados,
  }))

  // Preparar datos para gráfico de radar - Promedios de métricas
  const promedios = {
    apropiacion: preguntasCiclo.reduce((sum, p) => sum + p.apropiacion, 0) / preguntasCiclo.length,
    impacto: preguntasCiclo.reduce((sum, p) => sum + p.impacto, 0) / preguntasCiclo.length,
    factibilidad: preguntasCiclo.reduce((sum, p) => sum + p.factibilidad, 0) / preguntasCiclo.length,
    potencialAprendizaje: preguntasCiclo.reduce((sum, p) => sum + p.potencialAprendizaje, 0) / preguntasCiclo.length,
    pertinencia: preguntasCiclo.reduce((sum, p) => sum + p.pertinencia, 0) / preguntasCiclo.length,
    viabilidad: preguntasCiclo.reduce((sum, p) => sum + p.viabilidad, 0) / preguntasCiclo.length,
    antecedentes: preguntasCiclo.reduce((sum, p) => sum + p.antecedentes, 0) / preguntasCiclo.length,
  }

  const datosRadar = [
    { subject: "Apropiación", A: promedios.apropiacion, fullMark: 1 },
    { subject: "Impacto", A: promedios.impacto, fullMark: 1 },
    { subject: "Factibilidad", A: promedios.factibilidad, fullMark: 1 },
    { subject: "Potencial", A: promedios.potencialAprendizaje, fullMark: 1.5 },
    { subject: "Pertinencia", A: promedios.pertinencia, fullMark: 2.5 },
    { subject: "Viabilidad", A: promedios.viabilidad, fullMark: 2.5 },
    { subject: "Antecedentes", A: promedios.antecedentes, fullMark: 0.5 },
  ]

  // Preparar datos para gráfico de dispersión - Relación entre métricas
  const datosDispersion = preguntasCiclo.map((p) => ({
    id: p.id,
    x: p.impacto,
    y: p.factibilidad,
    z: p.sumaPuntajesPonderados,
    name: `P${p.id}`,
    textoCompleto: p.pregunta,
  }))

  // Preparar datos para gráfico de líneas - Comparación de métricas
  const datosLineas = preguntasCiclo.map((p) => ({
    id: p.id,
    name: `P${p.id}`,
    textoCompleto: p.pregunta,
    preguntaCorta: truncateText(p.pregunta, 30),
    apropiacion: p.apropiacion,
    impacto: p.impacto,
    factibilidad: p.factibilidad,
    potencial: p.potencialAprendizaje,
    pertinencia: p.pertinencia / 2, // Normalizar para visualización
    viabilidad: p.viabilidad / 2, // Normalizar para visualización
  }))

  // Componente personalizado para el tooltip de barras
  const CustomTooltipBarras = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-md max-w-md">
          <p className="font-bold text-sm">Pregunta {data.id}</p>
          <p className="text-sm my-1">{data.textoCompleto}</p>
          <p className="text-sm font-semibold">
            Puntaje: <span className="text-blue-600">{data.puntaje.toFixed(1)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Componente personalizado para el tooltip de dispersión
  const CustomTooltipDispersion = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-md max-w-md">
          <p className="font-bold text-sm">Pregunta {data.id}</p>
          <p className="text-sm my-1">{data.textoCompleto}</p>
          <p className="text-xs mt-2">
            <span className="font-semibold">Impacto:</span> {data.x.toFixed(2)}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Factibilidad:</span> {data.y.toFixed(2)}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Puntaje:</span> {data.z.toFixed(1)}
          </p>
        </div>
      )
    }
    return null
  }

  // Componente personalizado para el tooltip de líneas
  const CustomTooltipLineas = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-md max-w-md">
          <p className="font-bold text-sm">Pregunta {data.id}</p>
          <p className="text-sm my-1">{data.textoCompleto}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs">
                <span className="font-semibold" style={{ color: entry.color }}>
                  {entry.name}:
                </span>{" "}
                {entry.value.toFixed(2)}
              </p>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs value={activeCiclo} onValueChange={setActiveCiclo} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {ciclosUnicos.map((ciclo) => (
              <TabsTrigger key={ciclo} value={ciclo}>
                {ciclo}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={tipoGrafico} onValueChange={setTipoGrafico}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tipo de gráfico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="barras">Gráfico de Barras</SelectItem>
            <SelectItem value="radar">Gráfico de Radar</SelectItem>
            <SelectItem value="dispersion">Gráfico de Dispersión</SelectItem>
            <SelectItem value="lineas">Gráfico de Líneas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análisis Estadístico - {activeCiclo}</CardTitle>
          <CardDescription>
            {tipoGrafico === "barras" && "Puntajes ponderados por pregunta"}
            {tipoGrafico === "radar" && "Promedios de métricas del ciclo"}
            {tipoGrafico === "dispersion" && "Relación entre impacto y factibilidad"}
            {tipoGrafico === "lineas" && "Comparación de métricas entre preguntas"}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          {tipoGrafico === "barras" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosPuntajes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pregunta" angle={-45} textAnchor="end" height={100} interval={0} fontSize={10} />
                <YAxis domain={[0, 10]} />
                <Tooltip content={<CustomTooltipBarras />} />
                <Legend />
                <Bar dataKey="puntaje" fill="#8884d8" name="Suma de Puntajes Ponderados" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {tipoGrafico === "radar" && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={datosRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                <Radar
                  name={`Promedios ${activeCiclo}`}
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          )}

          {tipoGrafico === "dispersion" && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Impacto"
                  domain={[0, 0.5]}
                  label={{ value: "Impacto", position: "bottom" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Factibilidad"
                  domain={[0, 1.2]}
                  label={{ value: "Factibilidad", angle: -90, position: "left" }}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Puntaje" />
                <Tooltip content={<CustomTooltipDispersion />} />
                <Legend />
                <Scatter name={`Preguntas ${activeCiclo}`} data={datosDispersion} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          )}

          {tipoGrafico === "lineas" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosLineas} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={(props) => {
                    const { x, y, payload } = props
                    const item = datosLineas.find((d) => d.name === payload.value)
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize={10} transform="rotate(-45)">
                          {payload.value}: {item?.preguntaCorta}
                        </text>
                      </g>
                    )
                  }}
                />
                <YAxis domain={[0, 2.5]} />
                <Tooltip content={<CustomTooltipLineas />} />
                <Legend />
                <Line type="monotone" dataKey="apropiacion" stroke="#8884d8" name="Apropiación" />
                <Line type="monotone" dataKey="impacto" stroke="#82ca9d" name="Impacto" />
                <Line type="monotone" dataKey="factibilidad" stroke="#ffc658" name="Factibilidad" />
                <Line type="monotone" dataKey="potencial" stroke="#ff8042" name="Potencial" />
                <Line type="monotone" dataKey="pertinencia" stroke="#0088FE" name="Pertinencia" />
                <Line type="monotone" dataKey="viabilidad" stroke="#00C49F" name="Viabilidad" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
