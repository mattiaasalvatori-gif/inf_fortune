import React, { useState } from 'react';
import { Flame, ArrowLeft, Volume2, Settings, Trophy, Sparkles, Zap, X } from 'lucide-react';

// === DATI SIMBOLI ===
const SYMBOLS = {
  dante: {
    name: 'Dante',
    type: 'high',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769968270/1_Esploratore_Dante_a8kswr.png',
    pays: [0, 0, 100, 1000, 5000],
    canExpand: true
  },
  book: {
    name: 'Libro',
    type: 'wild-scatter',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/2_Libro_Commedia_qbcgfd.png',
    pays: [0, 0, 2, 20, 200],
    scatter: true,
    wild: true
  },
  beatrice: {
    name: 'Beatrice',
    type: 'high',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958222/3_Faraone_Beatrice_fimpos.png',
    pays: [0, 0, 40, 400, 2000],
    canExpand: true
  },
  virgilio: {
    name: 'Virgilio',
    type: 'high',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/4_Iside_Virgilio_tmkqfn.png',
    pays: [0, 0, 40, 400, 2000],
    canExpand: true
  },
  caronte: {
    name: 'Caronte',
    type: 'medium',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/5_Scarabeo_Moneta_caronte_us2hwz.png',
    pays: [0, 0, 30, 150, 750],
    canExpand: true
  },
  A: {
    name: 'Asso',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/6_Asso_t5xac7.png',
    pays: [0, 0, 10, 40, 150],
    canExpand: true
  },
  K: {
    name: 'Re',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958219/7_Re_iwnwiy.png',
    pays: [0, 0, 10, 40, 150],
    canExpand: true
  },
  Q: {
    name: 'Donna',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958221/8_Donna_gmbq9e.png',
    pays: [0, 0, 10, 40, 150],
    canExpand: true
  },
  J: {
    name: 'Fante',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958221/9_Fante_wdsxdg.png',
    pays: [0, 0, 10, 40, 150],
    canExpand: true
  },
  Ten: {
    name: 'Dieci',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958225/10_Dieci_uly2im.png',
    pays: [0, 0, 10, 40, 150],
    canExpand: true
  }
};

const SYMBOL_KEYS = Object.keys(SYMBOLS);
const LINES = 10; // Fisso a 10 linee

// Linee di pagamento
const PAYLINES = [
  [[0,1], [1,1], [2,1], [3,1], [4,1]], // 1
  [[0,0], [1,0], [2,0], [3,0], [4,0]], // 2
  [[0,2], [1,2], [2,2], [3,2], [4,2]], // 3
  [[0,0], [1,1], [2,2], [3,1], [4,0]], // 4
  [[0,2], [1,1], [2,0], [3,1], [4,2]], // 5
  [[0,1], [1,0], [2,0], [3,0], [4,1]], // 6
  [[0,1], [1,2], [2,2], [3,2], [4,1]], // 7
  [[0,0], [1,0], [2,1], [3,2], [4,2]], // 8
  [[0,2], [1,2], [2,1], [3,0], [4,0]], // 9
  [[0,1], [1,0], [2,1], [3,2], [4,1]]  // 10
];

function InfernoFortuneSlot() {
  const [credits, setCredits] = useState(1500);
  const [currentBet, setCurrentBet] = useState(5); // Puntata totale (0.5 per linea × 10)
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWin, setCurrentWin] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  
  // Turbo mode
  const [turboMode, setTurboMode] = useState(false);
  
  // Modale selezione puntata
  const [showBetModal, setShowBetModal] = useState(false);
  
  // AutoSpin
  const [autoSpinActive, setAutoSpinActive] = useState(false);
  const [showAutoSpinModal, setShowAutoSpinModal] = useState(false);
  const [autoSpinSpinsRemaining, setAutoSpinSpinsRemaining] = useState(0);
  const [autoSpinBudgetRemaining, setAutoSpinBudgetRemaining] = useState(0);
  const [autoSpinMode, setAutoSpinMode] = useState('spins'); // 'spins' o 'budget'
  
  // Free Spins
  const [freeSpinsMode, setFreeSpinsMode] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [expandingSymbol, setExpandingSymbol] = useState(null);
  const [freeSpinsTotalWin, setFreeSpinsTotalWin] = useState(0);
  
  // Animazioni
  const [showScatterCelebration, setShowScatterCelebration] = useState(false);
  const [showSymbolSelection, setShowSymbolSelection] = useState(false);
  const [symbolSelectionOptions, setSymbolSelectionOptions] = useState([]);
  const [selectedSymbolIndex, setSelectedSymbolIndex] = useState(0);
  
  // Rulli e animazioni
  const [reels, setReels] = useState([
    ['virgilio', 'K', 'beatrice'],
    ['Q', 'dante', 'A'],
    ['caronte', 'virgilio', 'J'],
    ['book', 'Q', 'Ten'],
    ['beatrice', 'K', 'virgilio']
  ]);
  const [spinningReels, setSpinningReels] = useState([false, false, false, false, false]);
  const [reelAnimationSymbols, setReelAnimationSymbols] = useState([[], [], [], [], []]);
  
  const [winningPositions, setWinningPositions] = useState([]);
  const [winningLines, setWinningLines] = useState([]);

  // === FUNZIONI UTILITÀ ===
  const generateRandomSymbol = () => {
    return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
  };

  const generateRandomReel = () => {
    return Array(3).fill(null).map(() => generateRandomSymbol());
  };

  const countScatters = (reelGrid) => {
    let count = 0;
    let positions = [];
    reelGrid.forEach((reel, reelIdx) => {
      reel.forEach((symbol, rowIdx) => {
        if (symbol === 'book') {
          count++;
          positions.push([reelIdx, rowIdx]);
        }
      });
    });
    return { count, positions };
  };

  const checkLineWin = (reelGrid, linePositions, expandingSymbol = null) => {
    const symbols = linePositions.map(([reelIndex, rowIndex]) => 
      reelGrid[reelIndex][rowIndex]
    );
    
    let firstSymbol = symbols[0];
    let matchCount = 1;
    
    for (let i = 1; i < symbols.length; i++) {
      const currentSymbol = symbols[i];
      
      if (currentSymbol === 'book' || currentSymbol === firstSymbol) {
        matchCount++;
      } else if (firstSymbol === 'book') {
        firstSymbol = currentSymbol;
        matchCount++;
      } else {
        break;
      }
    }
    
    if (expandingSymbol && firstSymbol === expandingSymbol) {
      const expandingCount = symbols.filter(s => s === expandingSymbol).length;
      if (expandingCount >= 3) {
        const payout = SYMBOLS[expandingSymbol].pays[expandingCount - 1] || 0;
        return { symbol: expandingSymbol, count: expandingCount, payout, positions: linePositions.slice(0, expandingCount) };
      }
    }
    
    if (matchCount >= 3) {
      const payout = SYMBOLS[firstSymbol].pays[matchCount - 1] || 0;
      return { symbol: firstSymbol, count: matchCount, payout, positions: linePositions.slice(0, matchCount) };
    }
    
    return null;
  };

  const calculateWins = (reelGrid) => {
    let totalPayout = 0;
    let winLines = [];
    let winPositions = [];
    const betPerLine = currentBet / LINES;
    
    const { count: scatterCount, positions: scatterPositions } = countScatters(reelGrid);
    if (scatterCount >= 3) {
      const scatterPayout = SYMBOLS.book.pays[scatterCount - 1] || 0;
      totalPayout += scatterPayout * currentBet;
      winPositions.push(...scatterPositions);
    }
    
    for (let i = 0; i < LINES; i++) {
      const lineWin = checkLineWin(reelGrid, PAYLINES[i], expandingSymbol);
      if (lineWin) {
        totalPayout += lineWin.payout * betPerLine;
        winLines.push(i);
        lineWin.positions.forEach(pos => {
          if (!winPositions.some(([r, ro]) => r === pos[0] && ro === pos[1])) {
            winPositions.push(pos);
          }
        });
      }
    }
    
    return { totalPayout, winLines, winPositions, scatterCount, scatterPositions };
  };

  const expandSymbols = (reelGrid, expandingSymbol) => {
    const newGrid = reelGrid.map(reel => [...reel]);
    newGrid.forEach((reel, reelIdx) => {
      if (reel.includes(expandingSymbol)) {
        newGrid[reelIdx] = [expandingSymbol, expandingSymbol, expandingSymbol];
      }
    });
    return newGrid;
  };

  // === ANIMAZIONE RULLI (FIX: simboli generati UNA VOLTA) ===
  const animateReelSpin = async (reelIndex, finalSymbols, delay = 0) => {
    const spinDuration = turboMode ? 500 : 2000; // 0.5s turbo, 2s normale
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const animSymbols = Array(20).fill(null).map(() => generateRandomSymbol());
        
        setReelAnimationSymbols(prev => {
          const newSymbols = [...prev];
          newSymbols[reelIndex] = animSymbols;
          return newSymbols;
        });
        
        setSpinningReels(prev => {
          const newSpinning = [...prev];
          newSpinning[reelIndex] = true;
          return newSpinning;
        });
        
        setTimeout(() => {
          setSpinningReels(prev => {
            const newSpinning = [...prev];
            newSpinning[reelIndex] = false;
            return newSpinning;
          });
          
          // IMPORTANTE: Imposta i simboli FINALI qui (non dopo!)
          setReels(prev => {
            const newReels = [...prev];
            newReels[reelIndex] = finalSymbols;
            return newReels;
          });
          
          resolve();
        }, spinDuration + delay);
      }, delay);
    });
  };

  // === ANIMAZIONE SCATTER CELEBRATION ===
  const playScatterCelebration = async (scatterPositions) => {
    setShowScatterCelebration(true);
    setWinningPositions(scatterPositions);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowScatterCelebration(false);
  };

  // === ANIMAZIONE SELEZIONE SIMBOLO ===
  const playSymbolSelection = async () => {
    const expandableSymbols = SYMBOL_KEYS.filter(key => 
      key !== 'book' && SYMBOLS[key].canExpand
    );
    
    setSymbolSelectionOptions(expandableSymbols);
    setShowSymbolSelection(true);
    
    const spins = 30;
    const spinDuration = 100;
    
    for (let i = 0; i < spins; i++) {
      setSelectedSymbolIndex(i % expandableSymbols.length);
      await new Promise(resolve => setTimeout(resolve, spinDuration));
    }
    
    const finalIndex = Math.floor(Math.random() * expandableSymbols.length);
    setSelectedSymbolIndex(finalIndex);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const selectedSymbol = expandableSymbols[finalIndex];
    setExpandingSymbol(selectedSymbol);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowSymbolSelection(false);
    
    return selectedSymbol;
  };

  // === SPIN PRINCIPALE (FIX: simboli generati UNA VOLTA) ===
  const handleSpin = async () => {
    if (isSpinning) return;
    
    if (!freeSpinsMode && credits < currentBet) return;
    
    setIsSpinning(true);
    setWinningPositions([]);
    setWinningLines([]);
    setCurrentWin(0);
    
    if (!freeSpinsMode) {
      setCredits(prev => prev - currentBet);
      
      // AutoSpin: decrementa budget se attivo
      if (autoSpinActive && autoSpinMode === 'budget') {
        setAutoSpinBudgetRemaining(prev => prev - currentBet);
      }
    }
    
    // GENERA SIMBOLI FINALI UNA VOLTA SOLA
    const finalReels = Array(5).fill(null).map(() => generateRandomReel());
    
    // Anima rulli con i simboli finali già decisi
    const reelDelay = turboMode ? 50 : 200;
    const reelPromises = finalReels.map((finalReel, index) => 
      animateReelSpin(index, finalReel, index * reelDelay)
    );
    
    await Promise.all(reelPromises);
    
    // Aspetta un attimo prima di calcolare
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // I simboli sono GIÀ impostati, non riimpostarli!
    let resultReels = finalReels;
    
    // Se in modalità free spin, espandi simbolo
    if (freeSpinsMode && expandingSymbol) {
      resultReels = expandSymbols(finalReels, expandingSymbol);
      setReels(resultReels);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Calcola vincite
    const { totalPayout, winLines, winPositions, scatterCount, scatterPositions } = calculateWins(resultReels);
    
    setWinningLines(winLines);
    setWinningPositions(winPositions);
    setCurrentWin(totalPayout);
    setLastWin(totalPayout);
    
    if (totalPayout > 0) {
      setCredits(prev => prev + totalPayout);
      if (freeSpinsMode) {
        setFreeSpinsTotalWin(prev => prev + totalPayout);
      }
    }
    
    // Gestione scatter (3+)
    if (scatterCount >= 3) {
      // FERMA AUTOSPIN se attivo
      if (autoSpinActive) {
        setAutoSpinActive(false);
        setAutoSpinSpinsRemaining(0);
        setAutoSpinBudgetRemaining(0);
      }
      
      await playScatterCelebration(scatterPositions);
      
      if (freeSpinsMode) {
        setFreeSpinsRemaining(prev => prev + 10);
      } else {
        await playSymbolSelection();
        setFreeSpinsMode(true);
        setFreeSpinsRemaining(10);
        setFreeSpinsTotalWin(0);
        setIsSpinning(false);
        
        // Free spins NON sono auto
        return;
      }
    }
    
    // Continua free spins
    if (freeSpinsMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const remaining = freeSpinsRemaining - 1;
      setFreeSpinsRemaining(remaining);
      
      if (remaining > 0) {
        setIsSpinning(false);
        setTimeout(() => handleSpin(), 1000);
      } else {
        setFreeSpinsMode(false);
        setExpandingSymbol(null);
        setIsSpinning(false);
        
        setTimeout(() => {
          alert(`🎉 FREE SPINS COMPLETATI!\n\nVincita Totale: ${freeSpinsTotalWin.toFixed(2)} token`);
          setFreeSpinsTotalWin(0);
        }, 500);
      }
    } else {
      setIsSpinning(false);
      
      // AutoSpin: continua se attivo
      if (autoSpinActive) {
        const canContinue = autoSpinMode === 'spins' 
          ? autoSpinSpinsRemaining > 1 
          : (autoSpinBudgetRemaining >= currentBet && credits >= currentBet);
        
        if (canContinue) {
          if (autoSpinMode === 'spins') {
            setAutoSpinSpinsRemaining(prev => prev - 1);
          }
          setTimeout(() => handleSpin(), turboMode ? 500 : 1000);
        } else {
          setAutoSpinActive(false);
          setAutoSpinSpinsRemaining(0);
          setAutoSpinBudgetRemaining(0);
        }
      }
    }
  };

  // === GESTIONE PUNTATA ===
  // La puntata viene selezionata tramite modale con importi preimpostati

  // === AUTOSPIN ===
  const handleAutoSpinConfig = (mode, value) => {
    setAutoSpinMode(mode);
    if (mode === 'spins') {
      setAutoSpinSpinsRemaining(value);
      setAutoSpinBudgetRemaining(0);
    } else {
      setAutoSpinBudgetRemaining(value);
      setAutoSpinSpinsRemaining(0);
    }
    setAutoSpinActive(true);
    setShowAutoSpinModal(false);
    
    // Avvia primo spin
    setTimeout(() => handleSpin(), 500);
  };

  const toggleAutoSpin = () => {
    if (autoSpinActive) {
      setAutoSpinActive(false);
      setAutoSpinSpinsRemaining(0);
      setAutoSpinBudgetRemaining(0);
    } else {
      setShowAutoSpinModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black flex flex-col relative overflow-hidden">
      {/* Sfondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-orange-600 via-red-600 to-transparent animate-pulse"></div>
      </div>

      {/* MODAL AUTOSPIN */}
      {showAutoSpinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-yellow-300">AUTO SPIN</h2>
              <button 
                onClick={() => setShowAutoSpinModal(false)}
                className="text-yellow-400 hover:text-yellow-200"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Limite GIRI */}
              <div>
                <label className="text-yellow-400 font-bold text-lg mb-2 block">
                  Limite GIRI (5-100)
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5"
                  defaultValue="10"
                  className="w-full"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    document.getElementById('spins-value').textContent = value;
                  }}
                  id="spins-slider"
                />
                <div className="text-center text-white text-2xl font-black mt-2">
                  <span id="spins-value">10</span> giri
                </div>
                <button
                  onClick={() => {
                    const value = parseInt(document.getElementById('spins-slider').value);
                    handleAutoSpinConfig('spins', value);
                  }}
                  className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl"
                >
                  AVVIA CON GIRI
                </button>
              </div>

              <div className="border-t-2 border-yellow-600 pt-6">
                {/* Limite TOKEN */}
                <label className="text-yellow-400 font-bold text-lg mb-2 block">
                  Limite TOKEN (10-{credits.toFixed(0)})
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max={Math.max(10, credits)}
                  step="10"
                  defaultValue="50"
                  className="w-full"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    document.getElementById('budget-value').textContent = value;
                  }}
                  id="budget-slider"
                />
                <div className="text-center text-white text-2xl font-black mt-2">
                  <span id="budget-value">50</span> token
                </div>
                <button
                  onClick={() => {
                    const value = parseInt(document.getElementById('budget-slider').value);
                    handleAutoSpinConfig('budget', value);
                  }}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl"
                >
                  AVVIA CON BUDGET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SELEZIONE PUNTATA */}
      {showBetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-yellow-300">SELEZIONA PUNTATA</h2>
              <button 
                onClick={() => setShowBetModal(false)}
                className="text-yellow-400 hover:text-yellow-200"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[0.5, 1, 1.5, 2.5, 5, 8, 10, 15, 20, 50].map(bet => (
                <button
                  key={bet}
                  onClick={() => {
                    setCurrentBet(bet);
                    setShowBetModal(false);
                  }}
                  className={`
                    py-4 px-6 rounded-xl font-black text-2xl transition-all
                    ${currentBet === bet 
                      ? 'bg-yellow-500 text-black border-4 border-yellow-300' 
                      : 'bg-gray-700 text-yellow-400 border-2 border-gray-600 hover:bg-gray-600'
                    }
                  `}
                >
                  {bet.toFixed(1)}
                </button>
              ))}
              
              {/* Puntata 100 solo se credito > 1000 */}
              {credits > 1000 && (
                <button
                  onClick={() => {
                    setCurrentBet(100);
                    setShowBetModal(false);
                  }}
                  className={`
                    py-4 px-6 rounded-xl font-black text-2xl transition-all
                    ${currentBet === 100 
                      ? 'bg-yellow-500 text-black border-4 border-yellow-300' 
                      : 'bg-gradient-to-br from-orange-600 to-red-600 text-white border-2 border-orange-400 hover:from-orange-500 hover:to-red-500'
                    }
                  `}
                >
                  100
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SELEZIONE SIMBOLO */}
      {showSymbolSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-12 border-8 border-yellow-500 shadow-2xl max-w-4xl">
            <h2 className="text-5xl font-black text-yellow-300 text-center mb-8 animate-pulse">
              🎰 SELEZIONE SIMBOLO EXPANDING 🎰
            </h2>
            
            <div className="grid grid-cols-5 gap-6 mb-8">
              {symbolSelectionOptions.map((symbolKey, index) => (
                <div
                  key={symbolKey}
                  className={`
                    p-4 rounded-2xl border-4 transition-all duration-200
                    ${index === selectedSymbolIndex 
                      ? 'bg-yellow-400 border-yellow-300 scale-125 shadow-2xl' 
                      : 'bg-purple-800/50 border-purple-600 scale-100'
                    }
                  `}
                >
                  <img 
                    src={SYMBOLS[symbolKey].img}
                    alt={SYMBOLS[symbolKey].name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: index === selectedSymbolIndex ? 'drop-shadow(0 0 20px gold)' : 'none'
                    }}
                  />
                </div>
              ))}
            </div>
            
            <p className="text-yellow-200 text-2xl text-center font-bold">
              Il simbolo scelto si espanderà durante i Free Spins!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-red-900 via-orange-700 to-red-900 border-b-4 border-yellow-600 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <button className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-yellow-400 font-bold px-4 py-2 rounded-lg border border-yellow-600 transition-all">
            <ArrowLeft className="w-5 h-5" />
            MENU
          </button>

          <div className="text-center">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-2xl tracking-wider px-8 py-2 leading-tight">
              INFERNO'S FORTUNE
            </h1>
            <p className="text-yellow-400 font-semibold text-sm tracking-widest mt-1">
              ★ DELUXE EDITION ★
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-black/50 hover:bg-black/70 p-2 rounded-lg border border-yellow-600 text-yellow-400 transition-all">
              <Volume2 className="w-5 h-5" />
            </button>
            <button className="bg-black/50 hover:bg-black/70 p-2 rounded-lg border border-yellow-600 text-yellow-400 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* FREE SPINS Banner */}
      {freeSpinsMode && (
        <div className="relative z-20 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-4 px-6 border-b-4 border-yellow-400 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <div>
                <div className="text-yellow-300 font-black text-2xl">FREE SPINS ATTIVI!</div>
                <div className="text-white text-sm">Simbolo Expanding: {SYMBOLS[expandingSymbol]?.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 text-sm">Spins Rimanenti</div>
              <div className="text-white font-black text-3xl">{freeSpinsRemaining}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 text-sm">Vincita Totale</div>
              <div className="text-green-400 font-black text-3xl">{freeSpinsTotalWin.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Area gioco */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-6xl w-full">
          
          <div className="relative bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 p-6 rounded-3xl shadow-2xl border-8 border-double border-yellow-600">
            
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 px-12 py-3 rounded-t-2xl border-4 border-yellow-600 shadow-xl z-10">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
                <span className="text-2xl font-black text-yellow-300 tracking-wider">GIRA E VINCI</span>
                <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>

            {/* Griglia rulli */}
            <div className="bg-gradient-to-b from-black via-gray-900 to-black rounded-2xl p-4 shadow-inner relative overflow-hidden">
              
              {/* Numeri sinistra */}
              <div className="absolute -left-16 top-0 bottom-0 flex flex-col justify-around py-4 z-10">
                {[1, 2, 3, 4, 5].map(num => (
                  <div 
                    key={`left-${num}`} 
                    className={`text-black font-black text-lg px-3 py-2 rounded-lg shadow-lg border-2 transition-all ${
                      winningLines.includes(num - 1)
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-300 animate-pulse'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-300'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>

              {/* Numeri destra */}
              <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-around py-4 z-10">
                {[6, 7, 8, 9, 10].map(num => (
                  <div 
                    key={`right-${num}`} 
                    className={`text-black font-black text-lg px-3 py-2 rounded-lg shadow-lg border-2 transition-all ${
                      winningLines.includes(num - 1)
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-300 animate-pulse'
                        : 'bg-gradient-to-r from-orange-500 to-yellow-500 border-yellow-300'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>

              {/* 5 Rulli */}
              <div className="grid grid-cols-5 gap-2">
                {reels.map((reel, reelIndex) => (
                  <div key={reelIndex} className="flex flex-col gap-2 relative">
                    {spinningReels[reelIndex] ? (
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="animate-reel-spin">
                          {reelAnimationSymbols[reelIndex].map((symbolKey, idx) => (
                            <div
                              key={idx}
                              className="bg-gradient-to-br from-red-900 via-orange-800 to-red-900 rounded-xl border-4 border-yellow-600/30 flex items-center justify-center aspect-square mb-2"
                            >
                              <img 
                                src={SYMBOLS[symbolKey].img}
                                alt={SYMBOLS[symbolKey].name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  padding: '8px',
                                  filter: 'blur(2px)'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      reel.map((symbolKey, rowIndex) => {
                        const isWinning = winningPositions.some(
                          ([r, ro]) => r === reelIndex && ro === rowIndex
                        );
                        const isScatter = showScatterCelebration && symbolKey === 'book';
                        
                        return (
                          <div
                            key={`${reelIndex}-${rowIndex}`}
                            className={`
                              bg-gradient-to-br from-red-900 via-orange-800 to-red-900 
                              rounded-xl border-4
                              flex items-center justify-center 
                              aspect-square
                              shadow-xl
                              transition-all duration-300
                              overflow-hidden
                              ${isWinning ? 'border-green-400 animate-pulse-win scale-110 z-20' : 'border-yellow-600/50'}
                              ${isScatter ? 'animate-scatter-flash' : ''}
                              ${!isSpinning && !isWinning ? 'hover:scale-105 hover:border-yellow-400' : ''}
                            `}
                          >
                            <img 
                              src={SYMBOLS[symbolKey].img}
                              alt={SYMBOLS[symbolKey].name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '8px',
                                display: 'block'
                              }}
                            />
                            {isScatter && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Sparkles className="w-16 h-16 text-yellow-300 animate-spin" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ))}
              </div>

              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 pointer-events-none z-10"></div>
            </div>

            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-8">
              <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
              <Flame className="w-12 h-12 text-red-500 animate-pulse" style={{animationDelay: '0.3s'}} />
              <Flame className="w-12 h-12 text-yellow-500 animate-pulse" style={{animationDelay: '0.6s'}} />
            </div>
          </div>

          {/* NUOVO PANNELLO CONTROLLO */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border-4 border-yellow-600">
            <div className="grid grid-cols-4 gap-6">
              
              {/* RIQUADRO ROSSO - Credito e Puntata */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 border-4 border-gray-600 shadow-lg">
                <div className="text-yellow-400 text-sm font-bold mb-2 text-center">CREDITO:</div>
                <div className="text-white text-2xl font-black text-center mb-4">
                  💰 {credits.toFixed(2)}
                </div>
                
                <div className="border-t-2 border-gray-600 pt-4 mt-2">
                  <div className="text-yellow-400 text-sm font-bold mb-2 text-center">TOT. PUNTATA:</div>
                  <button
                    onClick={() => !isSpinning && !freeSpinsMode && !autoSpinActive && setShowBetModal(true)}
                    disabled={isSpinning || freeSpinsMode || autoSpinActive}
                    className="w-full text-yellow-300 hover:text-yellow-100 text-4xl font-black py-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💳 {currentBet.toFixed(1)}
                  </button>
                  <div className="text-gray-400 text-xs text-center mt-1">
                    (click per cambiare)
                  </div>
                </div>
              </div>

              {/* RIQUADRO VERDE - Vincita */}
              <div className={`col-span-2 rounded-xl p-6 border-4 shadow-lg transition-all ${
                currentWin > 0 
                  ? 'bg-gradient-to-br from-green-700 to-green-800 border-green-400 animate-pulse' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
              }`}>
                <div className="text-yellow-400 text-lg font-bold mb-2 text-center">
                  {currentWin > 0 ? 'VINCITA ATTUALE:' : 'ULTIMA VINCITA:'}
                </div>
                <div className={`text-6xl font-black text-center ${
                  currentWin > 0 ? 'text-yellow-300' : (lastWin > 0 ? 'text-green-300' : 'text-gray-400')
                }`}>
                  💰 {(currentWin > 0 ? currentWin : lastWin).toFixed(2)}
                </div>
              </div>

              {/* RIQUADRO BLU - Opzioni */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 border-4 border-blue-600 shadow-lg flex flex-col gap-3">
                
                {/* Turbo */}
                <button
                  onClick={() => setTurboMode(!turboMode)}
                  disabled={isSpinning}
                  className={`${
                    turboMode 
                      ? 'bg-yellow-500 border-yellow-400' 
                      : 'bg-gray-700 border-gray-600'
                  } border-2 text-white font-black py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
                >
                  <Zap className="w-5 h-5" />
                  TURBO
                </button>

                {/* AutoSpin */}
                <button
                  onClick={toggleAutoSpin}
                  disabled={isSpinning || freeSpinsMode}
                  className={`${
                    autoSpinActive 
                      ? 'bg-red-600 border-red-400' 
                      : 'bg-purple-700 border-purple-600'
                  } border-2 text-white font-black py-3 px-4 rounded-lg transition-all active:scale-95`}
                >
                  {autoSpinActive ? 'STOP AUTO' : 'AUTO SPIN'}
                </button>
                
                {/* Counter AutoSpin */}
                {autoSpinActive && (
                  <div className="text-yellow-300 text-sm text-center font-bold">
                    {autoSpinMode === 'spins' 
                      ? `${autoSpinSpinsRemaining} giri` 
                      : `${autoSpinBudgetRemaining.toFixed(1)} token`}
                  </div>
                )}

                {/* INFO FREE SPINS - Nello spazio sotto */}
                {freeSpinsMode && (
                  <div className="mt-2 bg-purple-900/50 rounded-lg p-3 border-2 border-purple-500">
                    <div className="text-yellow-300 text-xs font-bold mb-2 text-center">
                      FREE SPINS
                    </div>
                    <div className="text-white text-lg font-black text-center mb-2">
                      {10 - freeSpinsRemaining + 1} / 10
                    </div>
                    {expandingSymbol && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-yellow-400 text-xs">Simbolo:</div>
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-1 border-2 border-yellow-400">
                          <img 
                            src={SYMBOLS[expandingSymbol].img}
                            alt={SYMBOLS[expandingSymbol].name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                        <div className="text-yellow-300 text-xs font-bold text-center">
                          {SYMBOLS[expandingSymbol].name}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* PULSANTE SPIN */}
            <div className="mt-6">
              <button 
                onClick={handleSpin}
                disabled={isSpinning || (!freeSpinsMode && credits < currentBet) || autoSpinActive}
                className="w-full bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-6 px-8 rounded-2xl shadow-lg border-4 border-green-400 disabled:border-gray-500 transition-all active:scale-95 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10 text-4xl">
                  {isSpinning ? '⏳ SPIN...' : '▶ SPIN!'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animazioni */}
      <style>{`
        @keyframes reel-spin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        
        .animate-reel-spin {
          animation: reel-spin ${turboMode ? '0.05s' : '0.15s'} linear infinite;
        }

        @keyframes pulse-win {
          0%, 100% { 
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.8);
          }
          50% { 
            transform: scale(1.15);
            box-shadow: 0 0 30px rgba(74, 222, 128, 1);
          }
        }
        
        .animate-pulse-win {
          animation: pulse-win 0.6s infinite;
        }

        @keyframes scatter-flash {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(250, 204, 21, 1);
            border-color: rgba(250, 204, 21, 1);
          }
          50% { 
            box-shadow: 0 0 50px rgba(250, 204, 21, 1);
            border-color: rgba(251, 191, 36, 1);
            transform: scale(1.2);
          }
        }
        
        .animate-scatter-flash {
          animation: scatter-flash 0.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default InfernoFortuneSlot;
