import React, { useState, useRef, useEffect } from 'react';
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
const LINES = 10;

// ✅ FIX #5: Linee di pagamento BOOK OF RA (esatte dalla foto)
const PAYLINES = [
  [[0,1], [1,1], [2,1], [3,1], [4,1]], // Linea 1 - centrale
  [[0,0], [1,0], [2,0], [3,0], [4,0]], // Linea 2 - alta
  [[0,2], [1,2], [2,2], [3,2], [4,2]], // Linea 3 - bassa
  [[0,0], [1,1], [2,2], [3,1], [4,0]], // Linea 4 - V
  [[0,2], [1,1], [2,0], [3,1], [4,2]], // Linea 5 - V invertita
  [[0,1], [1,0], [2,0], [3,0], [4,1]], // Linea 6 - tetto
  [[0,1], [1,2], [2,2], [3,2], [4,1]], // Linea 7 - pavimento
  [[0,0], [1,0], [2,1], [3,2], [4,2]], // Linea 8 - scala su
  [[0,2], [1,2], [2,1], [3,0], [4,0]], // Linea 9 - scala giù
  [[0,1], [1,0], [2,1], [3,2], [4,1]]  // Linea 10 - W
];

function InfernoFortuneSlot() {
  // ✅ FIX #4: Crediti iniziali a 150
  const [credits, setCredits] = useState(150);
  const [currentBet, setCurrentBet] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWin, setCurrentWin] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  
  const [turboMode, setTurboMode] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  
  const [autoSpinActive, setAutoSpinActive] = useState(false);
  const [showAutoSpinModal, setShowAutoSpinModal] = useState(false);
  const [autoSpinSpinsRemaining, setAutoSpinSpinsRemaining] = useState(0);
  const [autoSpinBudgetRemaining, setAutoSpinBudgetRemaining] = useState(0);
  const [autoSpinMode, setAutoSpinMode] = useState('spins');
  
  const [freeSpinsMode, setFreeSpinsMode] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [expandingSymbol, setExpandingSymbol] = useState(null);
  const [freeSpinsTotalWin, setFreeSpinsTotalWin] = useState(0);
  
  const [showScatterCelebration, setShowScatterCelebration] = useState(false);
  const [showSymbolSelection, setShowSymbolSelection] = useState(false);
  const [symbolSelectionOptions, setSymbolSelectionOptions] = useState([]);
  const [selectedSymbolIndex, setSelectedSymbolIndex] = useState(0);
  
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

  // ✅ FIX #3: useRef per autospin
  const autoSpinTimerRef = useRef(null);
  const spinInProgressRef = useRef(false);

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

  // ✅ FIX #1: Animazione rulli SENZA scomparsa
  const animateReelSpin = async (reelIndex, finalSymbols, delay = 0) => {
    const spinDuration = turboMode ? 500 : 2000;
    
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

  const playScatterCelebration = async (scatterPositions) => {
    setShowScatterCelebration(true);
    setWinningPositions(scatterPositions);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowScatterCelebration(false);
  };

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

  const handleSpin = async () => {
    if (isSpinning || spinInProgressRef.current) return;
    
    if (!freeSpinsMode && credits < currentBet) return;
    
    spinInProgressRef.current = true;
    setIsSpinning(true);
    setWinningPositions([]);
    setWinningLines([]);
    setCurrentWin(0);
    
    if (!freeSpinsMode) {
      setCredits(prev => prev - currentBet);
      
      if (autoSpinActive && autoSpinMode === 'budget') {
        setAutoSpinBudgetRemaining(prev => prev - currentBet);
      }
    }
    
    const finalReels = Array(5).fill(null).map(() => generateRandomReel());
    
    const reelDelay = turboMode ? 50 : 200;
    const reelPromises = finalReels.map((finalReel, index) => 
      animateReelSpin(index, finalReel, index * reelDelay)
    );
    
    await Promise.all(reelPromises);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let resultReels = finalReels;
    
    if (freeSpinsMode && expandingSymbol) {
      resultReels = expandSymbols(finalReels, expandingSymbol);
      setReels(resultReels);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
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
    
    if (scatterCount >= 3) {
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
        spinInProgressRef.current = false;
        
        return;
      }
    }
    
    if (freeSpinsMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const remaining = freeSpinsRemaining - 1;
      setFreeSpinsRemaining(remaining);
      
      if (remaining > 0) {
        setIsSpinning(false);
        spinInProgressRef.current = false;
        setTimeout(() => handleSpin(), 1000);
      } else {
        setFreeSpinsMode(false);
        setExpandingSymbol(null);
        setIsSpinning(false);
        spinInProgressRef.current = false;
        
        setTimeout(() => {
          alert(`🎉 FREE SPINS COMPLETATI!\n\nVincita Totale: ${freeSpinsTotalWin.toFixed(2)} token`);
          setFreeSpinsTotalWin(0);
        }, 500);
      }
    } else {
      setIsSpinning(false);
      spinInProgressRef.current = false;
    }
  };

  // ✅ FIX #3: useEffect per autospin
  useEffect(() => {
    if (autoSpinTimerRef.current) {
      clearTimeout(autoSpinTimerRef.current);
      autoSpinTimerRef.current = null;
    }

    if (autoSpinActive && !isSpinning && !spinInProgressRef.current && !freeSpinsMode) {
      const canStart = autoSpinMode === 'spins' 
        ? autoSpinSpinsRemaining > 0 
        : (autoSpinBudgetRemaining > 0 && credits >= currentBet);
      
      if (canStart) {
        autoSpinTimerRef.current = setTimeout(() => {
          if (autoSpinMode === 'spins') {
            setAutoSpinSpinsRemaining(prev => prev - 1);
          }
          handleSpin();
        }, turboMode ? 500 : 1000);
      } else {
        setAutoSpinActive(false);
        setAutoSpinSpinsRemaining(0);
        setAutoSpinBudgetRemaining(0);
      }
    }
    
    return () => {
      if (autoSpinTimerRef.current) {
        clearTimeout(autoSpinTimerRef.current);
      }
    };
  }, [autoSpinActive, autoSpinSpinsRemaining, autoSpinBudgetRemaining, isSpinning, freeSpinsMode, autoSpinMode, credits, currentBet, turboMode]);

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
              <div>
                <label className="text-yellow-400 font-bold text-lg mb-2 block">
                  Limite GIRI (5-100)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 25, 50].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAutoSpinConfig('spins', num)}
                      className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black py-3 px-4 rounded-lg border-2 border-blue-400 transition-all"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-yellow-400 font-bold text-lg mb-2 block">
                  Limite TOKEN
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[50, 100, 200].map(num => (
                    <button
                      key={num}
                      onClick={() => handleAutoSpinConfig('budget', num)}
                      disabled={credits < num}
                      className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-3 px-4 rounded-lg border-2 border-green-400 disabled:border-gray-500 transition-all disabled:cursor-not-allowed"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PUNTATA */}
      {showBetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-4 border-yellow-500 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-yellow-300">SCEGLI PUNTATA</h2>
              <button 
                onClick={() => setShowBetModal(false)}
                className="text-yellow-400 hover:text-yellow-200"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[0.5, 1, 2, 5, 10, 20, 50].map(bet => (
                <button
                  key={bet}
                  onClick={() => {
                    setCurrentBet(bet);
                    setShowBetModal(false);
                  }}
                  disabled={credits < bet}
                  className={`
                    py-4 px-6 rounded-xl font-black text-2xl transition-all disabled:cursor-not-allowed disabled:opacity-50
                    ${currentBet === bet 
                      ? 'bg-yellow-500 text-black border-4 border-yellow-300' 
                      : 'bg-gradient-to-br from-orange-600 to-red-600 text-white border-2 border-orange-400 hover:from-orange-500 hover:to-red-500'
                    }
                  `}
                >
                  {bet}
                </button>
              ))}
              
              {credits > 100 && (
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

      {/* ✅ FIX #2: Header più compatto */}
      <div className="relative z-10 bg-gradient-to-r from-red-900 via-orange-700 to-red-900 border-b-4 border-yellow-600 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2">
          <button className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-yellow-400 font-bold px-3 py-1.5 rounded-lg border border-yellow-600 transition-all text-sm">
            <ArrowLeft className="w-4 h-4" />
            MENU
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-2xl tracking-wider px-6 py-1 leading-tight">
              INFERNO'S FORTUNE
            </h1>
            <p className="text-yellow-400 font-semibold text-xs tracking-widest">
              ★ DELUXE EDITION ★
            </p>
          </div>

          <div className="flex gap-2">
            <button className="bg-black/50 hover:bg-black/70 p-1.5 rounded-lg border border-yellow-600 text-yellow-400 transition-all">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="bg-black/50 hover:bg-black/70 p-1.5 rounded-lg border border-yellow-600 text-yellow-400 transition-all">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FREE SPINS Banner */}
      {freeSpinsMode && (
        <div className="relative z-20 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-2 px-4 border-b-4 border-yellow-400 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-300" />
              <div>
                <div className="text-yellow-300 font-black text-lg">FREE SPINS ATTIVI!</div>
                <div className="text-white text-xs">Simbolo: {SYMBOLS[expandingSymbol]?.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 text-xs">Rimanenti</div>
              <div className="text-white font-black text-xl">{freeSpinsRemaining}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 text-xs">Vincita</div>
              <div className="text-green-400 font-black text-xl">{freeSpinsTotalWin.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Area gioco */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-5xl w-full">
          
          <div className="relative bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 p-4 rounded-3xl shadow-2xl border-8 border-double border-yellow-600">
            
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 px-8 py-2 rounded-t-2xl border-4 border-yellow-600 shadow-xl z-10">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-xl font-black text-yellow-300 tracking-wider">GIRA E VINCI</span>
                <Flame className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
            </div>

            {/* Griglia rulli */}
            <div className="bg-gradient-to-b from-black via-gray-900 to-black rounded-2xl p-3 shadow-inner relative overflow-hidden">
              
              {/* Numeri sinistra */}
              <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-around py-3 z-10">
                {[1, 2, 3, 4, 5].map(num => (
                  <div 
                    key={`left-${num}`} 
                    className={`text-black font-black text-sm px-2 py-1.5 rounded-lg shadow-lg border-2 transition-all ${
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
              <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-around py-3 z-10">
                {[6, 7, 8, 9, 10].map(num => (
                  <div 
                    key={`right-${num}`} 
                    className={`text-black font-black text-sm px-2 py-1.5 rounded-lg shadow-lg border-2 transition-all ${
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
                    {/* ✅ FIX #1: Animazione SEMPRE visibile */}
                    {spinningReels[reelIndex] ? (
                      <div className="absolute inset-0 overflow-hidden rounded-xl z-10">
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
                    ) : null}
                    
                    {/* Simboli finali sempre visibili */}
                    {reel.map((symbolKey, rowIndex) => {
                      const isWinning = winningPositions.some(
                        ([r, ro]) => r === reelIndex && ro === rowIndex
                      );
                      const isScatter = showScatterCelebration && symbolKey === 'book';
                      
                      return (
                        <div
                          key={`${reelIndex}-${rowIndex}`}
                          className={`
                            bg-gradient-to-br from-red-900 via-orange-800 to-red-900 
                            rounded-xl border-4 flex items-center justify-center 
                            aspect-square transition-all duration-300
                            ${isWinning ? 'border-green-400 animate-pulse-win' : 'border-yellow-600/50'}
                            ${isScatter ? 'animate-scatter-flash' : ''}
                            ${spinningReels[reelIndex] ? 'opacity-0' : 'opacity-100'}
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
                              filter: isWinning ? 'drop-shadow(0 0 10px #4ade80)' : 'none'
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ FIX #2: Barra inferiore più compatta */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              
              {/* Credito e Puntata */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-3 border-4 border-gray-600 shadow-lg">
                <div className="text-yellow-400 text-xs font-bold mb-1 text-center">CREDITO:</div>
                <div className="text-white text-xl font-black text-center mb-2">
                  💰 {credits.toFixed(2)}
                </div>
                
                <div className="border-t-2 border-gray-600 pt-2 mt-1">
                  <div className="text-yellow-400 text-xs font-bold mb-1 text-center">PUNTATA:</div>
                  <button
                    onClick={() => !isSpinning && !freeSpinsMode && !autoSpinActive && setShowBetModal(true)}
                    disabled={isSpinning || freeSpinsMode || autoSpinActive}
                    className="w-full text-yellow-300 hover:text-yellow-100 text-2xl font-black py-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💳 {currentBet.toFixed(1)}
                  </button>
                  <div className="text-gray-400 text-xs text-center">
                    (clicca)
                  </div>
                </div>
              </div>

              {/* Vincita */}
              <div className={`col-span-2 rounded-xl p-3 border-4 shadow-lg transition-all ${
                currentWin > 0 
                  ? 'bg-gradient-to-br from-green-700 to-green-800 border-green-400 animate-pulse' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
              }`}>
                <div className="text-yellow-400 text-sm font-bold mb-1 text-center">
                  {currentWin > 0 ? 'VINCITA:' : 'ULTIMA:'}
                </div>
                <div className={`text-4xl font-black text-center ${
                  currentWin > 0 ? 'text-yellow-300' : (lastWin > 0 ? 'text-green-300' : 'text-gray-400')
                }`}>
                  💰 {(currentWin > 0 ? currentWin : lastWin).toFixed(2)}
                </div>
              </div>

              {/* Opzioni */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-2 border-4 border-blue-600 shadow-lg flex flex-col gap-2">
                
                <button
                  onClick={() => setTurboMode(!turboMode)}
                  disabled={isSpinning}
                  className={`${
                    turboMode 
                      ? 'bg-yellow-500 border-yellow-400' 
                      : 'bg-gray-700 border-gray-600'
                  } border-2 text-white font-black py-2 px-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm`}
                >
                  <Zap className="w-4 h-4" />
                  TURBO
                </button>

                <button
                  onClick={toggleAutoSpin}
                  disabled={isSpinning || freeSpinsMode}
                  className={`${
                    autoSpinActive 
                      ? 'bg-red-600 border-red-400' 
                      : 'bg-purple-700 border-purple-600'
                  } border-2 text-white font-black py-2 px-3 rounded-lg transition-all active:scale-95 text-sm`}
                >
                  {autoSpinActive ? 'STOP' : 'AUTO'}
                </button>
                
                {autoSpinActive && (
                  <div className="text-yellow-300 text-xs text-center font-bold">
                    {autoSpinMode === 'spins' 
                      ? `${autoSpinSpinsRemaining}` 
                      : `${autoSpinBudgetRemaining.toFixed(0)}`}
                  </div>
                )}
              </div>
            </div>

            {/* PULSANTE SPIN */}
            <div className="mt-3">
              <button 
                onClick={handleSpin}
                disabled={isSpinning || (!freeSpinsMode && credits < currentBet) || autoSpinActive}
                className="w-full bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg border-4 border-green-400 disabled:border-gray-500 transition-all active:scale-95 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10 text-3xl">
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
