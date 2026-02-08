"use client";
import { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { CategoryType, AgeGroup, AIAnalysisResponse } from './types';
import { HELPLINES, ZUPANIJE } from './data/helplines';
import { analyzeCrisisInput } from './services/geminiService';

const App = () => {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [crisisText, setCrisisText] = useState('');
  const [aiResponse, setAiResponse] = useState<AIAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    emailjs.init('Ps7byDs6uO5hufWh5');
  }, []);

  const quickExit = () => window.location.href = 'https://www.google.com';

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') quickExit();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredHelplines = useMemo(() => {
    return HELPLINES.filter(h => {
      const matchAge = selectedAge === 'all' || h.targetAges.includes(selectedAge as AgeGroup);
      const matchCounty = selectedCounty === 'all' || h.counties.includes('Sve') || h.counties.includes(selectedCounty);
      const matchCat = selectedCategory === 'all' || h.category === selectedCategory || h.category.includes(selectedCategory);
      return matchAge && matchCounty && matchCat;
    });
  }, [selectedAge, selectedCounty, selectedCategory]);

  const handleAIAnalysis = async () => {
    if (!crisisText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCrisisInput(crisisText);
      setAiResponse(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSend = async () => {
    if (!email.trim() || !message.trim()) {
      alert('Molimo popunite sva polja.');
      return;
    }
    setIsSending(true);
    try {
      await emailjs.send('service_j95i9h5', 'template_yvyi30d', { user_email: email, message: message });
      alert('Poruka je uspješno poslana!');
      setMessage(''); setEmail('');
    } catch (err) {
      alert('Greška pri slanju.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">⚓</div>
            <span className="font-black text-2xl tracking-tight text-blue-900">Sigurna Luka</span>
          </div>
          <button onClick={quickExit} className="bg-[#EF4444] hover:bg-red-600 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-all">
            BRZI IZLAZ (ESC)
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Filteri */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-blue-600 text-xl">🌐</span>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Brzo filtriranje pomoći</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.15em]">Dob korisnika</label>
              <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-medium outline-none">
                <option value="all">Sve dobi</option>
                <option value="<18">Djeca i mladi (&lt;18)</option>
                <option value="18-25">Mladi odrasli (18-25)</option>
                <option value="26+">Odrasli (26+)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.15em]">Lokacija (Županija)</label>
              <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-medium outline-none">
                <option value="all">Cijela Hrvatska</option>
                {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.15em]">Vrsta problema</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-medium outline-none">
                <option value="all">Svi problemi</option>
                {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* AI Triage */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl italic font-black text-blue-600">AI</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💬</span>
            <h2 className="text-2xl font-black text-blue-900">Trebam pomoć odmah</h2>
          </div>
          <textarea 
            value={crisisText} onChange={(e) => setCrisisText(e.target.value)}
            placeholder="Opišite nam što vas muči..."
            className="w-full h-44 p-8 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white outline-none resize-none text-lg transition-all shadow-inner"
          />
          <button 
            onClick={handleAIAnalysis} disabled={isAnalyzing}
            className={`w-full mt-6 py-6 rounded-2xl font-black text-lg transition-all ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200'}`}
          >
            {isAnalyzing ? "Analiziram..." : "Analiziraj i pomozi"}
          </button>
          {aiResponse && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
                <h4 className="font-black text-emerald-800 text-xs uppercase tracking-widest mb-4">🌬️ Vježba</h4>
                <p className="text-emerald-900 italic">{aiResponse.exercise}</p>
              </div>
              <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2rem]">
                <h4 className="font-black text-blue-800 text-xs uppercase tracking-widest mb-4">❤️ Podrška</h4>
                <p className="text-blue-900 font-medium">{aiResponse.empatheticMessage}</p>
              </div>
            </div>
          )}
        </section>

        {/* POPIS SLUŽBI - SADA NADOGRAĐEN */}
        <div>
          <div className="flex justify-between items-end mb-8 px-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sve dostupne službe</h2>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Pronađeno: {filteredHelplines.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHelplines.map(h => (
              <div key={h.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest border border-blue-100">{h.category}</span>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500">{h.hours}</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{h.name}</h4>
                
                {/* NOVO: Prikaz adrese */}
                {h.address && (
                  <p className="text-blue-500 text-xs font-bold mb-3 flex items-center gap-1">
                    📍 {h.address}, {h.city}
                  </p>
                )}

                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{h.description}</p>
                
                {/* NOVO: Prikaz usluga kao bedževa */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {h.services?.map(service => (
                    <span key={service} className="text-[9px] bg-slate-50 text-slate-400 px-2 py-1 rounded-md font-bold uppercase tracking-tighter">
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <a href={`tel:${h.number}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-lg shadow-blue-100 transition-all transform hover:scale-[1.02]">
                    <span className="text-xl">📞</span> Nazovi {h.number}
                  </a>
                  
                  {/* NOVO: Poveznica na Web */}
                  {h.web && (
                    <a href={h.web} target="_blank" rel="noopener noreferrer" className="w-full bg-white border-2 border-slate-100 text-slate-600 font-bold py-3 rounded-[1.2rem] text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      Posjeti web stranicu ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 pt-10 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 leading-relaxed italic">
          Ova platforma ne sprema vaše osobne podatke. Razgovor s AI asistentom je privremen.
        </p>
      </footer>
    </div>
  );
};

export default App;