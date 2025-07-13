export interface CompanyData {
  name: string;
  cnpj: string;
  address: string;
  period: string;
  activity: string;
  registrationDate?: string;
}

const COMPANY_STORAGE_KEY = 'bishop-company-data';

export const saveCompanyData = (companyData: CompanyData): void => {
  try {
    const dataToSave = {
      ...companyData,
      registrationDate: companyData.registrationDate || new Date().toISOString()
    };
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('Dados da empresa salvos:', dataToSave);
  } catch (error) {
    console.error('Erro ao salvar dados da empresa:', error);
  }
};

export const loadCompanyData = (): CompanyData | null => {
  try {
    const stored = localStorage.getItem(COMPANY_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as CompanyData;
      console.log('Dados da empresa carregados:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar dados da empresa:', error);
    return null;
  }
};

export const clearCompanyData = (): void => {
  try {
    localStorage.removeItem(COMPANY_STORAGE_KEY);
    console.log('Dados da empresa removidos');
  } catch (error) {
    console.error('Erro ao remover dados da empresa:', error);
  }
};

export const hasCompanyData = (): boolean => {
  const data = loadCompanyData();
  return data !== null && data.name.trim() !== '';
}; 