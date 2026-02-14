import React, { useState } from 'react';
import { Flame, ArrowLeft, Volume2, Settings, Trophy, Sparkles } from 'lucide-react';

// === DATI SIMBOLI ===
const SYMBOLS = {
  dante: {
    name: 'Dante',
    type: 'high',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769968270/1_Esploratore_Dante_a8kswr.png',
    pays: [0, 0, 15, 80, 250], // RIDOTTI per RTP 12%
    canExpand: true,
    weight: 1 // RARISSIMO (1%)
  },
  book: {
    name: 'Libro',
    type: 'wild-scatter',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/2_Libro_Commedia_qbcgfd.png',
    pays: [0, 0, 1, 5, 25], // RIDOTTI drasticamente
    scatter: true,
    wild: true,
    weight: 1 // Scatter MOLTO raro (1%)
  },
  beatrice: {
    name: 'Beatrice',
    type: 'high',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958222/3_Faraone_Beatrice_fimpos.png',
    pays: [0, 0, 8, 50, 150], // RIDOTTI
    canExpand: true,
    weight: 2 // Raro (2%)
  },
  virgilio: {
    name: 'Virgilio',
    type: 'high',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/4_Iside_Virgilio_tmkqfn.png',
    pays: [0, 0, 8, 50, 150], // RIDOTTI
    canExpand: true,
    weight: 2 // Raro (2%)
  },
  caronte: {
    name: 'Caronte',
    type: 'medium',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/5_Scarabeo_Moneta_caronte_us2hwz.png',
    pays: [0, 0, 5, 25, 80], // RIDOTTI
    canExpand: true,
    weight: 4 // Poco comune (4%)
  },
  A: {
    name: 'Asso',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958220/6_Asso_t5xac7.png',
    pays: [0, 0, 2, 8, 25], // RIDOTTI
    canExpand: true,
    weight: 18 // Comune (18%)
  },
  K: {
    name: 'Re',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958219/7_Re_iwnwiy.png',
    pays: [0, 0, 2, 8, 25], // RIDOTTI
    canExpand: true,
    weight: 18 // Comune (18%)
  },
  Q: {
    name: 'Donna',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958221/8_Donna_gmbq9e.png',
    pays: [0, 0, 2, 8, 25], // RIDOTTI
    canExpand: true,
    weight: 20 // Molto comune (20%)
  },
  J: {
    name: 'Fante',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958221/9_Fante_wdsxdg.png',
    pays: [0, 0, 2, 8, 25], // RIDOTTI
    canExpand: true,
    weight: 20 // Molto comune (20%)
  },
  Ten: {
    name: 'Dieci',
    type: 'low',
    img: 'https://res.cloudinary.com/dxqqeun0c/image/upload/v1769958225/10_Dieci_uly2im.png',
    pays: [0, 0, 2, 8, 25], // RIDOTTI
    canExpand: true,
    weight: 14 // Comune (14%)
  }
};

// Array ponderato per generazione simboli (RTP 12%)
const createWeightedSymbolPool = () => {
  const pool = [];
  Object.keys(SYMBOLS).forEach(key => {
    const weight = SYMBOLS[key].weight;
    for (let i = 0; i < weight; i++) {
      pool.push(key);
    }
  });
  return pool;
};

const SYMBOL_POOL = createWeightedSymbolPool();

// Definizione delle 10 linee di pagamento
const PAYLINES = [
  [[0,1], [1,1], [2,1], [3,1], [4,1]], // Linea 1: centro
  [[0,0], [1,0], [2,0], [3,0], [4,0]], // Linea 2: alto
  [[0,2], [1,2], [2,2], [3,2], [4,2]], // Linea 3: basso
  [[0,0], [1,1], [2,2], [3,1], [4,0]], // Linea 4: V
  [[0,2], [1,1], [2,0], [3,1], [4,2]], // Linea 5: ^
  [[0,1], [1,0], [2,0], [3,0], [4,1]], // Linea 6
  [[0,1], [1,2], [2,2], [3,2], [4,1]], // Linea 7
  [[0,0], [1,0], [2,1], [3,2], [4,2]], // Linea 8
  [[0,2], [1,2], [2,1], [3,0], [4,0]], // Linea 9
  [[0,1], [1,0], [2,1], [3,2], [4,1]]  // Linea 10
];

function InfernoFortuneSlot() {
  const [credits, setCredits] = useState(500);
  const [currentBet, setCurrentBet] = useState(10);
  const [lines, setLines] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWin, setCurrentWin] = useState(0);
  
  // Free Spins
  const [freeSpinsMode, setFreeSpinsMode] = useState(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [expandingSymbol, setExpandingSymbol] = useState(null);
  const [freeSpinsTotalWin, setFreeSpinsTotalWin] = useState(0);
  
  // Animazioni
  const [showScatterAnimation, setShowScatterAnimation] = useState(false);
  const [showExpandingSelection, setShowExpandingSelection] = useState(false);
  const [expandingSelectionSymbols, setExpandingSelectionSymbols] = useState([]);
  const [currentExpandingIndex, setCurrentExpandingIndex] = useState(0);
  
  // Stato rulli
  const [reels, setReels] = useState([
    ['virgilio', 'K', 'beatrice'],
    ['Q', 'dante', 'A'],
    ['caronte', 'virgilio', 'J'],
    ['book', 'Q', 'Ten'],
    ['beatrice', 'K', 'virgilio']
  ]);
  
  // Rulli in animazione
  const [spinningReels, setSpinningReels] = useState([]);
  const [reelsStopped, setReelsStopped] = useState([true, true, true, true, true]);
  
  // Simboli vincenti
  const [winningPositions, setWinningPositions] = useState([]);
  const [winningLines, setWinningLines] = useState([]);

  // === FUNZIONE: Genera simbolo casuale ponderato ===
  const generateRandomSymbol = () => {
    return SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
  };

  // === FUNZIONE: Genera stack di simboli per animazione ===
  const generateSpinningStack = (finalSymbol) => {
    const stack = [];
    for (let i = 0; i < 20; i++) {
      stack.push(generateRandomSymbol());
    }
    stack.push(finalSymbol);
    return stack;
  };

  // === FUNZIONE: Genera nuovi rulli ===
  const generateNewReels = () => {
    return Array(5).fill(null).map(() => 
      Array(3).fill(null).map(() => generateRandomSymbol())
    );
  };

  // === FUNZIONE: Conta scatter ===
  const countScatters = (reelGrid) => {
    let count = 0;
    const positions = [];
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

  // === FUNZIONE: Controlla vincita su una linea ===
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
        return { symbol: expandingSymbol, count: expandingCount, payout };
      }
    }
    
    if (matchCount >= 3) {
      const payout = SYMBOLS[firstSymbol].pays[matchCount - 1] || 0;
      return { symbol: firstSymbol, count: matchCount, payout };
    }
    
    return null;
  };

  // === FUNZIONE: Calcola tutte le vincite ===
  const calculateWins = (reelGrid) => {
    let totalPayout = 0;
    let winLines = [];
    let winPositions = [];
    
    const { count: scatterCount, positions: scatterPositions } = countScatters(reelGrid);
    if (scatterCount >= 3) {
      const scatterPayout = SYMBOLS.book.pays[scatterCount - 1] || 0;
      totalPayout += scatterPayout * currentBet * lines;
      winPositions.push(...scatterPositions);
    }
    
    for (let i = 0; i < lines; i++) {
      const lineWin = checkLineWin(reelGrid, PAYLINES[i], expandingSymbol);
      if (lineWin) {
        totalPayout += lineWin.payout * currentBet;
        winLines.push(i);
        
        for (let j = 0; j < lineWin.count; j++) {
          const [reelIdx, rowIdx] = PAYLINES[i][j];
          if (!winPositions.some(([r, ro]) => r === reelIdx && ro === rowIdx)) {
            winPositions.push([reelIdx, rowIdx]);
          }
        }
      }
    }
    
    return { totalPayout, winLines, winPositions, scatterCount };
  };

  // === FUNZIONE: Espandi simboli ===
  const expandSymbols = (reelGrid, expandingSymbol) => {
    const newGrid = reelGrid.map(reel => [...reel]);
    
    newGrid.forEach((reel, reelIdx) => {
      if (reel.includes(expandingSymbol)) {
        newGrid[reelIdx] = [expandingSymbol, expandingSymbol, expandingSymbol];
      }
    });
    
    return newGrid;
  };

  // === ANIMAZIONE: Selezione simbolo expanding ===
  const animateExpandingSelection = async (finalSymbol) => {
    const expandableSymbols = Object.keys(SYMBOLS).filter(key => 
      key !== 'book' && SYMBOLS[key].canExpand
    );
    
    setExpandingSelectionSymbols(expandableSymbols);
    setShowExpandingSelection(true);
    setCurrentExpandingIndex(0);
    
    // Rotazione veloce per 3 secondi
    const totalSteps = 30;
    for (let i = 0; i < totalSteps; i++) {
      setCurrentExpandingIndex(Math.floor(Math.random() * expandableSymbols.length));
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Rallenta e ferma sul simbolo finale
    const finalIndex = expandableSymbols.indexOf(finalSymbol);
    for (let i = 0; i < 5; i++) {
      setCurrentExpandingIndex(finalIndex);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowExpandingSelection(false);
  };

  // === FUNZIONE: Spin con animazioni realistiche ===
  const handleSpin = async () => {
    if (isSpinning) return;
    
    const betAmount = currentBet * lines;
    if (!freeSpinsMode && credits < betAmount) return;
    
    setIsSpinning(true);
    setWinningPositions([]);
    setWinningLines([]);
    setCurrentWin(0);
    
    if (!freeSpinsMode) {
      setCredits(prev => prev - betAmount);
    }
    
    // Genera risultati finali
    let finalReels = generateNewReels();
    
    // Reset stato rulli
    setReelsStopped([false, false, false, false, false]);
    
    // Genera stack di simboli per ogni posizione dei rulli
    const spinStacks = finalReels.map((reel) => 
      reel.map((finalSymbol) => 
        generateSpinningStack(finalSymbol)
      )
    );
    setSpinningReels(spinStacks);
    
    // Ferma i rulli uno alla volta (effetto cascata)
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 300 + (i * 200)));
      setReelsStopped(prev => {
        const newStopped = [...prev];
        newStopped[i] = true;
        return newStopped;
      });
    }
    
    // Attesa finale
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Imposta risultati finali
    setReels(finalReels);
    
    // Se in modalità free spin, espandi simbolo
    if (freeSpinsMode && expandingSymbol) {
      await new Promise(resolve => setTimeout(resolve, 500));
      finalReels = expandSymbols(finalReels, expandingSymbol);
      setReels(finalReels);
    }
    
    // Calcola vincite
    await new Promise(resolve => setTimeout(resolve, 300));
    const { totalPayout, winLines, winPositions, scatterCount } = calculateWins(finalReels);
    
    setWinningLines(winLines);
    setWinningPositions(winPositions);
    setCurrentWin(totalPayout);
    
    if (totalPayout > 0) {
      setCredits(prev => prev + totalPayout);
      if (freeSpinsMode) {
        setFreeSpinsTotalWin(prev => prev + totalPayout);
      }
    }
    
    // Gestione scatter (3+ libri)
    if (scatterCount >= 3) {
      // Animazione scatter
      setShowScatterAnimation(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowScatterAnimation(false);
      
      if (freeSpinsMode) {
        setFreeSpinsRemaining(prev => prev + 10);
      } else {
        // Attiva free spins con animazione simbolo
        const expandableSymbols = Object.keys(SYMBOLS).filter(key => 
          key !== 'book' && SYMBOLS[key].canExpand
        );
        const randomSymbol = expandableSymbols[Math.floor(Math.random() * expandableSymbols.length)];
        
        setExpandingSymbol(randomSymbol);
        setFreeSpinsMode(true);
        setFreeSpinsRemaining(10);
        setFreeSpinsTotalWin(0);
        
        await animateExpandingSelection(randomSymbol);
        
        setIsSpinning(false);
        setTimeout(() => handleSpin(), 500);
        return;
      }
    }
    
    // Gestione free spins
    if (freeSpinsMode) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const remaining = freeSpinsRemaining - 1;
      setFreeSpinsRemaining(remaining);
      
      if (remaining > 0) {
        setIsSpinning(false);
        setTimeout(() => handleSpin(), 500);
      } else {
        endFreeSpins();
      }
    } else {
      setIsSpinning(false);
    }
  };

  // === FUNZIONE: Termina Free Spins ===
  const endFreeSpins = () => {
    setFreeSpinsMode(false);
    setExpandingSymbol(null);
    setIsSpinning(false);
    
    setTimeout(() => {
      alert(`FREE SPINS COMPLETATI!\n\nVincita Totale: ${freeSpinsTotalWin.toFixed(2)} crediti`);
      setFreeSpinsTotalWin(0);
    }, 500);
  };

  // === FUNZIONE: Cambia bet ===
  const changeBet = (amount) => {
    if (isSpinning) return;
    const newBet = Math.max(1, Math.min(500, currentBet + amount));
    setCurrentBet(newBet);
  };

  // === FUNZIONE: Cambia linee ===
  const changeLines = (amount) => {
    if (isSpinning) return;
    const newLines = Math.max(1, Math.min(10, lines + amount));
    setLines(newLines);
  };

  const totalBet = currentBet * lines;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black flex flex-col relative overflow-hidden">
      {/* Sfondo animato */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-orange-600 via-red-600 to-transparent animate-pulse"></div>
      </div>

      {/* ANIMAZIONE SCATTER */}
      {showScatterAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
          <div className="text-center animate-scale-pulse">
            <div className="text-8xl mb-6 animate-bounce">📕</div>
            <div className="text-6xl font-black text-yellow-300 mb-4 animate-glow">
              FREE SPINS!
            </div>
            <div className="text-3xl text-white font-bold">
              10 Giri Gratis Attivati!
            </div>
            <div className="flex gap-4 justify-center mt-8">
              <Sparkles className="w-16 h-16 text-yellow-400 animate-spin-slow" />
              <Sparkles className="w-16 h-16 text-orange-400 animate-spin-slow" style={{animationDelay: '0.2s'}} />
              <Sparkles className="w-16 h-16 text-red-400 animate-spin-slow" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
        </div>
      )}

      {/* ANIMAZIONE SELEZIONE SIMBOLO EXPANDING */}
      {showExpandingSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center">
            <div className="text-4xl font-black text-yellow-300 mb-8">
              SIMBOLO EXPANDING
            </div>
            <div className="w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 border-8 border-yellow-400 shadow-2xl animate-pulse-slow">
              {expandingSelectionSymbols.length > 0 && (
                <img 
                  src={SYMBOLS[expandingSelectionSymbols[currentExpandingIndex]].img}
                  alt="Simbolo"
                  className="w-full h-full object-contain animate-rotate-y"
                />
              )}
            </div>
            <div className="text-2xl text-white font-bold mt-6">
              {expandingSelectionSymbols.length > 0 && 
                SYMBOLS[expandingSelectionSymbols[currentExpandingIndex]].name}
            </div>
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
                <div className="text-white text-sm">Simbolo Expanding: {SYMBOLS[expandingSymbol].name}</div>
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
          
          {/* Container rulli */}
          <div className="relative bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 p-6 rounded-3xl shadow-2xl border-8 border-double border-yellow-600">
            
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-orange-600 px-12 py-3 rounded-t-2xl border-4 border-yellow-600 shadow-xl z-10">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
                <span className="text-2xl font-black text-yellow-300 tracking-wider">GIRA E VINCI</span>
                <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
              </div>
            </div>

            {/* Griglia rulli */}
            <div className="bg-gradient-to-b from-black via-gray-900 to-black rounded-2xl p-4 shadow-inner relative">
              
              {/* Numeri sinistra */}
              <div className="absolute -left-16 top-0 bottom-0 flex flex-col justify-around py-4 z-20">
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
              <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-around py-4 z-20">
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

              {/* 5 Rulli con animazione */}
              <div className="grid grid-cols-5 gap-2">
                {reels.map((reel, reelIndex) => (
                  <div key={reelIndex} className="flex flex-col gap-2 relative">
                    {reel.map((symbolKey, rowIndex) => {
                      const isWinning = winningPositions.some(
                        ([r, ro]) => r === reelIndex && ro === rowIndex
                      );
                      const isStopped = reelsStopped[reelIndex];
                      
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
                            relative
                            ${!isStopped ? 'animate-reel-spin' : ''}
                            ${isWinning ? 'border-green-400 animate-pulse-win scale-110 z-10' : 'border-yellow-600/50'}
                            ${isStopped && !isWinning ? 'hover:scale-105 hover:border-yellow-400' : ''}
                          `}
                        >
                          {/* Durante lo spin, mostra simboli che scorrono */}
                          {!isStopped && spinningReels[reelIndex] && spinningReels[reelIndex][rowIndex] ? (
                            <div className="animate-reel-scroll absolute inset-0 flex flex-col">
                              {spinningReels[reelIndex][rowIndex].map((sym, idx) => (
                                <div key={idx} className="flex-shrink-0 w-full h-full flex items-center justify-center">
                                  <img 
                                    src={SYMBOLS[sym].img}
                                    alt={SYMBOLS[sym].name}
                                    style={{
                                      width: '90%',
                                      height: '90%',
                                      objectFit: 'contain',
                                      padding: '4px'
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
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
                          )}
                        </div>
                      );
                    })}
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

          {/* Pannello controllo */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border-4 border-yellow-600">
            <div className="grid grid-cols-7 gap-4 items-center">
              
              <button className="bg-gradient-to-b from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-black py-4 px-6 rounded-xl shadow-lg border-2 border-yellow-400 transition-all active:scale-95">
                <div className="text-xs mb-1">MENU</div>
              </button>

              <div className="bg-gradient-to-b from-gray-700 to-gray-800 text-yellow-400 font-black py-2 px-4 rounded-xl shadow-lg border-2 border-gray-600">
                <div className="text-xs mb-1 text-gray-400 text-center">LINES</div>
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => changeLines(-1)}
                    disabled={isSpinning || freeSpinsMode}
                    className="text-yellow-400 hover:text-yellow-200 disabled:opacity-50"
                  >
                    ◀
                  </button>
                  <div className="text-2xl">{lines}</div>
                  <button 
                    onClick={() => changeLines(1)}
                    disabled={isSpinning || freeSpinsMode}
                    className="text-yellow-400 hover:text-yellow-200 disabled:opacity-50"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-700 to-gray-800 text-yellow-400 font-black py-2 px-4 rounded-xl shadow-lg border-2 border-gray-600">
                <div className="text-xs mb-1 text-gray-400 text-center">BET/LINE</div>
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => changeBet(-1)}
                    disabled={isSpinning || freeSpinsMode}
                    className="text-yellow-400 hover:text-yellow-200 disabled:opacity-50"
                  >
                    ◀
                  </button>
                  <div className="text-2xl">{currentBet}</div>
                  <button 
                    onClick={() => changeBet(1)}
                    disabled={isSpinning || freeSpinsMode}
                    className="text-yellow-400 hover:text-yellow-200 disabled:opacity-50"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-b from-red-800 to-red-900 text-yellow-300 font-black py-4 px-8 rounded-xl shadow-lg border-4 border-yellow-500">
                <div className="text-xs mb-1">TOTAL BET</div>
                <div className="text-3xl">{totalBet.toFixed(2)}</div>
              </div>

              <button 
                onClick={() => {
                  setCurrentBet(50);
                  setLines(10);
                }}
                disabled={isSpinning || freeSpinsMode}
                className="bg-gradient-to-b from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 text-white font-black py-4 px-6 rounded-xl shadow-lg border-2 border-orange-400 transition-all active:scale-95"
              >
                <div className="text-xs mb-1">MAX</div>
                <div className="text-lg">BET</div>
              </button>

              <button 
                disabled={true}
                className="bg-gradient-to-b from-gray-700 to-gray-800 opacity-50 text-yellow-400 font-black py-4 px-6 rounded-xl shadow-lg border-2 border-gray-600 cursor-not-allowed"
              >
                <div className="text-xs mb-1 text-gray-400">AUTO</div>
                <div className="text-lg">PLAY</div>
              </button>

              <button 
                onClick={handleSpin}
                disabled={isSpinning || (!freeSpinsMode && credits < totalBet)}
                className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-black py-4 px-8 rounded-xl shadow-lg border-4 border-green-400 disabled:border-gray-500 transition-all active:scale-95 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-sm mb-1">▶</div>
                  <div className="text-xl">{isSpinning ? 'SPIN...' : 'START'}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Display crediti */}
          <div className="mt-6 flex justify-between items-center px-4">
            <div className="bg-black/80 border-2 border-yellow-600 rounded-lg px-6 py-3">
              <div className="text-yellow-400 text-sm font-semibold mb-1">CREDITS</div>
              <div className="text-yellow-300 text-3xl font-black">{credits.toFixed(2)}</div>
            </div>

            <div className={`bg-black/80 border-2 rounded-lg px-6 py-3 transition-all ${
              currentWin > 0 ? 'border-green-400 animate-pulse' : 'border-yellow-600'
            }`}>
              <div className="text-yellow-400 text-sm font-semibold mb-1">WIN</div>
              <div className={`text-3xl font-black ${
                currentWin > 0 ? 'text-green-400' : 'text-gray-400'
              }`}>
                {currentWin.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animazioni */}
      <style>{`
        @keyframes reel-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        
        .animate-reel-scroll {
          animation: reel-scroll 0.15s linear infinite;
        }

        @keyframes reel-spin {
          0% { filter: blur(0px); }
          50% { filter: blur(2px); }
          100% { filter: blur(0px); }
        }
        
        .animate-reel-spin {
          animation: reel-spin 0.2s ease-in-out infinite;
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

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }

        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-scale-pulse {
          animation: scale-pulse 1s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(252, 211, 77, 0.8),
                         0 0 40px rgba(252, 211, 77, 0.6);
          }
          50% { 
            text-shadow: 0 0 30px rgba(252, 211, 77, 1),
                         0 0 60px rgba(252, 211, 77, 0.8);
          }
        }
        
        .animate-glow {
          animation: glow 1s ease-in-out infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes rotate-y {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .animate-rotate-y {
          animation: rotate-y 0.5s linear infinite;
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
