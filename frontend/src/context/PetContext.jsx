import React, { createContext, useContext, useState, useEffect } from 'react';
import { playSfx } from '../utils/sfx';

const PetContext = createContext();

const initialChips = [
  {
    id: '1',
    title: 'Cannon Battle Chip',
    category: 'WEAPON',
    mb: 12,
    code: 'A',
    desc: 'Attacks front enemy with high speed pulse.',
    completed: false,
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Recover 50',
    category: 'RECOVERY',
    mb: 8,
    code: 'L',
    desc: 'Restores health/energy when completed.',
    completed: true,
    createdAt: Date.now() - 10000
  },
  {
    id: '3',
    title: 'Review System Specs',
    category: 'NOTE',
    mb: 15,
    code: '*',
    desc: 'Check memory limits and backup PET log files.',
    completed: false,
    createdAt: Date.now() - 20000
  }
];

export const PetProvider = ({ children }) => {
  const [chips, setChips] = useState(() => {
    const saved = localStorage.getItem('PET_CHIPS_DATA');
    return saved ? JSON.parse(saved) : initialChips;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [petDialogue, setPetDialogue] = useState("Jack in! MegaMan.EXE, ready to organize your Battle Chips and notes!");
  const [petMood, setPetMood] = useState("READY");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChip, setEditingChip] = useState(null);

  useEffect(() => {
    localStorage.setItem('PET_CHIPS_DATA', JSON.stringify(chips));
  }, [chips]);

  const speakPet = (text, mood = "READY") => {
    setPetDialogue(text);
    setPetMood(mood);
  };

  const triggerSfx = (type) => playSfx(type, soundEnabled);

  const toggleAudio = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playSfx('click', true);
      speakPet("Audio SFX online!", "READY");
    }
  };

  const saveChip = (chipData) => {
    if (chipData.id) {
      setChips(prev => prev.map(c => c.id === chipData.id ? { ...c, ...chipData } : c));
      speakPet(`Updated chip data: ${chipData.title}!`, "FOCUSED");
    } else {
      const newChip = {
        ...chipData,
        id: Date.now().toString(),
        completed: false,
        createdAt: Date.now()
      };
      setChips(prev => [newChip, ...prev]);
      speakPet(`Slotted new Battle Chip: ${chipData.title}!`, "PUMPED");
    }
    triggerSfx('add');
    closeModal();
  };

  const toggleChipComplete = (id) => {
    setChips(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.completed;
        if (nextState) {
          speakPet(`Executed ${c.title}! Data uploaded!`, "VICTORIOUS");
        } else {
          speakPet(`Re-activated ${c.title} for execution.`, "READY");
        }
        return { ...c, completed: nextState };
      }
      return c;
    }));
    triggerSfx('execute');
  };

  const deleteChip = (id) => {
    const chip = chips.find(c => c.id === id);
    if (chip) {
      setChips(prev => prev.filter(c => c.id !== id));
      triggerSfx('delete');
      speakPet(`Purged ${chip.title} from PET memory!`, "ALERT");
    }
  };

  const openModal = (chip = null) => {
    triggerSfx('click');
    setEditingChip(chip);
    setModalOpen(true);
  };

  const closeModal = () => {
    triggerSfx('click');
    setModalOpen(false);
    setEditingChip(null);
  };

  return (
    <PetContext.Provider value={{
      chips,
      soundEnabled,
      petDialogue,
      petMood,
      searchQuery,
      categoryFilter,
      modalOpen,
      editingChip,
      setSearchQuery,
      setCategoryFilter,
      toggleAudio,
      speakPet,
      saveChip,
      toggleChipComplete,
      deleteChip,
      openModal,
      closeModal,
      triggerSfx
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);