(function () {
    'use strict';

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return; // very old browser: silently do nothing

    /* ---------- tweakable settings ---------- */
    const CFG = {
        master: 0.9,   // overall volume
        music: 0.5,    // background music level
        sfx: 0.8,      // click + sparkle level
        chordSec: 12   // seconds per chord of the music loop
    };

    /* ---------- helpers ---------- */
    const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = a => a[Math.floor(Math.random() * a.length)];

    let ctx, master, musicBus, sfxBus, reverb, revSend, delay, delaySend;
    let muted = false, musicOn = false, nextChordT = 0, chordIdx = 0, sched = null;

    try { muted = localStorage.getItem('grove-muted') === '1'; } catch (e) {}

    /* ---------- audio graph ---------- */
    function impulse(sec, decay) {
        const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let c = 0; c < 2; c++) {
            const d = b.getChannelData(c);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
        }
        return b;
    }

    function init() {
        if (ctx) return;
        ctx = new AC();

        master = ctx.createGain();
        master.gain.value = muted ? 0 : CFG.master;
        const comp = ctx.createDynamicsCompressor();
        master.connect(comp); comp.connect(ctx.destination);

        musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
        sfxBus = ctx.createGain(); sfxBus.gain.value = CFG.sfx; sfxBus.connect(master);

        // Lush hall reverb shared by everything
        reverb = ctx.createConvolver(); reverb.buffer = impulse(3.8, 2.6);
        const revOut = ctx.createGain(); revOut.gain.value = 0.9;
        reverb.connect(revOut); revOut.connect(master);
        revSend = ctx.createGain(); revSend.gain.value = 0.55;
        musicBus.connect(revSend); sfxBus.connect(revSend); revSend.connect(reverb);

        // Soft echo for the plucked notes
        delay = ctx.createDelay(2); delay.delayTime.value = 0.46;
        const fb = ctx.createGain(); fb.gain.value = 0.36;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
        delay.connect(lp); lp.connect(fb); fb.connect(delay);
        lp.connect(musicBus);
        delaySend = ctx.createGain(); delaySend.gain.value = 0.4; delaySend.connect(delay);
    }

    /* ---------- background music ---------- */
    // D Lydian-flavoured, slow and dreamy. MIDI note numbers.
    const CHORDS = [
        { pad: [50, 57, 61, 64, 66], bass: 38 },   // Dmaj9
        { pad: [47, 54, 57, 62, 66], bass: 35 },   // Bm7
        { pad: [43, 50, 54, 59, 62], bass: 31 },   // Gmaj7
        { pad: [45, 52, 59, 61, 64], bass: 33 }    // Asus2/add
    ];
    const SCALE = [62, 64, 66, 69, 71, 73]; // D E F# A B C# (pentatonic + 7th)

    function padVoice(m, t, dur) {
        const f = mtof(m), g = ctx.createGain(), lp = ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 1300; lp.Q.value = 0.4;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.045, t + 3.5);
        g.gain.setValueAtTime(0.045, t + dur - 0.5);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 3.5);
        [['sine', -5], ['triangle', 6]].forEach(([type, cents]) => {
            const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = cents;
            o.connect(lp); o.start(t); o.stop(t + dur + 4);
        });
        // very slow shimmer on the filter
        const lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = rnd(0.07, 0.18); lg.gain.value = 250;
        lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t); lfo.stop(t + dur + 4);
        lp.connect(g); g.connect(musicBus);
    }

    function bassVoice(m, t, dur) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = mtof(m);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 4);
        g.gain.setValueAtTime(0.09, t + dur - 1);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 3);
        o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + dur + 3.5);
    }

    function pluck(m, t, vel, bus) {
        const f = mtof(m), g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vel, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2;
        const g2 = ctx.createGain(); g2.gain.value = 0.18;
        o.connect(g); o2.connect(g2); g2.connect(g);
        g.connect(bus || musicBus);
        if (!bus) g.connect(delaySend);
        o.start(t); o2.start(t); o.stop(t + 2.8); o2.stop(t + 2.8);
    }

    function scheduleChord(t) {
        const ch = CHORDS[chordIdx % CHORDS.length], d = CFG.chordSec;
        chordIdx++;
        ch.pad.forEach((m, i) => padVoice(m, t + i * 0.25, d));
        bassVoice(ch.bass, t, d);
        // drifting harp-like melody with plenty of rests
        for (let x = 0.8; x < d - 1; x += rnd(0.9, 1.9)) {
            if (Math.random() < 0.25) continue;
            const m = pick(SCALE) + (Math.random() < 0.3 ? 12 : 0);
            pluck(m, t + x, rnd(0.05, 0.1));
        }
        // an occasional high, tiny chime
        if (Math.random() < 0.6) pluck(pick(SCALE) + 24, t + rnd(2, d - 2), 0.035);
        nextChordT = t + d - 1.5; // overlap for seamless blending
    }

    function startMusic() {
        if (musicOn) return;
        musicOn = true;
        musicBus.gain.setValueAtTime(0.0001, ctx.currentTime);
        musicBus.gain.linearRampToValueAtTime(CFG.music, ctx.currentTime + 5);
        nextChordT = ctx.currentTime + 0.2;
        const tick = () => { while (nextChordT < ctx.currentTime + 6) scheduleChord(nextChordT); };
        tick();
        sched = setInterval(tick, 500);
    }

    /* ---------- sound effects ---------- */
    function click() {
        if (!ctx || muted) return;
        const t = ctx.currentTime, f = rnd(740, 880);
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, t);
        o.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.07);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.22, t + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.25);
        // tiny glassy overtone
        const o2 = ctx.createOscillator(), g2 = ctx.createGain();
        o2.type = 'triangle'; o2.frequency.value = f * 3;
        g2.gain.setValueAtTime(0.0001, t);
        g2.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o2.connect(g2); g2.connect(sfxBus); o2.start(t); o2.stop(t + 0.15);
    }

    function sparkle() {
        if (!ctx || muted) return;
        const t0 = ctx.currentTime + 0.02;
        // rising pentatonic run of bells…
        const run = [74, 78, 81, 85, 86, 90, 93, 97];
        run.forEach((m, i) => pluck(m, t0 + i * 0.075, 0.13, sfxBus));
        // …then glittering random twinkles
        for (let i = 0; i < 16; i++) {
            const m = pick([81, 85, 86, 90, 93, 97, 98]);
            pluck(m, t0 + 0.6 + Math.random() * 1.3, rnd(0.04, 0.09), sfxBus);
        }
        // warm, soft chord underneath for a "congratulations" feel
        [62, 66, 69, 74].forEach(m => pluck(m, t0 + 0.55, 0.09, sfxBus));
    }

    function sigh() { // gentle, non-scary tone when a minigame is lost
        if (!ctx || muted) return;
        const t = ctx.currentTime + 0.02;
        [69, 66, 62].forEach((m, i) => pluck(m, t + i * 0.28, 0.1, sfxBus));
    }

    /* ---------- wiring (no changes to game code required) ---------- */
    // 1) Unlock + start on the first interaction (browser autoplay rules)
    const unlock = () => {
        init();
        if (ctx.state === 'suspended') ctx.resume();
        startMusic();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
        document.addEventListener(ev, unlock, { capture: true, passive: true }));

    // 2) Click sound for every button (capture phase so it still plays
    //    even if the game removes the button during its own handler)
    document.addEventListener('click', e => {
        const b = e.target.closest && e.target.closest('button');
        if (!b || b.id === 'grove-sound') return;
        if (ctx && ctx.state === 'suspended') ctx.resume();
        click();
    }, true);

    // 3) Watch for minigame results: game.js/minigames.js add class "won"
    //    to the play area on success and "lost" on failure.
    const seen = new WeakSet();
    new MutationObserver(muts => {
        for (const m of muts) {
            const el = m.target;
            if (!el.classList || el.id !== 'pl' || seen.has(el)) continue;
            if (el.classList.contains('won')) { seen.add(el); sparkle(); }
            else if (el.classList.contains('lost')) { seen.add(el); sigh(); }
        }
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

    // 4) Pause audio when the tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (!ctx) return;
        if (document.hidden) ctx.suspend(); else ctx.resume();
    });

    /* ---------- mute button ---------- */
    function addButton() {
        const b = document.createElement('button');
        b.id = 'grove-sound';
        b.type = 'button';
        b.style.cssText =
            'position:fixed;right:calc(14px + env(safe-area-inset-right,0px));' +
            'top:calc(14px + env(safe-area-inset-top,0px));z-index:9999;' +
            'width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.35);' +
            'background:rgba(10,30,30,.6);color:#fff;font-size:22px;line-height:1;cursor:pointer;' +
            'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);padding:0;';
        const paint = () => {
            b.textContent = muted ? '🔇' : '🔊';
            b.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
            b.title = muted ? 'Sound off' : 'Sound on';
        };
        b.onclick = () => {
            muted = !muted;
            try { localStorage.setItem('grove-muted', muted ? '1' : '0'); } catch (e) {}
            init();
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setTargetAtTime(muted ? 0 : CFG.master, ctx.currentTime, 0.15);
            if (!muted) { ctx.resume(); startMusic(); }
            paint();
        };
        paint();
        document.body.appendChild(b);
    }
    if (document.body) addButton();
    else document.addEventListener('DOMContentLoaded', addButton);
})();
