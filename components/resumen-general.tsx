"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  type Pregunta,
  getConteoPreguntasPorCiclo,
  getTotalPreguntas,
  getConteoPreguntasPorRango,
  getPreguntasPorCiclo,
} from "@/data/preguntas"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts"
import Image from "next/image"

interface ResumenGeneralProps {
  data: Pregunta[]
}

export function ResumenGeneral({ data }: ResumenGeneralProps) {
  const totalPreguntas = getTotalPreguntas()
  const conteoPorCiclo = getConteoPreguntasPorCiclo()
  const conteoPorRango = getConteoPreguntasPorRango()

  // Estado para controlar el tooltip fijo
  const [tooltipInfo, setTooltipInfo] = useState<{
    visible: boolean
    ciclo: string
    count: number
    porcentaje: number
    preguntas: Array<{ id: number; texto: string; puntaje: number }>
  } | null>(null)

  // Preparar datos para el gráfico de ciclos con las preguntas incluidas
  const ciclosConPreguntas = conteoPorCiclo.map((cicloItem) => {
    const preguntasCiclo = getPreguntasPorCiclo(cicloItem.ciclo)
    return {
      ...cicloItem,
      porcentaje: (cicloItem.count / totalPreguntas) * 100,
      preguntas: preguntasCiclo.map((p) => ({
        id: p.id,
        texto: p.pregunta,
        puntaje: p.sumaPuntajesPonderados,
      })),
    }
  })

  // Ordenar ciclos por cantidad de preguntas (descendente)
  const ciclosOrdenados = [...ciclosConPreguntas].sort((a, b) => b.count - a.count)

  // Colores UNDP
  const COLORS = ["#0057B8", "#00AEEF", "#3F7E44", "#FFC20E", "#E5243B", "#4D4D4D", "#59BA47", "#26BDE2"]

  // Lista de criterios de evaluación
  const criteriosEvaluacion = [
    "Apropiación",
    "Impacto",
    "Factibilidad",
    "Potencial de Aprendizaje",
    "Pertinencia",
    "Viabilidad",
    "Antecedentes",
    "Esfuerzo Asumido/Asignado",
    "Recursos disponibles",
  ]

  // Función para manejar el clic en una barra
  const handleBarClick = (data: any) => {
    if (tooltipInfo && tooltipInfo.ciclo === data.ciclo) {
      // Si ya está visible el tooltip para este ciclo, lo cerramos
      setTooltipInfo(null)
    } else {
      // Si no está visible o es otro ciclo, mostramos el tooltip
      setTooltipInfo({
        visible: true,
        ciclo: data.ciclo,
        count: data.count,
        porcentaje: data.porcentaje,
        preguntas: data.preguntas,
      })
    }
  }

  // Componente para el tooltip fijo
  const FixedTooltip = () => {
    if (!tooltipInfo || !tooltipInfo.visible) return null

    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 border rounded-lg shadow-lg max-w-md max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-3 border-b pb-2">
          <div>
            <p className="font-bold text-[#0057B8] text-lg">{tooltipInfo.ciclo}</p>
            <p className="text-sm font-semibold">
              {tooltipInfo.count} preguntas ({tooltipInfo.porcentaje.toFixed(1)}% del total)
            </p>
          </div>
          <button
            onClick={() => setTooltipInfo(null)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-sm">Preguntas incluidas:</p>
          <ul className="space-y-3 text-sm">
            {tooltipInfo.preguntas.map((pregunta) => (
              <li key={pregunta.id} className="border-l-2 border-[#0057B8] pl-3 py-1">
                <span className="font-semibold">P{pregunta.id}:</span> {pregunta.texto}
                <div className="mt-1 text-[#0057B8]">Puntaje: {pregunta.puntaje.toFixed(1)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Componente personalizado para el tooltip del gráfico de barras
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-bold text-[#0057B8]">{data.ciclo}</p>
          <p className="text-sm">{data.count} preguntas</p>
          <p className="text-sm font-semibold">{data.porcentaje.toFixed(1)}% del total</p>
          <p className="text-xs mt-2 italic">Haz clic para ver las preguntas</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-4 lg:grid-cols-4">
      {/* Tooltip fijo que se muestra al hacer clic en una barra */}
      {tooltipInfo && <FixedTooltip />}

      {/* Overlay para cerrar el tooltip al hacer clic fuera */}
      {tooltipInfo && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setTooltipInfo(null)} />}

      {/* Encabezado principal con logo */}
      <Card className="col-span-1 sm:col-span-4 lg:col-span-4 border-[#0057B8]/20 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 border-b pb-4 border-[#0057B8]/20">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ACCLABPY.jpg-e7IUxwmxAk4Cf9g7tTLdeib9t9D0HO.jpeg"
              alt="ACCLABPY Logo"
              width={180}
              height={60}
              className="object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0057B8] text-center sm:text-left">
              Laboratorio de Aceleración Paraguay
            </h1>
          </div>

          <h2 className="text-xl font-semibold text-[#0057B8] mb-4">Sistematización de Preguntas - AccLabPy</h2>

          <ul className="space-y-3 mb-4">
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#0057B8] mt-2 flex-shrink-0"></div>
              <span>
                Este tablero reúne las preguntas clave elaboradas por los participantes de las sesiones realizadas
                durante la celebración del aniversario de los 5 años del Laboratorio de Aceleración del PNUD en
                Paraguay.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#0057B8] mt-2 flex-shrink-0"></div>
              <span>
                Las preguntas fueron puntuadas y seleccionadas mediante la metodología de evaluación multicriterio por
                los miembros del laboratorio.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-[#0057B8] mt-2 flex-shrink-0"></div>
              <span>
                Podrás explorar cómo estas preguntas quedaron encuadradas dentro de los ciclos de aprendizaje del
                Laboratorio, marcando el rumbo para futuras investigaciones y acciones orientadas al desarrollo
                sostenible.
              </span>
            </li>
          </ul>
          <p className="text-base font-medium text-[#0057B8] mt-4">
            ¡Descubre cómo estas interrogantes pueden inspirar soluciones colectivas y transformadoras!
          </p>
        </CardContent>
      </Card>

      {/* Primera fila de tarjetas de estadísticas */}
      <Card className="col-span-1 border-[#0057B8]/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0057B8]">Total de Preguntas</CardTitle>
          <CardDescription>Número total de preguntas en la planilla</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#0057B8]">{totalPreguntas}</div>
        </CardContent>
      </Card>

      {/* Cantidad de Sesiones */}
      <Card className="col-span-1 border-[#0057B8]/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0057B8]">Cantidad de Sesiones</CardTitle>
          <CardDescription>Número de sesiones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#0057B8]">4</div>
        </CardContent>
      </Card>

      {/* Imagen 5A en el medio */}
      <Card className="col-span-1 border-[#0057B8]/20 shadow-md overflow-hidden">
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="relative w-full h-[150px] sm:h-[180px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5A.jpg-bQT2o1YwBSSzO76lvSxNez3X5P2eMx.jpeg"
              alt="Colaboración e innovación"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 border-[#0057B8]/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0057B8]">Referentes Consultados</CardTitle>
          <CardDescription>Número de participantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-[#0057B8]">76</div>
        </CardContent>
      </Card>

      {/* Gráfico de ciclos mejorado - Ahora como gráfico de barras horizontales */}
      <Card className="col-span-1 sm:col-span-4 lg:col-span-4 border-[#0057B8]/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0057B8]">Preguntas por Ciclo de Aprendizaje</CardTitle>
          <CardDescription>
            Distribución de preguntas por cada ciclo. Haz clic en una barra para ver las preguntas incluidas.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] sm:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ciclosOrdenados} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, "dataMax + 2"]} />
              <YAxis dataKey="ciclo" type="category" width={180} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 87, 184, 0.1)" }} />
              <Bar
                dataKey="count"
                name="Cantidad de Preguntas"
                fill="#0057B8"
                radius={[0, 4, 4, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              >
                {ciclosOrdenados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList
                  dataKey="count"
                  position="right"
                  formatter={(value: number) => `${value} (${((value / totalPreguntas) * 100).toFixed(1)}%)`}
                  style={{ fill: "#333", fontWeight: "bold", fontSize: "12px" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="text-sm text-gray-600 italic border-t border-[#0057B8]/10 pt-3">
          <p>
            Un ciclo de aprendizaje del AccLabPy es un proceso continuo de formulación de preguntas, experimentación y
            generación de conocimiento para abordar los desafíos del desarrollo sostenible.
          </p>
        </CardFooter>
      </Card>

      {/* Reorganizados para estar uno al lado del otro al final */}
      <Card className="col-span-1 sm:col-span-1 lg:col-span-1 border-[#0057B8]/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0057B8] text-base sm:text-lg">Criterios para evaluación de preguntas</CardTitle>
          <CardDescription>Criterios utilizados en la evaluación multicriterio</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-sm">
            {criteriosEvaluacion.map((criterio, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#0057B8] flex-shrink-0"></div>
                <span>{criterio}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-1 sm:col-span-3 lg:col-span-3 border-[#0057B8]/20 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#0057B8] text-base sm:text-lg">Preguntas por Rango de Puntaje</CardTitle>
          <CardDescription>Distribución de preguntas según su rango de puntaje</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={conteoPorRango}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="rango"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {conteoPorRango.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} preguntas`, "Cantidad"]} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="text-sm text-gray-600 italic border-t border-[#0057B8]/10 pt-3">
          <p>
            La evaluación multicriterio es un método para tomar decisiones complejas considerando múltiples criterios y
            prioridades.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
