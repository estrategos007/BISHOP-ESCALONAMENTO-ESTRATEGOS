import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Employee } from "@/types/employee";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EmployeeRegistrationProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
}

export function EmployeeRegistration({ employees, onAddEmployee }: EmployeeRegistrationProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    address: "",
    period: "",
    activity: "",
    sector: "",
    name: "",
    role: "",
    ctps: "",
    admissionDate: undefined as Date | undefined,
  });

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.admissionDate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione a data de admissão.",
        variant: "destructive",
      });
      return;
    }

    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      companyName: formData.companyName,
      cnpj: formData.cnpj,
      address: formData.address,
      period: formData.period,
      activity: formData.activity,
      sector: formData.sector,
      name: formData.name,
      role: formData.role,
      ctps: formData.ctps,
      admissionDate: formData.admissionDate,
    };

    onAddEmployee(newEmployee);
    
    // Reset form
    setFormData({
      companyName: "",
      cnpj: "",
      address: "",
      period: "",
      activity: "",
      sector: "",
      name: "",
      role: "",
      ctps: "",
      admissionDate: undefined,
    });

    toast({
      title: "Sucesso",
      description: "Colaborador cadastrado com sucesso!",
      variant: "default",
    });
  };

  const roles = [...new Set(employees.map(emp => emp.role).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Cadastramento de Colaboradores
          </CardTitle>
          <CardDescription>
            Preencha as informações do colaborador para registro no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Digite o nome da empresa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Digite o endereço completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => handleInputChange("period", e.target.value)}
                  placeholder="Ex: Manhã, Tarde, Noite"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Atividade</Label>
                <Input
                  id="activity"
                  value={formData.activity}
                  onChange={(e) => handleInputChange("activity", e.target.value)}
                  placeholder="Descrição da atividade"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Lotação (Setor)</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => handleInputChange("sector", e.target.value)}
                  placeholder="Setor de lotação"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Colaborador</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  placeholder="Função/Cargo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctps">CTPS</Label>
                <Input
                  id="ctps"
                  value={formData.ctps}
                  onChange={(e) => handleInputChange("ctps", e.target.value)}
                  placeholder="Número da CTPS"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Admissão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.admissionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.admissionDate ? (
                        format(formData.admissionDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.admissionDate}
                      onSelect={(date) => handleInputChange("admissionDate", date || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Colaborador
            </Button>
          </form>
        </CardContent>
      </Card>

      {employees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores Cadastrados ({employees.length})</CardTitle>
            <CardDescription>
              Funções registradas: {roles.length > 0 ? roles.join(", ") : "Nenhuma"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex justify-between items-center p-3 rounded-md border border-border bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.role} • {employee.sector}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    CTPS: {employee.ctps}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}