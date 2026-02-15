import React, { useState } from ‘react’;
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

// Linee di pagamento Book of Ra (10 linee)
const PAYLINES = [
[[0,1], [1,1], [2,1], [3,1], [4,1]], // Linea 1: centrale
[[0,0], [1,0], [2,0], [3,0], [4,0]], // Linea 2: superiore
[[0,2], [1,2], [2,2], [3,2], [4,2]], // Linea 3: inferiore
[[0,0], [1,1], [2,2], [3,1], [4,0]], // Linea 4: V
[[0,2], [1,1], [2,0], [3,1], [4,2]], // Linea 5: V invertita
[[0,1], [1,0], [2,0], [3,0], [4,1]], // Linea 6: W alto
[[0,1], [1,2], [2,2], [3,2], [4,1]], // Linea 7: W basso
[[0,0], [1,0], [2,1], [3,2], [4,2]], // Linea 8: salita
[[0,2], [1,2], [2,1], [3,0], [4,0]], // Linea 9: discesa
[[0,1], [1,0], [2,1], [3,2], [4,1]]  // Linea 10: M
];

function InfernoFortuneSlot() {
// CREDITI INIZIALI: 150 (MODIFICATO DA 1500)
const [credits, setCredits] = useState(150);
const [currentBet, setCurrentBet] = useState(5);
const [isSpinning, setIsSpinning] = useState(false);
const [currentWin, setCurrentWin] = useState(0);
const [showMenu, setShowMenu] = useState(false);
const [showPaytable, setShowPaytable] = useState(false);
const [soundEnabled, setSoundEnabled] = useState(true);

const [reels, setReels] = useState([
[‘dante’, ‘K’, ‘beatrice’],
[‘Q’, ‘book’, ‘A’],
[‘caronte’, ‘virgilio’, ‘J’],
[‘book’, ‘Q’, ‘Ten’],
[‘beatrice’, ‘K’, ‘virgilio’]
]);

// STATO AUTO SPIN (CORRETTO)
const [autoSpinCount, setAutoSpinCount] = useState(0);
const [autoSpinActive, setAutoSpinActive] = useState(false);
const [turboMode, setTurboMode] = useState(false);

// Free Spins
const [freeSpinsCount, setFreeSpinsCount] = useState(0);
const [expandingSymbol, setExpandingSymbol] = useState(null);
const [scatterCelebration, setScatterCelebration] = useState(false);
const [showSymbolSelection, setShowSymbolSelection] = useState(false);
const [winningLines, setWinningLines] = useState([]);

// Genera simboli casuali per un rullo
const generateReelSymbols = () => {
const symbols = [];
for (let i = 0; i < 3; i++) {
const randomIndex = Math.floor(Math.random() * SYMBOL_KEYS.length);
symbols.push(SYMBOL_KEYS[randomIndex]);
}
return symbols;
};

// Conta scatter
const countScatters = (grid) => {
let count = 0;
for (let col = 0; col < 5; col++) {
for (let row = 0; row < 3; row++) {
if (grid[col][row] === ‘book’) count++;
}
}
return count;
};

// Calcola vincite
const calculateWins = (grid, isFreeSpins = false) => {
let totalWin = 0;
const foundLines = [];

```
for (let lineIndex = 0; lineIndex < LINES; lineIndex++) {
  const line = PAYLINES[lineIndex];
  const symbols = line.map(([col, row]) => grid[col][row]);
  
  let count = 1;
  const firstSymbol = symbols[0];
  
  for (let i = 1; i < symbols.length; i++) {
    if (symbols[i] === firstSymbol || 
        (symbols[i] === 'book' && !isFreeSpins) || 
        (firstSymbol === 'book' && !isFreeSpins && symbols[i] !== 'book')) {
      count++;
    } else {
      break;
    }
  }
  
  if (count >= 3) {
    let paySymbol = firstSymbol === 'book' && !isFreeSpins ? symbols.find(s => s !== 'book') : firstSymbol;
    if (paySymbol && SYMBOLS[paySymbol]) {
      let payout = SYMBOLS[paySymbol].pays[count - 1] * (currentBet / LINES);
      
      if (isFreeSpins && paySymbol === expandingSymbol) {
        payout *= 10;
      }
      
      totalWin += payout;
      foundLines.push(lineIndex);
    }
  }
}

return { totalWin, foundLines };
```

};

// LOGICA SPIN PRINCIPALE (CORRETTA)
const executeSpin = async () => {
if (credits < currentBet || isSpinning) return;

```
setIsSpinning(true);
setCurrentWin(0);
setWinningLines([]);

const betAmount = freeSpinsCount > 0 ? 0 : currentBet;
setCredits(prev => prev - betAmount);

const spinDuration = turboMode ? 1000 : 2000;

// ANIMAZIONE SPIN (SENZA FAR SPARIRE I RULLI)
await new Promise(resolve => setTimeout(resolve, spinDuration));

// Genera nuovi simboli
const newReels = [
  generateReelSymbols(),
  generateReelSymbols(),
  generateReelSymbols(),
  generateReelSymbols(),
  generateReelSymbols()
];

setReels(newReels);

// Controlla scatter
const scatterCount = countScatters(newReels);

if (scatterCount >= 3 && freeSpinsCount === 0) {
  setScatterCelebration(true);
  setTimeout(() => {
    setScatterCelebration(false);
    setShowSymbolSelection(true);
  }, 2000);
  
  setFreeSpinsCount(10);
  setIsSpinning(false);
  return;
}

// Calcola vincite
const { totalWin, foundLines } = calculateWins(newReels, freeSpinsCount > 0);

if (totalWin > 0) {
  setCurrentWin(totalWin);
  setCredits(prev => prev + totalWin);
  setWinningLines(foundLines);
}

// Gestione free spins
if (freeSpinsCount > 0) {
  setFreeSpinsCount(prev => prev - 1);
}

setIsSpinning(false);

// AUTO SPIN: CONTINUA SE ATTIVO (FIX PRINCIPALE)
if (autoSpinActive && autoSpinCount > 1) {
  setAutoSpinCount(prev => prev - 1);
  setTimeout(() => executeSpin(), turboMode ? 500 : 1000);
} else if (autoSpinCount <= 1) {
  setAutoSpinActive(false);
  setAutoSpinCount(0);
}
```

};

// START AUTO SPIN
const startAutoSpin = (count) => {
if (credits >= currentBet) {
setAutoSpinCount(count);
setAutoSpinActive(true);
setShowMenu(false);
executeSpin();
}
};

// STOP AUTO SPIN
const stopAutoSpin = () => {
setAutoSpinActive(false);
setAutoSpinCount(0);
};

// HANDLE SPIN BUTTON
const handleSpin = () => {
if (autoSpinActive) {
stopAutoSpin();
} else {
executeSpin();
}
};

// Seleziona simbolo expanding
const selectExpandingSymbol = (symbolKey) => {
setExpandingSymbol(symbolKey);
setShowSymbolSelection(false);
};

const betPerLine = (currentBet / LINES).toFixed(1);

return (
<div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black flex flex-col relative overflow-hidden">
{/* Sfondo animato */}
<div className="absolute inset-0 opacity-20 pointer-events-none">
<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-orange-600 via-red-600 to-transparent animate-pulse"></div>
</div>

```
  {/* Header compatto */}
  <div className="relative z-10 bg-gradient-to-r from-red-900 via-orange-700 to-red-900 border-b-4 border-yellow-600 shadow-2xl py-2">
    <div className="flex items-center justify-between px-4">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-yellow-400 px-3 py-1.5 rounded-lg transition-all text-sm"
      >
        <ArrowLeft size={18} />
        MENU
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 tracking-wider">
          INFERNO'S FORTUNE
        </h1>
        <p className="text-yellow-600 text-xs tracking-widest">★ DELUXE EDITION ★</p>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-black/50 hover:bg-black/70 text-yellow-400 p-2 rounded-lg transition-all"
        >
          <Volume2 size={18} />
        </button>
        <button 
          onClick={() => setShowPaytable(true)}
          className="bg-black/50 hover:bg-black/70 text-yellow-400 p-2 rounded-lg transition-all"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  </div>

  {/* Area di gioco centrale - RIDIMENSIONATA */}
  <div className="flex-1 flex items-center justify-center p-4 relative z-10">
    <div className="w-full max-w-3xl">
      
      {/* Celebrazione scatter */}
      {scatterCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 animate-pulse">
          <div className="text-center">
            <Sparkles className="w-24 h-24 text-yellow-400 mx-auto animate-bounce" />
            <h2 className="text-5xl font-bold text-yellow-400 mt-4 animate-pulse">
              GIRA E VINCI! 🔥
            </h2>
            <p className="text-2xl text-white mt-2">10 FREE SPINS ATTIVATI!</p>
          </div>
        </div>
      )}

      {/* Selezione simbolo expanding */}
      {showSymbolSelection && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/90">
          <div className="bg-gradient-to-br from-red-900 to-black p-8 rounded-2xl border-4 border-yellow-600 max-w-2xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
              SCEGLI IL SIMBOLO EXPANDING!
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {SYMBOL_KEYS.filter(k => SYMBOLS[k].canExpand).map((symbolKey) => (
                <button
                  key={symbolKey}
                  onClick={() => selectExpandingSymbol(symbolKey)}
                  className="bg-gradient-to-br from-orange-600 to-red-700 p-4 rounded-xl border-2 border-yellow-500 hover:scale-110 hover:border-yellow-300 transition-all"
                >
                  <img 
                    src={SYMBOLS[symbolKey].img} 
                    alt={SYMBOLS[symbolKey].name}
                    className="w-full h-auto"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Free Spins Badge */}
      {freeSpinsCount > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-full font-bold text-xl shadow-2xl border-4 border-white animate-bounce">
          <Flame className="inline mr-2" />
          FREE SPINS: {freeSpinsCount}
          <Flame className="inline ml-2" />
        </div>
      )}

      {/* Rulli slot - DIMENSIONI OTTIMIZZATE */}
      <div className="bg-gradient-to-br from-amber-900/40 to-black/60 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-2xl border-4 border-yellow-600">
        <div className="grid grid-cols-5 gap-2 md:gap-3 bg-black/50 p-3 md:p-4 rounded-2xl">
          {reels.map((reel, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2">
              {reel.map((symbolKey, rowIndex) => {
                const isWinning = winningLines.some(lineIndex => {
                  const line = PAYLINES[lineIndex];
                  return line.some(([col, row]) => col === colIndex && row === rowIndex);
                });

                return (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`
                      relative aspect-square rounded-xl overflow-hidden border-3
                      ${isWinning 
                        ? 'border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse' 
                        : 'border-yellow-700/50'
                      }
                      ${isSpinning ? 'animate-spin-reel' : ''}
                      ${expandingSymbol === symbolKey && freeSpinsCount > 0 ? 'ring-4 ring-yellow-400' : ''}
                    `}
                    style={{
                      background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.4) 0%, rgba(127, 29, 29, 0.4) 100%)'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-1">
                      <img 
                        src={SYMBOLS[symbolKey].img} 
                        alt={SYMBOLS[symbolKey].name}
                        className="w-full h-full object-contain"
                        style={{
                          filter: isWinning ? 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))' : 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Indicatori fiamma decorativi */}
        <div className="flex justify-center gap-8 mt-4">
          <Flame className="text-orange-500 animate-pulse" size={24} />
          <Flame className="text-red-500 animate-pulse" size={24} style={{animationDelay: '0.2s'}} />
          <Flame className="text-yellow-500 animate-pulse" size={24} style={{animationDelay: '0.4s'}} />
        </div>
      </div>

      {/* Barra controlli - COMPATTA */}
      <div className="mt-4 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-3 md:p-4 border-2 border-yellow-600/30 shadow-xl">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          
          {/* Credito */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-2 md:p-3 text-center border border-yellow-600/30">
            <p className="text-yellow-500 font-semibold text-xs mb-1">CREDITO:</p>
            <p className="text-yellow-400 text-xl md:text-2xl font-bold flex items-center justify-center gap-1">
              <Trophy size={18} className="text-yellow-500" />
              {credits.toFixed(2)}
            </p>
            <div className="mt-1 border-t border-yellow-600/30 pt-1">
              <p className="text-yellow-600/70 text-xs">TOT. PUNTATA:</p>
              <p className="text-yellow-500 font-bold flex items-center justify-center gap-1 text-sm">
                <Zap size={14} />
                {currentBet.toFixed(1)}
              </p>
              <p className="text-yellow-600/50 text-xs mt-0.5">(click per cambiare)</p>
            </div>
          </div>

          {/* Ultima vincita */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-2 md:p-3 text-center border border-yellow-600/30">
            <p className="text-yellow-500 font-semibold text-xs mb-1">ULTIMA VINCITA:</p>
            <p className={`text-2xl md:text-3xl font-bold flex items-center justify-center gap-1 ${
              currentWin > 0 ? 'text-yellow-400 animate-pulse' : 'text-gray-500'
            }`}>
              <Trophy size={20} className={currentWin > 0 ? 'text-yellow-500' : 'text-gray-600'} />
              {currentWin.toFixed(2)}
            </p>
          </div>

          {/* Controlli Auto Spin / Turbo */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl p-2 border border-blue-600/50 flex flex-col gap-1">
            <button
              onClick={() => setTurboMode(!turboMode)}
              disabled={isSpinning}
              className={`
                flex-1 rounded-lg font-bold transition-all text-sm md:text-base
                ${turboMode 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                  : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50'
                }
                ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Zap className="inline mr-1" size={16} />
              TURBO
            </button>
            
            <button
              onClick={() => {
                if (autoSpinActive) {
                  stopAutoSpin();
                } else {
                  setShowMenu(true);
                }
              }}
              disabled={isSpinning && !autoSpinActive}
              className={`
                flex-1 rounded-lg font-bold transition-all text-sm md:text-base
                ${autoSpinActive 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600'
                }
                ${isSpinning && !autoSpinActive ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {autoSpinActive ? (
                <>
                  <X className="inline mr-1" size={16} />
                  STOP ({autoSpinCount})
                </>
              ) : (
                <>AUTO<br/>SPIN</>
              )}
            </button>
          </div>
        </div>

        {/* Pulsante SPIN - COMPATTO */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || credits < currentBet || showSymbolSelection}
          className={`
            w-full mt-3 py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl transition-all
            ${isSpinning || credits < currentBet || showSymbolSelection
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-green-500/50'
            }
          `}
        >
          {isSpinning ? (
            <span className="flex items-center justify-center gap-2">
              <Zap className="animate-spin" />
              SPIN...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              ▶ SPIN!
            </span>
          )}
        </button>
      </div>
    </div>
  </div>

  {/* Menu Auto Spin */}
  {showMenu && (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border-2 border-yellow-600">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">AUTO SPIN</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[10, 20, 30, 50, 100].map(count => (
            <button
              key={count}
              onClick={() => startAutoSpin(count)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 rounded-lg font-bold"
            >
              {count} GIRI
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowMenu(false)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold"
        >
          CHIUDI
        </button>
      </div>
    </div>
  )}

  {/* Tabella pagamenti */}
  {showPaytable && (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-4xl w-full border-2 border-yellow-600 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-yellow-400">TABELLA PAGAMENTI</h3>
          <button
            onClick={() => setShowPaytable(false)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(SYMBOLS).map(([key, symbol]) => (
            <div key={key} className="bg-slate-700/50 rounded-xl p-4 border border-yellow-600/30">
              <img src={symbol.img} alt={symbol.name} className="w-20 h-20 mx-auto mb-2" />
              <h4 className="text-yellow-400 font-bold text-center mb-2">{symbol.name}</h4>
              <div className="text-white text-sm space-y-1">
                <p>5x: <span className="text-yellow-400 font-bold">{symbol.pays[4]}</span></p>
                <p>4x: <span className="text-yellow-400 font-bold">{symbol.pays[3]}</span></p>
                <p>3x: <span className="text-yellow-400 font-bold">{symbol.pays[2]}</span></p>
              </div>
              {symbol.scatter && <p className="text-green-400 text-xs mt-2">✓ SCATTER</p>}
              {symbol.wild && <p className="text-purple-400 text-xs mt-1">✓ WILD</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-900/30 border border-yellow-600 rounded-xl p-4">
          <h4 className="text-yellow-400 font-bold mb-2">REGOLE:</h4>
          <ul className="text-white text-sm space-y-1">
            <li>• 3+ LIBRI attivano 10 FREE SPINS</li>
            <li>• Durante i FREE SPINS, scegli un simbolo che si espande</li>
            <li>• Il simbolo expanding paga su linee non consecutive (×10 vincita)</li>
            <li>• LIBRO = WILD (sostituisce altri simboli) e SCATTER</li>
            <li>• 10 linee di pagamento fisse</li>
          </ul>
        </div>
      </div>
    </div>
  )}

  <style jsx>{`
    @keyframes spin-reel {
      0%, 100% { transform: translateY(0) rotateX(0deg); }
      50% { transform: translateY(-10px) rotateX(180deg); }
    }
    .animate-spin-reel {
      animation: spin-reel 0.5s ease-in-out infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 3s infinite;
    }
  `}</style>
</div>
```

);
}

export default InfernoFortuneSlot;
