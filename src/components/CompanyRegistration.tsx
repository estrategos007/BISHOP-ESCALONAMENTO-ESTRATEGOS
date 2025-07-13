import { useState, useEffect } from "react";
import { Building2, Save, Check, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CompanyData, 
  saveCompanyData, 
  loadCompanyData, 
  clearCompanyData, 
  hasCompanyData 
} from "@/utils/companyStorage";
import { useToast } from "@/hooks/use-toast";

export function CompanyRegistration() {
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    cnpj: '',
    address: '',
    period: '',
    activity: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingData, setExistingData] = useState<CompanyData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadExistingData = () => {
      const data = loadCompanyData();
      if (data) {
        setExistingData(data);
        setFormData(data);
      } else {
        setIsEditing(true); // Se não há dados, permitir edição imediatamente
      }
    };
    
    loadExistingData();
  }, []);

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCNPJ = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CNPJ
    return numbers
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome da empresa obrigatório",
        description: "Por favor, insira o nome da empresa.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.cnpj.trim()) {
      toast({
        title: "CNPJ obrigatório",
        description: "Por favor, insira o CNPJ da empresa.",
        variant: "destructive"
      });
      return false;
    }
    
    // Validação básica do CNPJ (deve ter 14 dígitos)
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve conter 14 dígitos.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.address.trim()) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, insira o endereço da empresa.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.period.trim()) {
      toast({
        title: "Período obrigatório",
        description: "Por favor, insira o período de funcionamento.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.activity.trim()) {
      toast({
        title: "Atividade obrigatória",
        description: "Por favor, insira a atividade principal da empresa.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      saveCompanyData(formData);
      setExistingData(formData);
      setIsEditing(false);
      
      toast({
        title: "Dados salvos com sucesso!",
        description: "Os dados da empresa foram cadastrados no sistema.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da empresa.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (existingData) {
      setFormData(existingData);
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    clearCompanyData();
    setExistingData(null);
    setFormData({
      name: '',
      cnpj: '',
      address: '',
      period: '',
      activity: ''
    });
    setIsEditing(true);
    
    toast({
      title: "Dados removidos",
      description: "Os dados da empresa foram removidos do sistema.",
      variant: "default"
    });
  };

  const isRegistered = hasCompanyData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Cadastro da Empresa</h1>
        {isRegistered && (
          <Badge variant="secondary" className="ml-2">
            <Check className="h-3 w-3 mr-1" />
            Empresa Cadastrada
          </Badge>
        )}
      </div>

      {!isRegistered && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta é a primeira configuração do sistema. Os dados da empresa devem ser cadastrados apenas uma vez 
            e serão utilizados como referência em todo o sistema.
          </AlertDescription>
        </Alert>
      )}

      <Card className="glass glass-dark shadow-modern-md">
        <CardHeader className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-bold">
                  Informações da Empresa
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-slate-600">
                {isEditing 
                  ? "Preencha as informações básicas da sua empresa"
                  : "Dados da empresa cadastrados no sistema"
                }
              </CardDescription>
            </div>
            
            {isRegistered && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClear}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                placeholder="Ex: Restaurante Estratégico LTDA"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => handleCNPJChange(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
                maxLength={18}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo *</Label>
            <Textarea
              id="address"
              placeholder="Rua, número, bairro, cidade, estado, CEP"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="period">Período de Funcionamento *</Label>
              <Input
                id="period"
                placeholder="Ex: Segunda a Sábado - 6h às 22h"
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity">Atividade Principal *</Label>
              <Input
                id="activity"
                placeholder="Ex: Restaurante e Lanchonete"
                value={formData.activity}
                onChange={(e) => handleInputChange('activity', e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>
          </div>
          
          {existingData?.registrationDate && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Data de Cadastro:</strong> {new Date(existingData.registrationDate).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
          
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              {existingData && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Dados
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isRegistered && !isEditing && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-800">Empresa cadastrada com sucesso!</p>
                <p className="text-sm text-green-600">
                  Os dados da empresa estão sendo utilizados em todo o sistema. 
                  Você pode editar as informações se necessário.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 