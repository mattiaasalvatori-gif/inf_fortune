import React, { useState, useRef, useEffect } from 'react';
import { Flame, Volume2, Settings, Sparkles, Zap, X } from 'lucide-react';

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

// FIX #5: Linee di pagamento esatte di Book of Ra (dalla foto payment_lines_BoR.png)
const PAYLINES = [
  [[0,1], [1,1], [2,1], [3,1], [4,1]], // 1: riga centrale
  [[0,0], [1,0], [2,0], [3,0], [4,0]], // 2: riga superiore
  [[0,2], [1,2], [2,2], [3,2], [4,2]], // 3: riga inferiore
  [[0,0], [1,1], [2,2], [3,1], [4,0]], // 4: V
  [[0,2], [1,1], [2,0], [3,1], [4,2]], // 5: V invertita
  [[0,1], [1,0], [2,0], [3,0], [4,1]], // 6: cappello
  [[0,1], [1,2], [2,2], [3,2], [4,1]], // 7: cappello invertito
  [[0,0], [1,0], [2,1], [3,2], [4,2]], // 8: scala ascendente
  [[0,2], [1,2], [2,1], [3,0], [4,0]], // 9: scala discendente
  [[0,1], [1,0], [2,1], [3,2], [4,1]]  // 10: zigzag
];

function InfernoFortuneSlot() {
  // FIX #4: Token iniziali = 1500 (non 150)
  const [credits, setCredits] = useState(1500);
  const [currentBet, setCurrentBet] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWin, setCurrentWin] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  
  const [turboMode, setTurboMode] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  
  // FIX #3: AutoSpin con useRef per tracking
  const [autoSpinActive, setAutoSpinActive] = useState(false);
  const [showAutoSpinModal, setShowAutoSpinModal] = useState(false);
  const [autoSpinSpinsRemaining, setAutoSpinSpinsRemaining] = useState(0);
  const [autoSpinBudgetRemaining, setAutoSpinBudgetRemaining] = useState(0);
  const [autoSpinMode, setAutoSpinMode] = useState('spins');
  const autoSpinTimerRef = useRef(null);
  const spinInProgressRef = useRef(false);
  
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
    
    const scatterResult = countScatters(reelGrid);
    const scatterCount = scatterResult.count;
    const scatterPositions = scatterResult.positions;
    
    if (scatterCount >= 3) {
      const scatterPayout = SYMBOLS.book.pays[scatterCount - 1] * currentBet;
      totalPayout += scatterPayout;
    }
    
    PAYLINES.forEach((line, lineIndex) => {
      const lineWin = checkLineWin(reelGrid, line, expandingSymbol);
      if (lineWin && lineWin.payout > 0) {
        const lineWinAmount = lineWin.payout * betPerLine;
        totalPayout += lineWinAmount;
        winLines.push(lineIndex);
        
        lineWin.positions.forEach(pos => {
          if (!winPositions.some(([r, ro]) => r === pos[0] && ro === pos[1])) {
            winPositions.push(pos);
          }
        });
      }
    });
    
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

  // FIX #1: Animazione rulli continua (genera simboli casuali durante lo spin)
  const animateReelSpin = async (reelIndex, finalSymbols, delay = 0) => {
    const spinDuration = turboMode ? 500 : 2000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Genera 20 simboli per l'animazione dello spin
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
      
      // FIX #3: AutoSpin - Decrementa qui se mode = 'spins'
      if (autoSpinActive) {
        const canContinue = autoSpinMode === 'spins' 
          ? autoSpinSpinsRemaining > 1 
          : (autoSpinBudgetRemaining >= currentBet && credits >= currentBet);
        
        if (canContinue) {
          if (autoSpinMode === 'spins') {
            setAutoSpinSpinsRemaining(prev => prev - 1);
          }
          // Non chiamare handleSpin() qui - sarà chiamato dal useEffect
        } else {
          setAutoSpinActive(false);
          setAutoSpinSpinsRemaining(0);
          setAutoSpinBudgetRemaining(0);
        }
      }
    }
  };

  // FIX #3: useEffect per AutoSpin continuo (soluzione ESLINT-safe)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (autoSpinActive && !isSpinning && !spinInProgressRef.current && !freeSpinsMode) {
      const canStart = autoSpinMode === 'spins' 
        ? autoSpinSpinsRemaining > 0 
        : (autoSpinBudgetRemaining > 0 && credits >= currentBet);
      
      if (canStart) {
        autoSpinTimerRef.current = setTimeout(() => {
          handleSpin();
        }, turboMode ? 500 : 1000);
      }
    }
    
    return () => {
      if (autoSpinTimerRef.current) {
        clearTimeout(autoSpinTimerRef.current);
      }
    };
  }, [autoSpinActive, autoSpinSpinsRemaining, autoSpinBudgetRemaining, 
      isSpinning, freeSpinsMode, autoSpinMode, credits, currentBet, turboMode]);

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
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white overflow-hidden">
      <div className="container mx-auto p-4">
        {/* FIX #2: Container responsive con max-width */}
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-red-800 to-red-600 py-4 px-6 rounded-t-2xl relative shadow-2xl border-4 border-yellow-600">
            <div className="flex justify-between items-center">
              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-black text-yellow-400 tracking-wider drop-shadow-lg">
                  INFERNO'S FORTUNE
                </h1>
                <p className="text-sm text-yellow-300 mt-1">★ DELUXE EDITION ★</p>
              </div>

              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scatter Celebration */}
          {showScatterCelebration && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="text-center animate-pulse">
                <div className="text-6xl font-black text-yellow-400 mb-4">
                  🔥 SCATTER BONUS! 🔥
                </div>
                <div className="text-4xl text-white">
                  10 FREE SPINS ATTIVATI!
                </div>
              </div>
            </div>
          )}

          {/* Symbol Selection */}
          {showSymbolSelection && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-900 to-purple-700 p-8 rounded-2xl border-4 border-yellow-500">
                <div className="text-2xl font-bold text-yellow-300 mb-4 text-center">
                  SIMBOLO ESPANDIBILE
                </div>
                <div className="w-48 h-48 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 border-4 border-yellow-400 animate-pulse">
                  <img 
                    src={SYMBOLS[symbolSelectionOptions[selectedSymbolIndex]]?.img}
                    alt="symbol"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bet Modal */}
          {showBetModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-4 border-yellow-600 max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-yellow-400">Seleziona Puntata</h3>
                  <button onClick={() => setShowBetModal(false)}>
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 5, 10, 20, 50, 100, 200, 500].map(bet => (
                    <button
                      key={bet}
                      onClick={() => {
                        setCurrentBet(bet);
                        setShowBetModal(false);
                      }}
                      className="bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-all active:scale-95"
                    >
                      {bet}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AutoSpin Modal */}
          {showAutoSpinModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-4 border-purple-600 max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-purple-400">Auto Spin</h3>
                  <button onClick={() => setShowAutoSpinModal(false)}>
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-300 mb-2">Numero di Giri:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 25, 50, 100].map(spins => (
                        <button
                          key={spins}
                          onClick={() => handleAutoSpinConfig('spins', spins)}
                          className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-3 rounded-lg transition-all active:scale-95"
                        >
                          {spins}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-300 mb-2">Budget Token:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[50, 100, 200, 500].map(budget => (
                        <button
                          key={budget}
                          onClick={() => handleAutoSpinConfig('budget', budget)}
                          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-all active:scale-95"
                        >
                          {budget}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Game Area - FIX #2: Dimensioni ottimizzate */}
          <div className="bg-gradient-to-b from-gray-900 to-black py-6 px-4 rounded-b-2xl shadow-2xl border-x-4 border-b-4 border-yellow-600 relative">
            
            {/* Reels */}
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-900 to-amber-700 p-4 rounded-xl border-4 border-yellow-600 shadow-inner">
                {reels.map((reel, reelIndex) => (
                  <div key={reelIndex} className="inline-block align-top" style={{width: '19%', marginRight: reelIndex < 4 ? '1.25%' : '0'}}>
                    {spinningReels[reelIndex] ? (
                      <div className="animate-reel-spin">
                        {reelAnimationSymbols[reelIndex].map((symbol, idx) => (
                          <div
                            key={idx}
                            className="mb-1 bg-gradient-to-br from-red-800 to-red-950 rounded-lg border-2 border-yellow-600 flex items-center justify-center"
                            style={{aspectRatio: '1/1'}}
                          >
                            <img 
                              src={SYMBOLS[symbol].img}
                              alt={symbol}
                              style={{width: '80%', height: '80%', objectFit: 'contain'}}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      reel.map((symbol, rowIndex) => {
                        const isWinning = winningPositions.some(([r, ro]) => r === reelIndex && ro === rowIndex);
                        const isScatter = symbol === 'book';

                        return (
                          <div
                            key={rowIndex}
                            className={`mb-1 bg-gradient-to-br from-red-800 to-red-950 rounded-lg border-2 transition-all duration-300 flex items-center justify-center relative ${
                              isWinning 
                                ? 'border-green-400 animate-pulse-win' 
                                : isScatter 
                                ? 'border-yellow-400 animate-scatter-flash' 
                                : 'border-yellow-600'
                            }`}
                            style={{aspectRatio: '1/1'}}
                          >
                            <img 
                              src={SYMBOLS[symbol].img}
                              alt={symbol}
                              style={{width: '80%', height: '80%', objectFit: 'contain'}}
                            />
                            {isScatter && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-yellow-300 animate-spin" />
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

          {/* PANNELLO CONTROLLO - FIX #2: Layout compatto */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 md:p-8 shadow-2xl border-4 border-yellow-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              
              {/* Credito e Puntata */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 md:p-6 border-4 border-gray-600 shadow-lg">
                <div className="text-yellow-400 text-sm font-bold mb-2 text-center">CREDITO:</div>
                <div className="text-white text-xl md:text-2xl font-black text-center mb-4">
                  💰 {credits.toFixed(2)}
                </div>
                
                <div className="border-t-2 border-gray-600 pt-4 mt-2">
                  <div className="text-yellow-400 text-sm font-bold mb-2 text-center">TOT. PUNTATA:</div>
                  <button
                    onClick={() => !isSpinning && !freeSpinsMode && !autoSpinActive && setShowBetModal(true)}
                    disabled={isSpinning || freeSpinsMode || autoSpinActive}
                    className="w-full text-yellow-300 hover:text-yellow-100 text-3xl md:text-4xl font-black py-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💳 {currentBet.toFixed(1)}
                  </button>
                  <div className="text-gray-400 text-xs text-center mt-1">
                    (click per cambiare)
                  </div>
                </div>
              </div>

              {/* Vincita */}
              <div className={`col-span-1 md:col-span-2 rounded-xl p-4 md:p-6 border-4 shadow-lg transition-all ${
                currentWin > 0 
                  ? 'bg-gradient-to-br from-green-700 to-green-800 border-green-400 animate-pulse' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
              }`}>
                <div className="text-yellow-400 text-base md:text-lg font-bold mb-2 text-center">
                  {currentWin > 0 ? 'VINCITA ATTUALE:' : 'ULTIMA VINCITA:'}
                </div>
                <div className={`text-4xl md:text-6xl font-black text-center ${
                  currentWin > 0 ? 'text-yellow-300' : (lastWin > 0 ? 'text-green-300' : 'text-gray-400')
                }`}>
                  💰 {(currentWin > 0 ? currentWin : lastWin).toFixed(2)}
                </div>
              </div>

              {/* Opzioni */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 border-4 border-blue-600 shadow-lg flex flex-col gap-3">
                
                <button
                  onClick={() => setTurboMode(!turboMode)}
                  disabled={isSpinning}
                  className={`${
                    turboMode 
                      ? 'bg-yellow-500 border-yellow-400' 
                      : 'bg-gray-700 border-gray-600'
                  } border-2 text-white font-black py-2 md:py-3 px-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base`}
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                  TURBO
                </button>

                <button
                  onClick={toggleAutoSpin}
                  disabled={isSpinning || freeSpinsMode}
                  className={`${
                    autoSpinActive 
                      ? 'bg-red-600 border-red-400' 
                      : 'bg-purple-700 border-purple-600'
                  } border-2 text-white font-black py-2 md:py-3 px-4 rounded-lg transition-all active:scale-95 text-sm md:text-base`}
                >
                  {autoSpinActive ? 'STOP AUTO' : 'AUTO SPIN'}
                </button>
                
                {autoSpinActive && (
                  <div className="text-yellow-300 text-sm text-center font-bold">
                    {autoSpinMode === 'spins' 
                      ? `${autoSpinSpinsRemaining} giri` 
                      : `${autoSpinBudgetRemaining.toFixed(1)} token`}
                  </div>
                )}

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
                            style={{width: '100%', height: '100%', objectFit: 'contain'}}
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
            <div className="mt-4 md:mt-6">
              <button 
                onClick={handleSpin}
                disabled={isSpinning || (!freeSpinsMode && credits < currentBet) || autoSpinActive}
                className="w-full bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-4 md:py-6 px-8 rounded-2xl shadow-lg border-4 border-green-400 disabled:border-gray-500 transition-all active:scale-95 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10 text-3xl md:text-4xl">
                  {isSpinning ? '⏳ SPIN...' : '▶ SPIN!'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

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
