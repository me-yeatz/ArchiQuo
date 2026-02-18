
import React, { useState } from 'react';
import { useStore } from './store';
import Layout from './components/Layout';
import { Project, Quotation, Invoice, Payment, Transmittal } from './types';
import { formatCurrency } from './utils/helpers';
import { NewProjectForm, NewQuotationForm, NewInvoiceForm, NewTransmittalForm, UserProfileForm } from './components/ProjectForms';

type ModalState = {
  type: 'quotation' | 'invoice' | 'transmittal' | 'select-project-for-transmittal';
  project?: Project;
  quotation?: Quotation;
} | null;

const DashboardView = () => {
  const { projects, quotations, invoices, profile } = useStore();
  const stats = [
    { label: 'ACTIVE PROJECTS', value: projects.filter(p => p.status === 'Active').length, color: 'text-black' },
    { label: 'OPEN QUOTATIONS', value: quotations.filter(q => q.status === 'Draft' || q.status === 'Sent').length, color: 'text-[#c02164]' },
    { label: 'UNSETTLED INVOICES', value: invoices.filter(i => i.status === 'Unpaid').length, color: 'text-red-600' },
    { label: 'GROSS SETTLEMENT', value: formatCurrency(invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.items.reduce((sum, item) => sum + item.amount, 0), 0)), color: 'text-black' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b-4 border-black pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Control.Panel</h1>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] mt-1">{profile.companyName} // CORE MANAGEMENT</p>
        </div>
        <div className="text-right no-print">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SYSTEM STATUS</p>
          <p className="text-xs font-black text-[#c02164] uppercase">OPERATIONAL</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 technical-border hover:bg-slate-50 transition-all cursor-default">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white technical-border flex flex-col">
          <div className="bg-[#1a1c1e] text-white p-4 flex justify-between items-center">
            <h2 className="text-xs font-black tracking-widest">LATEST PROJECT LOGS</h2>
            <i className="fas fa-history text-[10px] opacity-50"></i>
          </div>
          <div className="p-6 space-y-4">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 border-b technical-border-thin hover:bg-slate-50 cursor-pointer group">
                <div>
                  <p className="font-black text-xs group-hover:text-[#c02164] transition-colors uppercase">{p.title}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">{p.clientName}</p>
                </div>
                <div className="text-[9px] font-black px-2 py-0.5 technical-border uppercase tracking-widest">{p.status}</div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-slate-300 text-center py-10 font-black uppercase text-[10px]">Registry Empty</p>}
          </div>
        </div>

        <div className="bg-white technical-border flex flex-col">
          <div className="bg-[#1a1c1e] text-white p-4 flex justify-between items-center">
            <h2 className="text-xs font-black tracking-widest">PENDING RECEIVABLES</h2>
            <i className="fas fa-exclamation-triangle text-[10px] opacity-50"></i>
          </div>
          <div className="p-6 space-y-4">
            {invoices.filter(i => i.status === 'Unpaid').slice(0, 5).map(i => (
              <div key={i.id} className="flex items-center justify-between p-4 bg-red-50/30 technical-border-thin border-red-100 group">
                <div>
                  <p className="font-black text-xs uppercase tracking-tight">{i.invoiceNo}</p>
                  <p className="text-[9px] text-red-500 font-black uppercase mt-0.5 tracking-widest">DUE: {i.dueDate}</p>
                </div>
                <p className="font-black text-[#c02164] text-sm">{formatCurrency(i.items.reduce((a, b) => a + b.amount, 0) * (1 + i.taxRate / 100))}</p>
              </div>
            ))}
            {invoices.filter(i => i.status === 'Unpaid').length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">All Accounts Clear</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

const ProjectsView = ({ onSelectProject }: { onSelectProject: (p: Project) => void }) => {
  const { projects } = useStore();
  const [filter, setFilter] = useState<string>('Active');

  const filteredProjects = projects.filter(p => p.status === filter);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-4 border-black pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Registry.All</h1>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] mt-1">{useStore().profile.companyName} // ASSET DIRECTORY</p>
        </div>
        <div className="flex bg-[#1a1c1e] p-1 gap-1">
          {['Active', 'Completed', 'Archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-white text-black' : 'text-slate-500 hover:text-white'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(p => (
          <div
            key={p.id}
            onClick={() => onSelectProject(p)}
            className="group bg-white p-8 technical-border hover:bg-slate-50 transition-all cursor-pointer relative"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black uppercase italic tracking-tight group-hover:text-[#c02164] transition-colors">{p.title}</h3>
              <div className="text-[8px] font-black uppercase technical-border-thin px-2 py-0.5">ID:{p.id.slice(0, 4)}</div>
            </div>
            <p className="text-slate-500 text-[11px] font-bold leading-relaxed line-clamp-2 mb-8 border-l-2 border-slate-100 pl-4">{p.description || "NO DESCRIPTION LOGGED."}</p>
            <div className="flex items-center justify-between border-t-2 border-black pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  <i className="fas fa-user-tie text-[8px]"></i>
                  {p.clientName}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  <i className="fas fa-clock text-[8px]"></i>
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <i className="fas fa-arrow-right text-[10px] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"></i>
            </div>
          </div>
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <div className="text-center py-32 bg-white/50 border-4 border-dashed border-slate-200">
          <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">Registry.Empty</p>
        </div>
      )}
    </div>
  );
};

const TransmittalsView = ({ onOpenModal }: { onOpenModal: (state: ModalState) => void }) => {
  const { transmittals, projects } = useStore();

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b-4 border-black pb-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Registry.Transmittals</h1>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] mt-1">{useStore().profile.companyName} // LOG OF ALL TRANSMISSIONS</p>
        </div>
        <button
          onClick={() => onOpenModal({ type: 'select-project-for-transmittal' })}
          className="bg-[#1a1c1e] text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] technical-border hover:bg-slate-800 transition-all flex items-center gap-3 no-print"
        >
          <i className="fas fa-plus"></i> CREATE TRANSMITTAL
        </button>
      </div>

      <div className="space-y-6">
        {transmittals.map(t => {
          const project = projects.find(p => p.id === t.projectId);
          return (
            <div key={t.id} className="bg-white p-8 technical-border group hover:bg-slate-50 transition-all">
              <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-black uppercase italic tracking-tight group-hover:text-[#c02164] transition-colors">{t.transmittalNo}</h4>
                    <span className="text-[8px] font-black uppercase technical-border-thin px-1 bg-white">JOB: {t.jobNo}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.projectTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase">ISSUED TO</p>
                  <p className="text-xs font-black uppercase">{t.to}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2 col-span-2">
                  <p className="text-[8px] font-black text-[#c02164] uppercase tracking-widest">TRANSMITTED ITEMS</p>
                  <div className="grid grid-cols-1 gap-1">
                    {t.items.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[10px] font-bold text-slate-500 border-b border-dotted pb-1">
                        <span>• {item.description} ({item.type})</span>
                        <span className="text-black">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {t.items.length > 5 && <p className="text-[8px] text-slate-300 italic">...and {t.items.length - 5} more items</p>}
                </div>
                <div className="flex flex-col justify-end items-end gap-4">
                  <div className="text-right mb-auto">
                    <p className="text-[8px] font-black text-slate-400 uppercase">MODE</p>
                    <p className="text-[9px] font-black uppercase">{(t.transmissionModes || []).join(', ') || 'N/A'}</p>
                  </div>
                  {t.signatureData && (
                    <div className="technical-border-thin bg-white p-2">
                      <img src={t.signatureData} alt="Signature" className="h-10 object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    </div>
                  )}
                  <button onClick={() => window.print()} className="w-full bg-white border-2 border-black text-black px-4 py-2 font-black uppercase tracking-widest text-[9px] hover:bg-black hover:text-white transition-all no-print">
                    PRINT FORM
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {transmittals.length === 0 && (
          <div className="text-center py-32 bg-white/50 border-4 border-dashed border-slate-200">
            <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">Transmittals.Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectDetailView = ({ project, onBack, onOpenModal }: { project: Project, onBack: () => void, onOpenModal: (state: ModalState) => void }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { quotations, invoices, addPayment, updateInvoice, updateQuotation, transmittals } = useStore();

  const projectQuotes = quotations.filter(q => q.projectId === project.id);
  const projectInvoices = invoices.filter(i => i.projectId === project.id);
  const projectTransmittals = transmittals.filter(t => t.projectId === project.id);

  const tabs = [
    { id: 'details', label: '01.DETAILS', icon: 'fa-info' },
    { id: 'quotations', label: '02.QUOTES', icon: 'fa-file-invoice' },
    { id: 'invoices', label: '03.INVOICES', icon: 'fa-receipt' },
    { id: 'transmittals', label: '04.TRANSMIT', icon: 'fa-shipping-fast' },
    { id: 'payments', label: '05.STATEMENT', icon: 'fa-credit-card' },
  ];

  const handleAddPayment = (invoiceId: string, amount: number) => {
    addPayment({
      projectId: project.id,
      invoiceId,
      amount,
      date: new Date().toISOString().split('T')[0],
      method: 'Bank Transfer'
    });
    updateInvoice(invoiceId, { status: 'Paid' });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#c02164] flex items-center gap-2 no-print group">
        <i className="fas fa-long-arrow-alt-left"></i>
        [BACK_TO_REGISTRY]
      </button>

      <div className="bg-[#1a1c1e] p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 technical-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#fbd98e] font-black text-[9px] uppercase tracking-widest">{project.status}</span>
            <span className="text-slate-500 font-black text-[9px] uppercase tracking-widest">REF_NUM: {project.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">{project.title}</h1>
          <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] mt-1">{project.clientName} // {project.address}</p>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <button onClick={() => onOpenModal({ type: 'quotation', project })} className="bg-white text-black px-4 py-2 font-black uppercase tracking-widest text-[9px] hover:bg-slate-200 transition-all flex items-center gap-2">
            <i className="fas fa-plus"></i> NEW QUOTE
          </button>
          <button onClick={() => onOpenModal({ type: 'invoice', project })} className="bg-[#c02164] text-white px-4 py-2 font-black uppercase tracking-widest text-[9px] hover:bg-pink-700 transition-all flex items-center gap-2">
            <i className="fas fa-plus"></i> NEW INVOICE
          </button>
          <button onClick={() => onOpenModal({ type: 'transmittal', project })} className="bg-emerald-600 text-white px-4 py-2 font-black uppercase tracking-widest text-[9px] hover:bg-emerald-700 transition-all flex items-center gap-2">
            <i className="fas fa-shipping-fast"></i> NEW TRANSMITTAL
          </button>
        </div>
      </div>

      <nav className="flex gap-6 no-print border-b-2 border-black overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-b-4 border-[#c02164] text-black' : 'text-slate-400 hover:text-slate-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div>
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-8 technical-border">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-[#c02164]">01. EXECUTIVE SUMMARY</h3>
                <p className="text-slate-600 leading-relaxed font-bold text-sm whitespace-pre-line">{project.description || "N/A"}</p>
              </section>
              <section className="bg-white p-8 technical-border">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-[#c02164]">02. SCOPE OF WORKS</h3>
                <p className="text-slate-600 leading-relaxed font-bold text-sm whitespace-pre-line">{project.scopeOfWorks || "N/A"}</p>
              </section>
            </div>
            <div className="bg-white p-8 technical-border">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-6 border-b pb-2">VITAL STATISTICS</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">CURRENT PHASE</p>
                  <span className="technical-border-thin px-3 py-1 text-[10px] font-black uppercase tracking-widest">{project.status}</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">ENTRY DATE</p>
                  <p className="text-sm font-black">{new Date(project.createdAt).toDateString()}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2 italic">INTERNAL DIRECTIVES</p>
                  <p className="text-xs text-slate-500 font-bold italic">{project.notes || "NONE LOGGED."}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transmittals' && (
          <div className="space-y-6">
            {projectTransmittals.map(t => (
              <div key={t.id} className="bg-white p-8 technical-border">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">{t.transmittalNo}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">ISSUED: {t.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase">RECEIVED BY</p>
                    <p className="text-xs font-black uppercase">{t.receiverName || 'PENDING'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-[#c02164]">Transmitted Components</p>
                    <div className="space-y-1">
                      {t.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between p-3 bg-slate-50 technical-border-thin text-[10px] font-bold">
                          <span>{item.description} ({item.type})</span>
                          <span className="text-[#c02164]">{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 technical-border-thin">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">PURPOSE OF TRANSMISSION</p>
                      <div className="flex flex-wrap gap-2">
                        {(t.purposes || []).map(p => (
                          <span key={p} className="text-[9px] bg-white border border-black px-2 py-0.5 font-bold uppercase">{p}</span>
                        ))}
                      </div>
                    </div>
                    {t.signatureData && (
                      <div className="technical-border bg-white p-4 flex flex-col items-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Electronic Acknowledgement</p>
                        <img src={t.signatureData} alt="Signature" className="max-h-24 object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projectTransmittals.length === 0 && <div className="text-center py-20 text-slate-300 font-black uppercase text-[10px] tracking-widest">NO TRANSMITTALS EXECUTED.</div>}
          </div>
        )}

        {activeTab === 'quotations' && (
          <div className="space-y-6">
            {projectQuotes.map(q => (
              <div key={q.id} className="bg-white p-8 technical-border group">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight group-hover:text-[#c02164] transition-colors">{q.quotationNo}</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">ISSUED: {q.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 technical-border-thin text-[9px] font-black uppercase tracking-widest ${q.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                      q.status === 'Draft' ? 'bg-slate-50 text-slate-500' : 'bg-amber-50 text-amber-700'
                      }`}>
                      {q.status}
                    </span>
                    {q.status === 'Draft' && (
                      <button onClick={() => updateQuotation(q.id, { status: 'Approved' })} className="text-[9px] font-black uppercase tracking-widest hover:text-[#c02164]">AUTHORIZE</button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 technical-border-thin">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">PROPOSED VALUE</p>
                    <p className="text-lg font-black">{formatCurrency(q.proposedFees)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 technical-border-thin">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">CATEGORIES</p>
                    <p className="text-lg font-black">{q.scopeItems.length} ENTRIES</p>
                  </div>
                </div>
                <div className="flex justify-end no-print">
                  <button onClick={() => window.print()} className="bg-white technical-border px-6 py-2 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                    <i className="fas fa-print mr-2"></i> EXPORT_PDF
                  </button>
                </div>
              </div>
            ))}
            {projectQuotes.length === 0 && <div className="text-center py-20 text-slate-300 font-black uppercase text-[10px] tracking-widest">NO ASSETS DOCUMENTED.</div>}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {projectInvoices.map(i => {
              const total = i.items.reduce((acc, curr) => acc + curr.amount, 0) * (1 + i.taxRate / 100);
              return (
                <div key={i.id} className="bg-white p-8 technical-border">
                  <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight italic">{i.invoiceNo}</h4>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">DUE: {i.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 technical-border-thin text-[9px] font-black uppercase tracking-widest ${i.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                      {i.status}
                    </span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {i.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500 uppercase">{item.description}</span>
                        <span className="font-black">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t-2 border-black font-black text-slate-900 mt-4">
                      <span className="uppercase text-[10px] tracking-widest">NET SETTLEMENT VALUE</span>
                      <span className="text-xl text-[#c02164]">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  {i.status === 'Unpaid' && (
                    <button onClick={() => handleAddPayment(i.id, total)} className="w-full bg-[#1a1c1e] text-white py-3 font-black uppercase tracking-widest text-[9px] hover:bg-slate-800 transition-all">
                      <i className="fas fa-check-circle mr-2"></i> CONFIRM_PAYMENT
                    </button>
                  )}
                </div>
              );
            })}
            {projectInvoices.length === 0 && <div className="text-center py-20 text-slate-300 font-black uppercase text-[10px] tracking-widest">NO ASSETS DOCUMENTED.</div>}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white technical-border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#1a1c1e] text-white text-[9px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-4">TRANS_REF</th>
                  <th className="px-8 py-4">SETTLEMENT_DATE</th>
                  <th className="px-8 py-4">MODALITY</th>
                  <th className="px-8 py-4 text-right">CREDIT_VAL</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y technical-border-thin">
                {useStore().payments.filter(p => p.projectId === project.id).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-8 py-6 font-black tracking-tight uppercase">YT-TR-{p.id.slice(0, 5)}</td>
                    <td className="px-8 py-6 text-slate-500 font-black">{p.date}</td>
                    <td className="px-8 py-6 uppercase font-black text-slate-400">{p.method}</td>
                    <td className="px-8 py-6 text-right font-black text-[#c02164] text-sm">{formatCurrency(p.amount)}</td>
                  </tr>
                ))}
                {useStore().payments.filter(p => p.projectId === project.id).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">No Logs Found</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-900 text-white">
                <tr>
                  <td colSpan={3} className="px-8 py-6 font-black text-[10px] uppercase tracking-widest">Total Credit Received</td>
                  <td className="px-8 py-6 text-right font-black text-[#fbd98e] text-2xl">
                    {formatCurrency(useStore().payments.filter(p => p.projectId === project.id).reduce((a, b) => a + b.amount, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const { projects } = useStore();

  const renderContent = () => {
    if (selectedProject) {
      return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} onOpenModal={setActiveModal} />;
    }

    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'projects': return <ProjectsView onSelectProject={setSelectedProject} />;
      case 'transmittals': return <TransmittalsView onOpenModal={setActiveModal} />;
      case 'new-project': return <NewProjectForm onSuccess={() => setActiveView('projects')} />;
      case 'profile': return <UserProfileForm onSuccess={() => setActiveView('dashboard')} />;
      default: return <DashboardView />;
    }
  };

  return (
    <>
      {/* Background layer for modals to ensure global blur */}
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {renderContent()}
      </Layout>

      {/* Global Modal Container - Rendered outside of Layout to bypass container constraints */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6 no-print">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto technical-border shadow-2xl blueprint-bg animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b-2 border-black bg-[#1a1c1e] text-white sticky top-0 z-10">
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                {activeModal.type === 'select-project-for-transmittal' ? 'SELECT PROJECT FOR DOCUMENTATION' : `${activeModal.type.toUpperCase()}: ${activeModal.project?.title}`}
              </h2>
              <button onClick={() => setActiveModal(null)} className="font-black text-[10px] uppercase hover:text-red-400 transition-colors">
                [X] ABORT_PROCESS
              </button>
            </div>
            <div className="p-8">
              {activeModal.type === 'select-project-for-transmittal' && (
                <div className="space-y-6">
                  <div className="bg-black text-white p-4 technical-border mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">PHASE_01: SELECT TARGET PROJECT FROM REGISTRY</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.filter(p => p.status === 'Active').map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActiveModal({ type: 'transmittal', project: p })}
                        className="p-6 bg-white technical-border hover:border-[#c02164] hover:bg-slate-50 transition-all text-left group flex justify-between items-center"
                      >
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-[#c02164]">Project Entry</p>
                          <p className="font-black uppercase text-sm">{p.title}</p>
                          <p className="text-[9px] text-slate-400 mt-2 italic">{p.clientName}</p>
                        </div>
                        <i className="fas fa-chevron-right text-slate-300 group-hover:text-[#c02164]"></i>
                      </button>
                    ))}
                    {projects.filter(p => p.status === 'Active').length === 0 && (
                      <div className="col-span-2 text-center py-20 bg-white/50 border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">No active projects logged in registry.</p>
                        <p className="text-[10px] text-slate-400 mt-2">Initialize a project first to generate transmittals.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeModal.type === 'quotation' && activeModal.project && (
                <NewQuotationForm project={activeModal.project} onSuccess={() => setActiveModal(null)} />
              )}
              {activeModal.type === 'invoice' && activeModal.project && (
                <NewInvoiceForm project={activeModal.project} quotation={activeModal.quotation} onSuccess={() => setActiveModal(null)} />
              )}
              {activeModal.type === 'transmittal' && activeModal.project && (
                <NewTransmittalForm project={activeModal.project} onSuccess={() => setActiveModal(null)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
