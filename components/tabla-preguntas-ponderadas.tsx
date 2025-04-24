"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { Pregunta } from "@/data/preguntas"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TablaPreguntasPonderadasProps {
  data: Pregunta[]
}

export function TablaPreguntasPonderadas({ data }: TablaPreguntasPonderadasProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  const columns: ColumnDef<Pregunta>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          ID
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "pregunta",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent text-left"
        >
          Pregunta
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="max-w-[300px]">{row.getValue("pregunta")}</div>,
    },
    {
      accessorKey: "dimensiones",
      header: "Dimensiones",
    },
    {
      accessorKey: "cicloAprendizaje",
      header: "Ciclo de Aprendizaje",
    },
    {
      accessorKey: "sumaPuntajesPonderados",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Puntaje
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-right">{row.getValue("sumaPuntajesPonderados")}</div>,
    },
    {
      accessorKey: "rangoPuntaje",
      header: "Rango",
      cell: ({ row }) => {
        const rango = row.getValue("rangoPuntaje") as string
        return (
          <div
            className={`
            px-2 py-1 rounded-full text-xs font-medium text-center
            ${
              rango.includes("Alto")
                ? "bg-[#3F7E44]/20 text-[#3F7E44]"
                : rango.includes("Medio")
                  ? "bg-[#FFC20E]/20 text-[#FFC20E]/80"
                  : "bg-[#E5243B]/20 text-[#E5243B]"
            }
          `}
          >
            {rango}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <Card className="border-[#0057B8]/20 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#0057B8]">Tabla de Preguntas con Puntajes Ponderados</CardTitle>
        <CardDescription>Listado completo de preguntas con sus puntajes y clasificaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Input
              placeholder="Filtrar preguntas..."
              value={(table.getColumn("pregunta")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("pregunta")?.setFilterValue(event.target.value)}
              className="max-w-sm border-[#0057B8]/30 focus-visible:ring-[#0057B8]"
            />

            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Modo de vista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Vista de tabla</SelectItem>
                  <SelectItem value="cards">Vista de tarjetas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="rounded-md border border-[#0057B8]/20 overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#0057B8]/5">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="text-[#0057B8]">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-[#0057B8]/5"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Card key={row.id} className="border-[#0057B8]/20 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-[#0057B8]">ID: {row.getValue("id")}</span>
                        <div
                          className={`
                            px-2 py-1 rounded-full text-xs font-medium text-center
                            ${
                              (row.getValue("rangoPuntaje") as string).includes("Alto")
                                ? "bg-[#3F7E44]/20 text-[#3F7E44]"
                                : (row.getValue("rangoPuntaje") as string).includes("Medio")
                                  ? "bg-[#FFC20E]/20 text-[#FFC20E]/80"
                                  : "bg-[#E5243B]/20 text-[#E5243B]"
                            }
                          `}
                        >
                          {row.getValue("rangoPuntaje")}
                        </div>
                      </div>
                      <p className="text-sm mb-3">{row.getValue("pregunta")}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-semibold block">Dimensiones:</span>
                          <span>{row.getValue("dimensiones")}</span>
                        </div>
                        <div>
                          <span className="font-semibold block">Ciclo:</span>
                          <span>{row.getValue("cicloAprendizaje") || "No asignado"}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Puntaje: </span>
                          <span className="font-bold text-[#0057B8]">{row.getValue("sumaPuntajesPonderados")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">No se encontraron resultados.</div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-gray-500">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-[#0057B8]/30 hover:bg-[#0057B8]/10 hover:text-[#0057B8]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-[#0057B8]/30 hover:bg-[#0057B8]/10 hover:text-[#0057B8]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
