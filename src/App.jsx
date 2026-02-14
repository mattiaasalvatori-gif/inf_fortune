import React, { useState, useEffect, useRef } from 'react';
import { Flame, Volume2, Settings, Sparkles, Zap, X } from 'lucide-react';

// === DATI SIMBOLI (IDENTICI ALL'ORIGINALE) ===
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

// FIX #5: Linee di pagamento ESATTE di Book of Ra
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
  // FIX #4: Token iniziali = 1500
  const [credits, setCredits] = useState(1500);
  const [currentBet, setCurrentBet] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWin, setCurrentWin] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  
  const [turboMode, setTurboMode] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  
  // FIX #3: Auto Spin
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
  
  // FIX #1: Rulli sempre visibili
  const [reels, setReels] = useState([
    ['virgilio', 'K', 'beatrice'],
    ['Q', 'dante', 'A'],
    ['caronte', 'virgilio', 'J'],
    ['book', 'Q', 'Ten'],
    ['beatrice', 'K', 'virgilio']
  ]);
  
  const [winningPositions, setWinningPositions] = useState([]);
  const [winningLines, setWinningLines] = useState([]);
  
  const spinInProgressRef = useRef(false);

  // === FUNZIONI UTILITÀ ===
  const generateRandomSymbol = () => SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
  const generateRandomReel = () => Array(3).fill(null).map(() => generateRandomSymbol());

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
      setSelectedSymbolIndex(Math.floor(Math.random() * expandableSymbols.length));
      await new Promise(resolve => setTimeout(resolve, spinDuration + i * 5));
    }
    
    const finalIndex = Math.floor(Math.random() * expandableSymbols.length);
    setSelectedSymbolIndex(finalIndex);
    const selectedSymbol = expandableSymbols[finalIndex];
    setExpandingSymbol(selectedSymbol);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowSymbolSelection(false);
    
    return selectedSymbol;
  };

  // FIX #1 + #3: SPIN con animazione continua e auto spin corretto
  const handleSpin = async () => {
    if (isSpinning || spinInProgressRef.current) return;
    if (!freeSpinsMode && credits < currentBet) {
      alert('Crediti insufficienti!');
      setAutoSpinActive(false);
      setAutoSpinSpinsRemaining(0);
      return;
    }
    
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
    
    // FIX #1: Animazione rulli continua
    const spinDuration = turboMode ? 1000 : 2000;
    const intervalTime = 100;
    let elapsed = 0;
    
    const spinInterval = setInterval(() => {
      setReels([
        generateRandomReel(),
        generateRandomReel(),
        generateRandomReel(),
        generateRandomReel(),
        generateRandomReel()
      ]);
      elapsed += intervalTime;
      
      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        
        const finalReels = [
          generateRandomReel(),
          generateRandomReel(),
          generateRandomReel(),
          generateRandomReel(),
          generateRandomReel()
        ];
        
        let resultReels = finalReels;
        
        if (freeSpinsMode && expandingSymbol) {
          resultReels = expandSymbols(finalReels, expandingSymbol);
        }
        
        setReels(resultReels);
        
        setTimeout(async () => {
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
            
            // FIX #3: Auto Spin continua
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
        }, 300);
      }
    }, intervalTime);
  };

  // FIX #3: useEffect per trigger auto spin
  useEffect(() => {
    if (autoSpinActive && !isSpinning && !spinInProgressRef.current && !freeSpinsMode) {
      const canStart = autoSpinMode === 'spins' 
        ? autoSpinSpinsRemaining > 0 
        : (autoSpinBudgetRemaining > 0 && credits >= currentBet);
      
      if (canStart) {
        const timer = setTimeout(() => {
          handleSpin();
        }, turboMode ? 500 : 1000);
        return () => clearTimeout(timer);
      } else {
        setAutoSpinActive(false);
      }
    }
  }, [autoSpinActive, autoSpinSpinsRemaining, autoSpinBudgetRemaining, isSpinning, freeSpinsMode]);

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

  // === RENDER ===
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black p-4">
      {/* FIX #2: Container responsive */}
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-gradient-to-r from-red-800 to-red-600 py-4 px-6 rounded-t-2xl relative shadow-2xl">
          <div className="flex justify-between items-center">
            <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-yellow-400 tracking-wider">
                INFERNO'S FORTUNE
              </h1>
              <p className="text-sm text-yellow-300">★ DELUXE EDITION ★</p>
            </div>

            <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showScatterCelebration && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-center py-4 animate-pulse">
            <p className="text-3xl font-bold text-white">
              🔥 SCATTER! FREE SPINS ATTIVATI! 🔥
            </p>
          </div>
        )}

        {freeSpinsMode && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-center py-3">
            <p className="text-xl font-bold text-white">
              🎰 FREE SPINS: {11 - freeSpinsRemaining} / 10 - Vincita: {freeSpinsTotalWin.toFixed(2)} 🎰
            </p>
          </div>
        )}

        <div className="bg-gradient-to-b from-amber-700 to-amber-900 p-6 border-8 border-yellow-600 rounded-b-2xl shadow-2xl">
          <div className="relative">
            <div className="grid grid-cols-5 gap-3 bg-black/30 p-4 rounded-xl">
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="space-y-3">
                  {reel.map((symbolId, rowIndex) => {
                    const isWinning = winningPositions.some(
                      ([r, ro]) => r === reelIndex && ro === rowIndex
                    );
                    const isScatter = symbolId === 'book' && isWinning;

                    return (
                      <div
                        key={`${reelIndex}-${rowIndex}`}
                        className={`
                          aspect-square bg-gradient-to-br from-red-800 to-red-950 
                          rounded-lg border-4 border-yellow-600 
                          flex items-center justify-center p-2
                          transition-all duration-300
                          ${isWinning ? 'ring-4 ring-yellow-400 scale-105 animate-pulse' : ''}
                          ${isScatter ? 'animate-scatter-flash' : ''}
                        `}
                      >
                        <img 
                          src={SYMBOLS[symbolId].img} 
                          alt={SYMBOLS[symbolId].name}
                          className="w-full h-full object-contain"
                        />
                        {isScatter && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Sparkles className="w-16 h-16 text-yellow-300 animate-spin" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-8">
              <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
              <Flame className="w-12 h-12 text-red-500 animate-pulse" style={{animationDelay: '0.3s'}} />
              <Flame className="w-12 h-12 text-yellow-500 animate-pulse" style={{animationDelay: '0.6s'}} />
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border-4 border-yellow-600">
            <div className="grid grid-cols-4 gap-4 mb-4">
              
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 border-4 border-gray-600">
                <div className="text-yellow-400 text-sm font-bold mb-2 text-center">CREDITO:</div>
                <div className="text-white text-2xl font-black text-center mb-3">
                  💰 {credits.toFixed(2)}
                </div>
                
                <div className="border-t-2 border-gray-600 pt-3">
                  <div className="text-yellow-400 text-sm font-bold mb-2 text-center">PUNTATA:</div>
                  <button
                    onClick={() => !isSpinning && !freeSpinsMode && !autoSpinActive && setShowBetModal(true)}
                    disabled={isSpinning || freeSpinsMode || autoSpinActive}
                    className="w-full text-yellow-300 hover:text-yellow-100 text-3xl font-black py-2 transition-all"
                  >
                    💳 {currentBet.toFixed(1)}
                  </button>
                </div>
              </div>

              <div className={`col-span-2 rounded-xl p-4 border-4 transition-all ${
                currentWin > 0 
                  ? 'bg-gradient-to-br from-green-700 to-green-800 border-green-400 animate-pulse' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
              }`}>
                <div className="text-yellow-400 text-lg font-bold mb-2 text-center">
                  {currentWin > 0 ? 'VINCITA:' : 'ULTIMA:'}
                </div>
                <div className={`text-5xl font-black text-center ${
                  currentWin > 0 ? 'text-yellow-300' : (lastWin > 0 ? 'text-green-300' : 'text-gray-400')
                }`}>
                  💰 {(currentWin > 0 ? currentWin : lastWin).toFixed(2)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-3 border-4 border-blue-600 flex flex-col gap-2">
                <button
                  onClick={() => setTurboMode(!turboMode)}
                  disabled={isSpinning}
                  className={`${
                    turboMode ? 'bg-yellow-500' : 'bg-gray-700'
                  } text-white font-black py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2`}
                >
                  <Zap className="w-5 h-5" />
                  TURBO
                </button>

                <button
                  onClick={toggleAutoSpin}
                  disabled={isSpinning || freeSpinsMode}
                  className={`${
                    autoSpinActive ? 'bg-red-600' : 'bg-purple-700'
                  } text-white font-black py-2 px-3 rounded-lg transition-all`}
                >
                  {autoSpinActive ? 'STOP' : 'AUTO'}
                </button>
                
                {autoSpinActive && (
                  <div className="text-yellow-300 text-sm text-center font-bold">
                    {autoSpinMode === 'spins' 
                      ? `${autoSpinSpinsRemaining} giri` 
                      : `${autoSpinBudgetRemaining.toFixed(1)}€`}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleSpin}
              disabled={isSpinning || (!freeSpinsMode && credits < currentBet) || autoSpinActive}
              className="w-full bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-5 px-8 rounded-2xl shadow-lg border-4 border-green-400 disabled:border-gray-500 transition-all text-3xl"
            >
              {isSpinning ? '⏳ SPIN...' : '▶ SPIN!'}
            </button>
          </div>
        </div>
      </div>

      {showBetModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowBetModal(false)}>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border-4 border-yellow-600 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400">SELEZIONA PUNTATA</h3>
              <button onClick={() => setShowBetModal(false)} className="text-yellow-400 hover:text-yellow-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[0.5, 1, 2, 5, 10, 20, 50, 100].map(bet => (
                <button
                  key={bet}
                  onClick={() => {
                    setCurrentBet(bet);
                    setShowBetModal(false);
                  }}
                  className="bg-gradient-to-b from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black py-4 px-6 rounded-xl text-xl transition-all"
                >
                  {bet} €
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAutoSpinModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowAutoSpinModal(false)}>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border-4 border-purple-600 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-400">AUTO SPIN</h3>
              <button onClick={() => setShowAutoSpinModal(false)} className="text-purple-400 hover:text-purple-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-yellow-400 font-bold mb-3">Per numero di giri:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 25, 50, 100].map(spins => (
                    <button
                      key={spins}
                      onClick={() => handleAutoSpinConfig('spins', spins)}
                      className="bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-black py-3 px-4 rounded-xl transition-all"
                    >
                      {spins}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-yellow-400 font-bold mb-3">Per budget:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[50, 100, 200, 500].map(budget => (
                    <button
                      key={budget}
                      onClick={() => handleAutoSpinConfig('budget', budget)}
                      className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-3 px-4 rounded-xl transition-all"
                    >
                      {budget}€
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSymbolSelection && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-12 rounded-3xl border-8 border-yellow-400 shadow-2xl">
            <h3 className="text-4xl font-bold text-yellow-300 text-center mb-8">
              ⭐ SIMBOLO ESPANDIBILE ⭐
            </h3>
            
            {symbolSelectionOptions.length > 0 && (
              <div className="w-64 h-64 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-4 border-8 border-yellow-300 flex items-center justify-center">
                <img 
                  src={SYMBOLS[symbolSelectionOptions[selectedSymbolIndex]].img}
                  alt={SYMBOLS[symbolSelectionOptions[selectedSymbolIndex]].name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
}

export default InfernoFortuneSlot;
