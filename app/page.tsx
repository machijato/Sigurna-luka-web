"use client";
import { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { CategoryType } from './types';
import { HELPLINES, ZUPANIJE } from './data/helplines';

const App = () => {
  // --- STATE (Filteri) ---
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // --- STATE (Email Forma) ---
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- EMAILJS INIT ---
  useEffect(() => {
    emailjs.init('Ps7byDs6uO5hufWh5'); // Tvoj ključ
  }, []);

  const quickExit = () => window.location.href = 'https://www.google.com';

  // --- FUNKCIJA ZA SLANJE UPITA ---
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

  // --- LOGIKA FILTRIRANJA (Čista logika bez AI-ja) ---
  const filteredHelplines = useMemo(() => {
    return HELPLINES.filter(h => {
      // Provjera dobi - koristi 'as any' da izbjegnemo TS grešku sa stringom
      const matchAge = selectedAge === 'all' || (h.targetAges as any).includes(selectedAge);
      
      // Provjera županije (uključuje i one koji rade za 'Sve')
      const matchCounty = selectedCounty === 'all' || h.counties.includes('Sve') || h.counties.includes(selectedCounty);
      
      // Provjera kategorije problema
      const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
      
      return matchAge && matchCounty && matchCat;
    });
  }, [selectedAge, selectedCounty, selectedCategory]);

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
              <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-200">
                <option value="all">Sve dobi</option>
                <option value="<18">Djeca i mladi (&lt;18)</option>
                <option value="18-25">Mladi odrasli (18-25)</option>
                <option value="26+">Odrasli (26+)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Lokacija</label>
              <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-200">
                <option value="all">Cijela Hrvatska</option>
                {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Vrsta problema</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-200">
                <option value="all">Svi problemi</option>
                {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* SEKCIJA 2: Email Box (Popravljen i očišćen) */}
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
                value={userMessage} 
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ovdje opišite što vas muči..."
                className="w-full h-40 p-6 rounded-3xl bg-slate-50 border-none outline-none resize-none text-base focus:ring-2 focus:ring-blue-100"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 ml-2">E-mail adresa za odgovor</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="npr. netko@email.com"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-100"
                />
              </div>
              <div className="flex items-center gap-3 pb-4 px-2">
                <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" id="proslijedi" />
                <label htmlFor="proslijedi" className="text-[10px] text-slate-500 font-medium leading-tight cursor-pointer">
                  Želim da se moj upit proslijedi nadležnoj službi koja će mi odgovoriti u roku od 24h.
                </label>
              </div>
            </div>

            <button 
              onClick={handleSendEmail} 
              disabled={isSending}
              className="bg-[#EDF2F7] hover:bg-blue-600 hover:text-white text-blue-900 font-black px-10 py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-sm"
            >
              🚀 {isSending ? "Slanje..." : "POŠALJI UPIT"}
            </button>
          </div>
        </section>

        {/* SEKCIJA 3: Popis službi (Rezultati filtera) */}
        <div>
          <div className="flex justify-between items-end mb-8 px-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sve dostupne službe</h2>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Pronađeno: {filteredHelplines.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHelplines.map(h => (
              <div key={h.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[9px] px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest">{h.category}</span>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase">Dostupnost</p>
                    <span className="text-[11px] font-bold text-slate-500">{h.hours}</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-black text-slate-800 mb-2">{h.name}</h4>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">{h.description}</p>
                
                <div className="flex flex-col gap-3">
                  <a href={`tel:${h.number}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-lg transition-all transform hover:scale-[1.02]">
                    <span className="text-xl">📞</span> Nazovi {h.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {filteredHelplines.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Nema rezultata za odabrane filtere. Pokušajte promijeniti lokaciju ili kategoriju.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;