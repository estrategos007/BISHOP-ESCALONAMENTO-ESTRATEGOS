import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { Employee, TIME_SLOTS, TimeSlot } from "@/types/employee";
import { cn } from "@/lib/utils";

interface TimeGridProps {
  employees: Employee[];
}

export function TimeGrid({ employees }: TimeGridProps) {
  const [timeSlots, setTimeSlots] = useState<Record<string, Record<string, boolean>>>({});

  // Group employees by role
  const employeesByRole = employees.reduce((acc, employee) => {
    if (!acc[employee.role]) {
      acc[employee.role] = [];
    }
    acc[employee.role].push(employee);
    return acc;
  }, {} as Record<string, Employee[]>);

  // Initialize time slots for all employees
  useEffect(() => {
    const initialSlots: Record<string, Record<string, boolean>> = {};
    employees.forEach(employee => {
      initialSlots[employee.id] = {};
      TIME_SLOTS.forEach(slot => {
        initialSlots[employee.id][slot] = false;
      });
    });
    setTimeSlots(initialSlots);
  }, [employees]);

  const toggleTimeSlot = (employeeId: string, slot: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [slot]: !prev[employeeId]?.[slot]
      }
    }));
  };

  const calculateWorkedHours = (employeeId: string) => {
    const employeeSlots = timeSlots[employeeId] || {};
    const markedSlots = Object.values(employeeSlots).filter(Boolean).length;
    return (markedSlots * 0.5).toFixed(1); // Each slot is 30 minutes (0.5 hours)
  };

  if (Object.keys(employeesByRole).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Nenhum colaborador cadastrado</p>
          <p className="text-muted-foreground">Cadastre colaboradores para visualizar as grades de horário</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
          <Clock className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Grades de Horário por Função</h2>
      </div>

      {Object.entries(employeesByRole).map(([role, roleEmployees]) => (
        <Card key={role} className="overflow-hidden glass glass-dark shadow-modern-lg hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Função: {role}</span>
              <Badge variant="secondary">{roleEmployees.length} colaborador(es)</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-grid-border bg-grid-header text-primary-foreground">
                    <th className="sticky left-0 bg-grid-header text-left p-3 min-w-48 font-medium">
                      Colaborador
                    </th>
                    {TIME_SLOTS.map((slot) => (
                      <th key={slot} className="text-center p-2 min-w-16 font-medium text-sm">
                        {slot}
                      </th>
                    ))}
                    <th className="text-center p-3 min-w-20 font-medium">
                      Total (h)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roleEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-grid-border hover:bg-muted/50">
                      <td className="sticky left-0 bg-background p-3 font-medium border-r border-grid-border">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.sector}</p>
                        </div>
                      </td>
                      {TIME_SLOTS.map((slot) => {
                        const isMarked = timeSlots[employee.id]?.[slot] || false;
                        return (
                          <td key={slot} className="p-1">
                            <button
                              onClick={() => toggleTimeSlot(employee.id, slot)}
                              className={cn(
                                "w-full h-8 rounded-sm border transition-all duration-200",
                                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring",
                                isMarked
                                  ? "bg-grid-cell-selected border-grid-cell-selected text-white shadow-sm"
                                  : "bg-grid-cell border-grid-border hover:bg-grid-cell-hover"
                              )}
                              aria-label={`Toggle ${slot} for ${employee.name}`}
                            >
                              {isMarked && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                      <td className="text-center p-3 font-semibold bg-muted/30">
                        {calculateWorkedHours(employee.id)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}