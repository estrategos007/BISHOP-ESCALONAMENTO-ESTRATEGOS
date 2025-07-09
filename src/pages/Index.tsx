import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, UserPlus, Clock, Sparkles } from "lucide-react";
import { Employee } from "@/types/employee";
import { Summary } from "@/components/Summary";
import { EmployeeRegistration } from "@/components/EmployeeRegistration";
import { TimeGrid } from "@/components/TimeGrid";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const addEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5 pointer-events-none" />
      
      <div className="container mx-auto py-6 relative">
        <header className="mb-8 flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="h-8 w-8" />
              </div>
              Sistema de Escalonamento e Contabilização de Horas
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie colaboradores e controle horários de trabalho de forma eficiente e moderna
            </p>
          </div>
          <div className="animate-slide-in">
            <ThemeToggle />
          </div>
        </header>

        <Tabs defaultValue="summary" className="w-full animate-fade-in">
          <TabsList className="grid w-full grid-cols-3 mb-6 glass glass-dark shadow-modern-md">
            <TabsTrigger 
              value="summary" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Síntese
            </TabsTrigger>
            <TabsTrigger 
              value="registration" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <UserPlus className="h-4 w-4" />
              Cadastramento
            </TabsTrigger>
            <TabsTrigger 
              value="timegrid" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
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
