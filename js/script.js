/* ==========================================================================
   FADHIL HADIRA — Cinematic Portfolio — script.js
   ========================================================================== */
(function(){
  "use strict";

  const $  = (s, ctx) => (ctx||document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx||document).querySelectorAll(s));
  const isTouch = matchMedia("(hover:none), (pointer:coarse)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", init);

  function init(){
    initLoader();
    initSmoothScroll();
    initCursor();
    initNavbar();
    initReveal();
    initHeroFrames();
    initBadgeCard();
    initTypewriter();
    initBoxingShowcase();
    initMovieTrack();
    initMusicPlayer();
    initFooterYear();
  }

  /* ------------------------------------------------------------------ */
  /* LOADER                                                             */
  /* ------------------------------------------------------------------ */
  function initLoader(){
    const loader = $("#loader");
    if(!loader) return;
    const countEl = $(".loader-count", loader);
    const barEl   = $(".loader-bar span", loader);
    let n = 0;
    const step = () => {
      n += Math.random()*18 + 6;
      if(n >= 100) n = 100;
      if(countEl) countEl.textContent = String(Math.floor(n)).padStart(2,"0");
      if(barEl) barEl.style.width = n + "%";
      if(n < 100){ requestAnimationFrame(() => setTimeout(step, 60)); }
      else{ setTimeout(finish, 260); }
    };
    const finish = () => {
      loader.classList.add("is-done");
      document.body.style.overflow = "";
      setTimeout(() => loader.remove(), 800);
    };
    document.body.style.overflow = "hidden";
    requestAnimationFrame(step);
    // Safety net in case something stalls.
    setTimeout(() => { if(document.body.contains(loader) && !loader.classList.contains("is-done")) finish(); }, 4000);
  }

  /* ------------------------------------------------------------------ */
  /* SMOOTH SCROLL (Lenis + GSAP ScrollTrigger)                         */
  /* ------------------------------------------------------------------ */
  let lenis = null;
  function initSmoothScroll(){
    const hasGSAP = typeof window.gsap !== "undefined";
    if(hasGSAP && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      // Late-loading images/fonts can change section heights after the
      // first layout pass — re-measure ScrollTrigger start/end positions
      // once everything has settled so pinned sections don't desync.
      window.addEventListener("load", () => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 1200);
    }

    if(typeof window.Lenis !== "undefined" && !isTouch && !reducedMotion){
      lenis = new Lenis({ duration:1.05, smoothWheel:true, easing:(t)=>1-Math.pow(1-t,3) });
      const raf = (time) => { lenis.raf(time); if(hasGSAP) ScrollTrigger.update(); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      if(hasGSAP){ lenis.on("scroll", ScrollTrigger.update); }
    }

    // anchor links
    $$('a[data-nav], a.nav-brand').forEach(a => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if(!id || id.charAt(0) !== "#") return;
        const target = $(id);
        if(!target) return;
        e.preventDefault();
        closeMobileMenu();
        if(lenis){ lenis.scrollTo(target, { offset:-10 }); }
        else{ target.scrollIntoView({ behavior:"smooth" }); }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* CUSTOM CURSOR                                                       */
  /* ------------------------------------------------------------------ */
  function initCursor(){
    const cursor = $("#cursor");
    if(!cursor || isTouch) return;
    const label = $(".cursor-label", cursor);
    let x = -100, y = -100, cx = -100, cy = -100;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    const tick = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(tick);
    };
    cursor.style.left = "0"; cursor.style.top = "0";
    requestAnimationFrame(tick);

    $$("[data-cursor], a, button, .bx-slide, .movie-card, .track").forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-active");
        if(label) label.textContent = el.getAttribute("data-cursor") || "";
      });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });
  }

  /* ------------------------------------------------------------------ */
  /* NAVBAR + MOBILE MENU                                               */
  /* ------------------------------------------------------------------ */
  function closeMobileMenu(){
    $("#mobile-menu")?.classList.remove("is-open");
    $("#navToggle")?.classList.remove("is-open");
  }
  function initNavbar(){
    const navbar = $("#navbar");
    const toggle = $("#navToggle");
    const menu = $("#mobile-menu");
    const onScroll = () => navbar?.classList.toggle("is-scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });

    toggle?.addEventListener("click", () => {
      const open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
    });
    $$("#mobile-menu a").forEach(a => a.addEventListener("click", closeMobileMenu));

    // scrollspy
    const links = $$("#navbar a[data-nav]");
    const sections = links.map(a => $(a.getAttribute("href"))).filter(Boolean);
    if(!sections.length) return;
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin:"-40% 0px -50% 0px", threshold:0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ------------------------------------------------------------------ */
  /* REVEAL ON SCROLL                                                    */
  /* ------------------------------------------------------------------ */
  function initReveal(){
    const items = $$(".reveal");
    if(!items.length) return;
    if(reducedMotion){ items.forEach(el => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:"0px 0px -8% 0px" });
    items.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 5, 4) * 60 + "ms";
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* HERO — 240 FRAME SCROLL ANIMATION (with fallback)                  */
  /* ------------------------------------------------------------------ */
  function initHeroFrames(){
    const canvas = $("#boxing-canvas");
    const pin = $("#hero-pin");
    if(!canvas || !pin) return;
    const ctx = canvas.getContext("2d");
    const FRAME_COUNT = 240;
    const path = (i) => `assets/boxing/frame-${String(i).padStart(4,"0")}.jpg`;

    let loaded = 0;
    const images = [];
    const seq = { frame: 0 };

    function resize(){
      canvas.width = pin.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = pin.clientHeight * (window.devicePixelRatio || 1);
      canvas.style.width = pin.clientWidth + "px";
      canvas.style.height = pin.clientHeight + "px";
      render();
    }
    function render(){
      const img = images[seq.frame];
      if(!img || !img.complete || !img.naturalWidth) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const cw = canvas.width, ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight, cr = cw/ch;
      let dw, dh, dx, dy;
      if(ir > cr){ dh = ch; dw = ch*ir; dx = (cw-dw)/2; dy = 0; }
      else{ dw = cw; dh = cw/ir; dx = 0; dy = (ch-dh)/2; }
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    // Try loading the first frame to decide if the sequence exists at all.
    const probe = new Image();
    probe.onload = () => {
      pin.classList.add("frames-loaded");
      images[0] = probe; loaded = 1; render();
      for(let i = 2; i <= FRAME_COUNT; i++){
        const im = new Image();
        im.src = path(i);
        im.onload = () => { loaded++; if(i < 6) render(); };
        images[i-1] = im;
      }
      setupScrub();
    };
    probe.onerror = () => {
      // No frame assets yet — fallback gradient (.hero-fallback-glow) stays visible.
    };
    probe.src = path(1);

    function setupScrub(){
      window.addEventListener("resize", resize);
      resize();
      if(typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined"){
        // Fallback: scroll-linked without GSAP
        window.addEventListener("scroll", () => {
          const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight*1.2)));
          seq.frame = Math.round(p*(FRAME_COUNT-1));
          render();
        }, { passive:true });
        return;
      }
      gsap.to(seq, {
        frame: FRAME_COUNT - 1,
        ease:"none",
        snap:"frame",
        scrollTrigger:{
          trigger:"#hero",
          start:"top top",
          end:"+=140%",
          scrub:0.4,
          pin:true,
          pinSpacing:true,
          anticipatePin:1,
          invalidateOnRefresh:true
        },
        onUpdate: render
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* ABOUT — BADGE CARD (tilt + drag string)                            */
  /* ------------------------------------------------------------------ */
  function initBadgeCard(){
    const card = $("#badgeCard");
    if(!card || isTouch) return;
    let raf = null;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `rotateY(${px*14}deg) rotateX(${py*-14}deg)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  /* ------------------------------------------------------------------ */
  /* ABOUT — TYPEWRITER ROLE                                            */
  /* ------------------------------------------------------------------ */
  function initTypewriter(){
    const el = $(".tw-text");
    if(!el) return;
    const words = ["FADHIL", "BOXER", "FILMMAKER", "DEVELOPER"];
    let wi = 0, ci = 0, deleting = false;

    function tick(){
      const word = words[wi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 45 : 95;
      if(!deleting && ci === word.length){ delay = 1400; deleting = true; }
      else if(deleting && ci === 0){ deleting = false; wi = (wi+1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ------------------------------------------------------------------ */
  /* BOXING SHOWCASE — mixed aspect-ratio carousel                      */
  /* ------------------------------------------------------------------ */
  function initBoxingShowcase(){
    const stage = $("#bxShowcase");
    const track = $("#bxTrack");
    const dotsWrap = $("#bxDots");
    const prevBtn = $("#bxPrev");
    const nextBtn = $("#bxNext");
    if(!stage || !track) return;

    const slides = $$(".bx-slide", track);
    if(!slides.length) return;

    let index = 0;
    let timer = null;
    const AUTOPLAY_MS = 4200;

    // dots
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Slide " + (i+1));
      b.addEventListener("click", () => goTo(i));
      dotsWrap?.appendChild(b);
    });
    const dots = $$("button", dotsWrap);

    function render(){
      const n = slides.length;
      slides.forEach((slide, i) => {
        slide.classList.remove("is-current","is-prev","is-next");
        if(i === index) slide.classList.add("is-current");
        else if(i === (index - 1 + n) % n) slide.classList.add("is-prev");
        else if(i === (index + 1) % n) slide.classList.add("is-next");

        // Video TIDAK PERNAH diputar otomatis oleh carousel — hanya
        // dihentikan saat slide-nya bergeser keluar dari tengah.
        if(i !== index){
          const video = $("video", slide);
          if(video && !video.paused) video.pause();
        }
      });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }

    // Tombol play/pause kustom per video — putar hanya saat diklik,
    // dan bisa dihentikan kapan saja dengan klik yang sama atau kontrol native.
    slides.forEach(slide => {
      const video = $("video", slide);
      const btn = $(".bx-play-toggle", slide);
      if(!video || !btn) return;
      const media = video.parentElement;
      const sync = () => {
        const playing = !video.paused && !video.ended;
        media.classList.toggle("is-playing", playing);
      };
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(video.paused){
          video.controls = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
      video.addEventListener("play", sync);
      video.addEventListener("pause", sync);
      video.addEventListener("ended", sync);
    });

    function goTo(i){
      index = ((i % slides.length) + slides.length) % slides.length;
      render();
      restartAutoplay();
    }
    function next(){ goTo(index + 1); }
    function prev(){ goTo(index - 1); }

    function restartAutoplay(){
      clearInterval(timer);
      timer = setInterval(next, AUTOPLAY_MS);
    }

    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);
    stage.addEventListener("mouseenter", () => clearInterval(timer));
    stage.addEventListener("mouseleave", restartAutoplay);

    // click side slides to bring them to center
    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        if(slide.classList.contains("is-current")) return;
        goTo(i);
      });
    });

    // swipe
    let touchX = null;
    stage.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; clearInterval(timer); }, { passive:true });
    stage.addEventListener("touchend", (e) => {
      if(touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
      touchX = null;
      restartAutoplay();
    }, { passive:true });

    render();
    restartAutoplay();

    // floating particles (decorative)
    const particles = $("#bxParticles");
    if(particles){
      for(let i=0;i<18;i++){
        const s = document.createElement("span");
        s.style.left = Math.random()*100 + "%";
        s.style.top = Math.random()*100 + "%";
        s.style.opacity = (Math.random()*0.5+0.15).toFixed(2);
        s.style.transform = `scale(${(Math.random()*1.6+0.4).toFixed(2)})`;
        particles.appendChild(s);
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* MOVIES — draggable track + arrows                                  */
  /* ------------------------------------------------------------------ */
  function initMovieTrack(){
    const wrap = $(".movie-track-wrap");
    const track = $("#movieTrack");
    const prevBtn = $("#movPrev");
    const nextBtn = $("#movNext");
    if(!wrap || !track) return;

    const step = () => (track.querySelector(".movie-card")?.offsetWidth || 230) + 22;

    function scrollBy(delta){
      wrap.scrollBy({ left: delta, behavior:"smooth" });
    }
    prevBtn?.addEventListener("click", () => scrollBy(-step()*2));
    nextBtn?.addEventListener("click", () => scrollBy(step()*2));

    // drag to scroll
    let isDown = false, startX = 0, startScroll = 0;
    wrap.addEventListener("mousedown", (e) => {
      isDown = true; wrap.classList.add("is-dragging");
      startX = e.pageX; startScroll = wrap.scrollLeft;
    });
    window.addEventListener("mouseup", () => { isDown = false; wrap.classList.remove("is-dragging"); });
    window.addEventListener("mousemove", (e) => {
      if(!isDown) return;
      wrap.scrollLeft = startScroll - (e.pageX - startX);
    });
  }

  /* ------------------------------------------------------------------ */
  /* MUSIC PLAYER                                                        */
  /* ------------------------------------------------------------------ */
  function initMusicPlayer(){
    const tracks = $$(".track");
    const vinyl = $("#vinyl");
    const progressBar = $("#progressBar");
    const progressFill = $("#progressFill");
    const timeCurrent = $("#timeCurrent");
    const timeTotal = $("#timeTotal");
    const note = $("#playerNote");
    if(!tracks.length) return;

    const audio = new Audio();
    audio.preload = "none";
    let activeIndex = 0;

    function fmt(s){
      if(!isFinite(s)) return "0:00";
      const m = Math.floor(s/60), sec = Math.floor(s%60);
      return m + ":" + String(sec).padStart(2,"0");
    }

    function setActive(i){
      tracks.forEach((t, idx) => t.classList.toggle("active", idx === i));
      activeIndex = i;
    }

    function updatePlayState(){
      tracks.forEach((t, i) => {
        const playing = i === activeIndex && !audio.paused && audio.src;
        t.classList.toggle("is-playing", !!playing);
        const btn = $(".t-play", t);
        if(btn) btn.textContent = playing ? "❚❚" : "▶";
      });
    }

    function playTrack(i){
      const t = tracks[i];
      setActive(i);
      audio.src = t.getAttribute("data-src");
      audio.play().then(() => {
        vinyl?.classList.add("is-spinning");
        if(note) note.style.display = "none";
      }).catch(() => {
        updatePlayState();
        if(note){
          note.style.display = "block";
          note.textContent = "File belum ditemukan — letakkan " + t.getAttribute("data-src") + " untuk memutar lagu ini.";
        }
      });
    }

    tracks.forEach((t, i) => {
      t.addEventListener("click", () => {
        if(i === activeIndex && !audio.paused){ audio.pause(); return; }
        if(i === activeIndex && audio.paused && audio.src){ audio.play(); return; }
        playTrack(i);
      });
    });

    audio.addEventListener("timeupdate", () => {
      if(!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if(progressFill) progressFill.style.width = pct + "%";
      if(timeCurrent) timeCurrent.textContent = fmt(audio.currentTime);
      if(timeTotal) timeTotal.textContent = fmt(audio.duration);
    });
    audio.addEventListener("ended", () => {
      const nextI = (activeIndex + 1) % tracks.length;
      playTrack(nextI);
    });
    audio.addEventListener("pause", () => { vinyl?.classList.remove("is-spinning"); updatePlayState(); });
    audio.addEventListener("play", () => { vinyl?.classList.add("is-spinning"); updatePlayState(); });

    progressBar?.addEventListener("click", (e) => {
      if(!audio.duration) return;
      const r = progressBar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });
  }

  /* ------------------------------------------------------------------ */
  /* FOOTER YEAR                                                         */
  /* ------------------------------------------------------------------ */
  function initFooterYear(){
    const el = $("#footerYear");
    if(el) el.textContent = String(new Date().getFullYear());
  }

})();
