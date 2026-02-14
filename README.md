# 🎰 Inferno's Fortune - Slot Machine Game

Una slot machine a tema Inferno di Dante con meccaniche Book of Ra complete.

## ✨ Caratteristiche

- 🎮 Gioco base con 10 linee di pagamento
- 🎁 Modalità Free Spins con simbolo expanding
- 📕 Sistema Wild e Scatter (Libro della Commedia)
- 💰 Tabella pagamenti Book of Ra
- 🎬 Animazioni realistiche dei rulli
- ⚡ Celebrazione scatter con effetti visivi
- 🎯 Selezione simbolo expanding animata
- 🔥 Tema grafico Inferno (rosso/arancio/oro)

## 🚀 Deploy su Netlify

### Metodo 1: Via GitHub (Raccomandato)

1. **Carica su GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - Inferno's Fortune Slot"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/REPO-NAME.git
git push -u origin main
```

2. **Deploy su Netlify:**
   - Vai su https://app.netlify.com
   - "Add new site" → "Import an existing project"
   - Scegli GitHub → Autorizza
   - Seleziona il repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - "Deploy site"

3. **Deploy automatico:** Ogni push su GitHub rifarà automaticamente il build

### Metodo 2: Deploy Manuale (Drag & Drop)

1. **Build locale:**
```bash
npm install
npm run build
```

2. **Deploy:**
   - Vai su https://app.netlify.com/drop
   - Trascina la cartella `build` nella finestra
   - Il sito sarà online immediatamente

## 💻 Sviluppo Locale

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start
```

L'app si aprirà su http://localhost:3000

## 🎮 Come Giocare

### Gioco Base:
1. Imposta **BET/LINE** (puntata per linea, 1-500)
2. Imposta **LINES** (numero di linee attive, 1-10)
3. Click **START** per girare i rulli
4. I simboli vincenti si illuminano in verde
5. Le vincite vengono aggiunte ai crediti

### Free Spins:
1. Ottieni **3 o più simboli Libro** (scatter) ovunque sui rulli
2. Animazione di celebrazione scatter ⚡
3. Selezione casuale del **simbolo expanding** 🎯
4. **10 free spins** giocati automaticamente
5. Il simbolo expanding riempie l'intero rullo quando appare
6. 3+ scatter durante i free spins = **+10 free spins aggiuntivi**

## 🎨 Simboli e Pagamenti

| Simbolo | 5x | 4x | 3x |
|---------|-----|-----|-----|
| 👤 Dante | 5000 | 1000 | 100 |
| 📕 Libro (Wild+Scatter) | 200 | 20 | 2 |
| 😇 Beatrice | 2000 | 400 | 40 |
| 📜 Virgilio | 2000 | 400 | 40 |
| 🪙 Caronte | 750 | 150 | 30 |
| 🅰️ A, K, Q, J, 10 | 150 | 40 | 10 |

**Wild (Libro):** Sostituisce tutti i simboli e sceglie automaticamente la combinazione più alta.

**Scatter (Libro):** Paga ovunque sui rulli. 3+ = Free Spins!

## 🔧 Tecnologie

- React 18.2
- Tailwind CSS (via CDN)
- Lucide React (icone)
- React Scripts

## 📱 Browser Supportati

- Chrome (ultimi 2 versioni)
- Firefox (ultimi 2 versioni)
- Safari (ultimi 2 versioni)
- Edge (ultimi 2 versioni)

## 📄 Licenza

Progetto creato per scopi didattici e dimostrativi.

---

**Buona fortuna! 🔥🎰**
