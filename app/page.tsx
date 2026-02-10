"use client";
import { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { CategoryType } from './types';
import { HELPLINES, ZUPANIJE } from './data/helplines';

type TabType = 'search' | 'list' | 'tips';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    emailjs.init('Ps7byDs6uO5hufWh5');
  }, []);

  const quickExit = () => window.location.href = 'https://www.google.com';

  const handleSendEmail = async () => {
    if (!email.trim() || !userMessage.trim()) {
      alert('Molimo popunite sva polja.');
      return;
    }
    setIsSending(true);
    try {
      await emailjs.send('service_j95i9h5', 'template_yvyi30d', { user_email: email, message: userMessage });
      alert('Vaš upit je uspješno poslan!');
      setUserMessage(''); setEmail('');
    } catch (err) {
      alert('Došlo je do greške pri slanju upita.');
    } finally {
      setIsSending(false);
    }
  };

  // --- OVDJE JE FILTRIRANJE S FALLBACK LOGIKOM ---
  const filteredHelplines = useMemo(() => {
    const results = HELPLINES.filter(h => {
      const matchAge = selectedAge === 'all' || (h.targetAges as any).includes(selectedAge);
      const matchCounty = selectedCounty === 'all' || h.counties.includes('Sve') || h.counties.includes(selectedCounty);
      const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
      return matchAge && matchCounty && matchCat;
    });

    // Ako nema rezultata, vrati 4 obavezne službe
    if (results.length === 0) {
      return HELPLINES.filter(h => 
        h.name.toLowerCase().includes("plavi telefon") || 
        h.name.toLowerCase().includes("ženska pomoć sada") || 
        h.name.toLowerCase().includes("rebro") || 
        h.name.includes("112")
      );
    }

    return results;
  }, [selectedAge, selectedCounty, selectedCategory]);

  const sortedAllHelplines = useMemo(() => {
    return [...HELPLINES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">⚓</div>
            <span className="font-black text-2xl tracking-tight text-blue-900">Sigurna Luka</span>
          </div>
          <button onClick={quickExit} className="bg-[#EF4444] text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md uppercase">Brzi izlaz</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2">
          <button onClick={() => setActiveTab('search')} className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'search' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>🔍 Pretraga</button>
          <button onClick={() => setActiveTab('list')} className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>📋 Popis službi</button>
          <button onClick={() => setActiveTab('tips')} className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase transition-all ${activeTab === 'tips' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>💡 Savjeti</button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        
        {activeTab === 'search' && (
          <div className="space-y-10">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
              <h2 className="text-lg font-black text-slate-800 uppercase mb-6 flex items-center gap-2">🌐 Brzo filtriranje pomoći</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400">Dob korisnika</label>
                  <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium">
                    <option value="all">Sve dobi</option>
                    <option value="<18">Djeca i mladi (&lt;18)</option>
                    <option value="18-25">Mladi odrasli (18-25)</option>
                    <option value="26+">Odrasli (26+)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400">Lokacija</label>
                  <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium">
                    <option value="all">Cijela Hrvatska</option>
                    {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400">Vrsta problema</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium">
                    <option value="all">Svi problemi</option>
                    {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📩</span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Želite da vam se netko javi?</h2>
              </div>
              <p className="text-slate-500 text-sm mb-8 italic font-medium">Ukoliko niste spremni na razgovor telefonom, možete nam ostaviti svoj upit.</p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 ml-2">Vaša poruka</label>
                  <textarea 
                    value={userMessage} 
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ovdje opišite što vas muči..."
                    className="w-full h-40 p-6 rounded-3xl bg-slate-50 border-none outline-none resize-none text-base focus:ring-2 focus:ring-blue-100 font-medium"
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
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-3 pb-4 px-2">
                    <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" id="proslijedi" />
                    <label htmlFor="proslijedi" className="text-[10px] text-slate-500 font-bold leading-tight cursor-pointer uppercase">
                      Želim da se upit proslijedi dežurnoj službi (odgovor unutar 24h)
                    </label>
                  </div>
                </div>
                <button onClick={handleSendEmail} disabled={isSending} className="bg-blue-600 text-white font-black px-10 py-4 rounded-2xl uppercase text-xs shadow-md hover:bg-blue-700 transition-all active:scale-95">
                  🚀 {isSending ? "Slanje..." : "POŠALJI UPIT"}
                </button>
              </div>
            </section>

            <div>
              <div className="flex justify-between items-end mb-8 px-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sve dostupne službe</h2>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-blue-100">
                  Rezultati: {filteredHelplines.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHelplines.map(h => (
                  <div key={h.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all group">
                    <span className="text-[9px] px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase block w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">{h.category}</span>
                    <h4 className="text-2xl font-black text-slate-800 mb-2">{h.name}</h4>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 font-medium">{h.description}</p>
                    <a href={`tel:${h.number}`} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-blue-600 transition-all">Nazovi {h.number}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">A-Z Popis Ustanova</h2>
            <div className="divide-y divide-slate-100">
              {sortedAllHelplines.map((h) => (
                <div key={h.id} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{h.name}</h3>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{h.city} • {h.hours}</p>
                  </div>
                  <a href={`tel:${h.number}`} className="bg-slate-50 text-blue-600 font-black px-6 py-2 rounded-xl text-sm hover:bg-blue-600 hover:text-white transition-all">{h.number}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 mb-4 px-4 uppercase tracking-tighter text-center italic">Savjeti i podrška</h2>
            <div className="grid grid-cols-1 gap-6 text-center max-w-2xl mx-auto">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="text-4xl mb-4">🌱</div>
                    <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight text-center">Nisi sam/a</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">Ova stranica je tvoj siguran prostor. Svi kontakti ovdje su provjereni i spremni pomoći u bilo kojem trenutku.</p>
                </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;