"use client";
import { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { CategoryType, AgeGroup, AIAnalysisResponse } from './types';
import { HELPLINES, ZUPANIJE } from './data/helplines';
import { analyzeCrisisInput } from './services/geminiService';

const App = () => {
  // State-ovi za filtere
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // State-ovi za AI analizu
  const [crisisText, setCrisisText] = useState('');
  const [aiResponse, setAiResponse] = useState<AIAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State-ovi za E-mail formu
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Initialize EmailJS sa tvojim PUBLIC KEY
  useEffect(() => {
    emailjs.init('Ps7byDs6uO5hufWh5');
  }, []);

  const quickExit = () => window.location.href = 'https://www.google.com';

  // ESC za brzi izlaz
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') quickExit();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Logika filtriranja
  const filteredHelplines = useMemo(() => {
    return HELPLINES.filter(h => {
      const matchAge = selectedAge === 'all' || h.targetAges.includes(selectedAge as AgeGroup);
      const matchCounty = selectedCounty === 'all' || h.counties.includes('Sve') || h.counties.includes(selectedCounty);
      const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
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
      alert('Molimo popunite sva polja (poruku i e-mail).');
      return;
    }

    setIsSending(true);
    try {
      // Ovdje koristimo tvoj SERVICE_ID i TEMPLATE_ID
      await emailjs.send(
        'service_j95i9h5',
        'template_yvyi30d',
        {
          user_email: email,
          message: message,
        }
      );
      alert('Poruka je uspješno poslana! Javit ćemo vam se ubrzo.');
      setMessage('');
      setEmail('');
    } catch (err) {
      console.error('EmailJS Error:', err);
      alert('Greška pri slanju poruke. Provjerite internetsku vezu i pokušajte ponovno.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Navigacija */}
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
        
        {/* Sekcija 1: Filteri */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-blue-600 text-xl">🌐</span>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Brzo filtriranje pomoći</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.15em]">Dob korisnika</label>
              <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none">
                <option value="all">Sve dobi</option>
                <option value="<18">Djeca i mladi (&lt;18)</option>
                <option value="18-25">Mladi odrasli (18-25)</option>
                <option value="26+">Odrasli (26+)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.15em]">Lokacija (Županija)</label>
              <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none">
                <option value="all">Cijela Hrvatska</option>
                {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-slate-400 tracking-[0.15em]">Vrsta problema</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none">
                <option value="all">Svi problemi</option>
                {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Sekcija 2: AI Triage */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl italic font-black text-blue-600">AI</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💬</span>
            <h2 className="text-2xl font-black text-blue-900">Trebam pomoć odmah</h2>
          </div>
          <p className="text-slate-500 mb-8 max-w-xl">Opišite nam što vas muči. Naš AI će vas anonimno usmjeriti i pružiti prvu utjehu.</p>
          
          <div className="relative group">
            <textarea 
              value={crisisText} onChange={(e) => setCrisisText(e.target.value)}
              placeholder="Ovdje možete slobodno opisati svoju situaciju..."
              className="w-full h-44 p-8 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white outline-none resize-none text-lg transition-all shadow-inner group-hover:bg-slate-100/50"
            />
          </div>

          <button 
            onClick={handleAIAnalysis} disabled={isAnalyzing}
            className={`w-full mt-6 py-6 rounded-2xl font-black text-lg transition-all transform active:scale-[0.98] ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200'}`}
          >
            {isAnalyzing ? "Analiziram vaš upit..." : "Analiziraj i pomozi"}
          </button>

          {aiResponse && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
                  <h4 className="font-black text-emerald-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">🌬️ Vježba prve pomoći</h4>
                  <p className="text-emerald-900 leading-relaxed italic">{aiResponse.exercise}</p>
                </div>
                <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2rem]">
                  <h4 className="font-black text-blue-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">❤️ Poruka podrške</h4>
                  <p className="text-blue-900 font-medium leading-relaxed">{aiResponse.empatheticMessage}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Sekcija 3: E-mail Forma */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📩</span>
            <h2 className="text-xl font-black text-slate-800">Želite da vam se netko javi?</h2>
          </div>
          <p className="text-sm text-slate-500 mb-8 italic">Ukoliko niste spremni na razgovor telefonom, možete nam ostaviti svoj upit.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Vaša poruka</label>
              <textarea 
                value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Ovdje opišite što vas muči..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none resize-none"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">E-mail adresa za odgovor</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="npr. netko@email.com"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                />
              </div>
              <div className="flex items-center gap-3 mt-8">
                <input type="checkbox" id="forward" className="w-5 h-5 rounded-md" />
                <label htmlFor="forward" className="text-xs text-slate-600 font-medium leading-tight">
                  Želim da se moj upit proslijedi nadležnoj službi koja će mi odgovoriti u roku od 24h.
                </label>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSend} 
            disabled={isSending}
            className={`mt-8 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${isSending ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'}`}
          >
            🚀 {isSending ? 'Šaljem...' : 'Pošalji upit'}
          </button>
        </section>

        {/* Sekcija 4: Popis službi */}
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
                    <span className="block text-[10px] text-slate-300 font-black uppercase tracking-tighter">Dostupnost</span>
                    <span className="text-[11px] font-bold text-slate-500">{h.hours}</span>
                  </div>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{h.name}</h4>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{h.description}</p>
                <a href={`tel:${h.number}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-lg shadow-blue-100 transition-all transform group-hover:scale-[1.02]">
                  <span className="text-xl">📞</span> Nazovi {h.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer / Sigurnosni podsjetnik */}
      <footer className="max-w-4xl mx-auto px-4 pt-10 border-t border-slate-100">
        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sigurnosni podsjetnik</h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ova platforma ne sprema vaše osobne podatke. Razgovor s AI asistentom je privremen. Ukoliko se nalazite u neposrednoj opasnosti, molimo vas da odmah nazovete 112 ili 194.
          </p>
          <div className="flex gap-4 pt-4 opacity-30">
            <span className="text-xl">🛡️</span><span className="text-xl">⚓</span><span className="text-xl">🔒</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;