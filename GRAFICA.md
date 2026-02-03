# 🚀 Istruzioni per Claude Code - Stile MetàHodos

## Prompt Completo per Claude Code

Copia e incolla questo prompt quando chiedi a Claude Code di creare o aggiornare la tua app:

---

## 📋 PROMPT PER CLAUDE CODE

```
Aggiorna/Crea questa applicazione usando rigorosamente lo stile MetàHodos.

=== PALETTE COLORI (OBBLIGATORIA) ===

Colori Primari:
- Arancione: #F89F5A (CTA, buttons, accenti)
- Rosa: #f06681 (elementi decorativi, titoli speciali)
- Verde: #8CC63F (successi, elementi positivi)

Colori Neutri:
- Grigio scuro: #3C3C3C (sfondi hero, footer, testo principale)
- Grigio medio: #4A4A4A (body text)
- Grigio chiaro: #F5F5F5 (sfondi alternati)
- Grigio border: #E0E0E0 (bordi form)
- Bianco: #FFFFFF

=== TIPOGRAFIA (OBBLIGATORIA) ===

Font da Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

Font Primario - SAIRA CONDENSED:

- Uso: Titoli, headers, buttons, testi in maiuscolo
- H1 Hero: 86px, weight 700-800, MAIUSCOLO, letter-spacing 0.5px
- H2 Sections: 56px, weight 700, MAIUSCOLO, letter-spacing 0.5px
- H3 Subsections: 32px, weight 700
- Buttons: 20px, weight 600, MAIUSCOLO, letter-spacing 0.5px

Font Secondario - LATO:

- Uso: Body text, paragrafi, testo normale
- Body: 19px, weight 400, line-height 1.8
- Subtitle: 22px, weight 400
- Headers H3: 32px, weight 700
- Citazioni: 19px, weight 400, italic

=== CSS VARIABLES (USA QUESTE) ===

```css
:root {
  /* Colori */
  --color-orange: #F89F5A;
  --color-pink: #f06681;
  --color-green: #8CC63F;
  --color-gray-dark: #3C3C3C;
  --color-gray-medium: #4A4A4A;
  --color-gray-light: #F5F5F5;
  --color-gray-border: #E0E0E0;
  --color-white: #FFFFFF;
  
  /* Font */
  --font-headings: 'Saira Condensed', sans-serif;
  --font-body: 'Lato', sans-serif;
  
  /* Font Sizes */
  --size-hero: 86px;
  --size-h1: 56px;
  --size-h2: 32px;
  --size-body: 19px;
  --size-subtitle: 22px;
  --size-button: 20px;
  
  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 40px;
  --spacing-xl: 60px;
  --spacing-section: 80px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 15px;
  --radius-lg: 20px;
  --radius-pill: 30px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 5px 20px rgba(0, 0, 0, 0.1);
  --shadow-button: 0 4px 12px rgba(248, 159, 90, 0.3);
  
  /* Transitions */
  --transition: 0.3s ease;
}
```

=== COMPONENTI UI ===

1. TITOLI CON LINEA COLORATA (NUOVO PATTERN):

```html
<h2 class="title-with-line">
  LA SEMPLICITÀ
  <span class="title-underline title-underline-orange"></span>
</h2>

<h2 class="title-with-line">
  SIMPLIFICO
  <span class="title-underline title-underline-green"></span>
</h2>
```

```css
.title-with-line {
  font-family: var(--font-headings);
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-gray-dark);
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
  padding-bottom: 5px; /* Linea molto vicina al testo */
}

.title-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: 2px;
}

.title-underline-orange {
  background: var(--color-orange);
}

.title-underline-pink {
  background: var(--color-pink);
}

.title-underline-green {
  background: var(--color-green);
}

/* Variante con linea sotto (non assoluta) */
.title-simple {
  font-family: var(--font-headings);
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-gray-dark);
  letter-spacing: 0.5px;
  padding-bottom: 5px; /* Linea molto vicina */
  border-bottom: 4px solid var(--color-orange);
  display: inline-block;
}
```

1. BUTTONS:

```css
.btn-primary {
  background: var(--color-orange);
  color: var(--color-white);
  font-family: var(--font-headings);
  font-size: var(--size-button);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 18px 50px;
  border-radius: var(--radius-pill);
  border: none;
  box-shadow: var(--shadow-button);
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover {
  background: #FDB175;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(248, 159, 90, 0.4);
}
```

1. CARDS:

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-family: var(--font-headings);
  font-size: 28px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-gray-dark);
  margin-bottom: var(--spacing-md);
}
```

1. FORM INPUTS:

```css
.form-input {
  width: 100%;
  padding: 12px 20px;
  font-family: var(--font-body);
  font-size: 16px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-border);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(248, 159, 90, 0.1);
}
```

1. I TRE PALLINI (ELEMENTO DISTINTIVO):

```html
<div class="brand-dots">
  <span class="dot dot-pink"></span>
  <span class="dot dot-orange"></span>
  <span class="dot dot-green"></span>
</div>
```

```css
.brand-dots {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 40px 0;
}

.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.dot-pink { background: var(--color-pink); }
.dot-orange { background: var(--color-orange); }
.dot-green { background: var(--color-green); }
```

=== LAYOUT PATTERNS ===

1. HERO SECTION:

```html
<section class="hero">
  <div class="container">
    <h1>TITOLO PRINCIPALE</h1>
    <p class="subtitle">Sottotitolo descrittivo</p>
    
    <div class="brand-dots">
      <span class="dot dot-pink"></span>
      <span class="dot dot-orange"></span>
      <span class="dot dot-green"></span>
    </div>
    
    <button class="btn-primary">Call to Action</button>
  </div>
</section>
```

```css
.hero {
  background: var(--color-gray-dark);
  color: var(--color-white);
  padding: var(--spacing-section) 20px;
  text-align: center;
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 80px;
  background: var(--color-white);
  clip-path: ellipse(100% 100% at 50% 100%);
}

.hero h1 {
  font-family: var(--font-headings);
  font-size: var(--size-hero);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.hero .subtitle {
  font-family: var(--font-headings);
  font-size: 34px;
  font-weight: 400;
  margin-bottom: 40px;
}
```

1. CONTENT SECTION:

```html
<section class="content-section">
  <div class="container">
    <div class="brand-dots">
      <span class="dot dot-pink"></span>
      <span class="dot dot-orange"></span>
      <span class="dot dot-green"></span>
    </div>
    
    <h2>TITOLO SEZIONE</h2>
    <p class="section-subtitle">Sottotitolo della sezione</p>
    
    <div class="content">
      <p>Contenuto della sezione...</p>
    </div>
  </div>
</section>
```

```css
.content-section {
  padding: var(--spacing-section) 20px;
  max-width: 900px;
  margin: 0 auto;
}

.content-section h2 {
  font-family: var(--font-headings);
  font-size: var(--size-h1);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-gray-dark);
  text-align: center;
  margin-bottom: 30px;
}

.section-subtitle {
  font-family: var(--font-body);
  font-size: var(--size-subtitle);
  color: var(--color-gray-medium);
  text-align: center;
  margin-bottom: 40px;
}
```

1. BENEFIT ITEMS (CON FRECCE COLORATE):

```html
<div class="benefit-item">
  <span class="benefit-icon icon-pink">›</span>
  <p>Testo del beneficio o punto chiave</p>
</div>
```

```css
.benefit-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 30px;
}

.benefit-icon {
  font-size: 32px;
  font-weight: 700;
  flex-shrink: 0;
}

.icon-pink { color: var(--color-pink); }
.icon-orange { color: var(--color-orange); }
.icon-green { color: var(--color-green); }
```

=== RESPONSIVE DESIGN ===

Mobile First Approach:

```css
/* Mobile (default) */
.hero h1 { font-size: 48px; }
.content-section h2 { font-size: 38px; }

/* Tablet */
@media (min-width: 768px) {
  .hero h1 { font-size: 64px; }
  .content-section h2 { font-size: 48px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero h1 { font-size: 86px; }
  .content-section h2 { font-size: 56px; }
}
```

=== ANIMAZIONI ===

```css
/* Hover su cards */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* Hover su buttons */
.btn-primary {
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
}

/* Fade in on scroll */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

=== REGOLE OBBLIGATORIE ===

✅ USA SEMPRE:

- Font Saira Condensed per titoli
- Font Lato per body text
- I tre pallini colorati (almeno una volta per pagina)
- Colori esatti della palette (#F89F5A, #EF6F6C, #8CC63F)
- Border radius arrotondati (15-30px)
- Spaziature generose (minimo 40px tra sezioni)
- Buttons arancioni con shadow
- Forme ondulate per transizioni hero

❌ NON USARE:

- Font diversi da Saira Condensed e Lato
- Colori fuori dalla palette MetàHodos
- Border radius troppo piccoli (<8px)
- Testo sotto i 16px
- Bullet points standard (usa frecce › colorate)
- Layout troppo densi (rispetta spaziature)

=== STRUTTURA HTML BASE ===

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App MetàHodos</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  
  <style>
    /* CSS Variables qui */
    /* Stili qui */
  </style>
</head>
<body>
  <!-- Hero Section -->
  <section class="hero">
    <!-- contenuto hero -->
  </section>
  
  <!-- Content Sections -->
  <section class="content-section">
    <!-- contenuto -->
  </section>
  
  <!-- Footer -->
  <footer class="footer">
    <!-- footer -->
  </footer>
</body>
</html>
```

=== ESEMPI DI COMPONENTI REACT ===

Se usi React/Next.js:

```jsx
// Titolo con Linea Colorata Component
export const TitleWithLine = ({ children, color = 'orange' }) => (
  <h2 className="title-with-line">
    {children}
    <span className={`title-underline title-underline-${color}`}></span>
  </h2>
);

// Uso:
<TitleWithLine color="orange">LA SEMPLICITÀ</TitleWithLine>
<TitleWithLine color="green">SEMPLIFICO</TitleWithLine>
<TitleWithLine color="pink">RISULTATI</TitleWithLine>

// Button Component
export const Button = ({ children, variant = 'primary', onClick }) => (
  <button 
    className={`btn btn-${variant}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Brand Dots Component
export const BrandDots = () => (
  <div className="brand-dots">
    <span className="dot dot-pink"></span>
    <span className="dot dot-orange"></span>
    <span className="dot dot-green"></span>
  </div>
);

// Card Component
export const Card = ({ title, children }) => (
  <div className="card">
    <h3 className="card-title">{title}</h3>
    <div className="card-content">{children}</div>
  </div>
);

// Hero Section Component
export const Hero = ({ title, subtitle }) => (
  <section className="hero">
    <div className="container">
      <TitleWithLine color="orange">{title}</TitleWithLine>
      <p className="subtitle">{subtitle}</p>
      <BrandDots />
      <Button>Call to Action</Button>
    </div>
  </section>
);
```

=== TAILWIND CONFIG (SE USI TAILWIND) ===

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-orange': '#F89F5A',
        'brand-pink': '#EF6F6C',
        'brand-green': '#8CC63F',
        'brand-gray-dark': '#3C3C3C',
        'brand-gray-medium': '#4A4A4A',
        'brand-gray-light': '#F5F5F5',
      },
      fontFamily: {
        'headings': ['Saira Condensed', 'sans-serif'],
        'body': ['Lato', 'sans-serif'],
      },
      fontSize: {
        'hero': '86px',
        'h1': '56px',
        'h2': '32px',
        'body': '19px',
        'subtitle': '22px',
      },
      borderRadius: {
        'pill': '30px',
      },
      spacing: {
        'section': '80px',
      },
    },
  },
}
```

=== ACCESSIBILITÀ ===

Assicurati di:

- Contrasto colori sufficiente (WCAG AA)
- Font size minimo 16px
- Focus states visibili sui form
- Alt text su tutte le immagini
- Aria labels dove necessario
- Struttura heading semantica (h1, h2, h3)

=== PERFORMANCE ===

- Usa font-display: swap per Google Fonts
- Lazy loading per immagini
- Minifica CSS e JS
- Ottimizza immagini (WebP)
- CSS critici inline

=== TESTING ===

Testa su:

- Chrome, Firefox, Safari, Edge
- Mobile (iOS e Android)
- Tablet
- Desktop (varie risoluzioni)

Verifica:

- Hover states su desktop
- Touch targets su mobile (min 44x44px)
- Scroll fluido
- Animazioni non troppo pesanti

```

---

## 📦 File da Allegare a Claude Code

Quando lavori con Claude Code, allega questi file per riferimento:

1. **metahodos_styles.css** - CSS completo pronto
2. **metahodos_style_guide.md** - Guida completa di stile
3. **metahodos_font_specs.md** - Specifiche font dettagliate
4. **metahodos_design_tokens.json** - Design tokens strutturati
5. **metahodos_standalone.html** - Esempio HTML completo

---

## 🚀 Come Usare con Claude Code

### Passo 1: Apri Claude Code

```bash
claude-code
```

### Passo 2: Descri il Progetto

```
Voglio creare/aggiornare un'app web usando lo stile MetàHodos.
[Allega i file di riferimento sopra]
```

### Passo 3: Dai Istruzioni Specifiche

Esempio per nuova app:

```
Crea una landing page per MetàHodos con:
- Hero section con titolo "Performance Coaching"
- Sezione "Chi Sono" con presentazione
- Sezione "Servizi" con 3 cards
- Form contatto
- Footer con info

Usa rigorosamente lo stile MetàHodos:
- Font: Saira Condensed (titoli) + Lato (body)
- Colori: #F89F5A, #EF6F6C, #8CC63F, #3C3C3C
- I tre pallini colorati come elemento distintivo
- Layout con le specifiche nel file allegato
```

Esempio per aggiornare app esistente:

```
Aggiorna questa app React applicando lo stile MetàHodos:

MANTIENI:
- Tutta la logica e funzionalità esistente
- Struttura componenti React
- API calls e state management

AGGIORNA:
- Sostituisci tutti i font con Saira Condensed (titoli) e Lato (body)
- Cambia palette colori: #F89F5A, #EF6F6C, #8CC63F, #3C3C3C
- Aggiungi i tre pallini colorati nelle sezioni principali
- Aggiorna buttons con lo stile MetàHodos
- Modifica cards con border-radius e shadow corretti
- Aumenta spaziature tra elementi (min 40px)

Segui le specifiche nel file metahodos_styles.css allegato.
```

---

## ✅ Checklist Post-Sviluppo

Dopo che Claude Code ha generato il codice, verifica:

### Design

- [ ] Font Saira Condensed usato per tutti i titoli
- [ ] Font Lato usato per tutto il body text
- [ ] Colori esatti della palette (#F89F5A, #EF6F6C, #8CC63F, #3C3C3C)
- [ ] I tre pallini colorati presenti
- [ ] Buttons arancioni con shadow corretto
- [ ] Border radius arrotondati (15-30px)
- [ ] Spaziature generose (minimo 40px tra sezioni)

### Tipografia

- [ ] Titoli H1 in maiuscolo, 56-86px
- [ ] Body text 19px minimo
- [ ] Line-height 1.8 per il body
- [ ] Letter-spacing ridotto (0-0.5px)

### Interattività

- [ ] Hover effects su buttons
- [ ] Hover effects su cards
- [ ] Focus states su form inputs
- [ ] Transizioni smooth (0.3s)

### Responsive

- [ ] Mobile (<768px) - layout a colonna
- [ ] Tablet (768-1024px) - layout intermedio
- [ ] Desktop (>1024px) - layout completo
- [ ] Font sizes scalano correttamente

### Performance

- [ ] Google Fonts caricati correttamente
- [ ] Immagini ottimizzate
- [ ] CSS minificato (produzione)
- [ ] No errori console

---

## 💡 Tips per Claude Code

### 1. Sii Specifico

❌ "Aggiorna lo stile dell'app"
✅ "Applica lo stile MetàHodos: Saira Condensed per titoli, Lato per body, colori #F89F5A, #EF6F6C, #8CC63F"

### 2. Allega File di Riferimento

Sempre allega:

- metahodos_styles.css
- metahodos_style_guide.md
- Screenshot dell'HTML se possibile

### 3. Iterazioni Incrementali

Non chiedere tutto insieme. Esempio:

1. "Prima aggiorna font e colori"
2. "Ora aggiungi i tre pallini colorati"
3. "Infine sistema spaziature e responsive"

### 4. Test Continuo

Dopo ogni modifica:

```
Genera una preview e fammi vedere il risultato
```

### 5. Esporta CSS Separato

```
Crea un file metahodos-theme.css separato con tutti gli stili del brand
così posso riusarlo in altri progetti
```

---

## 🎯 Esempi di Richieste Complete

### Esempio 1: Landing Page da Zero

```
Claude Code, crea una landing page MetàHodos con:

STRUTTURA:
1. Hero section con:
   - Titolo "TRASFORMAZIONE AGILE"
   - Sottotitolo "Per PMI italiane"
   - I tre pallini colorati
   - Button "Scopri di più"
   
2. Sezione "Il Metodo":
   - Titolo sezione
   - 3 cards con icone (Definire, Tracciare, Prioritizzare)
   - Bullets con frecce › colorate
   
3. Form contatto:
   - Sfondo arancione
   - 4 campi (nome, email, telefono, messaggio)
   - Button submit grigio scuro
   
4. Footer:
   - Logo MetàHodos
   - Contatti
   - Privacy policy

STILE:
- Font: Saira Condensed (titoli) + Lato (body)
- Colori: #F89F5A, #EF6F6C, #8CC63F, #3C3C3C
- Responsive: mobile-first
- File CSS separato

Usa le specifiche in metahodos_styles.css allegato.
```

### Esempio 2: Dashboard React

```
Claude Code, trasforma questa dashboard React nello stile MetàHodos:

MANTIENI:
- Tutta la logica React (hooks, state, props)
- API calls
- Routing
- Componenti funzionali

AGGIORNA STILE:
1. Tema generale:
   - Palette MetàHodos (#F89F5A, #EF6F6C, #8CC63F)
   - Font Saira Condensed + Lato
   
2. Componenti UI:
   - Buttons → stile MetàHodos con shadow
   - Cards → border-radius 20px, shadow elevata
   - Forms → border arancione al focus
   - Sidebar → grigio scuro #3C3C3C
   
3. Elementi distintivi:
   - Aggiungi i tre pallini nel header
   - Status indicators con i colori brand
   - Badges arrotondati

4. File:
   - Crea theme.css con le variabili CSS
   - Esporta componenti stilizzati

Segui metahodos_style_guide.md allegato.
```

### Esempio 3: Form Multi-Step

```
Claude Code, crea un form multi-step stile MetàHodos:

FUNZIONALITÀ:
- 3 steps: Dati personali → Azienda → Obiettivi
- Progress bar visiva
- Validazione campi
- Recap finale

STILE METÀHODOS:
- Step indicator: tre pallini colorati (grigio/attivo)
- Buttons: arancione primary, grigio secondary
- Inputs: focus arancione, border-radius 8px
- Cards: ogni step in una card elevata
- Transizioni: fade tra steps

SPECIFICHE:
- Font: Saira Condensed (titoli) + Lato (inputs)
- Colori brand: #F89F5A, #EF6F6C, #8CC63F
- Mobile-first responsive
- Form validation con messaggi colorati (rosso errore, verde success)

Usa metahodos_styles.css come base.
```

---

## 📚 Risorse Aggiuntive

### File CSS Pronto

Il file `metahodos_styles.css` contiene:

- Tutte le CSS variables
- Componenti UI pronti
- Layout responsive
- Animazioni
- Utilities classes

### Design Tokens JSON

Il file `metahodos_design_tokens.json` contiene:

- Colori in formato JSON
- Font sizes
- Spacing scale
- Border radius
- Shadows
→ Importabile in Figma, Sketch, o tool di design

### Style Guide Completo

Il file `metahodos_style_guide.md` include:

- Guida visiva completa
- Pattern di design
- Esempi di uso
- Do's and Don'ts
- Best practices

---

## 🆘 Troubleshooting

### Problema: Font non si caricano

**Soluzione:**

```html
<!-- Aggiungi preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Problema: Colori non esatti

**Soluzione:**

```css
/* Usa HEX esatti, non RGB approssimati */
--color-orange: #F89F5A; /* ✅ Corretto */
--color-orange: rgb(248, 159, 90); /* ⚠️ Ok ma usa HEX */
--color-orange: #F8A05B; /* ❌ Sbagliato */
```

### Problema: Layout troppo denso

**Soluzione:**

```css
/* Aumenta spacing */
.section {
  padding: 80px 20px; /* Non meno di 80px verticale */
}

.element {
  margin-bottom: 40px; /* Minimo 40px tra elementi */
}
```

### Problema: Button non hanno l'effetto hover

**Soluzione:**

```css
.btn-primary {
  transition: all 0.3s ease; /* OBBLIGATORIO */
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(248, 159, 90, 0.4);
}
```

---

*Istruzioni create per Franz De Sario - MetàHodos*
*Claude Code Style Guide*
*17 Gennaio 2026*
