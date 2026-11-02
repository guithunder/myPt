import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ATTACK');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petMessage, setPetMessage] = useState("Sistemas operacionais sincronizados com o Supabase!");

  // Estado para armazenar a frase atual do balão de fala do MegaMan
  const [dialogue, setDialogue] = useState("Jack in! MegaMan.EXE pronto para operar.");

  // Frases aleatórias que o MegaMan diz ao ser tocado
  const handleMegaManClick = () => {
    const phrases = [
      "Battle routine, set! Vamos lá, Operador!",
      "Meus sistemas estão operando a 100%!",
      "Não se esqueça de verificar os Battle Chips!",
      "NetNavi MegaMan.EXE a postos!",
      "Boa jogada! O sistema está seguro.",
      "Não se preocupe, Operador! Estou aqui para ajudar.",
      "Mantenha seus chips prontos.",
      "Ótimo trabalho! Continue assim, Operador.",
      "Lembre-se de atualizar seus chips regularmente."
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setDialogue(randomPhrase);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setPetMessage("⚠️ Erro de conexão com o backend FastAPI.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await api.post('/notes', { title, content, category });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
      setPetMessage(`Chip "${title}" guardado na memória!`);
      fetchNotes();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setPetMessage("⚠️ Falha ao salvar no banco.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setPetMessage("Chip apagado do sistema.");
      fetchNotes();
    } catch (err) {
      console.error("Erro ao apagar:", err);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '380px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* CABEÇALHO DO PET */}
      <div style={{ background: '#0f172a', border: '2px solid rgba(0,240,255,0.4)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '14px', color: '#38bdf8' }}>PET OS v3.5</h2>
          <span style={{ fontSize: '10px', color: '#4ade80' }}>● STATUS: ONLINE</span>
        </div>
        <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>MEGAMAN.EXE</span>
      </div>

      {/* PAINEL DO AVATAR COM BALÃO DE FALA INTERATIVO */}
      <div style={{ background: '#0f172a', border: '2px solid rgba(0,240,255,0.4)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* LAYOUT LADO A LADO: BALÃO + MEGA MAN */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px', justifyContent: 'center' }}>
          
          {/* BALÃO DE FALA (Lado Esquerdo - Clica para mudar frase) */}
          <div 
            onClick={handleMegaManClick} 
            style={{ background: '#020617', border: '1px solid #00f0ff', borderRadius: '10px', padding: '10px', fontSize: '11px', color: '#fff', cursor: 'pointer', maxWidth: '160px', position: 'relative', boxShadow: '0 0 10px rgba(0,240,255,0.2)' }}
            title="Clica para falar!"
          >
            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>&gt; </span> {dialogue}
          </div>

          {/* AVATAR DO MEGA MAN (Clica para interagir) */}
          <div 
            onClick={handleMegaManClick} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' }} 
            title="Clica no MegaMan!"
          >
            <svg width="90" height="90" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(0,210,255,0.7))' }}>
              <circle cx="100" cy="100" r="75" fill="#0055ff" opacity="0.2" />
              <path d="M 30 90 L 15 75 L 35 65 Z" fill="#FFCC00" stroke="#CC9900" strokeWidth="2"/>
              <path d="M 170 90 L 185 75 L 165 65 Z" fill="#FFCC00" stroke="#CC9900" strokeWidth="2"/>
              <path d="M 45 100 C 45 45, 155 45, 155 100 C 155 110, 150 140, 145 145 C 130 160, 70 160, 55 145 C 50 140, 45 110, 45 100 Z" fill="#0055FF" stroke="#00d2ff" strokeWidth="3"/>
              <path d="M 55 70 C 70 50, 130 50, 145 70 C 135 60, 65 60, 55 70 Z" fill="#FFCC00"/>
              <rect x="92" y="42" width="16" height="22" rx="3" fill="#FFCC00"/>
              <path d="M 60 95 C 60 75, 140 75, 140 95 C 140 125, 125 140, 100 142 C 75 140, 60 125, 60 95 Z" fill="#FFE0BD"/>
              <ellipse cx="80" cy="98" rx="7" ry="12" fill="#0033aa"/>
              <ellipse cx="80" cy="98" rx="4" ry="8" fill="#00d2ff"/>
              <circle cx="78" cy="94" r="2.5" fill="#ffffff"/>
              <ellipse cx="120" cy="98" rx="7" ry="12" fill="#0033aa"/>
              <ellipse cx="120" cy="98" rx="4" ry="8" fill="#00d2ff"/>
              <circle cx="118" cy="94" r="2.5" fill="#ffffff"/>
              <path d="M 92 124 Q 100 129 108 124" stroke="#A0522D" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <circle cx="48" cy="102" r="16" fill="#CC0000" stroke="#FFCC00" strokeWidth="3"/>
              <line x1="38" y1="102" x2="58" y2="102" stroke="#FFCC00" strokeWidth="2"/>
              <circle cx="152" cy="102" r="16" fill="#CC0000" stroke="#FFCC00" strokeWidth="3"/>
              <line x1="142" y1="102" x2="162" y2="102" stroke="#FFCC00" strokeWidth="2"/>
              <path d="M 65 148 L 135 148 L 145 190 L 55 190 Z" fill="#002b80" stroke="#00d2ff" strokeWidth="2"/>
              <circle cx="100" cy="170" r="14" fill="#CC0000" stroke="#FFCC00" strokeWidth="2"/>
              <line x1="90" y1="170" x2="110" y2="170" stroke="#FFCC00" strokeWidth="2.5"/>
            </svg>
          </div>

        </div>

        {/* STATUS DO SISTEMA ABAIXO */}
        <div style={{ width: '100%', background: '#020617', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', padding: '8px', fontSize: '10px', color: '#94a3b8', marginTop: '12px', textAlign: 'center' }}>
          {petMessage}
        </div>

      </div>

      {/* PAINEL DE BATTLE CHIPS */}
      <div style={{ background: '#0f172a', border: '2px solid rgba(0,240,255,0.4)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>BATTLE CHIPS ({notes.length})</span>
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={{ background: '#00f0ff', color: '#020617', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + NOVO CHIP
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', margin: '16px 0' }}>Pasta vazia.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} style={{ background: '#020617', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '9px', background: '#082f49', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0,240,255,0.3)', fontWeight: 'bold' }}>
                    {note.category}
                  </span>
                  <h4 style={{ margin: '6px 0 2px 0', fontSize: '12px', color: '#fff' }}>{note.title}</h4>
                  <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>{note.content}</p>
                </div>
                <button 
                  onClick={() => handleDelete(note.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div style={{ background: '#0f172a', border: '2px solid #00f0ff', borderRadius: '12px', width: '100%', maxWidth: '300px', padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#00f0ff' }}>NOVO BATTLE CHIP</h3>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Nome (ex: Cannon v1)"
                style={{ background: '#020617', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '6px', padding: '8px', fontSize: '11px', color: '#fff', outline: 'none' }}
              />

              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: '#020617', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '6px', padding: '8px', fontSize: '11px', color: '#00f0ff', outline: 'none' }}
              >
                <option value="ATTACK">ATTACK</option>
                <option value="RECOVERY">RECOVERY</option>
                <option value="NOTE">NOTE</option>
              </select>

              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="2" 
                required
                placeholder="Descrição..."
                style={{ background: '#020617', border: '1px solid rgba(0,240,255,0.4)', borderRadius: '6px', padding: '8px', fontSize: '11px', color: '#fff', outline: 'none', resize: 'none' }}
              ></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  style={{ background: '#334155', color: '#cbd5e1', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#00f0ff', color: '#020617', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}