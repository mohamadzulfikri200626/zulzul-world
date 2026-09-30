const navLinks = document.querySelectorAll("#category-nav .nav-btn[data-page]");

const currentPage = location.pathname.split("/").pop() || "index.html";

navLinks.forEach(link => {
  const isActive = link.getAttribute("data-page") === currentPage;
  link.classList.toggle("active", isActive);
});

(function initIntroAnimation() {
  const loader = document.getElementById("page-loader");
  const reveal = () => {
    document.body.classList.add("page-ready");
    if (loader) {
      loader.classList.add("loaded");
      window.setTimeout(() => loader.remove(), 700);
    }
  };
  if (document.readyState === "complete") {
    window.setTimeout(reveal, 350);
  } else {
    window.addEventListener("load", () => window.setTimeout(reveal, 350));
  }
})();

(function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const root = document.documentElement;
  const icon = toggle.querySelector(".theme-icon");
  const applyTheme = theme => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (icon) icon.textContent = "☀";
      toggle.setAttribute("aria-label", "Switch to dark mode");
    } else {
      root.removeAttribute("data-theme");
      if (icon) icon.textContent = "☾";
      toggle.setAttribute("aria-label", "Switch to light mode");
    }
    try {
      localStorage.setItem("zw-theme", theme);
    } catch (e) {}
  };
  let saved = "dark";
  try {
    saved = localStorage.getItem("zw-theme") || "dark";
  } catch (e) {}
  applyTheme(saved);
  toggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    applyTheme(isLight ? "dark" : "light");
  });
})();

(function initMusicPlayer() {
  const toggle = document.getElementById("music-toggle");
  const switchBtn = document.getElementById("music-switch");
  const audio = document.getElementById("bg-music");
  if (!toggle || !audio) return;

  const playlist = [
    { name: "Phonk", file: "Brazilian Phonk Sport by Infraction, Emerel Gray [No Copyright Music] Hurt.mp3" },
    { name: "Kamado Tanjiro no uta", file: "NO COPYRIGHT ANIME MUSIC Tanjiro no uta Theme - Demon Slayer (Slowed and Reverb).mp3" },
    { name: "Royalty Egzod NCS", file: "Egzod & Maestro Chives - Royalty (ft. Neoni) Trap NCS - Copyright Free Music.mp3" }
  ];

  let trackIndex = 0;
  try {
    const saved = parseInt(localStorage.getItem("zw-track-index"), 10);
    if (!Number.isNaN(saved) && playlist[saved]) trackIndex = saved;
  } catch (e) {}

  audio.volume = 0.35;
  audio.preload = "metadata";

  const musicUrl = (file) => new URL(`./assets/Music/${file}`, document.baseURI).href;

  const setPlayingState = (isPlaying) => {
    toggle.classList.toggle("playing", isPlaying);
    toggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    toggle.title = isPlaying ? `Pause — ${playlist[trackIndex].name}` : `Play — ${playlist[trackIndex].name}`;
  };

  const applyTrackLabel = () => {
    const track = playlist[trackIndex];
    if (switchBtn) switchBtn.title = "Ganti lagu — sekarang: " + track.name;
  };

  const loadTrack = (index, keepPlaying = false) => {
    trackIndex = (index % playlist.length + playlist.length) % playlist.length;
    audio.pause();
    audio.src = musicUrl(playlist[trackIndex].file);
    audio.load();
    applyTrackLabel();
    setPlayingState(false);
    try { localStorage.setItem("zw-track-index", String(trackIndex)); } catch (e) {}

    if (keepPlaying) {
      audio.play()
        .then(() => setPlayingState(true))
        .catch(() => setPlayingState(false));
    }
  };

  loadTrack(trackIndex, false);

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          setPlayingState(true);
          try { localStorage.setItem("zw-music", "on"); } catch (e) {}
        })
        .catch((err) => {
          setPlayingState(false);
          console.warn("Musik gagal diputar:", err);
          toggle.title = "Klik lagi untuk memutar musik";
        });
    } else {
      audio.pause();
      setPlayingState(false);
      try { localStorage.setItem("zw-music", "off"); } catch (e) {}
    }
  });

  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      const wasPlaying = !audio.paused;
      loadTrack(trackIndex + 1, wasPlaying);
    });
  }

  audio.addEventListener("canplay", () => {
    if (audio.paused) setPlayingState(false);
  });

  audio.addEventListener("error", () => {
    setPlayingState(false);
    toggle.title = "Musik tidak dapat dimuat — cek folder assets/Music";
    console.warn("Audio error:", audio.error);
  });

  audio.addEventListener("ended", () => setPlayingState(false));
})();

(function initCursorGlow() {
  const isTouchLike = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouchLike) return;
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  document.body.appendChild(glow);
  let lastX = 0;
  let lastY = 0;
  let ticking = false;
  document.addEventListener("mousemove", e => {
    lastX = e.clientX;
    lastY = e.clientY;
    glow.classList.add("active");
    if (!ticking) {
      window.requestAnimationFrame(() => {
        glow.style.left = lastX + "px";
        glow.style.top = lastY + "px";
        ticking = false;
      });
      ticking = true;
    }
  });
  document.addEventListener("mouseleave", () => glow.classList.remove("active"));
  window.addEventListener("blur", () => glow.classList.remove("active"));
})();

const ALL_PROJECTS = [ {
  page: "websites.html",
  id: "proj-portfolio-v1"
}, {
  page: "websites.html",
  id: "proj-moringa-cafee"
}, {
  page: "games.html",
  id: "proj-gta-vii"
}, {
  page: "experiments.html",
  id: "proj-hover-lab"
}, {
  page: "experiments.html",
  id: "proj-particle-bg"
}, {
  page: "projects.html",
  id: "proj-absensi"
}, {
  page: "projects.html",
  id: "proj-sistem-informasi"
} ];

function highlightProject(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  el.classList.add("project-highlight");
  window.setTimeout(() => el.classList.remove("project-highlight"), 2200);
}

(function initSurpriseMe() {
  const buttons = document.querySelectorAll(".surprise-trigger");
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const pick = ALL_PROJECTS[Math.floor(Math.random() * ALL_PROJECTS.length)];
      btn.classList.add("rolling");
      window.setTimeout(() => {
        btn.classList.remove("rolling");
        if (pick.page === currentPage) {
          highlightProject(pick.id);
        } else {
          window.location.href = pick.page + "#" + pick.id;
        }
      }, 420);
    });
  });
})();

(function initHashHighlight() {
  if (!location.hash) return;
  const id = location.hash.slice(1);
  window.addEventListener("load", () => {
    window.setTimeout(() => highlightProject(id), 500);
  });
})();

(function initInteractiveBackground() {
  const canvas = document.getElementById("interactive-bg");
  if (!canvas) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  const ctx = canvas.getContext("2d");
  let width, height, particles;
  const isSmallScreen = window.innerWidth < 700;
  const particleCount = isSmallScreen ? 26 : 55;
  const linkDistance = 130;
  const mouse = {
    x: null,
    y: null,
    radius: 130
  };
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .25,
        vy: (Math.random() - .5) * .25
      });
    }
  }
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += dx / dist * force * 1.1;
          p.y += dy / dist * force * 1.1;
        }
      }
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(224, 38, 63, 0.55)";
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(224, 38, 63, ${.12 * (1 - dist / linkDistance)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  createParticles();
  draw();
})();

(function initReactions() {
  const buttons = document.querySelectorAll(".reaction-btn");
  if (!buttons.length) return;
  const STORAGE_KEY = "zw-reactions";
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  };
  const save = data => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  };
  const renderCounts = () => {
    const data = load();
    buttons.forEach(btn => {
      const key = btn.getAttribute("data-reaction");
      const countEl = document.getElementById("count-" + key);
      if (countEl) countEl.textContent = data[key] || 0;
    });
  };
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-reaction");
      const data = load();
      data[key] = (data[key] || 0) + 1;
      save(data);
      renderCounts();
      btn.classList.remove("pop");
      void btn.offsetWidth;
      btn.classList.add("pop");
      const floatEmoji = document.createElement("span");
      floatEmoji.className = "reaction-float";
      floatEmoji.textContent = btn.querySelector(".reaction-emoji").textContent;
      btn.appendChild(floatEmoji);
      window.setTimeout(() => floatEmoji.remove(), 900);
    });
  });
  renderCounts();
})();

(function initCoinGame() {
  const playBtn = document.getElementById("game-toggle");
  const overlay = document.getElementById("game-overlay");
  const canvas = document.getElementById("coin-canvas");
  if (!playBtn || !overlay || !canvas) return;
  const ctx = canvas.getContext("2d");
  const hud = overlay.querySelector(".game-hud");
  const scoreEl = document.getElementById("game-score");
  const livesEl = document.getElementById("game-lives");
  const hearts = livesEl ? Array.from(livesEl.querySelectorAll(".game-heart")) : [];
  const closeBtn = document.getElementById("game-close");
  const overPanel = document.getElementById("game-over");
  const overScoreEl = document.getElementById("game-over-score");
  const overBestEl = document.getElementById("game-over-best");
  const overNoteEl = document.getElementById("game-over-note");
  const retryBtn = document.getElementById("game-retry");
  const overCloseBtn = document.getElementById("game-over-close");
  const MAX_LIVES = 5;
  const BEST_KEY = "zw-coin-best";
  const pageParts = document.querySelectorAll("body > header, body > section, body > footer");
  let width = 0;
  let height = 0;
  let state = "idle";
  let rafId = 0;
  let lastTime = 0;
  let score = 0;
  let lives = MAX_LIVES;
  let spawnIn = 0;
  let missFlash = 0;
  let coins = [];
  let bursts = [];
  let floaters = [];

  let audioCtx = null;
  let bgGain = null;
  let bgTimer = 0;
  let bgStep = 0;
  let bgNextTime = 0;
  const BG_STEP_DUR = 60 / 132 / 2;
  const BG_ROOTS = [45, 43, 41, 43];
  const BG_ARP = [[57, 60, 64, 60], [55, 59, 62, 59], [53, 57, 60, 57], [55, 59, 62, 59]];
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  function playTone(dest, freq, time, dur, type, vol) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + .01);
    g.gain.exponentialRampToValueAtTime(.0001, time + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(time);
    osc.stop(time + dur + .02);
  }
  function playCoinSound() {
    if (!getAudio()) return;
    const t = audioCtx.currentTime;
    playTone(audioCtx.destination, 988, t, .12, "square", .09);
    playTone(audioCtx.destination, 1319, t + .07, .28, "square", .09);
  }
  function scheduleBg() {
    while (bgNextTime < audioCtx.currentTime + .15) {
      const bar = Math.floor(bgStep / 4) % 4;
      const beat = bgStep % 4;
      playTone(bgGain, mtof(BG_ARP[bar][beat] + 12), bgNextTime, BG_STEP_DUR * .9, "triangle", .5);
      if (beat === 0) playTone(bgGain, mtof(BG_ROOTS[bar]), bgNextTime, BG_STEP_DUR * 3.6, "sine", .9);
      bgStep += 1;
      bgNextTime += BG_STEP_DUR;
    }
  }
  function startBacksound() {
    if (!getAudio()) return;
    stopBacksound(true);
    bgGain = audioCtx.createGain();
    bgGain.gain.value = .16;
    bgGain.connect(audioCtx.destination);
    bgStep = 0;
    bgNextTime = audioCtx.currentTime + .05;
    scheduleBg();
    bgTimer = window.setInterval(scheduleBg, 25);
  }
  function stopBacksound(immediate) {
    window.clearInterval(bgTimer);
    bgTimer = 0;
    if (!bgGain || !audioCtx) return;
    const g = bgGain;
    bgGain = null;
    if (immediate) {
      g.disconnect();
      return;
    }
    g.gain.cancelScheduledValues(audioCtx.currentTime);
    g.gain.setValueAtTime(g.gain.value, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .25);
    window.setTimeout(() => g.disconnect(), 400);
  }
  const loadBest = () => {
    try {
      return parseInt(localStorage.getItem(BEST_KEY), 10) || 0;
    } catch (e) {
      return 0;
    }
  };
  const saveBest = value => {
    try {
      localStorage.setItem(BEST_KEY, String(value));
    } catch (e) {}
  };
  const isOpen = () => !overlay.classList.contains("is-hidden");
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function renderHud() {
    if (scoreEl) scoreEl.textContent = score;
    hearts.forEach((heart, i) => heart.classList.toggle("lost", i >= lives));
    if (livesEl) livesEl.setAttribute("aria-label", "Nyawa tersisa " + lives + " dari " + MAX_LIVES);
  }
  function spawnCoin() {
    const r = width < 700 ? 24 : 28;
    const speed = 100 + Math.random() * 60 + Math.min(score * 3.5, 170);
    coins.push({
      x: r + 8 + Math.random() * (width - 2 * (r + 8)),
      y: -r,
      r: r,
      speed: speed,
      phase: Math.random() * Math.PI * 2,
      spin: 3 + Math.random() * 2
    });
  }
  function spawnInterval() {
    const base = Math.max(.45, 1.15 - score * .018);
    return base * (.8 + Math.random() * .4);
  }
  function addBurst(x, y) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.PI * 2 * i / 10 + Math.random() * .4;
      const speed = 120 + Math.random() * 120;
      bursts.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: .45
      });
    }
    floaters.push({
      x: x,
      y: y - 10,
      life: .7
    });
  }
  function loseLife() {
    lives -= 1;
    missFlash = .35;
    renderHud();
    if (hud) {
      hud.classList.remove("hurt");
      void hud.offsetWidth;
      hud.classList.add("hurt");
    }
    if (lives <= 0) endGame();
  }
  function update(dt) {
    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawnCoin();
      spawnIn = spawnInterval();
    }
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.y += c.speed * dt;
      c.phase += c.spin * dt;
      if (c.y - c.r > height) {
        coins.splice(i, 1);
        loseLife();
        if (state !== "playing") return;
      }
    }
    bursts.forEach(b => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
    });
    bursts = bursts.filter(b => b.life > 0);
    floaters.forEach(f => {
      f.y -= 50 * dt;
      f.life -= dt;
    });
    floaters = floaters.filter(f => f.life > 0);
    missFlash = Math.max(0, missFlash - dt);
  }
  function drawCoin(c) {
    const sx = .45 + .55 * Math.abs(Math.cos(c.phase));
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(sx, 1);
    const grad = ctx.createRadialGradient(-c.r * .3, -c.r * .35, c.r * .1, 0, 0, c.r);
    grad.addColorStop(0, "#ffe08a");
    grad.addColorStop(1, "#f2a900");
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#b87700";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, c.r * .72, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(122, 75, 0, 0.45)";
    ctx.stroke();
    ctx.fillStyle = "#7a4b00";
    ctx.font = "700 " + Math.round(c.r * 1.05) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₿", 0, 1);
    ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    if (missFlash > 0) {
      const g = ctx.createLinearGradient(0, height, 0, height - 140);
      g.addColorStop(0, "rgba(224, 38, 63, " + Math.min(.6, missFlash * 1.7) + ")");
      g.addColorStop(1, "rgba(224, 38, 63, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, height - 140, width, 140);
    }
    coins.forEach(drawCoin);
    bursts.forEach(b => {
      ctx.globalAlpha = Math.max(0, b.life / .45);
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#f2a900";
      ctx.fill();
    });
    ctx.font = "700 18px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f2a900";
    floaters.forEach(f => {
      ctx.globalAlpha = Math.max(0, f.life / .7);
      ctx.fillText("+1", f.x, f.y);
    });
    ctx.globalAlpha = 1;
  }
  function loop(now) {
    if (state !== "playing") return;
    const dt = Math.min((now - lastTime) / 1e3, .05);
    lastTime = now;
    update(dt);
    if (state !== "playing") return;
    draw();
    rafId = requestAnimationFrame(loop);
  }
  function startGame() {
    cancelAnimationFrame(rafId);
    score = 0;
    lives = MAX_LIVES;
    coins = [];
    bursts = [];
    floaters = [];
    missFlash = 0;
    spawnIn = .4;
    state = "playing";
    startBacksound();
    overPanel.classList.add("is-hidden");
    renderHud();
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  function endGame() {
    state = "over";
    stopBacksound();
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, width, height);
    const best = loadBest();
    const isRecord = score > best;
    if (isRecord) saveBest(score);
    overScoreEl.textContent = score;
    overBestEl.textContent = isRecord ? score : best;
    overNoteEl.textContent = isRecord && score > 0 ? "rekor baru!" : "";
    overPanel.classList.remove("is-hidden");
    retryBtn.focus();
  }
  function openGame() {
    overlay.classList.remove("is-hidden");
    document.body.classList.add("game-active");
    pageParts.forEach(el => {
      el.inert = true;
    });
    resizeCanvas();
    startGame();
    if (closeBtn) closeBtn.focus();
  }
  function closeGame() {
    state = "idle";
    stopBacksound();
    cancelAnimationFrame(rafId);
    overlay.classList.add("is-hidden");
    document.body.classList.remove("game-active");
    pageParts.forEach(el => {
      el.inert = false;
    });
    playBtn.focus();
  }
  canvas.addEventListener("pointerdown", e => {
    if (state !== "playing") return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    let hitIndex = -1;
    let hitDist = Infinity;
    coins.forEach((c, i) => {
      const d = Math.hypot(c.x - px, c.y - py);
      if (d <= c.r + 10 && d < hitDist) {
        hitIndex = i;
        hitDist = d;
      }
    });
    if (hitIndex === -1) return;
    const caught = coins.splice(hitIndex, 1)[0];
    score += 1;
    playCoinSound();
    addBurst(caught.x, caught.y);
    renderHud();
  });
  playBtn.addEventListener("click", openGame);
  if (closeBtn) closeBtn.addEventListener("click", closeGame);
  if (overCloseBtn) overCloseBtn.addEventListener("click", closeGame);
  if (retryBtn) retryBtn.addEventListener("click", () => {
    startGame();
    if (closeBtn) closeBtn.focus();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && isOpen()) closeGame();
  });
  window.addEventListener("resize", () => {
    if (isOpen()) resizeCanvas();
  });
})();