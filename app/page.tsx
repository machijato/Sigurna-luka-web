"use client";
import { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { CategoryType, AIAnalysisResponse, Helpline } from './types';
import { HELPLINES, ZUPANIJE } from './data/helplines';
import { analyzeCrisisInput } from './services/geminiService';

const App = () => {
  // --- STATE (Podaci koji se mijenjaju) ---
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // State za AI Triage (Gornji box)
  const [crisisText, setCrisisText] = useState('');
  const [aiResponse, setAiResponse] = useState<AIAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State za Email Formu (Donji box)
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- EMAILJS INIT ---
  useEffect(() => {
    emailjs.init('Ps7byDs6uO5hufWh5'); // Tvoj javni ključ
  }, []);

  // --- FUNKCIJE ---
  const quickExit = () => window.location.href = 'https://www.google.com';

  // AI Analiza
  const handleAIAnalysis = async () => {
    if (!crisisText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCrisisInput(crisisText);
      setAiResponse(result);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Slanje Emaila
  const handleSendEmail = async () => {
    if (!email.trim() || !userMessage.trim()) {
      alert('Molimo popunite sva polja.');
      return;
    }
    setIsSending(true);
    try {
      await emailjs.send(
        'service_j95i9h5', 
        'template_yvyi30d', 
        { user_email: email, message: userMessage }
      );
      alert('Vaš upit je uspješno poslan!');
      setUserMessage(''); 
      setEmail('');
    } catch (err) {
      alert('Došlo je do greške pri slanju upita.');
    } finally {
      setIsSending(false);
    }
  };

  // --- LOGIKA FILTRIRANJA ---
  const filteredHelplines = useMemo(() => {
    // 1. Prvo filtriramo po tvojim dropdown izbornicima
    let list = HELPLINES.filter(h => {
      const matchAge = selectedAge === 'all' || h.targetAges.includes(selectedAge);
      const matchCounty = selectedCounty === 'all' || h.counties.includes('Sve') || h.counties.includes(selectedCounty);
      const matchCat = selectedCategory === 'all' || h.category.includes(selectedCategory);
      return matchAge && matchCounty && matchCat;
    });

    // 2. Ako imamo AI odgovor, sortiramo preporučene ID-ove na vrh
    if (aiResponse && aiResponse.priorityNumbers.length > 0) {
      return [...list].sort((a, b) => {
        const aPriority = aiResponse.priorityNumbers.includes(a.id) ? -1 : 1;
        const bPriority = aiResponse.priorityNumbers.includes(b.id) ? -1 : 1;
        return aPriority - bPriority;
      });
    }

    return list;
  }, [selectedAge, selectedCounty, selectedCategory, aiResponse]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">⚓</div>
            <span className="font-black text-2xl tracking-tight text-blue-900">Sigurna Luka</span>
          </div>
          <button onClick={quickExit} className="bg-[#EF4444] text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md">
            BRZI IZLAZ (ESC)
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        
        {/* SEKCIJA 1: Filteri */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
          <h2 className="text-lg font-black text-slate-800 uppercase mb-6 flex items-center gap-2">
            <span>🌐</span> Brzo filtriranje pomoći
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Dob korisnika</label>
              <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none">
                <option value="all">Sve dobi</option>
                <option value="<18">Djeca i mladi (&lt;18)</option>
                <option value="18-25">Mladi odrasli (18-25)</option>
                <option value="26+">Odrasli (26+)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Lokacija</label>
              <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none">
                <option value="all">Cijela Hrvatska</option>
                {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Vrsta problema</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none">
                <option value="all">Svi problemi</option>
                {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* SEKCIJA 2: AI Triage (Gornji box na slici) */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-50 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💬</span>
            <h2 className="text-2xl font-black text-blue-900">Trebam pomoć odmah</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">Opišite nam što vas muči. Naš AI će vas anonimno usmjeriti i pružiti prvu utjehu.</p>
          <textarea 
            value={crisisText} onChange={(e) => setCrisisText(e.target.value)}
            placeholder="Ovdje možete slobodno opisati svoju situaciju..."
            className="w-full h-40 p-6 rounded-[2rem] bg-slate-50 border-none outline-none resize-none text-lg transition-all"
          />
          <button 
            onClick={handleAIAnalysis} disabled={isAnalyzing}
            className="w-full mt-4 py-5 rounded-2xl font-black text-lg bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all disabled:bg-slate-200"
          >
            {isAnalyzing ? "Analiziram..." : "Analiziraj i pomozi"}
          </button>

          {aiResponse && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <h4 className="font-black text-emerald-800 text-[10px] uppercase mb-2">🌬️ Vježba</h4>
                <p className="text-emerald-900 text-sm italic">{aiResponse.exercise}</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <h4 className="font-black text-blue-800 text-[10px] uppercase mb-2">❤️ Podrška</h4>
                <p className="text-blue-900 text-sm font-medium">{aiResponse.empatheticMessage}</p>
              </div>
            </div>
          )}
        </section>

        {/* SEKCIJA 3: Email Box (Onaj koji je nedostajao - Donji box na slici) */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📩</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Želite da vam se netko javi?</h2>
          </div>
          <p className="text-slate-500 text-sm mb-8 italic">Ukoliko niste spremni na razgovor telefonom, možete nam ostaviti svoj upit.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 ml-2">Vaša poruka</label>
              <textarea 
                value={userMessage} onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ovdje opišite što vas muči..."
                className="w-full h-32 p-6 rounded-3xl bg-slate-50 border-none outline-none resize-none text-base"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 ml-2">E-mail adresa za odgovor</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="npr. netko@email.com"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pb-4 px-2">
                <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" id="proslijedi" />
                <label htmlFor="proslijedi" className="text-[10px] text-slate-500 font-medium leading-tight">
                  Želim da se moj upit proslijedi nadležnoj službi koja će mi odgovoriti u roku od 24h.
                </label>
              </div>
            </div>

            <button 
              onClick={handleSendEmail} disabled={isSending}
              className="bg-[#EDF2F7] hover:bg-slate-200 text-blue-900 font-black px-10 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all"
            >
              🚀 {isSending ? "Slanje..." : "POŠALJI UPIT"}
            </button>
          </div>
        </section>

        {/* SEKCIJA 4: Popis službi */}
        <div>
          <div className="flex justify-between items-end mb-8 px-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sve dostupne službe</h2>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Pronađeno: {filteredHelplines.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHelplines.map(h => (
              <div key={h.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all group relative overflow-hidden">
                {/* Badge za prioritet ako AI preporuči */}
                {aiResponse?.priorityNumbers.includes(h.id) && (
                  <div className="absolute top-4 right-4 bg-amber-400 text-white text-[8px] font-black px-2 py-1 rounded-md rotate-3 animate-bounce">TOP PREPORUKA</div>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest">{h.category}</span>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase">Dostupnost</p>
                    <span className="text-[11px] font-bold text-slate-500">{h.hours}</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-black text-slate-800 mb-2">{h.name}</h4>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{h.description}</p>
                
                <div className="flex flex-col gap-3">
                  <a href={`tel:${h.number}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-lg transition-all transform hover:scale-[1.02]">
                    <span className="text-xl">📞</span> Nazovi {h.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;