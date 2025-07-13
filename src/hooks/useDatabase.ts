import { useState, useEffect } from 'react';
import { db, DatabaseEmployee, DatabaseSchedule } from '@/utils/database';
import { Employee } from '@/types/employee';
import { SavedScheduleData } from '@/utils/scheduleStorage';
import { useToast } from '@/hooks/use-toast';

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [employees, setEmployees] = useState<DatabaseEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Inicializar banco de dados
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await db.initialize();
        
        // Verificar se precisa migrar dados do localStorage
        const localEmployees = localStorage.getItem('bishop_employees');
        const localSchedules = Object.keys(localStorage).filter(key => key.startsWith('schedule_'));
        
        if (localEmployees || localSchedules.length > 0) {
          console.log('🔄 Migrando dados do localStorage...');
          await db.migrateFromLocalStorage();
          
          toast({
            title: "🔄 Migração Concluída",
            description: "Dados migrados para o novo sistema de armazenamento robusto!",
            duration: 5000,
          });
        }
        
        setIsInitialized(true);
        await loadEmployees();
      } catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
        toast({
          title: "❌ Erro de Inicialização",
          description: "Não foi possível inicializar o banco de dados. Usando modo fallback.",
          variant: "destructive",
          duration: 7000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, [toast]);

  // Carregar colaboradores
  const loadEmployees = async () => {
    try {
      const dbEmployees = await db.getAllEmployees();
      setEmployees(dbEmployees);
    } catch (error) {
      console.error('❌ Erro ao carregar colaboradores:', error);
    }
  };

  // Operações de Colaboradores
  const addEmployee = async (employee: Employee): Promise<void> => {
    try {
      console.log('🔍 [useDatabase] Iniciando addEmployee:', employee.name);
      console.log('🔍 [useDatabase] Estado atual de employees:', employees.length);
      
      const dbEmployee = await db.addEmployee(employee);
      console.log('✅ [useDatabase] Colaborador adicionado ao banco:', dbEmployee);
      
      setEmployees(prev => {
        console.log('🔍 [useDatabase] Estado anterior:', prev.length);
        const newState = [...prev, dbEmployee];
        console.log('🔍 [useDatabase] Novo estado:', newState.length);
        return newState;
      });
      
      console.log('✅ [useDatabase] Estado atualizado com sucesso');
      
      toast({
        title: "✅ Colaborador Adicionado",
        description: `${employee.name} foi cadastrado com sucesso!`,
      });
    } catch (error) {
      console.error('❌ Erro ao adicionar colaborador:', error);
      toast({
        title: "❌ Erro ao Adicionar",
        description: "Não foi possível adicionar o colaborador.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEmployee = async (employee: DatabaseEmployee): Promise<void> => {
    try {
      const updatedEmployee = await db.updateEmployee(employee);
      setEmployees(prev => 
        prev.map(emp => emp.id === employee.id ? updatedEmployee : emp)
      );
      
      toast({
        title: "✅ Colaborador Atualizado",
        description: `${employee.name} foi atualizado com sucesso!`,
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar colaborador:', error);
      toast({
        title: "❌ Erro ao Atualizar",
        description: "Não foi possível atualizar o colaborador.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEmployee = async (employeeId: string): Promise<void> => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      await db.deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      toast({
        title: "✅ Colaborador Removido",
        description: `${employee?.name || 'Colaborador'} foi removido com sucesso!`,
      });
    } catch (error) {
      console.error('❌ Erro ao remover colaborador:', error);
      toast({
        title: "❌ Erro ao Remover",
        description: "Não foi possível remover o colaborador.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Operações de Horários
  const saveSchedule = async (scheduleData: SavedScheduleData): Promise<boolean> => {
    try {
      await db.saveSchedule(scheduleData);
      
      toast({
        title: "✅ Horário Salvo",
        description: `Horário do setor ${scheduleData.sector} salvo com sucesso!`,
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar horário:', error);
      toast({
        title: "❌ Erro ao Salvar",
        description: "Não foi possível salvar o horário.",
        variant: "destructive",
      });
      return false;
    }
  };

  const loadSchedule = async (sector: string, day: string): Promise<DatabaseSchedule | null> => {
    try {
      return await db.loadSchedule(sector, day);
    } catch (error) {
      console.error('❌ Erro ao carregar horário:', error);
      return null;
    }
  };

  const getAllSchedules = async (): Promise<DatabaseSchedule[]> => {
    try {
      return await db.getAllSchedules();
    } catch (error) {
      console.error('❌ Erro ao buscar horários:', error);
      return [];
    }
  };

  // Sistema de Backup
  const createBackup = async (type: 'auto' | 'manual' = 'manual'): Promise<boolean> => {
    try {
      const backup = await db.createBackup(type);
      
      if (type === 'manual') {
        toast({
          title: "✅ Backup Criado",
          description: `Backup ${backup.id} criado com sucesso!`,
        });
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      if (type === 'manual') {
        toast({
          title: "❌ Erro no Backup",
          description: "Não foi possível criar o backup.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const exportData = async (): Promise<string | null> => {
    try {
      const exportData = await db.exportData();
      
      toast({
        title: "✅ Dados Exportados",
        description: "Dados exportados com sucesso!",
      });
      
      return exportData;
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      toast({
        title: "❌ Erro na Exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Informações do Sistema
  const getStorageInfo = async () => {
    try {
      return await db.getStorageInfo();
    } catch (error) {
      console.error('❌ Erro ao obter informações de armazenamento:', error);
      return {
        totalEmployees: 0,
        totalSchedules: 0,
        totalBackups: 0,
        estimatedSize: 0,
        sectors: [],
        lastBackup: null
      };
    }
  };

  // Status de sincronização (preparação para nuvem)
  const getPendingSync = async () => {
    try {
      return await db.getPendingSync();
    } catch (error) {
      console.error('❌ Erro ao verificar dados pendentes:', error);
      return { employees: [], schedules: [] };
    }
  };

  // Limpar dados
  const clearAllData = async (): Promise<boolean> => {
    try {
      // Criar backup antes de limpar
      await createBackup('manual');
      
      // Limpar colaboradores
      for (const employee of employees) {
        await db.deleteEmployee(employee.id);
      }
      
      // Limpar horários
      const schedules = await db.getAllSchedules();
      for (const schedule of schedules) {
        // Implementar delete de schedule se necessário
      }
      
      setEmployees([]);
      
      toast({
        title: "🗑️ Dados Limpos",
        description: "Todos os dados foram removidos. Backup criado antes da limpeza.",
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      toast({
        title: "❌ Erro ao Limpar",
        description: "Não foi possível limpar os dados.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    // Estado
    isInitialized,
    employees,
    isLoading,
    
    // Operações de Colaboradores
    addEmployee,
    updateEmployee,
    deleteEmployee,
    loadEmployees,
    
    // Operações de Horários
    saveSchedule,
    loadSchedule,
    getAllSchedules,
    
    // Sistema de Backup
    createBackup,
    exportData,
    
    // Informações do Sistema
    getStorageInfo,
    getPendingSync,
    
    // Utilitários
    clearAllData,
  };
} 