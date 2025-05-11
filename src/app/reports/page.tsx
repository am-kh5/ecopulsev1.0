"use client";

import type React from 'react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

interface ReportEntry {
  id: string;
  date: string;
  category: string;
  metric: string;
  value: string;
  change?: string;
}

const allReportData: ReportEntry[] = [
  { id: "1", date: format(subDays(new Date(), 2), "yyyy-MM-dd"), category: "Carbon Footprint", metric: "Total Emissions", value: "120 tons CO2e", change: "-5%" },
  { id: "2", date: format(subDays(new Date(), 2), "yyyy-MM-dd"), category: "Water Usage", metric: "Total Consumption", value: "1450 m³", change: "-8%" },
  { id: "3", date: format(subDays(new Date(), 2), "yyyy-MM-dd"), category: "Electricity", metric: "Total Consumption", value: "28000 kWh", change: "-3%" },
  { id: "4", date: format(subDays(new Date(), 10), "yyyy-MM-dd"), category: "Carbon Footprint", metric: "Scope 1 Emissions", value: "70 tons CO2e", change: "-2%" },
  { id: "5", date: format(subDays(new Date(), 10), "yyyy-MM-dd"), category: "Waste Management", metric: "Recycled Waste", value: "85%", change: "+2%" },
  { id: "6", date: format(subDays(new Date(), 15), "yyyy-MM-dd"), category: "Water Usage", metric: "Wastewater Treated", value: "90%", change: "+1%" },
  { id: "7", date: format(subDays(new Date(), 20), "yyyy-MM-dd"), category: "Electricity", metric: "Renewable Energy Mix", value: "25%", change: "+5%" },
  { id: "8", date: format(subDays(new Date(), 30), "yyyy-MM-dd"), category: "Carbon Footprint", metric: "Total Emissions", value: "150 tons CO2e", change: "-3%" },
];

const reportCategories = ["All Categories", "Carbon Footprint", "Water Usage", "Electricity", "Waste Management"];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [category, setCategory] = useState<string>("All Categories");
  const [filteredData, setFilteredData] = useState<ReportEntry[]>(allReportData);

  useEffect(() => {
    let data = allReportData;
    if (dateRange?.from && dateRange?.to) {
      data = data.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= dateRange.from! && entryDate <= dateRange.to!;
      });
    }
    if (category !== "All Categories") {
      data = data.filter(entry => entry.category === category);
    }
    setFilteredData(data);
  }, [dateRange, category]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-6 w-6 text-primary" />
                Environmental Impact Reports
              </CardTitle>
              <CardDescription>
                View and filter key environmental metrics. Export reports for distribution.
              </CardDescription>
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export Report (CSV)
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-lg bg-muted/30">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full md:w-auto justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {reportCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Change (vs prev.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell className="font-medium text-foreground">{entry.metric}</TableCell>
                    <TableCell>{entry.value}</TableCell>
                    <TableCell className={`text-right ${entry.change?.startsWith('-') ? 'text-green-600' : entry.change?.startsWith('+') ? 'text-red-600' : 'text-muted-foreground'}`}>
                      {entry.change || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No data matches your current filters.</p>
              <p className="text-sm">Try adjusting the date range or category.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
