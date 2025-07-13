import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Building2, Calendar, Clock, Users, UserCheck, TrendingUp } from "lucide-react";
import { Employee } from "@/types/employee";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { loadCompanyData } from "@/utils/companyStorage";

interface SummaryProps {
  employees: Employee[];
}

export function Summary({ employees }: SummaryProps) {
  // Load company data for title
  const companyData = loadCompanyData();
  
  // Days of the week for calculations
  const DAYS_OF_WEEK = [
    "SEGUNDA-FEIRA",
    "TERÇA-FEIRA", 
    "QUARTA-FEIRA",
    "QUINTA-FEIRA",
    "SEXTA-FEIRA",
    "SÁBADO",
    "DOMINGO"
  ];

  // Calculate total worked hours for a sector across all 7 days
  const calculateSectorTotalHours = (sector: string): number => {
    let totalHours = 0;
    
    try {
      DAYS_OF_WEEK.forEach(day => {
        const storageKey = `schedule_${sector}_${day}`;
        const savedData = localStorage.getItem(storageKey);
        
        if (savedData) {
          const scheduleData = JSON.parse(savedData);
          
          if (scheduleData.employees) {
            scheduleData.employees.forEach((employee: any) => {
              // Skip employees on day-off
              if (employee.dayOff) return;
              
              if (employee.schedule) {
                const markedSlots = Object.values(employee.schedule).filter(Boolean).length;
                totalHours += markedSlots * 0.5; // Each slot = 30 minutes
              }
            });
          }
        }
      });
    } catch (error) {
      console.error(`Erro ao calcular horas do setor ${sector}:`, error);
    }
    
    return totalHours;
  };

  // Calculate total hours across all sectors
  const calculateAllSectorsTotalHours = (): number => {
    return Object.keys(employeesBySector).reduce((total, sector) => {
      return total + calculateSectorTotalHours(sector);
    }, 0);
  };

  // Calculate statistics
  const totalEmployees = employees.length;
  const uniqueRoles = [...new Set(employees.map(emp => emp.role).filter(Boolean))];
  const uniqueSectors = [...new Set(employees.map(emp => emp.sector).filter(Boolean))];
  const uniqueCompanies = [...new Set(employees.map(emp => emp.companyName).filter(Boolean))];
  
  const recentAdmissions = employees
    .filter(emp => emp.admissionDate)
    .sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())
    .slice(0, 5);

  // Group employees by sector
  const employeesBySector = employees.reduce((acc, emp) => {
    if (!acc[emp.sector]) acc[emp.sector] = 0;
    acc[emp.sector]++;
    return acc;
  }, {} as Record<string, number>);

  // Group employees by role
  const employeesByRole = employees.reduce((acc, emp) => {
    if (!acc[emp.role]) acc[emp.role] = 0;
    acc[emp.role]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          {companyData?.name ? `Síntese - ${companyData.name}` : 'Síntese do Sistema'}
        </h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card className="glass glass-dark shadow-modern-md hover:shadow-glow transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Colaboradores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="glass glass-dark shadow-modern-md hover:shadow-glow transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funções</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-accent">
              <UserCheck className="h-4 w-4 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{uniqueRoles.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Funções diferentes
            </p>
          </CardContent>
        </Card>

        <Card className="glass glass-dark shadow-modern-md hover:shadow-glow transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setores</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-secondary">
              <Building2 className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{uniqueSectors.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Setores ativos
            </p>
          </CardContent>
        </Card>

        <Card className="glass glass-dark shadow-modern-md hover:shadow-glow transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-secondary">
              <Building2 className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{uniqueCompanies.length}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              Empresas cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grade de Planejamento e Controle - Estilo Militar Compacto */}
      <Card className="shadow-lg border-slate-200 strategic-grid">
        <CardContent className="bg-white p-0 w-[1336px] max-w-[1336px]">
          <div className="flex">
            {/* Grade Principal à Esquerda */}
            <div className="overflow-hidden">
              <div className="w-[1100px]" style={{ width: '1100px', maxWidth: '1100px', minWidth: '1100px' }}>
                {/* Cabeçalho da tabela - Estilo Militar */}
                <div className="grid border-b-2 border-slate-700 font-bold text-white" style={{ gridTemplateColumns: '200px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px', backgroundColor: "#1E0759", fontFamily: "Arial Black, Arial, sans-serif" }}>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight text-left whitespace-nowrap mr-2 font-bold" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                    COLABORADORES
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ENTRADA
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    INTERVALO INÍCIO
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    INTERVALO TÉRMINO
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    SAÍDA
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    PRORROGAÇÃO INÍCIO
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    PRORROGAÇÃO TÉRMINO
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight ml-2" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    OBSERVAÇÕES
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    SALDO DE HORAS
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    SALDO DA PRORROGAÇÃO
                  </div>
                  <div className="text-center py-1 px-2 border-r border-slate-400 text-[10px] leading-tight" style={{ height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ADICIONAL NOTURNO
                  </div>
                </div>

                {/* Container com scrolling fixo */}
                <div className="strategic-scroll max-h-[900px] overflow-y-auto">
                  {/* Listagem de colaboradores por setor */}
                  {Object.entries(employeesBySector).map(([sector, count], sectorIndex) => {
                    const sectorEmployees = employees.filter(emp => emp.sector === sector);
                    const rows = [];
                    
                    // Linha do cabeçalho do setor
                    rows.push(
                      <div 
                        key={`sector-${sectorIndex}`}
                        className="border-b-2 border-slate-600 bg-slate-200"
                        style={{ 
                          display: 'block',
                          width: '100%'
                        }}
                      >
                        <div 
                          className="text-[11px] py-1 px-2 font-bold text-slate-800 flex items-center" 
                          style={{ 
                            height: "20px",
                            width: '100%',
                            borderRight: 'none'
                          }}
                        >
                          📁 {sector.toUpperCase()} ({count} colaborador{count > 1 ? 'es' : ''})
                        </div>
                      </div>
                    );
                    
                    // Linhas dos colaboradores do setor
                    sectorEmployees.forEach((employee, empIndex) => {
                      rows.push(
                        <div 
                          key={`employee-${employee.id}`}
                          className="grid border-b border-slate-300 transition-all duration-300 hover:bg-slate-50 hover:shadow-sm"
                          style={{ 
                            gridTemplateColumns: '200px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px',
                            backgroundColor: empIndex % 2 === 0 ? '#ffffff' : '#F8F9FA'
                          }}
                        >
                          {/* Coluna do Colaborador */}
                          <div 
                            className="text-[10px] py-0.5 px-2 font-mono text-left whitespace-nowrap mr-2 text-slate-900 border-r border-slate-300 flex items-center" 
                            style={{ 
                              height: "18px",
                              backgroundColor: empIndex % 2 === 0 ? '#ffffff' : '#F8F9FA'
                            }}
                          >
                            <span className="truncate">
                              👤 {employee.name} - {employee.role}
                            </span>
                          </div>
                          
                          {/* Colunas editáveis */}
                          {Array.from({ length: 10 }, (_, colIndex) => (
                            <div
                              key={colIndex}
                              className="text-[9px] py-0.5 px-1 border-r border-slate-300 text-center font-mono flex items-center justify-center"
                              style={{ 
                                height: "18px",
                                backgroundColor: empIndex % 2 === 0 ? '#ffffff' : '#F8F9FA'
                              }}
                            >
                              -
                            </div>
                          ))}
                        </div>
                      );
                    });
                    
                    return rows;
                  })}
                  
                  {/* Mensagem caso não haja colaboradores */}
                  {employees.length === 0 && (
                    <div className="grid border-b border-slate-300" style={{ gridTemplateColumns: '200px 90px 90px 90px 90px 90px 90px 90px 90px 90px 90px' }}>
                      <div className="text-[10px] py-2 px-2 text-slate-500 border-r border-slate-300 flex items-center justify-center" style={{ height: "30px" }}>
                        Nenhum colaborador cadastrado
                      </div>
                      {Array.from({ length: 10 }, (_, colIndex) => (
                        <div key={colIndex} className="border-r border-slate-300" style={{ height: "30px" }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Painel Lateral Direito */}
            <div className="w-[236px] bg-slate-50 border-l border-slate-300">
              <div className="p-3">
                <h3 className="text-sm font-bold text-slate-700 mb-2">Totais Mensais</h3>
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border">
                    <div className="text-xs text-slate-600">Saldo de Horas</div>
                    <div className="text-sm font-bold text-blue-600">0h 0min</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-xs text-slate-600">Saldo Prorrogação</div>
                    <div className="text-sm font-bold text-green-600">0h 0min</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <div className="text-xs text-slate-600">Adicional Noturno</div>
                    <div className="text-sm font-bold text-purple-600">0h 0min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees by Sector with Total Hours */}
        <Card>
          <CardHeader className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-bold">
                    Colaboradores por Setor
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 text-slate-600">
                  Distribuição dos colaboradores e horas trabalhadas por setor
                </CardDescription>
              </div>
              
              {/* Statistics Cards */}
              <div className="flex gap-3 ml-4">
                {/* Weekly Total */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-w-[140px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium opacity-90">Total Semanal</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {calculateAllSectorsTotalHours().toFixed(1)}h
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {Object.keys(employeesBySector).length} setores
                  </div>
                </div>
                
                {/* Monthly Estimate */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 min-w-[140px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium opacity-90">Estimativa Mensal</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {((calculateAllSectorsTotalHours() / 7) * 30).toFixed(0)}h
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    projeção baseada na semana
                  </div>
                </div>
              </div>
            </div>
            
            {/* Productivity Indicator */}
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Produtividade Média
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-amber-700">
                    {totalEmployees > 0 ? (calculateAllSectorsTotalHours() / totalEmployees).toFixed(1) : '0.0'}h
                  </span>
                  <span className="text-xs text-amber-600 ml-1">por colaborador/semana</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {Object.keys(employeesBySector).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(employeesBySector).map(([sector, count]) => {
                  const totalHours = calculateSectorTotalHours(sector);
                  
                  return (
                    <div key={sector} className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{sector}</span>
                        <Badge variant="secondary">{count} colaborador{count > 1 ? 'es' : ''}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium text-blue-600">
                            {totalHours.toFixed(1)}h
                          </span>
                          <span>total semanal</span>
                        </div>
                        {totalHours > 0 && (
                          <div className="text-xs">
                            • {(totalHours / count).toFixed(1)}h média/colaborador
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum setor cadastrado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Employees by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Colaboradores por Função
            </CardTitle>
            <CardDescription>
              Distribuição dos colaboradores por função
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(employeesByRole).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(employeesByRole).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{role}</span>
                    <Badge variant="outline">{count} colaborador{count > 1 ? 'es' : ''}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma função cadastrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Admissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Admissões Recentes
            </CardTitle>
            <CardDescription>
              Últimos colaboradores admitidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAdmissions.length > 0 ? (
              <div className="space-y-3">
                {recentAdmissions.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 rounded-md border border-border">
                    <div className="flex-1">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.role} • {employee.sector}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(employee.admissionDate), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-muted-foreground">CTPS: {employee.ctps}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma admissão registrada
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information about Time Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Informações da Grade de Horários
          </CardTitle>
          <CardDescription>
            Configuração do sistema de marcação de horários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-primary">48</div>
              <p className="text-sm text-muted-foreground">Colunas de horário</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-accent">30min</div>
              <p className="text-sm text-muted-foreground">Intervalo por coluna</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-success">05:00</div>
              <p className="text-sm text-muted-foreground">Horário inicial</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-md bg-muted/20 border-l-4 border-l-accent">
            <p className="text-sm">
              <strong>Como funciona:</strong> Cada grade é criada automaticamente para cada função cadastrada. 
              Os colaboradores podem ter seus horários marcados clicando nas células correspondentes. 
              O sistema calcula automaticamente o total de horas trabalhadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}