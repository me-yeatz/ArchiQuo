
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Project, Quotation, Invoice, Payment, Transmittal, UserProfile } from './types';

interface StoreContextType extends AppState {
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  addQuotation: (q: Omit<Quotation, 'id'>) => void;
  updateQuotation: (id: string, q: Partial<Quotation>) => void;
  addInvoice: (i: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, i: Partial<Invoice>) => void;
  addPayment: (pay: Omit<Payment, 'id'>) => void;
  addTransmittal: (t: Omit<Transmittal, 'id'>) => void;
  updateProfile: (p: UserProfile) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('archiquote_db');
    const defaultProfile = {
      companyName: 'YEATZ ARCH+STUDIO',
      companyAddress: '1738, Jalan Gajah 11, Kampung Kubu Gajah, 40160 Sungai Buloh, Selangor',
      senderName: 'Muhammad Fazreen Bin Ahmad Azhar',
      senderTitle: 'Project Manager',
      logoUrl: '/LOGO 2025-03.png'
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        profile: parsed.profile || defaultProfile
      };
    }
    return { projects: [], quotations: [], invoices: [], payments: [], transmittals: [], profile: defaultProfile };
  });

  useEffect(() => {
    localStorage.setItem('archiquote_db', JSON.stringify(state));
  }, [state]);

  const addProject = (p: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...p,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setState(s => ({ ...s, projects: [newProject, ...s.projects] }));
  };

  const updateProject = (id: string, p: Partial<Project>) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(proj => proj.id === id ? { ...proj, ...p } : proj)
    }));
  };

  const addQuotation = (q: Omit<Quotation, 'id'>) => {
    const newQ: Quotation = { ...q, id: crypto.randomUUID() };
    setState(s => ({ ...s, quotations: [newQ, ...s.quotations] }));
  };

  const updateQuotation = (id: string, q: Partial<Quotation>) => {
    setState(s => ({
      ...s,
      quotations: s.quotations.map(item => item.id === id ? { ...item, ...q } : item)
    }));
  };

  const addInvoice = (i: Omit<Invoice, 'id'>) => {
    const newI: Invoice = { ...i, id: crypto.randomUUID() };
    setState(s => ({ ...s, invoices: [newI, ...s.invoices] }));
  };

  const updateInvoice = (id: string, i: Partial<Invoice>) => {
    setState(s => ({
      ...s,
      invoices: s.invoices.map(item => item.id === id ? { ...item, ...i } : item)
    }));
  };

  const addPayment = (pay: Omit<Payment, 'id'>) => {
    const newP: Payment = { ...pay, id: crypto.randomUUID() };
    setState(s => ({ ...s, payments: [newP, ...s.payments] }));
  };

  const addTransmittal = (t: Omit<Transmittal, 'id'>) => {
    const newT: Transmittal = { ...t, id: crypto.randomUUID() };
    setState(s => ({ ...s, transmittals: [newT, ...s.transmittals] }));
  };

  const updateProfile = (p: UserProfile) => {
    setState(s => ({ ...s, profile: p }));
  };

  return (
    <StoreContext.Provider value={{
      ...state,
      addProject,
      updateProject,
      addQuotation,
      updateQuotation,
      addInvoice,
      updateInvoice,
      addPayment,
      addTransmittal,
      updateProfile
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
