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