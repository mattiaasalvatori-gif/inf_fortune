import React, { useState, useRef, useEffect } from 'react';
import { Flame, ArrowLeft, Volume2, Settings, Trophy, Sparkles, Zap, X } from 'lucide-react';

// === DATI SIMBOLI ===
const SYMBOLS = {
  book: {
    name: 'Book',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531693/book_of_dante_uzsqmv.png',
    payout: { 5: 200, 4: 20, 3: 2 },
    isScatter: true,
    isWild: true
  },
  dante: {
    name: 'Dante',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531692/dante_eqtbp2.png',
    payout: { 5: 500, 4: 100, 3: 40, 2: 5 }
  },
  beatrice: {
    name: 'Beatrice',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531693/beatrice_jvqh0p.png',
    payout: { 5: 200, 4: 50, 3: 15, 2: 3 }
  },
  virgilio: {
    name: 'Virgilio',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531692/virgilio_qxbqal.png',
    payout: { 5: 150, 4: 40, 3: 10 }
  },
  caronte: {
    name: 'Caronte',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531692/caronte_ctebsb.png',
    payout: { 5: 150, 4: 40, 3: 10 }
  },
  cerberus: {
    name: 'Cerberus',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531692/cerberus_pkqcbz.png',
    payout: { 5: 100, 4: 25, 3: 5 }
  },
  coin: {
    name: 'Coin',
    image: 'https://res.cloudinary.com/dzwaridrj/image/upload/v1739531692/coin_rqw44w.png',
    payout: { 5: 100, 4: 25, 3: 5 }
  },
  ace: {
    name: 'Ace',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZEODQzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkYwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQzQ4QjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIxMDUiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiIHN0cm9rZT0iIzZBM0UwMCIgc3Ryb2tlLXdpZHRoPSIzIj5BPC90ZXh0Pgo8L3N2Zz4=',
    payout: { 5: 150, 4: 40, 3: 10 }
  },
  king: {
    name: 'King',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZEODQzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkYwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQzQ4QjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIxMDUiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiIHN0cm9rZT0iIzZBM0UwMCIgc3Ryb2tlLXdpZHRoPSIzIj5LPC90ZXh0Pgo8L3N2Zz4=',
    payout: { 5: 150, 4: 40, 3: 10 }
  },
  queen: {
    name: 'Queen',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZEODQzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkYwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQzQ4QjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIxMDUiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiIHN0cm9rZT0iIzZBM0UwMCIgc3Ryb2tlLXdpZHRoPSIzIj5RPC90ZXh0Pgo8L3N2Zz4=',
    payout: { 5: 100, 4: 25, 3: 5 }
  },
  jack: {
    name: 'Jack',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZEODQzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkYwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQzQ4QjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIxMDUiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJ1cmwoI2dvbGRHcmFkaWVudCkiIHN0cm9rZT0iIzZBM0UwMCIgc3Ryb2tlLXdpZHRoPSIzIj5KPC90ZXh0Pgo8L3N2Zz4=',
    payout: { 5: 100, 4: 25, 3: 5 }
  },
  ten: {
    name: 'Ten',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZEODQzO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkYwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojQzQ4QjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHRleHQgeD0iNTAlIiB5PSI1NSUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSI4NSIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9InVybCgjZ29sZEdyYWRpZW50KSIgc3Ryb2tlPSIjNkEzRTAwIiBzdHJva2Utd2lkdGg9IjMiPjEwPC90ZXh0Pgo8L3N2Zz4=',
    payout: { 5: 100, 4: 25, 3: 5 }
  }
};

const SYMBOL_KEYS = Object.keys(SYMBOLS);

// === LINEE DI PAGAMENTO BOOK OF RA ===
const PAYLINES = [
  [1, 1, 1, 1, 1],  // Linea 1: centro
  [0, 0, 0, 0, 0],  // Linea 2: alto
  [2, 2, 2, 2, 2],  // Linea 3: basso
  [0, 1, 2, 1, 0],  // Linea 4: V
  [2, 1, 0, 1, 2],  // Linea 5: ^ rovesciato
  [1, 0, 0, 0, 1],  // Linea 6: W alto
  [1, 2, 2, 2, 1],  // Linea 7: M basso
  [0, 0, 1, 2, 2],  // Linea 8: scala giu
  [2, 2, 1, 0, 0],  // Linea 9: scala su
  [1, 0, 1, 2, 1]   // Linea 10: zigzag
];

const InfernosFortuneSlot = () => {
  const [credits, setCredits] = useState(150);
  const [bet, setBet] = useState(0.5);
  const [lastWin, setLastWin] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState([
    [SYMBOL_KEYS[0], SYMBOL_KEYS[1], SYMBOL_KEYS[2]],
    [SYMBOL_KEYS[3], SYMBOL_KEYS[4], SYMBOL_KEYS[5]],
    [SYMBOL_KEYS[6], SYMBOL_KEYS[7], SYMBOL_KEYS[8]],
    [SYMBOL_KEYS[9], SYMBOL_KEYS[10], SYMBOL_KEYS[0]],
    [SYMBOL_KEYS[1], SYMBOL_KEYS[2], SYMBOL_KEYS[3]]
  ]);
  const [winningCells, setWinningCells] = useState([]);
  const [scatterCount, setScatterCount] = useState(0);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [freeSpinsMode, setFreeSpinsMode] = useState(false);
  const [expandingSymbol, setExpandingSymbol] = useState(null);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showPaytable, setShowPaytable] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const autoSpinRef = useRef(null);

  const spinCost = bet * 10;

  const getRandomSymbol = () => {
    return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
  };

  const calculateWin = (finalReels) => {
    let totalWin = 0;
    let newWinningCells = [];
    let scatters = 0;

    finalReels.forEach(reel => {
      reel.forEach(symbol => {
        if (SYMBOLS[symbol].isScatter) {
          scatters++;
        }
      });
    });

    setScatterCount(scatters);

    if (scatters >= 3) {
      if (!freeSpinsMode) {
        setFreeSpinsRemaining(10);
        setFreeSpinsMode(true);
        const eligibleSymbols = SYMBOL_KEYS.filter(key => !SYMBOLS[key].isScatter && !SYMBOLS[key].isWild);
        const randomSymbol = eligibleSymbols[Math.floor(Math.random() * eligibleSymbols.length)];
        setExpandingSymbol(randomSymbol);
      } else {
        setFreeSpinsRemaining(prev => prev + 10);
      }
    }

    PAYLINES.forEach((line) => {
      const lineSymbols = line.map((row, reelIndex) => finalReels[reelIndex][row]);
      
      let matchCount = 1;
      let matchSymbol = lineSymbols[0];
      
      if (SYMBOLS[matchSymbol].isWild) {
        const nextNonWild = lineSymbols.find(s => !SYMBOLS[s].isWild);
        if (nextNonWild) matchSymbol = nextNonWild;
      }

      for (let i = 1; i < lineSymbols.length; i++) {
        const currentSymbol = lineSymbols[i];
        if (currentSymbol === matchSymbol || SYMBOLS[currentSymbol].isWild) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const symbolPayout = SYMBOLS[matchSymbol].payout[matchCount] || 0;
        totalWin += symbolPayout * bet;

        for (let i = 0; i < matchCount; i++) {
          newWinningCells.push(`${i}-${line[i]}`);
        }
      }
    });

    if (freeSpinsMode && expandingSymbol) {
      const expandPositions = [];
      finalReels.forEach((reel, reelIndex) => {
        reel.forEach((symbol) => {
          if (symbol === expandingSymbol) {
            expandPositions.push(reelIndex);
          }
        });
      });

      expandPositions.forEach(reelIndex => {
        [0, 1, 2].forEach(rowIndex => {
          newWinningCells.push(`${reelIndex}-${rowIndex}`);
        });
      });

      if (expandPositions.length > 0) {
        const symbolPayout = SYMBOLS[expandingSymbol].payout[5] || SYMBOLS[expandingSymbol].payout[4] || SYMBOLS[expandingSymbol].payout[3] || 0;
        totalWin += symbolPayout * bet * expandPositions.length;
      }
    }

    setWinningCells(newWinningCells);
    setLastWin(totalWin);
    setCredits(prev => prev + totalWin);

    if (totalWin > 0) {
      setShowWinMessage(true);
      setTimeout(() => setShowWinMessage(false), 2000);
    }

    return totalWin;
  };

  const handleSpin = () => {
    if (isSpinning || credits < spinCost) return;

    setIsSpinning(true);
    setWinningCells([]);
    setScatterCount(0);
    setShowWinMessage(false);

    if (!freeSpinsMode) {
      setCredits(prev => prev - spinCost);
    } else {
      setFreeSpinsRemaining(prev => prev - 1);
    }

    const spinDuration = turboMode ? 800 : 2000;
    const newReels = reels.map(() => [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);

    setTimeout(() => {
      setReels(newReels);
      
      setTimeout(() => {
        setIsSpinning(false);
        calculateWin(newReels);

        if (freeSpinsMode && freeSpinsRemaining === 1) {
          setFreeSpinsMode(false);
          setExpandingSymbol(null);
        }
      }, turboMode ? 200 : 500);
    }, spinDuration);
  };

  useEffect(() => {
    if (autoSpinCount > 0 && !isSpinning && credits >= spinCost) {
      autoSpinRef.current = setTimeout(() => {
        handleSpin();
        setAutoSpinCount(prev => prev - 1);
      }, turboMode ? 1000 : 2000);
    }

    return () => {
      if (autoSpinRef.current) {
        clearTimeout(autoSpinRef.current);
      }
    };
  });

  const startAutoSpin = (count) => {
    setAutoSpinCount(count);
  };

  const stopAutoSpin = () => {
    setAutoSpinCount(0);
    if (autoSpinRef.current) {
      clearTimeout(autoSpinRef.current);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4" style={{
      background: 'linear-gradient(to bottom, #8B0000 0%, #2d0a0a 50%, #1a0505 100%)'
    }}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="relative mb-2 sm:mb-4">
          <div className="bg-gradient-to-r from-red-900 via-red-700 to-red-900 rounded-t-lg p-2 sm:p-4 shadow-2xl border-b-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-yellow-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold border-2 border-yellow-600 shadow-lg flex items-center gap-2 text-sm sm:text-base"
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">MENU</span>
              </button>

              <div className="text-center">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 drop-shadow-lg tracking-wider">
                  INFERNO'S FORTUNE
                </h1>
                <p className="text-yellow-400 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-2 mt-1">
                  <Sparkles size={12} className="sm:w-4 sm:h-4" />
                  DELUXE EDITION
                  <Sparkles size={12} className="sm:w-4 sm:h-4" />
                </p>
              </div>

              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-yellow-300 p-1.5 sm:p-2 rounded-lg border-2 border-yellow-600 shadow-lg"
                >
                  <Volume2 size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-yellow-300 p-1.5 sm:p-2 rounded-lg border-2 border-yellow-600 shadow-lg"
                >
                  <Settings size={16} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="relative">
          {showWinMessage && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-red-900 px-6 py-3 sm:px-10 sm:py-5 rounded-2xl font-bold text-2xl sm:text-4xl shadow-2xl border-4 border-yellow-600 animate-pulse">
              <div className="flex items-center gap-2 sm:gap-3">
                <Flame className="text-red-600 w-6 h-6 sm:w-8 sm:h-8" />
                GIRA E VINCI
                <Flame className="text-red-600 w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-xl p-2 sm:p-4 shadow-2xl border-4 border-yellow-600">
            <div className="grid grid-cols-5 gap-1 sm:gap-2 bg-gradient-to-br from-gray-900 to-black p-2 sm:p-3 rounded-lg border-2 border-yellow-700">
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="flex flex-col gap-1 sm:gap-2">
                  {reel.map((symbol, rowIndex) => {
                    const isWinning = winningCells.includes(`${reelIndex}-${rowIndex}`);
                    const isScatter = SYMBOLS[symbol].isScatter;

                    return (
                      <div
                        key={rowIndex}
                        className={`
                          aspect-square bg-gradient-to-br from-red-900 to-red-950 rounded-md sm:rounded-lg 
                          border-2 sm:border-3 border-yellow-700 flex items-center justify-center 
                          transition-all duration-300 relative overflow-hidden
                          ${isWinning ? 'ring-4 ring-yellow-400 shadow-2xl shadow-yellow-500/50 scale-105' : ''}
                          ${isScatter ? 'ring-2 ring-purple-500' : ''}
                        `}
                      >
                        <img 
                          src={SYMBOLS[symbol].image} 
                          alt={SYMBOLS[symbol].name}
                          className={`
                            w-full h-full object-contain p-0.5 sm:p-1
                            ${isWinning ? 'animate-pulse' : ''}
                            transition-opacity duration-300
                          `}
                        />
                        {isScatter && scatterCount >= 3 && (
                          <div className="absolute inset-0 bg-purple-500/30 animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Indicatori Scatter */}
            {scatterCount > 0 && (
              <div className="flex justify-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                {[...Array(scatterCount)].map((_, i) => (
                  <Flame key={i} className="text-red-500 w-4 h-4 sm:w-6 sm:h-6 animate-bounce" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="mt-2 sm:mt-4 bg-gradient-to-br from-blue-950 to-blue-900 rounded-b-lg p-2 sm:p-3 shadow-2xl border-4 border-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 sm:mb-3">
            {/* Credito */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 border-2 border-slate-600">
              <div className="text-yellow-400 text-xs font-semibold mb-1">CREDITO:</div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-300 text-base">💰</span>
                <div className="text-white text-lg font-bold">{credits.toFixed(2)}</div>
              </div>
              <div className="mt-1 pt-1 border-t border-slate-700">
                <div className="text-yellow-400 text-xs font-semibold mb-1">TOT. PUNTATA:</div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-300 text-sm">💳</span>
                  <div className="text-yellow-400 text-base font-bold">{spinCost.toFixed(1)}</div>
                </div>
                <div className="text-gray-400 text-xs mt-0.5">(click per cambiare)</div>
              </div>
            </div>

            {/* Ultima Vincita */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 border-2 border-slate-600">
              <div className="text-yellow-400 text-xs font-semibold mb-1">ULTIMA VINCITA:</div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-300 text-base">💰</span>
                <div className={`text-2xl font-bold ${lastWin > 0 ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`}>
                  {lastWin.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Controlli */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-2 border-2 border-blue-600 flex flex-col gap-1">
              <button
                onClick={() => setTurboMode(!turboMode)}
                className={`${turboMode ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-slate-600 to-slate-700'} text-white px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-all text-sm`}
              >
                <Zap size={16} />
                TURBO
              </button>
              <button
                onClick={() => autoSpinCount > 0 ? stopAutoSpin() : startAutoSpin(10)}
                className={`${autoSpinCount > 0 ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'} text-white px-3 py-1.5 rounded-lg font-bold transition-all text-sm`}
              >
                {autoSpinCount > 0 ? `STOP (${autoSpinCount})` : 'AUTO SPIN'}
              </button>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || credits < spinCost}
            className={`
              w-full py-2.5 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all shadow-2xl
              ${(isSpinning || credits < spinCost)
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white'
              }
            `}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-lg">⏳</span> SPIN...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ▶ SPIN!
              </span>
            )}
          </button>
        </div>

        {/* Modals */}
        {showMenu && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-4 sm:p-6 max-w-md w-full border-4 border-yellow-600 relative">
              <button
                onClick={() => setShowMenu(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-yellow-400 hover:text-yellow-300"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 sm:mb-6">MENU</h2>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => { setShowPaytable(true); setShowMenu(false); }}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-yellow-300 px-4 py-2 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Trophy size={20} />
                  TABELLA PAGAMENTI
                </button>
                <button
                  onClick={() => { setShowSettings(true); setShowMenu(false); }}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Settings size={20} />
                  IMPOSTAZIONI
                </button>
              </div>
            </div>
          </div>
        )}

        {showPaytable && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-xl p-4 sm:p-6 max-w-2xl w-full border-4 border-yellow-600 relative my-4">
              <button
                onClick={() => setShowPaytable(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-yellow-400 hover:text-yellow-300"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 sm:mb-6">TABELLA PAGAMENTI</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto">
                {Object.entries(SYMBOLS).map(([key, symbol]) => (
                  <div key={key} className="bg-black/40 rounded-lg p-2 sm:p-3 border-2 border-yellow-700">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <img src={symbol.image} alt={symbol.name} className="w-10 h-10 sm:w-12 sm:h-12" />
                      <div>
                        <div className="text-yellow-400 font-bold text-sm sm:text-base">{symbol.name}</div>
                        {symbol.isScatter && <div className="text-purple-400 text-xs">SCATTER</div>}
                        {symbol.isWild && <div className="text-green-400 text-xs">WILD</div>}
                      </div>
                    </div>
                    <div className="text-white text-xs sm:text-sm">
                      {Object.entries(symbol.payout).map(([count, payout]) => (
                        <div key={count} className="flex justify-between">
                          <span>{count}x:</span>
                          <span className="text-yellow-400">{payout}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl p-4 sm:p-6 max-w-md w-full border-4 border-blue-600 relative">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-blue-400 hover:text-blue-300"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-4 sm:mb-6">IMPOSTAZIONI</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-white font-bold mb-2 block text-sm sm:text-base">Puntata per linea:</label>
                  <select
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border-2 border-slate-600"
                  >
                    <option value={0.5}>0.5</option>
                    <option value={1}>1.0</option>
                    <option value={2}>2.0</option>
                    <option value={5}>5.0</option>
                    <option value={10}>10.0</option>
                  </select>
                </div>
                <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                  <span className="text-white font-bold text-sm sm:text-base">Modalita Turbo</span>
                  <button
                    onClick={() => setTurboMode(!turboMode)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold transition-all text-sm sm:text-base ${
                      turboMode ? 'bg-purple-600' : 'bg-slate-600'
                    } text-white`}
                  >
                    {turboMode ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfernosFortuneSlot;
