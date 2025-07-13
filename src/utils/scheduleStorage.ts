export interface SavedScheduleData {
  day: string;
  sector: string;
  savedAt: string;
  version: string;
  autoSaved?: boolean;
  employees: {
    id: string;
    name: string;
    role: string;
    sector: string;
    schedule: Record<string, boolean>;
  }[];
}

export interface SavedSectorsRegistry {
  [sector: string]: {
    [day: string]: {
      savedAt: string;
      employeeCount: number;
    };
  };
}

export class ScheduleStorage {
  private static readonly STORAGE_PREFIX = 'schedule_';
  private static readonly REGISTRY_KEY = 'saved_sectors_registry';
  private static readonly VERSION = '1.0';

  static saveSchedule(sector: string, day: string, data: SavedScheduleData): boolean {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${sector}_${day}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Update registry
      this.updateRegistry(sector, day, data.savedAt, data.employees.length);
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      return false;
    }
  }

  static loadSchedule(sector: string, day: string): SavedScheduleData | null {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${sector}_${day}`;
      const data = localStorage.getItem(storageKey);
      
      if (data) {
        return JSON.parse(data);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao carregar horário:', error);
      return null;
    }
  }

  static loadAllSchedules(): Record<string, SavedScheduleData> {
    const schedules: Record<string, SavedScheduleData> = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith(this.STORAGE_PREFIX) && key !== this.REGISTRY_KEY) {
          const data = localStorage.getItem(key);
          
          if (data) {
            schedules[key] = JSON.parse(data);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar todos os horários:', error);
    }
    
    return schedules;
  }

  static getRegistry(): SavedSectorsRegistry {
    try {
      const registryData = localStorage.getItem(this.REGISTRY_KEY);
      return registryData ? JSON.parse(registryData) : {};
    } catch (error) {
      console.error('Erro ao carregar registro:', error);
      return {};
    }
  }

  private static updateRegistry(sector: string, day: string, savedAt: string, employeeCount: number): void {
    try {
      const registry = this.getRegistry();
      
      if (!registry[sector]) {
        registry[sector] = {};
      }
      
      registry[sector][day] = {
        savedAt,
        employeeCount
      };
      
      localStorage.setItem(this.REGISTRY_KEY, JSON.stringify(registry));
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
    }
  }

  static clearAllSchedules(): boolean {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && (key.startsWith(this.STORAGE_PREFIX) || key === this.REGISTRY_KEY)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar horários:', error);
      return false;
    }
  }

  static exportSchedules(): string {
    try {
      const allSchedules = this.loadAllSchedules();
      const registry = this.getRegistry();
      
      const exportData = {
        version: this.VERSION,
        exportedAt: new Date().toISOString(),
        schedules: allSchedules,
        registry: registry
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Erro ao exportar horários:', error);
      return '';
    }
  }

  static getStorageInfo(): { totalSchedules: number; totalSize: number; sectors: string[] } {
    try {
      const allSchedules = this.loadAllSchedules();
      const registry = this.getRegistry();
      
      const totalSchedules = Object.keys(allSchedules).length;
      const sectors = Object.keys(registry);
      
      // Calculate approximate storage size
      let totalSize = 0;
      Object.values(allSchedules).forEach(schedule => {
        totalSize += JSON.stringify(schedule).length;
      });
      
      return {
        totalSchedules,
        totalSize,
        sectors
      };
    } catch (error) {
      console.error('Erro ao obter informações de armazenamento:', error);
      return { totalSchedules: 0, totalSize: 0, sectors: [] };
    }
  }
} 