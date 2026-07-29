const indexToCountry = {
  0: 'mexico',         1: 'mexico',       2: 'mexico',
  3: 'usa',            4: 'usa',          5: 'usa',
  6: 'japon',          7: 'japon',        8: 'japon',
  9: 'argentina',     10: 'argentina',   11: 'argentina',
  12:'australia',     13: 'australia',   14: 'australia',
  15: 'brazil',       16: 'brazil',      17: 'brazil',
  18: 'canada',       19: 'canada',      20: 'canada',
  21: 'ecuador',      22: 'ecuador',     23: 'ecuador',
  24: 'iran',         25: 'iran',        26: 'iran',
  27: 'jordan',       28: 'jordan',      29: 'jordan',
  30: 'korea',        31: 'korea',       32: 'korea',
  33: 'newzealand',  34: 'newzealand',  35: 'newzealand',
  36: 'uzbekistan',   37: 'uzbekistan',  38: 'uzbekistan'
};

// ------------------------ NOMBRE BANDERA ----------------------------------------------
const countryNiceName = { mexico: 'México',       usa: 'Estados Unidos', japon: 'Japón', 
                          argentina: 'Argentina', australia:'Australia', brazil:'Brazil',
                          canada:'Canada',        ecuador:'Ecuador',     iran:'Iran',
                          jordan:'Jordania',      korea:'Corea del Sur', newzealand:'Nueva Zelanda',
                          uzbekistan:'Uzbekistan'
                        };

// ------------------------ PAISES ------------------------------------------------------
let currentCountry = null; 
let currentIndex = null;

/* --------------------------------- CONST BOTONES -------------------------------------  */
const controls = document.getElementById('controls');
const btnModel = document.getElementById('btnModel');
const btnCapture = document.getElementById('btnCapture');
const btnReturn = document.getElementById('btnReturn');
const hint = document.getElementById('hint');
const infoCard = document.getElementById('infoCard');
const closeInfo = document.getElementById('closeInfo');
const cardTitle = document.getElementById('cardTitle');
const playersList = document.getElementById('playersList');

/* ------------------------------------------------------- A-Frame entities ----------------------- */
const modelContainer = document.getElementById('modelContainer');
const placeholderBox = document.getElementById('placeholderBox');
const gltfModelEntity = document.getElementById('gltfModelEntity');

/* ------------------------------------- DATOS DE .JSON ------------------------------------------- */
let playersData = {};
fetch('data/players.json')
  .then(res => res.json())
  .then(data => playersData = data)
  .catch(err => {
    console.warn('No se pudo cargar data/players.json.', err);
    playersData = {
      mexico: [
        { name:'Luis Malagón', position: 'Portero', age:28, photo: 'assets/images/mex_player1.jpg', partidas:18, goles:0, asistidas:0, tarjetas:0 },
        
        { name:'Orbelín Pineda', position: 'Centrocampista', age:29, photo: 'assets/images/mex_player9.jpg', partidas:87, goles:12, asistidas:0, tarjetas:0 }
      ],
      usa: [
        { name:'John Smith', position:'Mediocampista', age:28, photo:'assets/images/usa_player1.jpg' }
      ],
      japon: [
        { name:'Takumi Tanaka', position:'Defensa', age:26, photo:'assets/images/jpn_player1.jpg' }
      ]
    };
  });

/* ----------------------------------------- TARJETAS DE JUGADORES ------------------------------------------  */
function showInfoForCountry(country) {
  const players = playersData[country] || [];
  cardTitle.innerHTML = ''; 

  const header = document.createElement('div');
  header.className = 'country-header';
  header.innerHTML = `
      <div class="header-left">
      <img src="assets/images/${country}/${country}.png" alt="${country}" 
           onerror="this.src='https://via.placeholder.com/60x40?text=${country}'" />
      <h2>${countryNiceName[country] || country}</h2>
    </div>
    <model-viewer class="header-model" 
      src="assets/models/${country}.glb" 
      alt="modelo ${country}" 
      camera-controls 
      disable-zoom 
      autoplay     
      exposure="1"
      style="width:80px; height:80px; background:transparent;">
    </model-viewer>
  `;
  cardTitle.appendChild(header);

  playersList.innerHTML = '';

  if (players.length === 0) {
    playersList.innerHTML = '<div>No hay jugadores cargados para este país.</div>';
  } else {
    let currentIndex = 0;

    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn left';
    prevBtn.innerHTML = '◀';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn right';
    nextBtn.innerHTML = '▶';

    function renderPlayer(index) {
  const p = players[index];
  
  playerCard.classList.remove('active');
  playerCard.classList.add('leaving');
  
  setTimeout(() => {
    
    playerCard.innerHTML = `
      <img class="player-photo" src="${p.photo}" alt="${p.name}" 
           onerror="this.src='https://via.placeholder.com/300x300?text=Sin+foto'"/>
      <div class="player-info">
        <h3>${p.name}</h3>
        <p><strong>Posición:</strong> ${p.position}</p>
        <p><strong>Edad:</strong> ${p.age} años</p>
        <p><strong>Partidas:</strong> ${p.partidas}</p>
        <p><strong>Goles:</strong> ${p.goles}</p>
        <p><strong>Asistidas:</strong> ${p.asistidas}</p>
        <p><strong>Tarjetas:</strong> ${p.tarjetas}</p>
        ${p.more ? `<p><strong>Club:</strong> ${p.more}</p>` : ''}
      </div>
    `;
    
    playerCard.classList.remove('leaving');
    playerCard.classList.add('entering');
    
    setTimeout(() => {
      playerCard.classList.remove('entering');
      playerCard.classList.add('active');
    }, 150);

  }, 200);
}


    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + players.length) % players.length;
      renderPlayer(currentIndex);
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % players.length;
      renderPlayer(currentIndex);
    });

    renderPlayer(currentIndex);

    playersList.appendChild(prevBtn);
    playersList.appendChild(playerCard);
    playersList.appendChild(nextBtn);
  }

  infoCard.style.display = 'block';
}


/* ----------------------------------------- MODELOS 3D ------------------------------------------------------- */
/*function showModelForCountry(country) {
  const modelUrl = `assets/models/${country}.glb`; 

  fetch(modelUrl, { method: 'HEAD' })
    .then(() => {
      gltfModelEntity.setAttribute('gltf-model', modelUrl);
      gltfModelEntity.setAttribute('visible', 'true');
      placeholderBox.setAttribute('visible', 'false');
      modelContainer.setAttribute('visible', 'true');
    })
    .catch(() => {
      gltfModelEntity.removeAttribute('gltf-model');
      gltfModelEntity.setAttribute('visible', 'false');
      placeholderBox.setAttribute('visible', 'true');
      modelContainer.setAttribute('visible', 'true');
    });
}
 */







/* ----------------------------------------- OCULTAR TODO ----------------------------------------------------- */

function hideAll() {
  controls.style.display = 'none';
  infoCard.style.display = 'none';
  modelContainer.setAttribute('visible', 'false');
  hint.style.display = 'block';
  currentCountry = null;
  currentIndex = null;
}

closeInfo.addEventListener('click', () => infoCard.style.display = 'none');

const idleScreen = document.getElementById('idle-screen');
let idleTimer = null;

idleScreen.classList.remove('hidden');

function showIdleScreen() {
  idleScreen.classList.remove('hidden');
  hideAll();
}

function hideIdleScreen() {
  idleScreen.classList.add('hidden');
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!currentCountry && !captureMode) {
      showIdleScreen();
    }
  }, 5000); 
}

Object.keys(indexToCountry).forEach(k => {
  const id = `target-${k}`;
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('targetFound', () => {
    hideIdleScreen();

    btnViewAR.style.display = "inline-block";
btnBackCards.style.display = "none";

    

    resetIdleTimer();

  if (captureMode) return;
  currentIndex = parseInt(k);
  currentCountry = indexToCountry[k];
  hint.style.display = 'none';
  controls.style.display = 'block';
  modelContainer.setAttribute('visible', 'false');

 
  


  showInfoForCountry(currentCountry);
  showModelForCountry(currentCountry);

  
  console.log('targetFound idx=', k, 'country=', currentCountry);
});


el.addEventListener('targetLost', () => {
  if (captureMode) return; 
  btnViewAR.style.display = "none";
btnBackCards.style.display = "none";

  hideAll();
  console.log('targetLost idx=', k);
  resetIdleTimer();

});
});

hideAll();

let captureMode = false;

btnCapture.addEventListener('click', () => {
  if (!currentCountry) return;
  captureMode = true;
  btnCapture.style.display = 'none';
  btnReturn.style.display = 'inline-block';
  hint.style.display = 'none'; 
});

btnReturn.addEventListener('click', () => {
  captureMode = false;
  btnReturn.style.display = 'none';
  btnCapture.style.display = 'inline-block';
  hideAll();
  hint.textContent = ' Apunta la cámara a una bandera (México / EE.UU / Japón)';
});




/* ===================================================== ROTACION /ANIMACION ===============================================  */
const btnAnimateModel = document.getElementById("btnAnimateModel");

btnAnimateModel.addEventListener("click", () => {
  const model = document.querySelector(".country-header .header-model");
  if (!model) return;


  const isRotating = model.hasAttribute("auto-rotate");

  if (isRotating) {
    model.removeAttribute("auto-rotate");
    btnAnimateModel.textContent = "▸";
  } else {
    model.setAttribute("auto-rotate", "");
    model.setAttribute("rotation-per-second", "30deg");
    btnAnimateModel.textContent = "⬛";
  }
});


/* ===================================================== VIDEO ===============================================  */
const btnVideo = document.getElementById('btnVideo');
btnVideo.addEventListener('click', () => {
  if (!currentCountry) return;

  const youtubeLinks = {
    mexico:    "https://www.youtube.com/embed/hWcYicU_XDk?autoplay=1",
    usa:       "https://www.youtube.com/embed/9aE1g3sDfVg?autoplay=1",
    japon:     "https://www.youtube.com/embed/laiqbrG5y6I?autoplay=1",
    argentina: "https://www.youtube.com/embed/BmNp5GeNEMM?autoplay=1",
    australia: "https://www.youtube.com/embed/7QePYntMdR0?autoplay=1",
    brazil:    "https://www.youtube.com/embed/VBbzKgMcWS0?autoplay=1",
    canada:    "https://www.youtube.com/embed/n54Gb3TtqQY?autoplay=1",
    ecuador:   "https://www.youtube.com/embed/YLK_HxMbcZ4?autoplay=1",
    iran:      "https://www.youtube.com/embed/wu1JFz-c5CE?autoplay=1",
    jordan:    "https://www.youtube.com/embed/9TsgeQYQavQ?autoplay=1",
    korea:     "https://www.youtube.com/embed/D1y5Dr6kd6o?autoplay=1",
    newzealand:"https://www.youtube.com/embed/yjH97D-B3pI?autoplay=1",
    uzbekistan:"https://www.youtube.com/embed/4gkUuWgbVf8?autoplay=1",

  };

  const videoURL = youtubeLinks[currentCountry];
  if (!videoURL) {
    alert("No hay video disponible para este país.");
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'youtube-modal';
  modal.innerHTML = `
    <iframe src="${videoURL}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    <button id="closeYT">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
    </svg>
    </button>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#closeYT').addEventListener('click', () => {
    modal.remove();
  });
});


/* ===================================================== CELEBRACION ===============================================  */
const btnCelebrate = document.getElementById('btnCelebrate');
btnCelebrate.addEventListener('click', () => {
  launchConfetti();
});

function launchConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
    }));
  }, 250);
}
/* ===================================================== CAMBIAR DE CARD A MODEL ===============================================  */
const btnViewAR = document.getElementById("btnViewAR");
const btnBackCards = document.getElementById("btnBackCards");

btnViewAR.addEventListener("click", () => {
  if (!currentCountry) return;


  infoCard.classList.add("fade-out");
  setTimeout(() => {
    infoCard.style.display = "none";
    infoCard.classList.remove("fade-out");

    showARModel(currentCountry);
    
    btnViewAR.style.display = "none";
    btnBackCards.style.display = "inline-block";
  }, 600);
});


btnBackCards.addEventListener("click", () => {

  hideARModel();

  
  infoCard.style.display = "block";
  infoCard.classList.add("fade-in");
  setTimeout(() => infoCard.classList.remove("fade-in"), 600);


  btnBackCards.style.display = "none";
  btnViewAR.style.display = "inline-block";
});









/*

// ------------- Mostrar modelo 3D automáticamente -------------
function showModelForCountry(country) {
  const modelUrl = `assets/models/${country}.glb`;
  fetch(modelUrl, { method: 'HEAD' })
    .then(() => {
      gltfModelEntity.setAttribute('gltf-model', modelUrl);
      gltfModelEntity.setAttribute('visible', 'true');
      placeholderBox.setAttribute('visible', 'false');
      modelContainer.setAttribute('visible', 'true');
    })
    .catch(() => {
      gltfModelEntity.removeAttribute('gltf-model');
      gltfModelEntity.setAttribute('visible', 'false');
      placeholderBox.setAttribute('visible', 'true');
      modelContainer.setAttribute('visible', 'true');
    });
}
*/

function showARModel(country) {
  const modelUrl = `assets/models/${country}.glb`;
  const modelEntity = document.getElementById("gltfModelEntity");
  const placeholder = document.getElementById("placeholderBox");

  fetch(modelUrl, { method: "HEAD" })
    .then(() => {
      modelEntity.setAttribute("gltf-model", modelUrl);
      modelEntity.setAttribute("visible", "true");
      placeholder.setAttribute("visible", "false");
      modelContainer.setAttribute("visible", "true");

   
      modelEntity.setAttribute("animation__pop", {
        property: "scale",
        from: "0 0 0",
        to: "0.5 0.5 0.5",
        dur: 800,
        easing: "easeOutElastic"
      });
    })
    .catch(() => {
      console.warn("Modelo no encontrado:", modelUrl);
    });
}

function hideARModel() {
  const modelEntity = document.getElementById("gltfModelEntity");
  const placeholder = document.getElementById("placeholderBox");

  modelEntity.setAttribute("visible", "false");
  modelContainer.setAttribute("visible", "false");
  placeholder.setAttribute("visible", "false");
}























/* ====================================================       TRIVIAS      ================================================== */
const triviaBtn = document.getElementById('btnTrivia');
const idleTriviaBtn = document.getElementById('idleTriviaBtn');

const triviaBase = [
  { country: 'Argentina', q: "¿En qué año ganó Argentina su primer Mundial?", opts: ["1978", "1986", "1990"], correct: "1978" },
  { country: 'Argentina', q: "¿Quién es el máximo goleador histórico de Argentina?", opts: ["Messi", "Maradona", "Batistuta"], correct: "Messi" },
  { country: 'Argentina', q: "¿En qué estadio juega la selección argentina como local?", opts: ["La Bombonera", "El Monumental", "Mario Kempes"], correct: "El Monumental" },

  { country: 'Australia', q: "¿Cuál es el apodo de la selección australiana?", opts: ["Socceroos", "Kangaroos", "Wallabies"], correct: "Socceroos" },
  { country: 'Australia', q: "¿Cuántas veces ha clasificado Australia al Mundial?", opts: ["3", "5", "6"], correct: "6" },
  { country: 'Australia', q: "¿En qué año debutó Australia en un Mundial?", opts: ["1974", "1982", "1990"], correct: "1974" },

  { country: 'Brasil', q: "¿Cuántos mundiales ha ganado Brasil?", opts: ["4", "5", "6"], correct: "5" },
  { country: 'Brasil', q: "¿Quién fue el capitán de Brasil en el Mundial 2002?", opts: ["Ronaldo", "Cafú", "Ronaldinho"], correct: "Cafú" },
  { country: 'Brasil', q: "¿Qué jugador brasileño es conocido como 'O Rei'?", opts: ["Pelé", "Neymar", "Romário"], correct: "Pelé" },

  { country: 'Canadá', q: "¿En qué año debutó Canadá en un Mundial?", opts: ["1982", "1986", "1994"], correct: "1986" },
  { country: 'Canadá', q: "¿Cuál es la ciudad sede del fútbol canadiense más grande?", opts: ["Toronto", "Vancouver", "Montreal"], correct: "Toronto" },
  { country: 'Canadá', q: "¿Quién fue la figura de Canadá en Qatar 2022?", opts: ["Alphonso Davies", "Jonathan David", "Milan Borjan"], correct: "Alphonso Davies" },

  { country: 'Corea del Sur', q: "¿En qué año fue coanfitrión del Mundial Corea del Sur?", opts: ["1998", "2002", "2006"], correct: "2002" },
  { country: 'Corea del Sur', q: "¿Hasta qué fase llegó Corea en 2002?", opts: ["Octavos", "Semifinales", "Final"], correct: "Semifinales" },
  { country: 'Corea del Sur', q: "¿Quién es su jugador más emblemático actual?", opts: ["Son Heung-min", "Park Ji-sung", "Lee Kang-in"], correct: "Son Heung-min" },

  { country: 'Ecuador', q: "¿En qué año debutó Ecuador en un Mundial?", opts: ["1998", "2002", "2006"], correct: "2002" },
  { country: 'Ecuador', q: "¿Qué jugador ecuatoriano anotó el primer gol del Mundial 2022?", opts: ["Valencia", "Caicedo", "Estrada"], correct: "Valencia" },
  { country: 'Ecuador', q: "¿Quién fue el DT de Ecuador en 2022?", opts: ["Gustavo Alfaro", "Reynaldo Rueda", "Bolillo Gómez"], correct: "Gustavo Alfaro" },

  { country: 'Estados Unidos', q: "¿En qué año fue sede del Mundial?", opts: ["1990", "1994", "1998"], correct: "1994" },
  { country: 'Estados Unidos', q: "¿Qué jugador es conocido como el 'Capitán América'?", opts: ["Pulisic", "Donovan", "Bradley"], correct: "Pulisic" },
  { country: 'Estados Unidos', q: "¿Cuál es la liga de fútbol profesional de EE.UU.?", opts: ["USL", "MLS", "NASL"], correct: "MLS" },

  { country: 'Irán', q: "¿Cuál es el apodo de la selección de Irán?", opts: ["Team Melli", "Lions of Persia", "Desert Eagles"], correct: "Team Melli" },
  { country: 'Irán', q: "¿Cuántas veces ha clasificado Irán al Mundial?", opts: ["4", "5", "6"], correct: "6" },
  { country: 'Irán', q: "¿En qué año venció a Estados Unidos en un Mundial?", opts: ["1998", "2002", "2006"], correct: "1998" },

  { country: 'Japón', q: "¿Cuál es el apodo de la selección japonesa?", opts: ["Samurai Blue", "Blue Ninjas", "Rising Sun"], correct: "Samurai Blue" },
  { country: 'Japón', q: "¿Cuántas veces ha llegado Japón a octavos de final?", opts: ["2", "3", "4"], correct: "4" },
  { country: 'Japón', q: "¿Quién es su jugador más famoso actual?", opts: ["Kubo", "Minamino", "Endo"], correct: "Kubo" },

  { country: 'Jordania', q: "¿Ha clasificado Jordania alguna vez a un Mundial?", opts: ["Sí", "No", "En proceso"], correct: "No" },
  { country: 'Jordania', q: "¿En qué confederación juega Jordania?", opts: ["AFC", "CAF", "CONCACAF"], correct: "AFC" },
  { country: 'Jordania', q: "¿Cuál es su principal estadio nacional?", opts: ["Estadio Rey Abdullah", "Amman Stadium", "Petra Park"], correct: "Amman Stadium" },

  { country: 'México', q: "¿Cuántas veces ha sido sede México del Mundial?", opts: ["1", "2", "3"], correct: "2" },
  { country: 'México', q: "¿Qué jugador es conocido como 'Chicharito'?", opts: ["Jiménez", "Hernández", "Vela"], correct: "Hernández" },
  { country: 'México', q: "¿Hasta qué fase ha llegado México más veces?", opts: ["Octavos", "Cuartos", "Semifinales"], correct: "Octavos" },

  { country: 'Nueva Zelanda', q: "¿Cuál es el apodo de la selección neozelandesa?", opts: ["All Whites", "All Blacks", "Kiwi FC"], correct: "All Whites" },
  { country: 'Nueva Zelanda', q: "¿Cuántas veces ha clasificado al Mundial?", opts: ["1", "2", "3"], correct: "2" },
  { country: 'Nueva Zelanda', q: "¿Qué confederación pertenece?", opts: ["OFC", "AFC", "UEFA"], correct: "OFC" },

  { country: 'Uzbekistán', q: "¿En qué confederación participa Uzbekistán?", opts: ["UEFA", "AFC", "CAF"], correct: "AFC" },
  { country: 'Uzbekistán', q: "¿Ha clasificado Uzbekistán a un Mundial?", opts: ["Sí", "No", "En proceso"], correct: "No" },
  { country: 'Uzbekistán', q: "¿Cuál es su ciudad más futbolera?", opts: ["Tashkent", "Samarkanda", "Bujará"], correct: "Tashkent" },
];

function launchTrivia() {
  const randomQs = triviaBase.sort(() => 0.5 - Math.random()).slice(0, 5);

  const triviaBox = document.createElement('div');
  triviaBox.className = 'media-modal';
  triviaBox.innerHTML = `
    <div class="trivia-content">
      <h3> Trivia Mundial 2026</h3>
      <div id="trivia-questions"></div>
      <button class="close-media">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
      </button>
    </div>
  `;
  document.body.appendChild(triviaBox);

  const container = triviaBox.querySelector('#trivia-questions');
  randomQs.forEach(q => {
    const qDiv = document.createElement('div');
    qDiv.className = 'trivia-question';
    qDiv.innerHTML = `<p><strong>${q.country}</strong>: ${q.q}</p>`;
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
  if (btn.textContent === q.correct) {
    btn.classList.add('correct');
    btn.textContent += ' ✅';
  } else {
    btn.classList.add('wrong');
    btn.textContent += ' ❌';
  }
  qDiv.querySelectorAll('.opt').forEach(b => (b.disabled = true));
});

      qDiv.appendChild(btn);
    });
    container.appendChild(qDiv);
  });

  triviaBox.querySelector('.close-media').addEventListener('click', () => triviaBox.remove());
}

idleTriviaBtn.addEventListener('click', launchTrivia);















/* ==================================================== ESTADISTICAS ================================================== */
const idleStatsBtn = document.getElementById('idleStatsBtn');
idleStatsBtn.addEventListener('click', () => {
  const modal = document.createElement('div');
  modal.className = 'stats-dashboard';
  modal.innerHTML = `
    <h2> Estadísticas 2026</h2>
    <div class="stats-container">
      <div class="stat-item">
        <span> Equipos clasificados: <span class="stat-value">48</span></span>
        <div class="stat-bar"><div style="--val: 100%"></div></div>
      </div>
      <div class="stat-item">
        <span> Goles proyectados: <span class="stat-value">185</span></span>
        <div class="stat-bar"><div style="--val: 80%"></div></div>
      </div>
      <div class="stat-item">
        <span> Sedes confirmadas: <span class="stat-value">16</span></span>
        <div class="stat-bar"><div style="--val: 60%"></div></div>
      </div>
      <div class="stat-item">
        <span> Aficionados esperados: <span class="stat-value">5.8M</span></span>
        <div class="stat-bar"><div style="--val: 90%"></div></div>
      </div>
      <div class="stat-item">
        <span> Ingresos estimados: <span class="stat-value">$11B</span></span>
        <div class="stat-bar"><div style="--val: 75%"></div></div>
      </div>
    </div>
    <button id="closeStats"> 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
    </svg>
    </button>
  `;
  document.body.appendChild(modal);

  setTimeout(() => {
    modal.querySelectorAll('.stat-bar div').forEach((bar, i) => {
      setTimeout(() => { bar.style.width = bar.style.getPropertyValue('--val'); }, i * 200);
    });
  }, 200);

  modal.querySelector('#closeStats').addEventListener('click', () => {
    modal.remove();
  });
});











/* ==================================================== FILTROS ================================================== */
const cameraFeed = document.getElementById('cameraFeed');
const toggleFiltersBtn = document.getElementById('toggleFilters');
const filtersDiv = document.getElementById('filters');

async function startCameraFeed() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    cameraFeed.srcObject = stream;
  } catch (err) {
    console.error('No se pudo acceder a la cámara:', err);
  }
}
startCameraFeed();

toggleFiltersBtn.addEventListener('click', () => {
  filtersDiv.style.display = filtersDiv.style.display === 'none' ? 'flex' : 'none';
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.filter;
    cameraFeed.className = ''; 
    cameraFeed.classList.add(`filter-${type}`);

const ytModal = document.querySelector('.youtube-modal');
if (ytModal) {
  ytModal.className = `youtube-modal youtube-filter-${type}`;
}

  });
});









