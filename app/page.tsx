"use client";
import { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { CategoryType } from './types';
import { HELPLINES, ZUPANIJE } from './data/helplines';

// Tipovi za tabove
type TabType = 'search' | 'list' | 'tips';

const App = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- EMAILJS INIT ---
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
    return HELPLINES.filter(h => {
      const matchAge = selectedAge === 'all' || (h.targetAges as any).includes(selectedAge);
      const matchCounty = selectedCounty === 'all' || h.counties.includes('Sve') || h.counties.includes(selectedCounty);
      const matchCat = selectedCategory === 'all' || h.category === selectedCategory;
      return matchAge && matchCounty && matchCat;
    });
  }, [selectedAge, selectedCounty, selectedCategory]);

  // --- LOGIKA ZA POPIS SVIH (Abecedno) ---
  const sortedAllHelplines = useMemo(() => {
    return [...HELPLINES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">⚓</div>
            <span className="font-black text-2xl tracking-tight text-blue-900">Sigurna Luka</span>
          </div>
          <button onClick={quickExit} className="bg-[#EF4444] text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md uppercase">
            Brzi izlaz
          </button>
        </div>
      </nav>

      {/* TAB NAVIGACIJA */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 gap-2">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-tighter transition-all ${activeTab === 'search' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            🔍 Pretraga
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-tighter transition-all ${activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            📋 Popis službi
          </button>
          <button 
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-tighter transition-all ${activeTab === 'tips' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            💡 Savjeti
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* PRIKAZ 1: PRETRAGA */}
        {activeTab === 'search' && (
          <div className="space-y-10">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
              <h2 className="text-lg font-black text-slate-800 uppercase mb-6 flex items-center gap-2">🌐 Filtriranje</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400">Dob</label>
                  <select value={selectedAge} onChange={(e) => setSelectedAge(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-200 text-sm">
                    <option value="all">Sve dobi</option>
                    <option value="<18">Djeca i mladi (&lt;18)</option>
                    <option value="18-25">Mladi odrasli (18-25)</option>
                    <option value="26+">Odrasli (26+)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400">Lokacija</label>
                  <select value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-200 text-sm">
                    <option value="all">Cijela Hrvatska</option>
                    {ZUPANIJE.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400">Problem</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-200 text-sm">
                    <option value="all">Sve kategorije</option>
                    {Object.values(CategoryType).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHelplines.map(h => (
                <div key={h.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all">
                  <span className="text-[9px] px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest block w-fit mb-4">{h.category}</span>
                  <h4 className="text-2xl font-black text-slate-800 mb-2">{h.name}</h4>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{h.description}</p>
                  <a href={`tel:${h.number}`} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg">
                    Nazovi {h.number}
                  </a>
                </div>
              ))}
            </div>

            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
              <h2 className="text-2xl font-black text-slate-800 mb-6 italic">Ostavite upit 📩</h2>
              <textarea 
                value={userMessage} 
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ovdje opišite što vas muči..."
                className="w-full h-32 p-6 rounded-3xl bg-slate-50 border-none outline-none mb-4"
              />
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Vaš e-mail"
                  className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none"
                />
                <button onClick={handleSendEmail} disabled={isSending} className="bg-blue-600 text-white font-black px-8 py-4 rounded-2xl uppercase text-xs">
                  {isSending ? "Slanje..." : "Pošalji"}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* PRIKAZ 2: POPIS SVIH SLUŽBI (Abecedno) */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50">
            <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter">A-Z Popis Ustanova</h2>
            <div className="divide-y divide-slate-100">
              {sortedAllHelplines.map((h) => (
                <div key={h.id} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{h.name}</h3>
                    <p className="text-slate-400 text-xs">{h.city} • {h.hours}</p>
                  </div>
                  <a href={`tel:${h.number}`} className="text-blue-600 font-black text-sm hover:underline">
                    {h.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRIKAZ 3: KORISNI SAVJETI */}
        {activeTab === 'tips' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 mb-4 px-4 uppercase tracking-tighter text-center">Savjeti i podrška</h2>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <span className="text-blue-600 font-black text-[10px] uppercase">Članak #1</span>
              <h3 className="text-2xl font-black text-slate-800 mt-2 mb-4">Kako prepoznati kriznu situaciju?</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Ponekad je teško razlučiti prolaznu tugu od stanja koje zahtijeva stručnu pomoć. 
                Ključni znakovi su nesanica koja traje tjednima, povlačenje iz društva i gubitak interesa za stvari koje volite...
              </p>
              <button className="text-blue-600 font-bold text-sm uppercase">Pročitaj više →</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
              <span className="text-blue-600 font-black text-[10px] uppercase">Članak #2</span>
              <h3 className="text-2xl font-black text-slate-800 mt-2 mb-4">Prvi korak: Što reći kada nazovete?</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Strah od prvog poziva je normalan. Važno je znati da s druge strane sjede educirani stručnjaci 
                koji vas neće osuđivati. Možete početi s: "Samo se osjećam loše i trebam nekoga za razgovor"...
              </p>
              <button className="text-blue-600 font-bold text-sm uppercase">Pročitaj više →</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;