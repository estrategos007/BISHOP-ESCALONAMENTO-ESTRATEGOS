import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Building2, Calendar, Clock, Users, UserCheck } from "lucide-react";
import { Employee } from "@/types/employee";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SummaryProps {
  employees: Employee[];
}

export function Summary({ employees }: SummaryProps) {
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
        <h1 className="text-2xl font-bold">Síntese do Sistema</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Colaboradores cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funções</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueRoles.length}</div>
            <p className="text-xs text-muted-foreground">
              Funções diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSectors.length}</div>
            <p className="text-xs text-muted-foreground">
              Setores ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCompanies.length}</div>
            <p className="text-xs text-muted-foreground">
              Empresas cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees by Sector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Colaboradores por Setor
            </CardTitle>
            <CardDescription>
              Distribuição dos colaboradores nos setores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(employeesBySector).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(employeesBySector).map(([sector, count]) => (
                  <div key={sector} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{sector}</span>
                    <Badge variant="secondary">{count} colaborador{count > 1 ? 'es' : ''}</Badge>
                  </div>
                ))}
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