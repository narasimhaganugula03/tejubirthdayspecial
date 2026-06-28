/* ═══════════════════════════════
   STATE & CONSTANTS
═══════════════════════════════ */
let current = 0;
const TOTAL = 6;
let finaleStarted = false;
let finaleInterval = null;

/* ═══════════════════════════════
   PROGRESS DOTS
═══════════════════════════════ */
const progressEl = document.getElementById('progress');
for (let i = 0; i < TOTAL; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goTo(i));
  progressEl.appendChild(d);
}

function updateUI() {
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  document.getElementById('prev-btn').classList.toggle('hidden', current === 0);
  document.getElementById('next-btn').classList.toggle('hidden', current === TOTAL - 1);
  document.getElementById('slide-counter').textContent = `${current + 1} / ${TOTAL}`;
}

/* ═══════════════════════════════
   NAVIGATION
═══════════════════════════════ */
function goTo(idx) {
  if (idx < 0 || idx >= TOTAL || idx === current) return;
  const slides = document.querySelectorAll('.slide');
  const prev = slides[current];
  const next = slides[idx];

  const dir = idx > current ? 'exit-left' : 'exit-right';
  prev.classList.add(dir);
  prev.classList.remove('active');
  setTimeout(() => prev.classList.remove(dir), 700);

  next.classList.add('active');
  current = idx;
  updateUI();

  if (current === TOTAL - 1 && !finaleStarted) {
    finaleStarted = true;
    initFinaleHearts();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
});

let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
}, { passive: true });

/* ═══════════════════════════════
   FLOATING HEARTS
═══════════════════════════════ */
const heartsEl = document.getElementById('hearts-container');
const heartEmojis = ['❤️', '💕', '💗', '💓', '💖', '💝', '🌸', '✨', '💞', '🦋'];

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'floating-heart';
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + 'vw';
  const dur = 6 + Math.random() * 8;
  h.style.animationDuration = dur + 's';
  h.style.fontSize = (.8 + Math.random() * 1.4) + 'rem';
  heartsEl.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000 + 500);
}
setInterval(spawnHeart, 700);
for (let i = 0; i < 10; i++) spawnHeart();

/* ═══════════════════════════════
   MUSIC (YouTube — Tum Hi Ho)
═══════════════════════════════ */
/* To change song, replace SONG_ID with any YouTube video ID:
   Hawayein              : 7bAJYpyFAMM
   Tera Ban Jaunga       : J_oBXTMoI_8
   Bekhayali             : FrJ5xkMH4qs  */
const SONG_ID = 'Umqb9KENgmk';

let musicPlaying = false;
let ytPlayer = null;
const musicBtn = document.getElementById('music-toggle');

function buildYTFrame() {
  if (ytPlayer) return;
  const iframe = document.createElement('iframe');
  iframe.id = 'yt-player';
  iframe.width  = '0';
  iframe.height = '0';
  iframe.style.cssText = 'position:fixed;bottom:0;left:0;opacity:0;pointer-events:none;';
  iframe.allow = 'autoplay';
  iframe.src = `https://www.youtube-nocookie.com/embed/${SONG_ID}?autoplay=1&loop=1&playlist=${SONG_ID}&controls=0&disablekb=1&modestbranding=1&mute=0`;
  document.body.appendChild(iframe);
  ytPlayer = iframe;
}

function startMusic() {
  if (musicPlaying) return;
  musicPlaying = true;
  musicBtn.textContent = '🔇';
  buildYTFrame();
}

function stopMusic() {
  musicPlaying = false;
  musicBtn.textContent = '🎵';
  if (ytPlayer) { ytPlayer.src = ''; ytPlayer.remove(); ytPlayer = null; }
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) stopMusic(); else startMusic();
});

/* ═══════════════════════════════
   CAKE — blow out candles
═══════════════════════════════ */
let candlesOut = 0;

function blowCandle(wrap) {
  const flame = wrap.querySelector('.flame');
  if (flame && !flame.classList.contains('out')) {
    flame.classList.add('out');
    if (++candlesOut >= 5) {
      document.getElementById('blow-hint').style.display  = 'none';
      document.getElementById('cake-blown').style.display = 'block';
      miniConfetti();
    }
  }
}

function miniConfetti() {
  const cols = ['#ff69b4', '#ff4d94', '#ffd700', '#ff8c00', '#9b59b6', '#3498db'];
  if (!document.getElementById('cfall-style')) {
    const s = document.createElement('style');
    s.id = 'cfall-style';
    s.textContent = '@keyframes cfall{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(180px) rotate(360deg)}}';
    document.head.appendChild(s);
  }
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.style.cssText = `position:fixed;top:${40 + Math.random() * 20}%;left:${20 + Math.random() * 60}%;width:8px;height:8px;border-radius:50%;z-index:9999;pointer-events:none;background:${cols[Math.floor(Math.random() * cols.length)]};animation:cfall 1.5s ease-out forwards;`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1600);
    }, i * 22);
  }
}

/* ═══════════════════════════════
   GIFT BOX
═══════════════════════════════ */
function openGift() {
  document.getElementById('giftBox').classList.add('open');
  document.querySelector('.gift-hint').style.display = 'none';
}

/* ═══════════════════════════════
   FINALE — FLOATING HEARTS
═══════════════════════════════ */
function initFinaleHearts() {
  const slide  = document.getElementById('s5');
  const icons  = ['❤️','💕','💖','💗','💓','🌹','✨','💝'];

  function spawn() {
    const el = document.createElement('span');
    el.className = 'finale-float-heart';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left     = (Math.random() * 96) + '%';
    el.style.fontSize = (.8 + Math.random() * 2.2) + 'rem';
    const dur = 5 + Math.random() * 6;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * 1.5) + 's';
    slide.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  for (let i = 0; i < 14; i++) setTimeout(spawn, i * 250);
  finaleInterval = setInterval(spawn, 700);
}

/* ═══════════════════════════════
   INIT
═══════════════════════════════ */
updateUI();