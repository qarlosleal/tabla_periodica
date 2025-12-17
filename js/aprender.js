// Voz
<!--
function speak(text) {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
}
-->

function speak(text){
  if(!('speechSynthesis' in window)) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";

  // Ajustes estilo “Vader”
  u.rate = 0.7;   // más lento
  u.pitch = 0.5;  // más grave
  u.volume = 1;

  // Intentar elegir voz masculina
  const voices = speechSynthesis.getVoices();
  const maleVoice = voices.find(v =>
    /male|mascul/i.test(v.name) && v.lang.startsWith('es')
  );
  if (maleVoice) u.voice = maleVoice;

  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// Textos info (exactos)
const infoMain = `1. Pulsa los diferentes símbolos para escuchar los nombres de los elementos.
2. Cuando te sepas una columna completa 🔥, pulsa el botón de abajo para comprobar si te los sabes.`;

const infoExam = `1. Escribe, en orden, el símbolo y nombre de cada elemento.
2. Cuando lo hayas rellenado, pulsa el botón corregir 🚀
3. Si hay algo mal, podrás cambiarlo y volver a corregir.
4. Si te rindes 🙆‍♀️ pulsa el botón "volver".
⚠️ En el símbolo del elemento has de escribir mayúsculas y minúsculas correctamente`;


function openInfo(where) {
    document.getElementById('modal-text').innerText = (where === 'main') ? infoMain : infoExam;
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
function backdropClose(e) {
    if (e.target && e.target.id === 'modal') closeModal();
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Datos columnas
const columnas = {
    "Ia": [
        { symbol: "H", name: "Hidrógeno" },
        { symbol: "Li", name: "Litio" },
        { symbol: "Na", name: "Sodio" },
        { symbol: "K", name: "Potasio" },
        { symbol: "Rb", name: "Rubidio" },
        { symbol: "Cs", name: "Cesio" },
        { symbol: "Fr", name: "Francio" },
    ],
    "IIa": [
        { symbol: "Be", name: "Berilio" },
        { symbol: "Mg", name: "Magnesio" },
        { symbol: "Ca", name: "Calcio" },
        { symbol: "Sr", name: "Estroncio" },
        { symbol: "Ba", name: "Bario" },
        { symbol: "Ra", name: "Radio" },
    ],
    "IIIa": [
        { symbol: "B", name: "Boro" },
        { symbol: "Al", name: "Aluminio" },
        { symbol: "Ga", name: "Galio" },
        { symbol: "In", name: "Indio" },
        { symbol: "Tl", name: "Talio" },
    ],
    "IVa": [
        { symbol: "C", name: "Carbono" },
        { symbol: "Si", name: "Silicio" },
        { symbol: "Ge", name: "Germanio" },
        { symbol: "Sn", name: "Estaño" },
        { symbol: "Pb", name: "Plomo" },
    ],
    "Va": [
        { symbol: "N", name: "Nitrógeno" },
        { symbol: "P", name: "Fósforo" },
        { symbol: "As", name: "Arsénico" },
        { symbol: "Sb", name: "Antimonio" },
        { symbol: "Bi", name: "Bismuto" },
    ],
    "VIa": [
        { symbol: "O", name: "Oxígeno" },
        { symbol: "S", name: "Azufre" },
        { symbol: "Se", name: "Selenio" },
        { symbol: "Te", name: "Telurio" },
        { symbol: "Po", name: "Polonio" },
    ],
    "VIIa": [
        { symbol: "F", name: "Flúor" },
        { symbol: "Cl", name: "Cloro" },
        { symbol: "Br", name: "Bromo" },
        { symbol: "I", name: "Yodo" },
        { symbol: "At", name: "Astato" },
    ],
};

let columnaActual = null;

function normalizar(str) {
    return str.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function openExam(col) {
    columnaActual = col;

    // UI
    document.getElementById('tabla-principal').style.display = 'none';
    document.querySelector('.title-row').style.display = 'none';
    document.getElementById('exam-area').style.display = 'block';

    document.getElementById('exam-title').innerText = `Examen ${col}`;

    const datos = columnas[col];
    const examBody = document.getElementById('exam-body');

    let html = `<div class="exam-grid">`;

    datos.forEach((el, i) => {
        html += `
        <div class="exam-row">
          <input class="exam-input" id="sym-${i}" placeholder="Símbolo">
          <div class="resultado" id="res-sym-${i}"></div>
          <input class="exam-input" id="name-${i}" placeholder="Nombre">
          <div class="resultado" id="res-name-${i}"></div>
        </div>
      `;
    });

    html += `</div>
      <div style="display:flex; justify-content:center; gap:14px;">
        <button class="circle-btn" onclick="resolver()" title="Corregir">✔️</button>
        <button class="circle-btn" onclick="cerrarExamen()" title="Volver">↩️</button>
      </div>
      <p id="resumen"></p>
    `;

    examBody.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resolver() {
    const datos = columnas[columnaActual];
    let aciertos = 0;
    let errores = 0;

    datos.forEach((el, i) => {
        const symInput = document.getElementById(`sym-${i}`);
        const nameInput = document.getElementById(`name-${i}`);

        const sym = symInput.value.trim();
        const name = nameInput.value;

        const okSym = (sym === el.symbol);                 // símbolo exacto (mayús/minús)
        const okName = (normalizar(name) === normalizar(el.name)); // nombre sin tildes/mayús

        const boxSym = document.getElementById(`res-sym-${i}`);
        const boxName = document.getElementById(`res-name-${i}`);

        // símbolo: ✅ si acierta, si falla en blanco
        if (okSym) {
            boxSym.textContent = "✅";
            symInput.style.backgroundColor = "#c8f7c5";
            aciertos++;
        } else {
            boxSym.textContent = "";
            symInput.style.backgroundColor = "#f7c5c5";
            errores++;
        }

        // nombre: ✅ si acierta, si falla en blanco
        if (okName) {
            boxName.textContent = "✅";
            nameInput.style.backgroundColor = "#c8f7c5";
            aciertos++;
        } else {
            boxName.textContent = "";
            nameInput.style.backgroundColor = "#f7c5c5";
            errores++;
        }
    });

    const total = datos.length * 2;
    const resumen = document.getElementById('resumen');
    resumen.textContent = `Aciertos: ${aciertos} · Errores: ${errores} (de ${total})`;

    if (aciertos === total) {
        celebrateAllCorrect();
    }
}

function cerrarExamen() {
    closeModal();
    document.getElementById('exam-area').style.display = 'none';
    document.getElementById('tabla-principal').style.display = 'block';
    document.querySelector('.title-row').style.display = 'flex';
    document.getElementById('exam-body').innerHTML = '';
    columnaActual = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== CELEBRACIÓN: 3 fuegos + TOP/GOAT (colores y posiciones variables, NO a la vez) ======
const fx = document.getElementById('fx');
const ctx = fx.getContext('2d');
let particles = [];
let raf = null;
let fxHideTimer = null;

function resizeFx() {
    fx.width = window.innerWidth;
    fx.height = window.innerHeight;
}
window.addEventListener('resize', resizeFx);
resizeFx();

function celebrateAllCorrect() {
    // Palabras: una detrás de otra, diferentes posiciones y colores
    showWordsSequential();

    // 3 explosiones consecutivas desde 3 sitios distintos
    const spots = [
        { x: fx.width * 0.22, y: fx.height * 0.38 },
        { x: fx.width * 0.78, y: fx.height * 0.32 },
        { x: fx.width * 0.50, y: fx.height * 0.48 },
    ];

    burstAt(spots[0].x, spots[0].y);
    setTimeout(() => burstAt(spots[1].x, spots[1].y), 450);
    setTimeout(() => burstAt(spots[2].x, spots[2].y), 900);
}

function randColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)`;
}

function pickPos(exclude) {
    // margen para que no salga pegado al borde
    const marginX = 90;
    const marginY = 90;
    const x = marginX + Math.random() * (window.innerWidth - marginX * 2);
    const y = marginY + Math.random() * (window.innerHeight * 0.65 - marginY * 2);

    if (!exclude) return { x, y };

    // si está muy cerca, reintenta unas cuantas veces
    let px = x, py = y;
    for (let k = 0; k < 12; k++) {
        const dx = px - exclude.x;
        const dy = py - exclude.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 220) break;
        px = marginX + Math.random() * (window.innerWidth - marginX * 2);
        py = marginY + Math.random() * (window.innerHeight * 0.65 - marginY * 2);
    }
    return { x: px, y: py };
}

function showWord(el, text, pos) {
    el.textContent = text;
    el.style.left = `${pos.x}px`;
    el.style.top = `${pos.y}px`;
    el.style.color = randColor();
    el.style.display = 'block';
}

function hideWord(el) {
    el.style.display = 'none';
}

function showWordsSequential() {
    const topEl = document.getElementById('word-top');
    const goatEl = document.getElementById('word-goat');

    hideWord(topEl);
    hideWord(goatEl);

    const posTop = pickPos(null);
    showWord(topEl, "TOP", posTop);

    // TOP desaparece
    setTimeout(() => hideWord(topEl), 650);

    // GOAT aparece después, en otro sitio y otro color
    const posGoat = pickPos(posTop);
    setTimeout(() => {
        showWord(goatEl, "GOAT", posGoat);
        setTimeout(() => hideWord(goatEl), 650);
    }, 700);
}

function burstAt(x, y) {
    resizeFx();
    fx.style.display = 'block';

    const count = 140;
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            g: 0.10 + Math.random() * 0.10,
            life: 85 + Math.random() * 35,
            size: 3 + Math.random() * 4,
            c: `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)`,
        });
    }

    if (raf === null) {
        raf = requestAnimationFrame(loopFx);
    }

    if (fxHideTimer) clearTimeout(fxHideTimer);
    fxHideTimer = setTimeout(() => { fx.style.display = 'none'; }, 2300);
}

function loopFx() {
    ctx.clearRect(0, 0, fx.width, fx.height);

    particles.forEach(p => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    particles = particles.filter(p => p.life > 0 && p.y < fx.height + 30);

    if (particles.length) {
        raf = requestAnimationFrame(loopFx);
    } else {
        raf = null;
        fx.style.display = 'none';
    }
}
