import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, UserPlus, Clock, Monitor, Building2, Calendar } from "lucide-react";
import { Employee } from "@/types/employee";
import { Summary } from "@/components/Summary";
import { EmployeeRegistration } from "@/components/EmployeeRegistration";
import { CompanyRegistration } from "@/components/CompanyRegistration";
import { TimeGrid } from "@/components/TimeGrid";
import { Escalonamento } from "@/components/Escalonamento";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BishopIcon } from "@/components/BishopIcon";
import { ScheduleStatus } from "@/components/ScheduleStatus";
import { DebugPanel } from "@/components/DebugPanel";
import { useDatabase } from "@/hooks/useDatabase";
import { DatabaseEmployee } from "@/utils/database";
import { DataRecovery } from "@/components/DataRecovery";

const Index = () => {
  const {
    employees,
    isLoading,
    isInitialized,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useDatabase();

  // Converter DatabaseEmployee para Employee para compatibilidade
  const convertToEmployee = (dbEmployee: DatabaseEmployee): Employee => {
    return {
      id: dbEmployee.id,
      companyName: dbEmployee.companyName,
      cnpj: dbEmployee.cnpj,
      address: dbEmployee.address,
      period: dbEmployee.period,
      activity: dbEmployee.activity,
      sector: dbEmployee.sector,
      name: dbEmployee.name,
      role: dbEmployee.role,
      ctps: dbEmployee.ctps,
      admissionDate: dbEmployee.admissionDate,
      remuneracao: dbEmployee.remuneracao,
    };
  };

  const convertedEmployees = employees.map(convertToEmployee);

  const handleAddEmployee = async (employee: Employee): Promise<void> => {
    await addEmployee(employee);
  };

  const handleUpdateEmployee = async (employee: Employee): Promise<void> => {
    console.log('Atualizando colaborador:', employee);
    const dbEmployee = employees.find(emp => emp.id === employee.id);
    if (dbEmployee) {
      const updatedDbEmployee: DatabaseEmployee = {
        ...employee,
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        version: dbEmployee.version + 1,
      };
      console.log('Dados para atualização no banco:', updatedDbEmployee);
      await updateEmployee(updatedDbEmployee);
      console.log('Colaborador atualizado com sucesso');
    }
  };

  const handleRemoveEmployee = async (employeeId: string): Promise<void> => {
    await deleteEmployee(employeeId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Inicializando sistema de banco de dados...</p>
          <p className="text-sm text-muted-foreground">Aguarde enquanto configuramos o armazenamento robusto</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-lg font-medium">Erro ao inicializar o sistema</p>
          <p className="text-sm text-muted-foreground">Por favor, recarregue a página ou entre em contato com o suporte</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5 pointer-events-none" />
      
      <div className="container mx-auto py-6 relative">
        <header className="mb-8 flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <BishopIcon className="h-8 w-8" />
              </div>
              BISHOP - ESCALONAMENTO ESTRATÉGICO
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
          <TabsList className="grid w-full grid-cols-6 mb-6 glass glass-dark shadow-modern-md">
            <TabsTrigger 
              value="summary" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Síntese
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Building2 className="h-4 w-4" />
              Empresa
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
            <TabsTrigger 
              value="escalonamento" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="h-4 w-4" />
              Escalonamento
            </TabsTrigger>
            <TabsTrigger 
              value="monitor" 
              className="flex items-center gap-2 transition-all duration-300 hover:shadow-glow data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Monitor className="h-4 w-4" />
              Monitor de Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Summary employees={convertedEmployees} />
          </TabsContent>

          <TabsContent value="company">
            <CompanyRegistration />
          </TabsContent>

          <TabsContent value="registration">
            <EmployeeRegistration 
              employees={convertedEmployees} 
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onRemoveEmployee={handleRemoveEmployee}
            />
          </TabsContent>

          <TabsContent value="timegrid">
            <TimeGrid employees={convertedEmployees} />
          </TabsContent>

          <TabsContent value="escalonamento">
            <Escalonamento employees={convertedEmployees} />
          </TabsContent>

          <TabsContent value="monitor">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                  <Monitor className="h-6 w-6" />
                  Monitor de Dados
                </h2>
                <p className="text-muted-foreground">
                  Monitore o sistema de banco de dados híbrido e execute testes de diagnóstico
                </p>
              </div>
              
              <DataRecovery />
              
              <DebugPanel />
              <ScheduleStatus />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
