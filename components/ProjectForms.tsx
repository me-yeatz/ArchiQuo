
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Project, Quotation, ScopeItem, Invoice, InvoiceItem, Transmittal, TransmittalItem } from '../types';
import { getRinggitWords, formatCurrency } from '../utils/helpers';

const inputClasses = "w-full px-4 py-3 technical-border bg-white text-slate-900 placeholder:text-slate-300 focus:bg-slate-50 outline-none transition-all font-bold text-sm";
const labelClasses = "block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em]";

export const NewProjectForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { addProject } = useStore();
  const [formData, setFormData] = useState({
    title: '', clientName: '', address: '', scopeOfWorks: '', description: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({ ...formData, status: 'Active' });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b-4 border-black pb-4 mb-8">
        <h2 className="text-4xl font-black tracking-tighter uppercase italic">Project.Initialize</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <label className={labelClasses}>01. Title</label>
          <input required className={inputClasses} placeholder="PROJECT IDENTIFIER"
            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>02. Client</label>
          <input required className={inputClasses} placeholder="LEGAL ENTITY NAME"
            value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>03. Site Address</label>
        <textarea rows={2} className={inputClasses} placeholder="GEOGRAPHICAL LOCATION"
          value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <label className={labelClasses}>04. Core Scope</label>
          <textarea rows={4} className={inputClasses} placeholder="TECHNICAL SCOPE SUMMARY"
            value={formData.scopeOfWorks} onChange={e => setFormData({ ...formData, scopeOfWorks: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>05. Detail Narrative</label>
          <textarea rows={4} className={inputClasses} placeholder="ARCHITECTURAL DESCRIPTION"
            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>06. Internal Directive</label>
        <textarea rows={2} className={inputClasses} placeholder="CONFIDENTIAL NOTES"
          value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
      </div>

      <button type="submit" className="w-full bg-[#1a1c1e] text-white py-5 font-black hover:bg-slate-800 transition-all uppercase tracking-[0.4em] text-sm technical-border">
        Confirm Project Entry
      </button>
    </form>
  );
};

export const NewQuotationForm: React.FC<{ project: Project, onSuccess: () => void }> = ({ project, onSuccess }) => {
  const { addQuotation } = useStore();
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([
    { id: '1', category: 'Architecture', description: 'Architectural Submission to Local Council', charges: 0 }
  ]);
  const [qData, setQData] = useState({
    quotationNo: `QT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    objective: "To prepare, coordinate, and submit all necessary architectural documentation and application materials required to obtain approval.",
    proposedFees: 0
  });

  const addRow = () => {
    setScopeItems([...scopeItems, { id: Date.now().toString(), category: 'Architecture', description: '', charges: 0 }]);
  };

  const removeRow = (id: string) => {
    setScopeItems(scopeItems.filter(item => item.id !== id));
  };

  const updateRow = (id: string, updates: Partial<ScopeItem>) => {
    setScopeItems(scopeItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const totalFees = scopeItems.reduce((acc, curr) => acc + (Number(curr.charges) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addQuotation({
      ...qData,
      projectId: project.id,
      clientName: project.clientName,
      clientAddress: project.address,
      projectTitle: project.title,
      scopeItems: scopeItems,
      proposedFees: totalFees,
      status: 'Draft'
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="blueprint-bg technical-border p-8 space-y-10">
      <div className="flex justify-between items-start border-b-2 border-black pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Doc.Quotation</h2>
          <p className="text-[10px] font-black text-[#c02164] tracking-widest mt-1">YEATZ ARCH+STUDIO</p>
        </div>
        <div className="text-right">
          <p className={labelClasses}>Project Ref</p>
          <p className="font-black text-xs">{project.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClasses}>Reference ID</label>
          <input required className={inputClasses}
            value={qData.quotationNo} onChange={e => setQData({ ...qData, quotationNo: e.target.value })} />
        </div>
        <div>
          <label className={labelClasses}>Issue Date</label>
          <input type="date" required className={inputClasses}
            value={qData.date} onChange={e => setQData({ ...qData, date: e.target.value })} />
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="bg-[#1a1c1e] text-white px-3 py-1 font-black text-[10px] tracking-widest inline-block uppercase">1.0 Service Definition</h3>
        <div className="text-xs text-slate-700 bg-white p-6 technical-border italic leading-relaxed font-bold">
          Technical consultancy covering design, documentation, and regulatory coordination.
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="bg-[#1a1c1e] text-white px-3 py-1 font-black text-[10px] tracking-widest inline-block uppercase">2.0 Objective</h3>
        <textarea rows={2} className={inputClasses}
          value={qData.objective} onChange={e => setQData({ ...qData, objective: e.target.value })} />
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end border-b-2 border-black pb-2">
          <h3 className="font-black text-sm uppercase">3.0 Schedule of Services</h3>
          <button type="button" onClick={addRow} className="text-[10px] font-black uppercase hover:text-[#c02164]">
            [+] Append Service
          </button>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-[#1a1c1e] text-white uppercase text-[9px] tracking-[0.2em]">
            <tr>
              <th className="px-4 py-3">REF</th>
              <th className="px-4 py-3">CATEGORY</th>
              <th className="px-4 py-3">DESCRIPTION</th>
              <th className="px-4 py-3 text-right">VALUATION</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {scopeItems.map((item, index) => (
              <tr key={item.id} className="border-b technical-border-thin">
                <td className="px-4 py-4 font-black text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                <td className="px-4 py-4">
                  <select className="bg-transparent font-black text-slate-700 w-full focus:outline-none"
                    value={item.category} onChange={e => updateRow(item.id, { category: e.target.value })}>
                    <option>Architecture</option>
                    <option>C&S Engineering</option>
                    <option>M&E Engineering</option>
                    <option>Landscape</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <input className="w-full border-none bg-transparent focus:ring-0 font-bold" placeholder="..."
                    value={item.description}
                    onInput={(e: any) => updateRow(item.id, { description: e.target.value })}
                  />
                </td>
                <td className="px-4 py-4 text-right">
                  <input type="number" className="w-24 text-right border-none bg-transparent font-black text-[#c02164]"
                    value={item.charges} onChange={e => updateRow(item.id, { charges: parseFloat(e.target.value) || 0 })} />
                </td>
                <td className="px-4 py-4 text-right">
                  <button type="button" onClick={() => removeRow(item.id)} className="text-slate-200 hover:text-black">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-4 pt-4">
        <div className="bg-[#1a1c1e] p-8 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">AGGREGATE PROPOSAL FEE</p>
            <p className="text-xs text-slate-400 italic font-medium">{getRinggitWords(totalFees)}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-[#fbd98e]">{formatCurrency(totalFees)}</span>
          </div>
        </div>
      </section>

      <button type="submit" className="w-full bg-[#c02164] text-white py-5 font-black uppercase tracking-[0.4em] text-sm technical-border">
        GENERATE OFFICIAL QUOTATION
      </button>
    </form>
  );
};

export const NewInvoiceForm: React.FC<{ project: Project, quotation?: Quotation, onSuccess: () => void }> = ({ project, quotation, onSuccess }) => {
  const { addInvoice } = useStore();
  const [items, setItems] = useState<InvoiceItem[]>(
    quotation
      ? [{ id: '1', description: `Professional Services as per Quotation ${quotation.quotationNo}`, amount: quotation.proposedFees }]
      : [{ id: '1', description: '', amount: 0 }]
  );
  const [iData, setIData] = useState({
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 6
  });

  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const tax = subtotal * (iData.taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      ...iData,
      projectId: project.id,
      quotationId: quotation?.id,
      items,
      status: 'Unpaid'
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="blueprint-bg technical-border p-8 space-y-6">
      <div className="border-b-2 border-black pb-4 flex justify-between items-end">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Tax.Invoice</h2>
        <div className="text-right text-[10px] font-black text-slate-400">STATUS: DRAFTING</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClasses}>Invoice REF</label>
          <input required className={inputClasses}
            value={iData.invoiceNo} onChange={e => setIData({ ...iData, invoiceNo: e.target.value })} />
        </div>
        <div>
          <label className={labelClasses}>Issue DATE</label>
          <input type="date" required className={inputClasses}
            value={iData.date} onChange={e => setIData({ ...iData, date: e.target.value })} />
        </div>
        <div>
          <label className={labelClasses}>Due DATE</label>
          <input type="date" required className={inputClasses}
            value={iData.dueDate} onChange={e => setIData({ ...iData, dueDate: e.target.value })} />
        </div>
      </div>

      <div className="space-y-4">
        <label className={labelClasses}>Billing Components</label>
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-4 items-center">
            <input className={inputClasses + " flex-1"} placeholder="Service reference..."
              value={item.description} onChange={e => setItems(items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))} />
            <div className="relative">
              <span className="absolute left-3 top-3 text-[10px] font-black text-slate-300">MYR</span>
              <input type="number" className={inputClasses + " w-40 text-right pl-10"} placeholder="0.00"
                value={item.amount} onChange={e => setItems(items.map(i => i.id === item.id ? { ...i, amount: parseFloat(e.target.value) || 0 } : i))} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white technical-border p-8 space-y-3 mt-8">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>SUBTOTAL</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest items-center">
          <span>TAX RATE (%)</span>
          <input type="number" className="w-20 px-2 py-1 bg-slate-50 border-none font-black text-right focus:outline-none"
            value={iData.taxRate} onChange={e => setIData({ ...iData, taxRate: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="flex justify-between text-3xl font-black text-slate-900 pt-6 border-t-2 border-black">
          <span className="uppercase tracking-tighter italic">Net Total</span>
          <span className="text-[#c02164]">{formatCurrency(total)}</span>
        </div>
      </div>

      <button type="submit" className="w-full bg-[#1a1c1e] text-white py-5 font-black uppercase tracking-[0.4em] text-sm technical-border">
        ISSUE OFFICIAL INVOICE
      </button>
    </form>
  );
};

export const SignaturePad: React.FC<{ onSave: (data: string) => void }> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1a1c1e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSave('');
  };

  return (
    <div className="space-y-2">
      <div className="technical-border bg-white cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full h-[150px] touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      <button type="button" onClick={clear} className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500">
        [CLEAR SIGNATURE]
      </button>
    </div>
  );
};

export const NewTransmittalForm: React.FC<{ project: Project, onSuccess: () => void }> = ({ project, onSuccess }) => {
  const { addTransmittal } = useStore();
  const [items, setItems] = useState<TransmittalItem[]>([
    { id: '1', description: '', quantity: '1 Copy', type: 'A4 Doc' }
  ]);

  const [tData, setTData] = useState({
    transmittalNo: `TR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    from: 'YEATZ ARCH+STUDIO',
    to: project.clientName,
    jobNo: project.id.slice(0, 8).toUpperCase(),
    projectTitle: project.title,
    salutation: 'Dear Sir / Madam',
    transmissionModes: [] as string[],
    documentTypes: [] as string[],
    purposes: [] as string[],
    senderName: 'Muhammad Fazreen Bin Ahmad Azhar',
    senderTitle: 'Project Manager',
    senderCompany: 'YEATZ ARCH+STUDIO',
    senderAddress: '1738, Jalan Gajah 11, Kampung Kubu Gajah, 40160 Sungai Buloh, Selangor',
    receiverName: '',
    receivedDate: '',
    signatureData: ''
  });

  const transmissionModesList = ['Attached', 'Emails', 'Delivery'];
  const documentTypesList = ['Shop Drawing', 'Drawings', 'Documents', 'Copy of Letter', 'Invoice', 'Change Orders'];
  const purposesList = [
    'For Approval', 'Approval Document',
    'For your used', 'Approved as Notes',
    'As Requested', 'Returns for Corrections',
    'For Review / Comment', 'Re-Submit Document'
  ];

  const handleCheckboxToggle = (listName: 'transmissionModes' | 'documentTypes' | 'purposes', value: string) => {
    setTData(prev => {
      const currentList = prev[listName];
      const newList = currentList.includes(value)
        ? currentList.filter(i => i !== value)
        : [...currentList, value];
      return { ...prev, [listName]: newList };
    });
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: '', type: '' }]);
  };

  const updateItem = (id: string, updates: Partial<TransmittalItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransmittal({
      ...tData,
      projectId: project.id,
      items
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-12 text-[#1a1c1e] max-w-[900px] mx-auto shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
      {/* Header with Logo */}
      <div className="flex flex-col items-center mb-10">
        <img
          src="/LOGO 2025-03.png"
          alt="YEATZ ARCH+STUDIO"
          className="h-16 w-auto object-contain mb-4"
        />
        <h1 className="text-2xl font-black uppercase tracking-widest border-b-4 border-black inline-block pb-1">Transmittal Form</h1>
      </div>

      {/* Top Section Table */}
      <div className="grid grid-cols-2 border-2 border-black mb-1">
        <div className="p-4 border-r-2 border-black">
          <label className="text-[10px] font-black uppercase block mb-1">From:</label>
          <input className="w-full font-bold text-sm bg-transparent outline-none" value={tData.from} onChange={e => setTData({ ...tData, from: e.target.value })} />
        </div>
        <div className="p-4">
          <label className="text-[10px] font-black uppercase block mb-1">To:</label>
          <input className="w-full font-bold text-sm bg-transparent outline-none" value={tData.to} onChange={e => setTData({ ...tData, to: e.target.value })} />
        </div>
      </div>

      <div className="bg-black text-white h-6 mb-1"></div>

      <div className="grid grid-cols-2 border-2 border-black mb-1">
        <div className="p-2 border-r-2 border-black flex">
          <label className="text-[10px] font-black uppercase w-20">Date :</label>
          <input className="flex-1 font-bold text-sm bg-transparent outline-none" value={tData.date} onChange={e => setTData({ ...tData, date: e.target.value })} />
        </div>
        <div className="p-2 flex">
          <label className="text-[10px] font-black uppercase w-20">Job No :</label>
          <input className="flex-1 font-bold text-sm bg-transparent outline-none" value={tData.jobNo} onChange={e => setTData({ ...tData, jobNo: e.target.value })} />
        </div>
      </div>

      <div className="border-2 border-black p-2 flex mb-8">
        <label className="text-[10px] font-black uppercase w-24">Project Title :</label>
        <textarea className="flex-1 font-bold text-sm bg-transparent outline-none resize-none" rows={4} value={tData.projectTitle} onChange={e => setTData({ ...tData, projectTitle: e.target.value })} />
      </div>

      <div className="mb-6">
        <input className="font-bold text-md bg-transparent outline-none w-full" value={tData.salutation} onChange={e => setTData({ ...tData, salutation: e.target.value })} />
      </div>

      {/* Transmission Modes */}
      <div className="mb-4 flex items-center gap-6 border-b border-black pb-2">
        <span className="text-sm font-bold underline">We are sending you :</span>
        <div className="flex gap-4">
          {transmissionModesList.map(mode => (
            <label key={mode} className="flex items-center gap-1.5 cursor-pointer">
              <div
                onClick={() => handleCheckboxToggle('transmissionModes', mode)}
                className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${tData.transmissionModes.includes(mode) ? 'bg-black' : ''}`}
              >
                {tData.transmissionModes.includes(mode) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <span className="text-[11px] font-bold">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Document Types */}
      <div className="grid grid-cols-3 gap-y-3 mb-8">
        {documentTypesList.map(type => (
          <label key={type} className="flex items-center gap-1.5 cursor-pointer">
            <div
              onClick={() => handleCheckboxToggle('documentTypes', type)}
              className={`w-4 h-4 rounded-full border-2 border-black flex items-center justify-center ${tData.documentTypes.includes(type) ? 'bg-black' : ''}`}
            >
              {tData.documentTypes.includes(type) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
            </div>
            <span className="text-[11px] font-bold">{type}</span>
          </label>
        ))}
      </div>

      {/* Items Table */}
      <table className="w-full border-2 border-black mb-8">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="w-12 p-1 text-[11px] font-black uppercase border-r-2 border-black">Num</th>
            <th className="p-1 text-[11px] font-black uppercase border-r-2 border-black">Descriptions</th>
            <th className="w-24 p-1 text-[11px] font-black uppercase border-r-2 border-black">Qty</th>
            <th className="w-32 p-1 text-[11px] font-black uppercase">Types</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className="border-b border-black group">
              <td className="p-1 border-r-2 border-black text-center text-sm font-bold">{(idx + 1).toString().padStart(2, '0')}</td>
              <td className="p-1 border-r-2 border-black relative">
                <input
                  className="w-full bg-transparent outline-none font-bold text-sm"
                  value={item.description}
                  onChange={e => updateItem(item.id, { description: e.target.value })}
                />
                <button type="button" onClick={() => removeItem(item.id)} className="absolute right-1 top-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-black transition-all">
                  <i className="fas fa-times text-[10px]"></i>
                </button>
              </td>
              <td className="p-1 border-r-2 border-black">
                <input className="w-full bg-transparent outline-none font-bold text-sm text-center" value={item.quantity} onChange={e => updateItem(item.id, { quantity: e.target.value })} />
              </td>
              <td className="p-1">
                <input className="w-full bg-transparent outline-none font-bold text-sm text-center" value={item.type} onChange={e => updateItem(item.id, { type: e.target.value })} />
              </td>
            </tr>
          ))}
          {/* Fill extra rows to look like the image if items are few */}
          {[...Array(Math.max(0, 5 - items.length))].map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-black h-8">
              <td className="border-r-2 border-black"></td>
              <td className="border-r-2 border-black"></td>
              <td className="border-r-2 border-black"></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={addItem} className="text-[10px] font-black uppercase text-slate-400 mb-8 hover:text-black no-print">
        [+ Add Row]
      </button>

      <div className="mb-4">
        <span className="text-sm font-bold">Transmitted as checked:</span>
      </div>

      {/* Purposes Table */}
      <div className="grid grid-cols-2 border-2 border-black mb-4">
        <div className="border-r-2 border-black">
          {purposesList.slice(0, 4).map((p, i) => (
            <div key={p} className={`flex items-center gap-2 p-1.5 border-b border-black ${i === 3 ? 'border-b-0' : ''}`}>
              <div
                onClick={() => handleCheckboxToggle('purposes', p)}
                className={`w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer ${tData.purposes.includes(p) ? 'bg-black' : ''}`}
              >
                {tData.purposes.includes(p) && <i className="fas fa-check text-white text-[8px]"></i>}
              </div>
              <span className="text-[11px] font-bold">{p}</span>
            </div>
          ))}
        </div>
        <div>
          {purposesList.slice(4).map((p, i) => (
            <div key={p} className={`flex items-center gap-2 p-1.5 border-b border-black ${i === 3 ? 'border-b-0' : ''}`}>
              <div
                onClick={() => handleCheckboxToggle('purposes', p)}
                className={`w-4 h-4 border-2 border-black flex items-center justify-center cursor-pointer ${tData.purposes.includes(p) ? 'bg-black' : ''}`}
              >
                {tData.purposes.includes(p) && <i className="fas fa-check text-white text-[8px]"></i>}
              </div>
              <span className="text-[11px] font-bold">{p}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-red-600 text-[11px] font-bold italic mb-10">Note : Please sign and return the copy for our records.</p>

      {/* Footer / Signature Area */}
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-[11px] font-bold whitespace-nowrap">Received By :</span>
            <div className="flex-1 border-b-2 border-black h-8 relative">
              <SignaturePad onSave={(data) => setTData({ ...tData, signatureData: data })} />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[11px] font-bold whitespace-nowrap">Date :</span>
            <input className="flex-1 border-b-2 border-black text-sm font-bold outline-none" value={tData.receivedDate} onChange={e => setTData({ ...tData, receivedDate: e.target.value })} />
          </div>
        </div>

        <div className="text-sm">
          <input className="w-full font-black text-lg uppercase outline-none" value={tData.senderName} onChange={e => setTData({ ...tData, senderName: e.target.value })} />
          <input className="w-full font-bold outline-none uppercase" value={tData.senderTitle} onChange={e => setTData({ ...tData, senderTitle: e.target.value })} />
          <input className="w-full font-black outline-none uppercase mt-1" value={tData.senderCompany} onChange={e => setTData({ ...tData, senderCompany: e.target.value })} />
          <textarea className="w-full font-bold text-xs outline-none uppercase resize-none leading-tight mt-1" rows={3} value={tData.senderAddress} onChange={e => setTData({ ...tData, senderAddress: e.target.value })} />
        </div>
      </div>

      <div className="mt-12 no-print">
        <button type="submit" className="w-full bg-[#1a1c1e] text-white py-5 font-black uppercase tracking-[0.4em] text-sm technical-border hover:bg-black transition-all">
          Generate Professional Transmittal
        </button>
      </div>
    </form>
  );
};
