import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, UserPlus, Clock } from "lucide-react";
import { Employee } from "@/types/employee";
import { Summary } from "@/components/Summary";
import { EmployeeRegistration } from "@/components/EmployeeRegistration";
import { TimeGrid } from "@/components/TimeGrid";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const addEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sistema de Escalonamento e Contabilização de Horas
          </h1>
          <p className="text-muted-foreground">
            Gerencie colaboradores e controle horários de trabalho de forma eficiente
          </p>
        </header>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Síntese
            </TabsTrigger>
            <TabsTrigger value="registration" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Cadastramento
            </TabsTrigger>
            <TabsTrigger value="timegrid" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Grade de Horários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Summary employees={employees} />
          </TabsContent>

          <TabsContent value="registration">
            <EmployeeRegistration employees={employees} onAddEmployee={addEmployee} />
          </TabsContent>

          <TabsContent value="timegrid">
            <TimeGrid employees={employees} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
