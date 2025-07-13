export interface Employee {
  id: string;
  companyName: string;
  cnpj: string;
  address: string;
  period: string;
  activity: string;
  sector: string;
  name: string;
  role: string;
  ctps: string;
  admissionDate: Date;
  remuneracao?: string;
}

export interface TimeSlot {
  employeeId: string;
  timeSlot: string;
  isMarked: boolean;
}

export interface TimeGrid {
  role: string;
  employees: Employee[];
  timeSlots: Record<string, TimeSlot[]>;
}

// Generate time slots from 05:00 to 05:00 (next day) in 30-minute intervals
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startHour = 5;
  const totalSlots = 48;
  
  for (let i = 0; i < totalSlots; i++) {
    const totalMinutes = startHour * 60 + (i * 30);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    slots.push(formattedTime);
  }
  
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

// 🌙 CORREÇÃO PARA JORNADAS NOTURNAS
// Função para converter tempo visual para tempo de cálculo
export const getCalculationTime = (visualTime: string): string => {
  if (!visualTime) return visualTime;
  
  const [hours, minutes] = visualTime.split(':').map(Number);
  
  // Para horários 00:00-04:30 (slots 39-48), adiciona 24 horas para cálculo
  if (hours >= 0 && hours < 5) {
    const calculationHours = hours + 24;
    return `${calculationHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return visualTime;
};

// Função para converter tempo HH:MM para minutos (com correção para jornadas noturnas)
export const timeToMinutesWithCorrection = (time: string): number => {
  if (!time) return 0;
  
  const calculationTime = getCalculationTime(time);
  const [hours, minutes] = calculationTime.split(':').map(Number);
  
  return hours * 60 + minutes;
};

// Função para converter minutos para tempo HH:MM (com correção para display visual)
export const minutesToTimeWithCorrection = (minutes: number): string => {
  if (minutes < 0) return "00:00";
  
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  // Se horas >= 24, converte de volta para formato visual (24:00 → 00:00, 25:30 → 01:30, etc.)
  if (hours >= 24) {
    hours = hours - 24;
  }
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Função para converter minutos para tempo HH:MM (para totais acumulados - sem correção de 24h)
export const minutesToTimeForTotals = (minutes: number): string => {
  if (minutes < 0) return "00:00";
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};