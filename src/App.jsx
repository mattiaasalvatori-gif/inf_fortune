import React, { useState, useRef, useEffect } from ‘react’;
import { Flame, ArrowLeft, Volume2, Settings, Trophy, Sparkles, Zap, X } from ‘lucide-react’;

// === DATI SIMBOLI ===
const SYMBOLS = {
dante: {
name: ‘Dante’,
type: ‘high’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769968270/1_Esploratore_Dante_a8kswr.png’,
pays: [0, 0, 100, 1000, 5000],
canExpand: true
},
book: {
name: ‘Libro’,
type: ‘wild-scatter’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/2_Libro_Commedia_qbcgfd.png’,
pays: [0, 0, 2, 20, 200],
scatter: true,
wild: true
},
beatrice: {
name: ‘Beatrice’,
type: ‘high’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958222/3_Faraone_Beatrice_fimpos.png’,
pays: [0, 0, 40, 400, 2000],
canExpand: true
},
virgilio: {
name: ‘Virgilio’,
type: ‘high’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/4_Iside_Virgilio_tmkqfn.png’,
pays: [0, 0, 40, 400, 2000],
canExpand: true
},
caronte: {
name: ‘Caronte’,
type: ‘medium’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/5_Scarabeo_Moneta_caronte_us2hwz.png’,
pays: [0, 0, 30, 150, 750],
canExpand: true
},
A: {
name: ‘Asso’,
type: ‘low’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/6_Asso_t5xac7.png’,
pays: [0, 0, 10, 40, 150],
canExpand: true
},
K: {
name: ‘Re’,
type: ‘low’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958219/7_Re_iwnwiy.png’,
pays: [0, 0, 10, 40, 150],
canExpand: true
},
Q: {
name: ‘Donna’,
type: ‘low’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958221/8_Donna_gmbq9e.png’,
pays: [0, 0, 10, 40, 150],
canExpand: true
},
J: {
name: ‘Fante’,
type: ‘low’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958221/9_Fante_wdsxdg.png’,
pays: [0, 0, 10, 40, 150],
canExpand: true
},
Ten: {
name: ‘Dieci’,
type: ‘low’,
img: ‘https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958225/10_Dieci_uly2im.png’,
pays: [0, 0, 10, 40, 150],
canExpand: true
}
};

const SYMBOL_KEYS = Object.keys(SYMBOLS);
const LINES = 10;

// ✅ LINEE BOOK OF RA ESATTE (dalla foto payment_lines_BoR.png)
const PAYLINES = [
[[0,1], [1,1], [2,1], [3,1], [4,1]], // Linea 1 - Centro (blu)
[[0,0], [1,0], [2,0], [3,0], [4,0]], // Linea 2 - Alto (rosa)
[[0,2], [1,2], [2,2], [3,2], [4,2]], // Linea 3 - Basso (verde)
[[0,0], [1,1], [2,2], [3,1], [4,0]], // Linea 4 - V (giallo)
[[0,2], [1,1], [2,0], [3,1], [4,2]], // Linea 5 - V rovesciato (rosa)
[[0,1], [1,0], [2,0], [3,0], [4,1]], // Linea 6 - U (lime)
[[0,1], [1,2], [2,2], [3,2], [4,1]], // Linea 7 - U rovesciato (cyan)
[[0,0], [1,0], [2,1], [3,2], [4,2]], // Linea 8 - Scala ascendente (celeste)
[[0,2], [1,2], [2,1], [3,0], [4,0]], // Linea 9 - Scala discendente (verde)
[[0,1], [1,0], [2,1], [3,2], [4,1]]  // Linea 10 - W (viola)
];

function InfernoFortuneSlot() {
// ✅ FIX #4: Token iniziali 150
const [credits, setCredits] = useState(150);
const [currentBet, setCurrentBet] = useState(5);
const [isSpinning, setIsSpinning] = useState(false);
const [currentWin, setCurrentWin] = useState(0);
const [lastWin, setLastWin] = useState(0);

const [turboMode, setTurboMode] = useState(false);
const [showBetModal, setShowBetModal] = useState(false);

// AutoSpin
const [autoSpinActive, setAutoSpinActive] = useState(false);
const [showAutoSpinModal, setShowAutoSpinModal] = useState(false);
const [autoSpinSpinsRemaining, setAutoSpinSpinsRemaining] = useState(0);
const [autoSpinBudgetRemaining, setAutoSpinBudgetRemaining] = useState(0);
const [autoSpinMode, setAutoSpinMode] = useState(‘spins’);
const autoSpinTimerRef = useRef(null);
const spinInProgressRef = useRef(false);

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

// Rulli
const [reels, setReels] = useState([
[‘virgilio’, ‘K’, ‘beatrice’],
[‘Q’, ‘dante’, ‘A’],
[‘caronte’, ‘virgilio’, ‘J’],
[‘book’, ‘Q’, ‘Ten’],
[‘beatrice’, ‘K’, ‘virgilio’]
]);
const [spinningReels, setSpinningReels] = useState([false, false, false, false, false]);

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
if (symbol === ‘book’) {
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

```
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
```

};

const calculateWins = (reelGrid) => {
let totalPayout = 0;
let winLines = [];
let winPositions = [];
const betPerLine = currentBet / LINES;

```
PAYLINES.forEach((linePositions, lineIndex) => {
  const win = checkLineWin(reelGrid, linePositions, expandingSymbol);
  if (win && win.payout > 0) {
    const linePayout = win.payout * betPerLine;
    totalPayout += linePayout;
    winLines.push(lineIndex);
    winPositions.push(...win.positions);
  }
});

const uniquePositions = Array.from(
  new Set(winPositions.map(pos => JSON.stringify(pos)))
).map(str => JSON.parse(str));

return {
  totalPayout,
  winningLines: winLines,
  winningPositions: uniquePositions
};
```

};

const handleSpin = async () => {
if (isSpinning || spinInProgressRef.current) return;

```
spinInProgressRef.current = true;
setIsSpinning(true);
setCurrentWin(0);
setWinningPositions([]);
setWinningLines([]);

if (!freeSpinsMode) {
  if (credits < currentBet) {
    setIsSpinning(false);
    spinInProgressRef.current = false;
    return;
  }
  setCredits(prev => prev - currentBet);
}

// ✅ FIX #1: Genera simboli finali PRIMA dell'animazione
const finalReels = [
  generateRandomReel(),
  generateRandomReel(),
  generateRandomReel(),
  generateRandomReel(),
  generateRandomReel()
];

// ✅ FIX #1: Avvia SOLO animazione spin, NON scomparsa
setSpinningReels([true, true, true, true, true]);

const spinDuration = turboMode ? 800 : 1500;
const reelStopDelay = turboMode ? 100 : 200;

// Ferma i rulli progressivamente e mostra simboli finali
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    setSpinningReels(prev => {
      const newSpinning = [...prev];
      newSpinning[i] = false;
      return newSpinning;
    });
    
    setReels(prev => {
      const newReels = [...prev];
      newReels[i] = finalReels[i];
      return newReels;
    });
  }, spinDuration + (i * reelStopDelay));
}

setTimeout(() => {
  const { totalPayout, winningLines: winLines, winningPositions: winPos } = calculateWins(finalReels);
  
  if (winPos.length > 0) {
    setWinningPositions(winPos);
    setWinningLines(winLines);
    setCurrentWin(totalPayout);
    setLastWin(totalPayout);
    
    if (freeSpinsMode) {
      setFreeSpinsTotalWin(prev => prev + totalPayout);
    }
    
    setCredits(prev => prev + totalPayout);
  }

  const { count: scatterCount } = countScatters(finalReels);
  
  if (scatterCount >= 3 && !freeSpinsMode) {
    setShowScatterCelebration(true);
    
    setTimeout(() => {
      setShowScatterCelebration(false);
      
      const expandableSymbols = SYMBOL_KEYS.filter(key => 
        SYMBOLS[key].canExpand && key !== 'book'
      );
      setSymbolSelectionOptions(expandableSymbols);
      setSelectedSymbolIndex(0);
      setShowSymbolSelection(true);
    }, turboMode ? 1000 : 2000);
  } else if (freeSpinsMode) {
    const newRemaining = freeSpinsRemaining - 1;
    setFreeSpinsRemaining(newRemaining);
    
    if (newRemaining === 0) {
      setTimeout(() => {
        alert(`🎉 FREE SPINS COMPLETATI!\n\nVincita totale: ${freeSpinsTotalWin.toFixed(2)} token`);
        setFreeSpinsMode(false);
        setExpandingSymbol(null);
        setFreeSpinsTotalWin(0);
        setIsSpinning(false);
        spinInProgressRef.current = false;
      }, turboMode ? 500 : 1000);
      return;
    }
  }

  setIsSpinning(false);
  spinInProgressRef.current = false;
}, spinDuration + (5 * reelStopDelay) + (turboMode ? 300 : 500));
```

};

const startFreeSpins = (symbol) => {
setExpandingSymbol(symbol);
setFreeSpinsRemaining(10);
setFreeSpinsMode(true);
setFreeSpinsTotalWin(0);
setShowSymbolSelection(false);
};

const toggleAutoSpin = () => {
if (autoSpinActive) {
setAutoSpinActive(false);
if (autoSpinTimerRef.current) {
clearTimeout(autoSpinTimerRef.current);
autoSpinTimerRef.current = null;
}
} else {
setShowAutoSpinModal(true);
}
};

const startAutoSpin = (mode, value) => {
setAutoSpinMode(mode);
if (mode === ‘spins’) {
setAutoSpinSpinsRemaining(value);
} else {
setAutoSpinBudgetRemaining(value);
}
setAutoSpinActive(true);
setShowAutoSpinModal(false);
};

// ✅ FIX #3: useEffect per gestire AutoSpin
useEffect(() => {
if (autoSpinActive && !isSpinning && !spinInProgressRef.current && !freeSpinsMode && !showScatterCelebration && !showSymbolSelection) {
const canStart = autoSpinMode === ‘spins’
? autoSpinSpinsRemaining > 0
: (autoSpinBudgetRemaining > 0 && credits >= currentBet);

```
  if (canStart) {
    autoSpinTimerRef.current = setTimeout(() => {
      if (autoSpinMode === 'spins') {
        setAutoSpinSpinsRemaining(prev => prev - 1);
      } else {
        setAutoSpinBudgetRemaining(prev => prev - currentBet);
      }
      
      handleSpin();
    }, turboMode ? 500 : 1000);
  } else {
    setAutoSpinActive(false);
  }
}

return () => {
  if (autoSpinTimerRef.current) {
    clearTimeout(autoSpinTimerRef.current);
  }
};
```

}, [autoSpinActive, isSpinning, autoSpinSpinsRemaining, autoSpinBudgetRemaining, autoSpinMode, credits, currentBet, freeSpinsMode, turboMode, showScatterCelebration, showSymbolSelection]);

return (
<div className="min-h-screen bg-gradient-to-br from-red-950 via-orange-950 to-amber-950 flex items-center justify-center p-2 sm:p-4">
<style>{`@keyframes reel-spin { 0% { transform: translateY(0); } 100% { transform: translateY(-2000px); } } .animate-reel-spin { animation: reel-spin 0.8s linear infinite; } @keyframes pulse-win { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } } .animate-pulse-win { animation: pulse-win 0.5s ease-in-out infinite; } @keyframes scatter-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } } .animate-scatter-flash { animation: scatter-flash 0.3s ease-in-out infinite; }`}</style>

```
  <div className="w-full max-w-4xl">
    {/* HEADER - ✅ FIX #2: Compattato */}
    <div className="bg-gradient-to-r from-red-900 via-orange-800 to-red-900 px-3 py-2 sm:px-4 sm:py-3 rounded-t-2xl border-x-4 border-t-4 border-yellow-600 flex justify-between items-center shadow-2xl">
      <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95">
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
      </button>

      <div className="text-center flex-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-300" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
          INFERNO'S FORTUNE
        </h1>
        <p className="text-xs sm:text-sm text-yellow-500 font-bold flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> DELUXE EDITION <Sparkles className="w-3 h-3" />
        </p>
      </div>

      <div className="flex gap-1 sm:gap-2">
        <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95">
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
        </button>
      </div>
    </div>

    {/* FREE SPINS BANNER */}
    {freeSpinsMode && (
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 px-3 py-2 text-center border-x-4 border-yellow-600 animate-pulse">
        <div className="text-sm sm:text-base md:text-lg font-black text-yellow-300 flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          FREE SPINS: {freeSpinsRemaining} rimasti | Vincita totale: {freeSpinsTotalWin.toFixed(2)}
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        {expandingSymbol && (
          <div className="text-xs sm:text-sm text-yellow-400 mt-1">
            Simbolo espandibile: {SYMBOLS[expandingSymbol].name}
          </div>
        )}
      </div>
    )}

    {/* BET MODAL */}
    {showBetModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-4 sm:p-6 max-w-md w-full border-4 border-yellow-500 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-yellow-300">SELEZIONA PUNTATA</h2>
            <button onClick={() => setShowBetModal(false)} className="p-1 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[0.5, 1, 2, 5, 10, 20, 50, 100].map(bet => (
              <button
                key={bet}
                onClick={() => {
                  setCurrentBet(bet);
                  setShowBetModal(false);
                }}
                disabled={credits < bet}
                className={`py-2 sm:py-3 px-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                  bet === currentBet
                    ? 'bg-green-600 text-white scale-105'
                    : credits < bet
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-700 hover:bg-purple-600 text-white active:scale-95'
                }`}
              >
                {bet.toFixed(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* AUTOSPIN MODAL */}
    {showAutoSpinModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-4 sm:p-6 max-w-md w-full border-4 border-yellow-500 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-yellow-300">AUTO SPIN</h2>
            <button onClick={() => setShowAutoSpinModal(false)} className="p-1 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 text-sm sm:text-base">Numero giri:</h3>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map(spins => (
                  <button
                    key={spins}
                    onClick={() => startAutoSpin('spins', spins)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-2 rounded-lg transition-all text-sm sm:text-base"
                  >
                    {spins}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-yellow-400 font-bold mb-2 text-sm sm:text-base">Budget token:</h3>
              <div className="grid grid-cols-4 gap-2">
                {[20, 50, 100, 200].map(budget => (
                  <button
                    key={budget}
                    onClick={() => startAutoSpin('budget', budget)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-2 rounded-lg transition-all text-sm sm:text-base"
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

    {/* SCATTER CELEBRATION */}
    {showScatterCelebration && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="text-center animate-bounce">
          <div className="text-6xl sm:text-8xl mb-4">🎉</div>
          <div className="text-4xl sm:text-6xl font-black text-yellow-300 mb-2">
            GIRA E VINCI! 🔥
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-400">
            10 FREE SPINS ATTIVATI!
          </div>
        </div>
      </div>
    )}

    {/* SYMBOL SELECTION */}
    {showSymbolSelection && (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-4 sm:p-8 max-w-2xl w-full border-4 border-yellow-500 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-300 text-center mb-4 sm:mb-6">
            SELEZIONA IL SIMBOLO ESPANDIBILE
          </h2>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-8">
            {symbolSelectionOptions.map((symbolKey, index) => (
              <button
                key={symbolKey}
                onClick={() => setSelectedSymbolIndex(index)}
                className={`aspect-square rounded-xl p-2 sm:p-3 transition-all ${
                  selectedSymbolIndex === index
                    ? 'bg-yellow-500 scale-110 border-4 border-yellow-300 shadow-lg shadow-yellow-500/50'
                    : 'bg-gray-700 border-2 border-gray-500 hover:scale-105'
                }`}
              >
                <img 
                  src={SYMBOLS[symbolKey].img}
                  alt={SYMBOLS[symbolKey].name}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => startFreeSpins(symbolSelectionOptions[selectedSymbolIndex])}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-black py-3 sm:py-4 px-4 sm:px-8 rounded-xl text-lg sm:text-2xl transition-all active:scale-95 border-4 border-green-400"
          >
            INIZIA FREE SPINS
          </button>
        </div>
      </div>
    )}

    {/* SLOT MACHINE - ✅ FIX #2 & #6: Responsive */}
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-4 md:p-6 rounded-b-2xl border-x-4 border-b-4 border-yellow-600 shadow-2xl">
      <div className="relative">
        {/* Area rulli - ✅ FIX #2: Dimensioni scalabili */}
        <div className="bg-gradient-to-br from-orange-950 to-red-950 rounded-xl p-2 sm:p-3 md:p-4 border-4 border-yellow-700 shadow-inner relative overflow-hidden">
          <div className="grid grid-cols-5 gap-1 sm:gap-2 relative z-20">
            {reels.map((reel, reelIndex) => (
              <div key={reelIndex} className="space-y-1 sm:space-y-2">
                {spinningReels[reelIndex] ? (
                  // ✅ FIX #1: Simboli che scorrono (NO scomparsa)
                  <div className="h-[180px] sm:h-[240px] md:h-[300px] overflow-hidden relative">
                    <div className="animate-reel-spin space-y-1 sm:space-y-2">
                      {Array(30).fill(null).map((_, idx) => {
                        const symbol = generateRandomSymbol();
                        return (
                          <div
                            key={idx}
                            className="h-[58px] sm:h-[78px] md:h-[98px] w-full bg-gradient-to-br from-red-900 to-orange-900 rounded-lg border-2 border-yellow-600 flex items-center justify-center"
                          >
                            <img 
                              src={SYMBOLS[symbol].img}
                              alt={SYMBOLS[symbol].name}
                              className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Rullo fermo
                  reel.map((symbol, rowIndex) => {
                    const isWinning = winningPositions.some(
                      ([r, row]) => r === reelIndex && row === rowIndex
                    );
                    const isScatter = symbol === 'book';

                    return (
                      <div
                        key={rowIndex}
                        className={`h-[58px] sm:h-[78px] md:h-[98px] w-full rounded-lg border-2 flex items-center justify-center transition-all ${
                          isWinning 
                            ? 'bg-gradient-to-br from-green-600 to-green-700 border-green-400 animate-pulse-win' 
                            : isScatter
                            ? 'bg-gradient-to-br from-yellow-700 to-orange-700 border-yellow-400 animate-scatter-flash'
                            : 'bg-gradient-to-br from-red-900 to-orange-900 border-yellow-600'
                        }`}
                      >
                        <img 
                          src={SYMBOLS[symbol].img}
                          alt={SYMBOLS[symbol].name}
                          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                        />
                        {isScatter && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-300 animate-spin" />
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

        <div className="absolute -bottom-3 sm:-bottom-4 left-0 right-0 flex justify-center gap-4 sm:gap-6">
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-pulse" style={{animationDelay: '0.3s'}} />
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 animate-pulse" style={{animationDelay: '0.6s'}} />
        </div>
      </div>

      {/* PANNELLO CONTROLLI - ✅ FIX #2: Compatto e responsive */}
      <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* CREDITO */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2 sm:p-3 border-2 border-yellow-700">
            <div className="text-yellow-500 text-xs sm:text-sm font-bold mb-0.5 sm:mb-1">CREDITO:</div>
            <div className="text-yellow-300 text-base sm:text-xl md:text-2xl font-black flex items-center gap-1">
              💰 {credits.toFixed(2)}
            </div>
            <div className="text-yellow-600 text-xs mt-0.5 sm:mt-1">
              TOT. PUNTATA:
            </div>
            <div className="text-yellow-400 text-sm sm:text-base font-bold flex items-center gap-1">
              💳 {currentBet.toFixed(1)}
            </div>
            <button
              onClick={() => setShowBetModal(true)}
              className="text-xs text-yellow-500 underline mt-1 hover:text-yellow-300"
            >
              (click per cambiare)
            </button>
          </div>

          {/* ULTIMA VINCITA */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2 sm:p-3 border-2 border-yellow-700">
            <div className="text-yellow-500 text-xs sm:text-sm font-bold mb-0.5 sm:mb-1">ULTIMA VINCITA:</div>
            <div className="text-green-400 text-base sm:text-xl md:text-2xl font-black flex items-center gap-1">
              💰 {lastWin.toFixed(2)}
            </div>
          </div>
        </div>

        {/* PULSANTI AZIONE - ✅ FIX #2: Compatti */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTurboMode(!turboMode)}
            className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all active:scale-95 ${
              turboMode
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-2 border-yellow-400'
                : 'bg-gradient-to-r from-blue-700 to-blue-800 text-white border-2 border-blue-500 hover:from-blue-600 hover:to-blue-700'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" /> TURBO
            </div>
          </button>

          <button
            onClick={toggleAutoSpin}
            disabled={isSpinning || freeSpinsMode}
            className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all active:scale-95 ${
              autoSpinActive
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-red-400 animate-pulse'
                : 'bg-gradient-to-r from-purple-700 to-purple-800 text-white border-2 border-purple-500 hover:from-purple-600 hover:to-purple-700'
            } ${(isSpinning || freeSpinsMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            AUTO SPIN
            {autoSpinActive && (
              <div className="text-xs mt-0.5">
                {autoSpinMode === 'spins' ? `${autoSpinSpinsRemaining} giri` : `${autoSpinBudgetRemaining.toFixed(0)} token`}
              </div>
            )}
          </button>

          <button
            onClick={handleSpin}
            disabled={isSpinning || credits < currentBet}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-base sm:text-lg md:text-xl transition-all active:scale-95 border-2 border-green-400"
          >
            ▶ SPIN!
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

);
}

export default InfernoFortuneSlot;
