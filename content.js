(function () {
  'use strict';
  if (document.getElementById('hc-bar')) return;

  function showLoadingScreen() {
    const style = document.createElement('style');
    style.textContent = `
      #dc-loader { position: fixed; inset: 0; z-index: 999999; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Courier New', monospace; overflow: hidden; }
      #dc-loader canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
      @keyframes dc-flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 95%{opacity:1} 97%{opacity:0.85} }
      @keyframes dc-scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
      @keyframes dc-glow-pulse { 0%,100%{text-shadow:0 0 10px #fff,0 0 30px #fff,0 0 60px rgba(255,255,255,0.5)} 50%{text-shadow:0 0 20px #fff,0 0 60px #fff,0 0 100px rgba(255,255,255,0.8),0 0 140px rgba(255,255,255,0.3)} }
      @keyframes dc-mrtree-glow { 0%,100%{text-shadow:0 0 10px #ff2020,0 0 30px #ff0000,0 0 60px rgba(255,0,0,0.5)} 50%{text-shadow:0 0 20px #ff4040,0 0 60px #ff0000,0 0 100px rgba(255,0,0,0.8),0 0 140px rgba(200,0,0,0.4)} }
      @keyframes dc-fade-in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      @keyframes dc-fade-out { from{opacity:1} to{opacity:0} }
      @keyframes dc-logo-in { 0%{opacity:0;transform:scale(0.6) rotate(-8deg)} 60%{opacity:1;transform:scale(1.08) rotate(1deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
      @keyframes dc-ring-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes dc-ring-spin-r { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
      @keyframes dc-bar-fill { from{width:0} to{width:100%} }
      #dc-scanline-el { position: absolute; left: 0; right: 0; height: 3px; background: linear-gradient(transparent, rgba(255,255,255,0.06), transparent); animation: dc-scanline 2.8s linear infinite; pointer-events: none; }
      #dc-logo-wrap { position: relative; width: 110px; height: 110px; margin-bottom: 32px; animation: dc-logo-in 0.9s cubic-bezier(0.22,1,0.36,1) forwards; }
      .dc-ring { position: absolute; border-radius: 50%; border: 2px solid transparent; }
      .dc-ring-1 { inset:0; border-top-color:rgba(255,255,255,0.9); border-right-color:rgba(255,255,255,0.2); animation:dc-ring-spin 1.4s linear infinite; filter:drop-shadow(0 0 6px #fff); }
      .dc-ring-2 { inset:10px; border-bottom-color:rgba(255,255,255,0.7); border-left-color:rgba(255,255,255,0.15); animation:dc-ring-spin-r 2s linear infinite; filter:drop-shadow(0 0 4px rgba(255,255,255,0.6)); }
      .dc-ring-3 { inset:22px; border-top-color:rgba(255,255,255,0.5); border-right-color:rgba(255,255,255,0.1); animation:dc-ring-spin 3s linear infinite; }
      #dc-logo-inner { position:absolute; inset:32px; background:radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%); border-radius:50%; display:flex; align-items:center; justify-content:center; }
      #dc-logo-inner svg { width:36px; height:36px; filter:drop-shadow(0 0 8px #fff) drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
      #dc-content { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; }
      #dc-title { font-size:22px; font-weight:700; letter-spacing:5px; color:#fff; text-transform:uppercase; white-space:nowrap; opacity:0; animation:dc-fade-in 0.7s ease 0.9s forwards, dc-glow-pulse 2.5s ease 1.6s infinite, dc-flicker 8s ease 2s infinite; }
      #dc-version { font-size:11px; letter-spacing:6px; color:rgba(255,255,255,0.45); margin-top:6px; opacity:0; animation:dc-fade-in 0.6s ease 1.3s forwards; }
      #dc-mrtree { font-size:13px; letter-spacing:5px; color:#ff2020; margin-top:22px; opacity:0; text-transform:uppercase; animation:dc-fade-in 0.7s ease 2.2s forwards, dc-mrtree-glow 2s ease 2.9s infinite; }
      #dc-bar-wrap { margin-top:36px; width:200px; height:2px; background:rgba(255,255,255,0.08); border-radius:2px; overflow:hidden; opacity:0; animation:dc-fade-in 0.4s ease 1.5s forwards; }
      #dc-bar-fill { height:100%; width:0; border-radius:2px; background:linear-gradient(90deg,rgba(255,255,255,0.3),#fff,rgba(255,255,255,0.3)); box-shadow:0 0 8px #fff,0 0 20px rgba(255,255,255,0.5); animation:dc-bar-fill 2.4s cubic-bezier(0.4,0,0.2,1) 1.5s forwards; }
      #dc-dots { margin-top:14px; font-size:9px; letter-spacing:4px; color:rgba(255,255,255,0.25); opacity:0; animation:dc-fade-in 0.4s ease 1.8s forwards; }
    `;
    document.head.appendChild(style);

    const el = document.createElement('div');
    el.id = 'dc-loader';
    el.innerHTML = `
      <canvas id="dc-particles"></canvas>
      <div id="dc-scanline-el"></div>
      <div id="dc-content">
        <div id="dc-logo-wrap">
          <div class="dc-ring dc-ring-1"></div>
          <div class="dc-ring dc-ring-2"></div>
          <div class="dc-ring dc-ring-3"></div>
          <div id="dc-logo-inner">
            <svg viewBox="0 0 24 24" stroke="#fff" fill="none" stroke-width="1.8">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
        </div>
        <div id="dc-title">Mrtree Cord</div>
        <div id="dc-version">النسخة الثانية</div>
        <div id="dc-mrtree">من صنع MRTREE</div>
        <div id="dc-bar-wrap"><div id="dc-bar-fill"></div></div>
        <div id="dc-dots">جاري التشغيل...</div>
      </div>
    `;
    document.body.appendChild(el);

    const canvas = document.getElementById('dc-particles');
    const ctx = canvas.getContext('2d');
    let W, H;
    const pts = Array.from({length: 70}, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      a: Math.random() * 0.5 + 0.1,
    }));
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    let raf;
    (function draw() {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      });
    })();

    setTimeout(() => {
      el.style.animation = 'dc-fade-out 0.7s ease forwards';
      setTimeout(() => { cancelAnimationFrame(raf); el.remove(); style.remove(); }, 700);
    }, 3800);
  }

  if (document.body) { showLoadingScreen(); }
  else { document.addEventListener('DOMContentLoaded', showLoadingScreen); }
const MAX_GAIN   = 100;
const MAX_PREAMP = 100;

const EQ_BANDS = [
  { id: 'hc-eq1',  freq: 31,    type: 'lowshelf', label: '31 هرتز'  },
  { id: 'hc-eq2',  freq: 63,    type: 'peaking',  label: '63 هرتز'  },
  { id: 'hc-eq3',  freq: 125,   type: 'peaking',  label: '125 هرتز' },
  { id: 'hc-eq4',  freq: 250,   type: 'peaking',  label: '250 هرتز' },
  { id: 'hc-eq5',  freq: 500,   type: 'peaking',  label: '500 هرتز' },
  { id: 'hc-eq6',  freq: 1000,  type: 'peaking',  label: '1 كيلو'   },
  { id: 'hc-eq7',  freq: 2000,  type: 'peaking',  label: '2 كيلو'   },
  { id: 'hc-eq8',  freq: 4000,  type: 'peaking',  label: '4 كيلو'   },
  { id: 'hc-eq9',  freq: 8000,  type: 'peaking',  label: '8 كيلو'   },
  { id: 'hc-eq10', freq: 16000, type: 'highshelf', label: '16 كيلو' },
];

/* ============================================================
   ⭐ كود AudioWorklet — مصحّح لمنع الصوت المزدوج
============================================================ */
const PITCH_WORKLET_SRC = `
  class MrtreePitch extends AudioWorkletProcessor {
    constructor() {
      super();
      this.ratio = 1;
      this.targetRatio = 1;
      this.BUF = 16384;
      this.buf = new Float32Array(this.BUF);
      this.wPos = 0;
      this.G = 1024;
      this.H = 512;
      this.win = new Float32Array(this.G);
      for (let i = 0; i < this.G; i++) {
        this.win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / this.G);
      }
      this.grains = [];
      this.outAbs = 0;
      this.nextOut = 0;
      this.port.onmessage = (e) => {
        if (!e.data) return;
        if (typeof e.data.ratio === 'number') {
          this.targetRatio = e.data.ratio;
          if (e.data.instant) {
            this.ratio = e.data.ratio;
          }
        }
        if (e.data.clearGrains) {
          this.grains.length = 0;
        }
      };
    }
    process(inputs, outputs) {
      const inp = inputs[0] && inputs[0][0];
      const out = outputs[0] && outputs[0][0];
      if (!out) return true;
      const N = out.length;

      this.ratio += (this.targetRatio - this.ratio) * 0.12;
      const ratio = this.ratio;

      if (inp) {
        for (let i = 0; i < N; i++) {
          this.buf[(this.wPos + i) % this.BUF] = inp[i];
        }
      } else {
        for (let i = 0; i < N; i++) {
          this.buf[(this.wPos + i) % this.BUF] = 0;
        }
      }

      for (let i = 0; i < N; i++) out[i] = 0;

      for (let i = 0; i < N; i++) {
        const aOut = this.outAbs + i;
        const aIn = this.wPos + i;

        while (aOut >= this.nextOut) {
          this.grains.push({
            outStart: this.nextOut,
            inStart: aIn - Math.floor(this.G * ratio),
            ratio: ratio,
          });
          this.nextOut += this.H;
        }

        let sample = 0;
        for (let g = this.grains.length - 1; g >= 0; g--) {
          const grain = this.grains[g];
          const local = aOut - grain.outStart;
          if (local < 0) continue;
          if (local >= this.G) { this.grains.splice(g, 1); continue; }
          const rp = grain.inStart + local * grain.ratio;
          if (rp < 0 || rp >= aIn) continue;
          const idx = Math.floor(rp);
          const frac = rp - idx;
          const i1 = ((idx % this.BUF) + this.BUF) % this.BUF;
          const i2 = (i1 + 1) % this.BUF;
          const s = this.buf[i1] * (1 - frac) + this.buf[i2] * frac;
          sample += s * this.win[local];
        }
        out[i] = sample;
      }

      this.wPos = (this.wPos + N) % this.BUF;
      this.outAbs += N;
      return true;
    }
  }
  registerProcessor('mrtree-pitch', MrtreePitch);
`;

let pitchWorkletURL = null;
function getPitchWorkletURL() {
  if (pitchWorkletURL) return pitchWorkletURL;
  const blob = new Blob([PITCH_WORKLET_SRC], { type: 'application/javascript' });
  pitchWorkletURL = URL.createObjectURL(blob);
  return pitchWorkletURL;
}

/* ============================================================
   10 أنماط صوتية
============================================================ */
const VOICE_PROFILES = {
  off: {
    label: 'بدون', emoji: '🚫', description: 'صوتك الطبيعي',
    semitones: 0,
    lowpass: 20000, highpass: 20, kidHP: 20,
    formantFreq: 1500, formantGain: 0,
    bodyFreq: 250, bodyGain: 0,
    airGain: 0, satAmt: 0,
  },
  deep: {
    label: 'رجولي', emoji: '🧔', description: 'صوت رجولي طبيعي',
    semitones: -2,
    lowpass: 5000, highpass: 60, kidHP: 80,
    formantFreq: 900, formantGain: 5,
    bodyFreq: 180, bodyGain: 6,
    airGain: -5, satAmt: 0.12,
  },
  deeper: {
    label: 'عميق', emoji: '🦁', description: 'صوت عميق ثقيل',
    semitones: -4,
    lowpass: 4000, highpass: 50, kidHP: 70,
    formantFreq: 750, formantGain: 8,
    bodyFreq: 150, bodyGain: 9,
    airGain: -8, satAmt: 0.22,
  },
  monster: {
    label: 'وحش', emoji: '👹', description: 'صوت وحشي مرعب',
    semitones: -6,
    lowpass: 3200, highpass: 45, kidHP: 60,
    formantFreq: 650, formantGain: 10,
    bodyFreq: 120, bodyGain: 11,
    airGain: -12, satAmt: 0.4,
  },
  female: {
    label: 'أنثى', emoji: '👩', description: 'صوت أنثوي طبيعي',
    semitones: 2.5,
    lowpass: 10000, highpass: 70, kidHP: 180,
    formantFreq: 2200, formantGain: 5,
    bodyFreq: 300, bodyGain: -1,
    airGain: 5, satAmt: 0.05,
  },
  female_soft: {
    label: 'ناعمة', emoji: '🌸', description: 'صوت أنثوي ناعم',
    semitones: 3.5,
    lowpass: 11000, highpass: 75, kidHP: 200,
    formantFreq: 2500, formantGain: 6,
    bodyFreq: 320, bodyGain: -2,
    airGain: 8, satAmt: 0.03,
  },
  kid: {
    label: 'طفل', emoji: '👦', description: 'صوت طفل طبيعي',
    semitones: 5,
    lowpass: 11000, highpass: 90, kidHP: 350,
    formantFreq: 3200, formantGain: 8,
    bodyFreq: 500, bodyGain: 3,
    airGain: 7, satAmt: 0.05,
  },
  kid_small: {
    label: 'طفل صغير', emoji: '🧒', description: 'طفل صغير',
    semitones: 7,
    lowpass: 12000, highpass: 100, kidHP: 450,
    formantFreq: 3800, formantGain: 10,
    bodyFreq: 600, bodyGain: 2,
    airGain: 9, satAmt: 0.04,
  },
  robot: {
    label: 'روبوت', emoji: '🤖', description: 'صوت ميكانيكي',
    semitones: 0,
    lowpass: 4000, highpass: 150, kidHP: 150,
    formantFreq: 1200, formantGain: 12,
    bodyFreq: 100, bodyGain: 8,
    airGain: -3, satAmt: 0.6,
  },
  alien: {
    label: 'فضائي', emoji: '👽', description: 'صوت فضائي غريب',
    semitones: 4,
    lowpass: 7000, highpass: 130, kidHP: 250,
    formantFreq: 1800, formantGain: -6,
    bodyFreq: 800, bodyGain: 5,
    airGain: 3, satAmt: 0.3,
  },
};

let audioCtx        = null;
let gainNode        = null;
let preAmpNode      = null;
let eqNodes         = [];
let bassFilter      = null;
let trebleFilter    = null;
let distortionNode  = null;
let reverbNode      = null;
let reverbGain      = null;
let analyserNode    = null;
let outputGain      = null;
let monitorGain     = null;
let destNode        = null;
let processedStream = null;
let originalGetUserMedia = null;

let vcPitchNode     = null;
let vcDeepLP        = null;
let vcDeepHP        = null;
let vcKidHP         = null;
let vcFormant       = null;
let vcBody          = null;
let vcAir           = null;
let vcSat           = null;
let vcDryGain       = null;
let vcBypassGain    = null;
let vcWetGain       = null;
let vcMixOut        = null;

let broadcastStream = null;
let broadcastSource = null;
let broadcastGain   = null;

const FX = {
  gain: 1, preamp: 1,
  bass: 0, treble: 0,
  reverb: 0, distortion: 0,
  stereoWidth: 1, voiceDepth: 0,
  pitch: 0,
  voiceProfile: 'off',
  voiceIntensity: 1.0,
  monitorEnabled: true,
  monitorVol: 0.7,
};

const FX_EQ = {};
EQ_BANDS.forEach(b => { FX_EQ[b.id] = 0; });
function buildDistortionCurve(amount) {
  const n = 512, curve = new Float32Array(n), k = amount * 400;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = k === 0
      ? x
      : ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function buildSoftSaturateCurve(amount) {
  const n = 1024, curve = new Float32Array(n);
  const k = Math.max(0.0001, amount);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = Math.tanh(x * (1 + k * 4));
  }
  return curve;
}

function buildReverbIR(ctx, decay) {
  decay = decay || 2.5;
  const len = ctx.sampleRate * decay;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
  }
  return buf;
}

async function createPitchShifter(ctx) {
  try {
    if (!ctx.audioWorklet) return null;
    await ctx.audioWorklet.addModule(getPitchWorkletURL());
    const node = new AudioWorkletNode(ctx, 'mrtree-pitch', {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    return node;
  } catch (e) {
    console.warn('[MrtreeCord] AudioWorklet غير مدعوم');
    return null;
  }
}

async function initAudioEngine(stream) {
  if (audioCtx) { try { audioCtx.close(); } catch (_) {} }

  audioCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});

  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.78;

  gainNode = audioCtx.createGain();
  gainNode.gain.value = FX.gain;

  preAmpNode = audioCtx.createGain();
  preAmpNode.gain.value = FX.preamp;

  eqNodes = EQ_BANDS.map(b => {
    const f = audioCtx.createBiquadFilter();
    f.type = b.type;
    f.frequency.value = b.freq;
    f.Q.value = b.type === 'peaking' ? 1.41 : 0.707;
    f.gain.value = FX_EQ[b.id] || 0;
    return f;
  });
  for (let i = 0; i < eqNodes.length - 1; i++) eqNodes[i].connect(eqNodes[i + 1]);

  bassFilter = audioCtx.createBiquadFilter();
  bassFilter.type = 'lowshelf';
  bassFilter.frequency.value = 180;
  bassFilter.gain.value = FX.bass;

  trebleFilter = audioCtx.createBiquadFilter();
  trebleFilter.type = 'highshelf';
  trebleFilter.frequency.value = 4500;
  trebleFilter.gain.value = FX.treble;

  distortionNode = audioCtx.createWaveShaper();
  distortionNode.curve = buildDistortionCurve(FX.distortion);
  distortionNode.oversample = '4x';

  reverbNode = audioCtx.createConvolver();
  reverbNode.buffer = buildReverbIR(audioCtx);
  reverbGain = audioCtx.createGain();
  reverbGain.gain.value = FX.reverb;

  const dryGain = audioCtx.createGain();
  dryGain.gain.value = 1;
  vcDryGain = dryGain;

  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 24;
  compressor.ratio.value = 16;
  compressor.attack.value = 0.002;
  compressor.release.value = 0.2;

  outputGain = audioCtx.createGain();
  outputGain.gain.value = 1;

  monitorGain = audioCtx.createGain();
  monitorGain.gain.value = FX.monitorEnabled ? FX.monitorVol : 0;

  vcPitchNode = await createPitchShifter(audioCtx);

  let vcPitchIsDummy = false;
  if (!vcPitchNode) {
    vcPitchNode = audioCtx.createGain();
    vcPitchIsDummy = true;
  }
  vcPitchNode._isDummy = vcPitchIsDummy;

  vcDeepLP = audioCtx.createBiquadFilter();
  vcDeepLP.type = 'lowpass';
  vcDeepLP.frequency.value = 20000;
  vcDeepLP.Q.value = 0.8;

  vcDeepHP = audioCtx.createBiquadFilter();
  vcDeepHP.type = 'highpass';
  vcDeepHP.frequency.value = 20;
  vcDeepHP.Q.value = 0.5;

  vcKidHP = audioCtx.createBiquadFilter();
  vcKidHP.type = 'highpass';
  vcKidHP.frequency.value = 20;
  vcKidHP.Q.value = 0.7;

  vcFormant = audioCtx.createBiquadFilter();
  vcFormant.type = 'peaking';
  vcFormant.frequency.value = 1500;
  vcFormant.Q.value = 3.0;
  vcFormant.gain.value = 0;

  vcBody = audioCtx.createBiquadFilter();
  vcBody.type = 'peaking';
  vcBody.frequency.value = 250;
  vcBody.Q.value = 1.5;
  vcBody.gain.value = 0;

  vcAir = audioCtx.createBiquadFilter();
  vcAir.type = 'highshelf';
  vcAir.frequency.value = 8000;
  vcAir.gain.value = 0;

  vcSat = audioCtx.createWaveShaper();
  vcSat.curve = buildSoftSaturateCurve(0.001);
  vcSat.oversample = '2x';

  vcBypassGain = audioCtx.createGain();
  vcBypassGain.gain.value = 1;
  vcWetGain = audioCtx.createGain();
  vcWetGain.gain.value = 0;
  vcMixOut = audioCtx.createGain();
  vcMixOut.gain.value = 1;

  vcPitchNode.connect(vcDeepHP);
  vcDeepHP.connect(vcDeepLP);
  vcDeepLP.connect(vcKidHP);
  vcKidHP.connect(vcFormant);
  vcFormant.connect(vcBody);
  vcBody.connect(vcAir);
  vcAir.connect(vcSat);
  vcSat.connect(vcWetGain);
  vcWetGain.connect(vcMixOut);
  vcBypassGain.connect(vcMixOut);

  const src = audioCtx.createMediaStreamSource(stream);
  src.connect(gainNode);
  gainNode.connect(preAmpNode);
  preAmpNode.connect(eqNodes[0]);
  eqNodes[eqNodes.length - 1].connect(bassFilter);
  bassFilter.connect(trebleFilter);
  trebleFilter.connect(distortionNode);
  distortionNode.connect(dryGain);
  dryGain.connect(compressor);
  distortionNode.connect(reverbNode);
  reverbNode.connect(reverbGain);
  reverbGain.connect(compressor);
  distortionNode.connect(vcBypassGain);
  distortionNode.connect(vcPitchNode);
  vcMixOut.connect(compressor);
  compressor.connect(outputGain);

  destNode = audioCtx.createMediaStreamDestination();
  outputGain.connect(destNode);
  outputGain.connect(monitorGain);
  monitorGain.connect(audioCtx.destination);
  outputGain.connect(analyserNode);

  processedStream = destNode.stream;
  stream.getVideoTracks().forEach(t => processedStream.addTrack(t));

  if (broadcastSource && broadcastGain) {
    try { broadcastGain.connect(destNode); } catch (_) {}
  }

  applyVoiceProfile(FX.voiceProfile, FX.voiceIntensity);
  startVisualizer();
  return processedStream;
}

function applyFX() {
  if (!audioCtx || audioCtx.state === 'closed') return;
  const t = audioCtx.currentTime + 0.02;
  gainNode.gain.linearRampToValueAtTime(Math.max(0, FX.gain), t);
  preAmpNode.gain.linearRampToValueAtTime(Math.max(0, FX.preamp), t);
  bassFilter.gain.linearRampToValueAtTime(FX.bass, t);
  trebleFilter.gain.linearRampToValueAtTime(FX.treble, t);
  reverbGain.gain.linearRampToValueAtTime(Math.max(0, FX.reverb), t);
  distortionNode.curve = buildDistortionCurve(FX.distortion);
  EQ_BANDS.forEach((b, i) => {
    if (eqNodes[i]) eqNodes[i].gain.linearRampToValueAtTime(FX_EQ[b.id], t);
  });
  if (monitorGain) {
    const target = FX.monitorEnabled ? Math.max(0, FX.monitorVol) : 0;
    monitorGain.gain.linearRampToValueAtTime(target, t);
  }
}

function interceptGetUserMedia() {
  if (originalGetUserMedia) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async function (constraints) {
    const stream = await originalGetUserMedia(constraints);
    const hasAudio = constraints &&
      (constraints.audio === true || typeof constraints.audio === 'object');
    if (hasAudio) {
      try { return await initAudioEngine(stream); }
      catch (e) { /* رجوع صامت */ }
    }
    return stream;
  };
}

interceptGetUserMedia();

if (!navigator.mediaDevices) {
  Object.defineProperty(navigator, 'mediaDevices', {
    get: function () { return this._hcMD; },
    set: function (v) {
      this._hcMD = v;
      interceptGetUserMedia();
    },
    configurable: true,
  });
}
/* ============================================================
   ⭐ applyVoiceProfile — مصحّح لمنع الصوت المزدوج
============================================================ */
function lerp(a, b, t) { return a + (b - a) * t; }

function applyVoiceProfile(profileKey, intensity) {
  if (!audioCtx || !vcPitchNode) return;

  const prevProfile = FX.voiceProfile;
  const isSwitch = (prevProfile !== profileKey);

  FX.voiceProfile   = profileKey;
  FX.voiceIntensity = intensity;

  const profile = VOICE_PROFILES[profileKey];
  const t = audioCtx.currentTime;

  /* ⭐ لو تغيّر النمط — قطع فوري + تنظيف الحبيبات */
  if (isSwitch) {
    vcDryGain.gain.cancelScheduledValues(t);
    vcWetGain.gain.cancelScheduledValues(t);

    if (!vcPitchNode._isDummy && vcPitchNode.port) {
      vcPitchNode.port.postMessage({ clearGrains: true });
    }
  }

  /* ===== "بدون" أو شدة صفر → صوت طبيعي ===== */
  if (!profile || profileKey === 'off' || intensity < 0.01) {
    if (isSwitch) {
      vcDryGain.gain.setValueAtTime(1, t);
      vcWetGain.gain.setValueAtTime(0, t);
    } else {
      vcDryGain.gain.linearRampToValueAtTime(1, t + 0.02);
      vcWetGain.gain.linearRampToValueAtTime(0, t + 0.02);
    }

    if (!vcPitchNode._isDummy && vcPitchNode.port) {
      vcPitchNode.port.postMessage({ ratio: 1, instant: true });
    }
    return;
  }

  /* ===== نمط صوتي شغال ===== */
  if (isSwitch) {
    vcDryGain.gain.setValueAtTime(0, t);
    vcWetGain.gain.setValueAtTime(1, t);
  } else {
    vcDryGain.gain.linearRampToValueAtTime(0, t + 0.02);
    vcWetGain.gain.linearRampToValueAtTime(1, t + 0.02);
  }

  /* احسب القيم */
  const semi         = (profile.semitones || 0) * intensity + FX.pitch;
  const finalRatio   = Math.pow(2, semi / 12);
  const formantFreq  = lerp(1500, profile.formantFreq || 1500, intensity);
  const formantGain  = (profile.formantGain || 0) * intensity;
  const bodyFreq     = lerp(250,  profile.bodyFreq  || 250,  intensity);
  const bodyGain     = (profile.bodyGain || 0) * intensity;
  const airGain      = (profile.airGain || 0) * intensity;
  const satAmt       = (profile.satAmt || 0) * intensity;
  const lowpass      = lerp(20000, profile.lowpass  || 20000, intensity);
  const highpass     = lerp(20,    profile.highpass || 20,    intensity);
  const kidHP        = lerp(20,    profile.kidHP    || 20,    intensity);

  if (!vcPitchNode._isDummy && vcPitchNode.port) {
    vcPitchNode.port.postMessage({
      ratio: finalRatio,
      instant: isSwitch,
    });
  }

  const tt = t + 0.015;
  vcDeepLP.frequency.linearRampToValueAtTime(lowpass,  tt);
  vcDeepHP.frequency.linearRampToValueAtTime(highpass, tt);
  vcKidHP.frequency.linearRampToValueAtTime(kidHP,    tt);

  vcFormant.frequency.linearRampToValueAtTime(formantFreq, tt);
  vcFormant.gain.linearRampToValueAtTime(formantGain, tt);

  vcBody.frequency.linearRampToValueAtTime(bodyFreq, tt);
  vcBody.gain.linearRampToValueAtTime(bodyGain, tt);

  vcAir.gain.linearRampToValueAtTime(airGain, tt);

  vcSat.curve = buildSoftSaturateCurve(satAmt);
}

/* ============================================================
   المؤثر البصري
============================================================ */
let vizAnimFrame = null;

function startVisualizer() {
  const canvas = document.getElementById('hc-canvas');
  if (!canvas || !analyserNode) return;
  if (vizAnimFrame) cancelAnimationFrame(vizAnimFrame);
  const ctx2 = canvas.getContext('2d');
  const bufLen = analyserNode.frequencyBinCount;
  const data = new Uint8Array(bufLen);

  function draw() {
    vizAnimFrame = requestAnimationFrame(draw);
    analyserNode.getByteFrequencyData(data);
    const w = canvas.width, h = canvas.height;
    ctx2.fillStyle = 'rgba(0,0,0,0.55)';
    ctx2.fillRect(0, 0, w, h);
    const bw = (w / bufLen) * 2.2;
    let x = 0;
    for (let i = 0; i < bufLen; i++) {
      const t = data[i] / 255;
      const barH = t * h;
      const br = Math.round(155 + t * 100);
      const a = 0.25 + t * 0.75;
      const g = ctx2.createLinearGradient(x, h - barH, x, h);
      g.addColorStop(0, `rgba(${br},${br},${br},${a})`);
      g.addColorStop(1, `rgba(70,70,70,${a * 0.3})`);
      ctx2.fillStyle = g;
      ctx2.fillRect(x, h - barH, bw - 1, barH);
      x += bw + 0.5;
    }
    const avg = data.reduce((a, b) => a + b, 0) / bufLen;
    const lat = audioCtx ? Math.round((audioCtx.baseLatency || 0) * 1000) : 0;
    const lbl = document.getElementById('hc-latency-label');
    if (lbl) lbl.textContent = `التأخير: ${lat} ملي  المستوى: ${Math.round((avg / 255) * 100)}%`;
  }
  draw();
}

function startIdleVisualizer() {
  const canvas = document.getElementById('hc-canvas');
  if (!canvas) return;
  if (vizAnimFrame) cancelAnimationFrame(vizAnimFrame);
  const ctx2 = canvas.getContext('2d');
  let tick = 0;
  function draw() {
    vizAnimFrame = requestAnimationFrame(draw);
    const w = canvas.width, h = canvas.height;
    ctx2.fillStyle = 'rgba(0,0,0,0.85)';
    ctx2.fillRect(0, 0, w, h);
    const bars = 48, bw = w / bars - 0.8;
    for (let i = 0; i < bars; i++) {
      const amp = Math.sin(tick * 0.032 + i * 0.37) * 0.11 + 0.06;
      const a = Math.min(0.32, 0.14 + amp * 1.8);
      ctx2.fillStyle = `rgba(255,255,255,${a})`;
      ctx2.fillRect(i * (bw + 0.8), h - amp * h, bw, amp * h);
    }
    tick++;
  }
  draw();
}

/* ============================================================
   الأيقونات
============================================================ */
const S = 'stroke="#fff" fill="none" stroke-width="1.8"';
const ICONS = {
  bolt:    `<svg viewBox="0 0 24 24" ${S}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  mic:     `<svg viewBox="0 0 24 24" ${S}><path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M6 11a6 6 0 0 0 12 0"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>`,
  eq:      `<svg viewBox="0 0 24 24" ${S}><line x1="4" y1="6" x2="4" y2="18"/><line x1="8" y1="3" x2="8" y2="18"/><line x1="12" y1="8" x2="12" y2="18"/><line x1="16" y1="4" x2="16" y2="18"/><line x1="20" y1="10" x2="20" y2="18"/><rect x="2" y="5" width="4" height="3" rx="1"/><rect x="6" y="2" width="4" height="3" rx="1"/><rect x="10" y="7" width="4" height="3" rx="1"/><rect x="14" y="3" width="4" height="3" rx="1"/><rect x="18" y="9" width="4" height="3" rx="1"/></svg>`,
  voice:   `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M18 9l2-2 2 2"/><path d="M18 13l2 2 2-2"/></svg>`,
  eqband:  `<svg viewBox="0 0 24 24" ${S}><path d="M2 18h3v-5H2z M7 18h3V8H7z M12 18h3v-8h-3z M17 18h3V4h-3z"/></svg>`,
  preset:  `<svg viewBox="0 0 24 24" ${S}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  sound:   `<svg viewBox="0 0 24 24" ${S}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  gain:    `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16V8l3 4 3-4v8"/></svg>`,
  preamp:  `<svg viewBox="0 0 24 24" ${S}><path d="M4 12h4"/><circle cx="12" cy="12" r="4"/><path d="M16 12h4"/><path d="M12 4v4"/><path d="M12 16v4"/></svg>`,
  bass:    `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><path d="M7 12a5 5 0 0 1 10 0"/><line x1="12" y1="7" x2="12" y2="17"/></svg>`,
  treble:  `<svg viewBox="0 0 24 24" ${S}><path d="M12 3c2 0 4 2 4 5s-2 4-4 4v4"/><circle cx="10" cy="19" r="2"/></svg>`,
  reverb:  `<svg viewBox="0 0 24 24" ${S}><path d="M4 4 Q 12 20 20 4"/><path d="M6 8 Q 12 18 18 8"/><path d="M8 12 Q 12 16 16 12"/></svg>`,
  distort: `<svg viewBox="0 0 24 24" ${S}><path d="M2 12 Q 6 2 10 12 Q 14 22 18 12 Q 22 2 22 12"/></svg>`,
  stereo:  `<svg viewBox="0 0 24 24" ${S}><path d="M3 9l4 3-4 3"/><path d="M21 9l-4 3 4 3"/><rect x="8" y="8" width="8" height="8" rx="2"/></svg>`,
  depth:   `<svg viewBox="0 0 24 24" ${S}><path d="M3 6h18M3 12h18M3 18h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
  pitch:   `<svg viewBox="0 0 24 24" ${S}><path d="M3 17l5-10 4 8 3-5 3 7"/><line x1="21" y1="17" x2="21" y2="7"/></svg>`,
  close:   `<svg viewBox="0 0 24 24" stroke="#fff" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" ${S}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  reset:   `<svg viewBox="0 0 24 24" ${S}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  mp3file: `<svg viewBox="0 0 24 24" ${S}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13a3 3 0 1 0 3 3v-7l4 1"/></svg>`,
  monitorOn:  `<svg viewBox="0 0 24 24" ${S}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4z"/><path d="M3 19a2 2 0 0 0 2 2h1v-6H3v4z"/></svg>`,
  monitorOff: `<svg viewBox="0 0 24 24" ${S}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4z"/><path d="M3 19a2 2 0 0 0 2 2h1v-6H3v4z"/><line x1="3" y1="3" x2="21" y2="21"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" ${S}><rect x="2" y="5" width="20" height="14" rx="4"/><polygon points="10 8.5 16 12 10 15.5 10 8.5"/></svg>`,
  broadcast:    `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>`,
  broadcastOff: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/><line x1="3" y1="3" x2="21" y2="21"/></svg>`,
};

function ic(name, style) {
  if (!ICONS[name]) return '';
  return ICONS[name].replace('<svg ', `<svg style="${style}" `);
}

const SM = 'width:12px;height:12px;filter:drop-shadow(0 0 3px rgba(255,255,255,0.65))';
const NV = 'width:20px;height:20px';
const PI = 'width:17px;height:17px;filter:drop-shadow(0 0 5px rgba(255,255,255,0.7))';
const HDR = 'width:14px;height:14px;filter:drop-shadow(0 0 6px #fff) drop-shadow(0 0 14px rgba(255,255,255,0.45))';

function setSliderTrack(el) {
  const min = parseFloat(el.getAttribute('data-min') || el.min);
  const max = parseFloat(el.getAttribute('data-max') || el.max);
  const val = parseFloat(el.value);
  const pct = ((val - min) / (max - min)) * 100;
  el.style.background =
    `linear-gradient(90deg,rgba(255,255,255,0.86) ${pct}%,rgba(255,255,255,0.14) ${pct}%)`;
}

function sliderRow(id, label, iconName, min, max, step, value, unit) {
  unit = unit || '';
  const displayVal = Math.abs(value - Math.round(value)) < 0.005
    ? Math.round(value) : value.toFixed(2);
  return `
    <div class="hc-control">
      <div class="hc-control-header">
        <span class="hc-control-label">${ic(iconName, SM)} ${label}</span>
        <span class="hc-control-val" id="${id}-val">${displayVal}${unit}</span>
      </div>
      <input type="range" class="hc-slider" id="${id}"
             min="${min}" max="${max}" step="${step}" value="${value}"
             data-min="${min}" data-max="${max}" data-unit="${unit}">
    </div>`;
}
function buildFXSection() {
  return `
    <div class="hc-section active" id="hc-sec-fx">
      <div class="hc-section-title">// تأثيرات الصوت</div>
      ${sliderRow('hc-gain',       'قوة المايك',    'gain',    0,  MAX_GAIN,   0.5,  1,  'x')}
      ${sliderRow('hc-preamp',     'مضخم الصوت',    'preamp',  0,  MAX_PREAMP, 0.5,  1,  'x')}
      ${sliderRow('hc-bass',       'تعزيز البيس',   'bass',    -20, 40,        1,    0,  'dB')}
      ${sliderRow('hc-treble',     'الحدة',         'treble',  -20, 20,        1,    0,  'dB')}
      ${sliderRow('hc-reverb',     'الصدى',         'reverb',  0,  1,          0.01, 0,  '')}
      ${sliderRow('hc-distortion', 'التشويش',       'distort', 0,  1,          0.01, 0,  '')}
      ${sliderRow('hc-stereo',     'عرض الستيريو',  'stereo',  0,  2,          0.01, 1,  '')}
      ${sliderRow('hc-depth',      'عمق الصوت',     'depth',   -24, 24,        1,    0,  'dB')}
    </div>`;
}

function buildVCSection() {
  const voiceButtons = Object.keys(VOICE_PROFILES).map(key => {
    const p = VOICE_PROFILES[key];
    return `
      <button class="hc-voice-btn ${key === 'off' ? 'active' : ''}" data-voice="${key}">
        <div class="hc-voice-btn-emoji">${p.emoji}</div>
        <div class="hc-voice-btn-label">${p.label}</div>
      </button>`;
  }).join('');

  return `
    <div class="hc-section" id="hc-sec-vc">
      <div class="hc-section-title">// مغير الصوت</div>
      <div class="hc-voice-grid">${voiceButtons}</div>
      ${sliderRow('hc-voice-intensity', 'شدة التغيير', 'sound', 0, 100, 1, 100, '%')}
      ${sliderRow('hc-pitch',           'نغمة إضافية', 'pitch', -12, 12, 1, 0, 'نصف نغمة')}
      <div class="hc-monitor-info" style="margin-top:16px">
        <p id="hc-voice-desc">• اختر نمط صوت لتغيير صوتك</p>
        <p>• "نغمة إضافية" تضاف فوق النمط</p>
        <p>• "شدة التغيير" تخفف قوة التأثير</p>
      </div>
    </div>`;
}

function buildMonitorSection() {
  return `
    <div class="hc-section" id="hc-sec-monitor">
      <div class="hc-section-title">// مراقبة صوتك</div>
      <button class="hc-monitor-toggle active" id="hc-monitor-toggle">
        ${ic('monitorOn', 'width:20px;height:20px')}
        <span id="hc-monitor-toggle-text">المراقبة مفعّلة</span>
      </button>
      <div class="hc-monitor-warning">
        ⚠️ <b>استخدم سماعات دايماً!</b><br>
        لو استخدمت سماعة الجوال، المايك راح يسمع نفسه → رجيع وصدى.
      </div>
      ${sliderRow('hc-monitor-vol', 'مستوى المراقبة', 'sound', 0, 200, 1, 70, '%')}
      <div class="hc-monitor-info">
        <p>• المراقبة لك فقط — ما تأثر على صوتك اللي يوصل لأصحابك</p>
        <p>• زر الكتم السريع في الهيدر يوقفها فوراً</p>
      </div>
    </div>`;
}

function buildEQSection() {
  const rows = EQ_BANDS.map(b =>
    sliderRow(b.id, b.label, 'sliders', -20, 20, 1, 0, 'dB')
  ).join('');
  return `
    <div class="hc-section" id="hc-sec-eq">
      <div class="hc-section-title">// موازن الترددات العشري</div>
      <div class="hc-eq-grid">${rows}</div>
    </div>`;
}

function buildPresetsSection() {
  return `
    <div class="hc-section" id="hc-sec-pre">
      <div class="hc-section-title">// إعدادات جاهزة</div>
      <div class="hc-preset-grid">
        <button class="hc-preset-btn" data-preset="default">
          <div class="hc-preset-icon">${ic('reset', PI)}</div>
          <div class="hc-preset-info">
            <div class="hc-preset-name">الافتراضي</div>
            <div class="hc-preset-desc">إعادة كل الإعدادات</div>
          </div>
        </button>
        <button class="hc-preset-btn" data-preset="maxpower">
          <div class="hc-preset-icon">${ic('bolt',  PI)}</div>
          <div class="hc-preset-info">
            <div class="hc-preset-name">⚡ MAX POWER</div>
            <div class="hc-preset-desc">أصخب وضعية: كل شي بأقصى حد + كل الهيرتز ماكس</div>
          </div>
        </button>
        <button class="hc-preset-btn" data-preset="talkingset">
          <div class="hc-preset-icon">${ic('mic',   PI)}</div>
          <div class="hc-preset-info">
            <div class="hc-preset-name">وضع الكلام</div>
            <div class="hc-preset-desc">الحدة كاملة + البيس +17</div>
          </div>
        </button>
        <button class="hc-preset-btn" data-preset="loudtalkingset">
          <div class="hc-preset-icon">${ic('sound', PI)}</div>
          <div class="hc-preset-info">
            <div class="hc-preset-name">كلام عالي</div>
            <div class="hc-preset-desc">مضخم 100x + بيس +14 + حدة كاملة</div>
          </div>
        </button>
      </div>
    </div>`;
}

function buildMP3Section() {
  return `
    <div class="hc-section" id="hc-sec-mp3">
      <div class="hc-section-title">// مشغل الأغاني</div>
      <label id="hc-mp3-label" for="hc-mp3-input">
        <svg viewBox="0 0 24 24" stroke="#fff" fill="none" stroke-width="1.8" style="width:14px;height:14px;flex-shrink:0;filter:drop-shadow(0 0 4px #fff)">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span id="hc-mp3-name">اختر ملف لتشغيله مباشرة</span>
      </label>
      <input type="file" id="hc-mp3-input" accept="audio/*" style="display:none">

      <div id="hc-mp3-btns">
        <button id="hc-mp3-play" class="hc-mp3-btn hc-mp3-play" title="تشغيل">
          <svg viewBox="0 0 24 24" fill="#00e676" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button id="hc-mp3-pause" class="hc-mp3-btn hc-mp3-pause" title="إيقاف / متابعة">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
        </button>
        <button id="hc-mp3-stop" class="hc-mp3-btn hc-mp3-stop" title="إيقاف">
          <svg viewBox="0 0 24 24" fill="#ff1744" stroke="none"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        </button>
      </div>

      <div id="hc-mp3-progress-wrap">
        <span id="hc-mp3-cur">0:00</span>
        <div id="hc-mp3-bar-bg"><div id="hc-mp3-bar-fill"></div></div>
        <span id="hc-mp3-dur">0:00</span>
      </div>

      <div style="margin-top:12px">
        ${sliderRow('hc-mp3-vol',   'مستوى الصوت', 'sound',  0, 300, 1, 100, '%')}
        ${sliderRow('hc-mp3-mix',   'خلط المايك',  'mic',    0, 100, 1, 0,   '%')}
        ${sliderRow('hc-mp3-gain',  'قوة الصوت',   'gain',   0, 200, 1, 100, '%')}
      </div>

      <div class="hc-lib-divider">
        <span>📚 أصواتي المحفوظة</span>
      </div>

      <label class="hc-lib-add" for="hc-lib-input">
        <span style="font-size:20px;line-height:1">➕</span>
        <span>إضافة صوت للمكتبة</span>
      </label>
      <input type="file" id="hc-lib-input" accept="audio/*" multiple style="display:none">

      <div class="hc-lib-list" id="hc-lib-list">
        <div class="hc-lib-empty">لا توجد أصوات محفوظة بعد</div>
      </div>

      <div class="hc-monitor-tip" style="margin-top:14px">
        💡 الأصوات المحفوظة تُخزّن على جهازك فقط — اضغط ▶ للتشغيل، ✏ للتعديل، 🗑 للحذف.
      </div>
    </div>`;
}

function buildYouTubeSection() {
  return `
    <div class="hc-section" id="hc-sec-youtube">
      <div class="hc-section-title">// مشغل يوتيوب</div>
      <div class="hc-yt-input-wrap">
        <input type="text" id="hc-yt-url" placeholder="الصق رابط يوتيوب هنا...">
        <button id="hc-yt-load">تحميل</button>
      </div>
      <div id="hc-yt-player-wrap">
        <iframe id="hc-yt-player" src="about:blank" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
      <div id="hc-yt-btns">
        <button id="hc-yt-play" class="hc-mp3-btn hc-mp3-play" title="تشغيل">
          <svg viewBox="0 0 24 24" fill="#00e676" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button id="hc-yt-pause" class="hc-mp3-btn hc-mp3-pause" title="إيقاف مؤقت">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2.2"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
        </button>
        <button id="hc-yt-stop" class="hc-mp3-btn hc-mp3-stop" title="إيقاف">
          <svg viewBox="0 0 24 24" fill="#ff1744" stroke="none"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        </button>
      </div>
      ${sliderRow('hc-yt-vol', 'مستوى يوتيوب', 'sound', 0, 100, 1, 100, '%')}
      <div class="hc-yt-broadcast-wrap">
        <div class="hc-yt-broadcast-title">🎙️ بث الصوت لأصحابك</div>
        <button id="hc-yt-broadcast" class="hc-broadcast-btn">
          ${ic('broadcast', 'width:20px;height:20px;stroke:#00f5ff;fill:none')}
          <span id="hc-yt-broadcast-text">ابدأ البث</span>
        </button>
        <div class="hc-yt-broadcast-hint">
          اختر <b>التاب هذا</b> + <b>✅ مشاركة الصوت</b>
        </div>
      </div>
    </div>`;
}

function buildWidget() {
  const overlay = document.createElement('div');
  overlay.id = 'hc-overlay';
  overlay.addEventListener('click', closeWidget);

  const w = document.createElement('div');
  w.id = 'hc-widget';
  w.innerHTML = `
    <div id="hc-header">
      <div style="display:flex;align-items:center;gap:9px">
        ${ic('bolt', HDR)}
        <span id="hc-title">MRTREE CORD V2</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="hc-status-dot inactive" id="hc-status"></div>
        <span class="hc-active-label" id="hc-active-lbl">متوقف</span>
        <button id="hc-quick-mute" title="كتم المراقبة" style="width:30px;height:30px;border:1px solid rgba(0,245,255,0.35);border-radius:50%;background:rgba(0,245,255,0.05);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">
          ${ic('monitorOn', 'width:14px;height:14px;stroke:#00f5ff;fill:none')}
        </button>
        <button id="hc-close" aria-label="إغلاق">
          ${ic('close','width:16px;height:16px')}
        </button>
      </div>
    </div>

    <div id="hc-visualizer">
      <canvas id="hc-canvas" width="430" height="62"></canvas>
      <span id="hc-latency-label">التأخير: -- ملي  المستوى: 0%</span>
    </div>

    <div id="hc-body">
      <nav id="hc-nav">
        ${navBtn('fx',      'eq',        'تأثيرات الصوت')}
        ${navBtn('vc',      'voice',     'مغير الصوت')}
        ${navBtn('monitor', 'monitorOn', 'المراقبة')}
        ${navBtn('eq',      'eqband',    'موازن الترددات')}
        ${navBtn('pre',     'preset',    'إعدادات جاهزة')}
        ${navBtn('mp3',     'mp3file',   'مشغل الأغاني')}
        ${navBtn('youtube', 'youtube',   'يوتيوب')}
      </nav>
      <div id="hc-sections">
        ${buildFXSection()}
        ${buildVCSection()}
        ${buildMonitorSection()}
        ${buildEQSection()}
        ${buildPresetsSection()}
        ${buildMP3Section()}
        ${buildYouTubeSection()}
      </div>
    </div>

    <div id="hc-footer">
      <span id="hc-footer-text">— من صنع MRTREE —</span>
    </div>`;

  return { overlay, widget: w };
}

function navBtn(id, iconName, label) {
  return `
    <button class="hc-nav-btn" data-section="${id}">
      ${ic(iconName, NV)} ${label}
    </button>`;
}
const _basePreset = () => {
  const o = {
    'hc-gain': 1, 'hc-preamp': 1,
    'hc-bass': 0, 'hc-treble': 0,
    'hc-reverb': 0, 'hc-distortion': 0,
    'hc-stereo': 1, 'hc-depth': 0,
    'hc-pitch': 0,
    'hc-voice-intensity': 100,
    'hc-monitor-vol': 70, 'hc-yt-vol': 100,
  };
  EQ_BANDS.forEach(b => { o[b.id] = 0; });
  return o;
};

const _maxPowerPreset = () => {
  const o = _basePreset();
  o['hc-gain'] = MAX_GAIN;
  o['hc-preamp'] = MAX_PREAMP;
  o['hc-bass'] = 40;
  o['hc-treble'] = 20;
  o['hc-distortion'] = 0.25;
  o['hc-reverb'] = 0;
  o['hc-stereo'] = 2;
  o['hc-depth'] = 0;
  EQ_BANDS.forEach(b => { o[b.id] = 20; });
  return o;
};

const PRESETS = {
  default: _basePreset(),
  maxpower: _maxPowerPreset(),
  talkingset: Object.assign(_basePreset(), {
    'hc-bass': 17, 'hc-treble': 20,
  }),
  loudtalkingset: Object.assign(_basePreset(), {
    'hc-preamp': MAX_PREAMP, 'hc-bass': 14, 'hc-treble': 20,
  }),
};

function applyPreset(id) {
  const preset = PRESETS[id];
  if (!preset) return;
  document.querySelectorAll('.hc-preset-btn').forEach(b => b.classList.remove('applied'));
  const btn = document.querySelector(`[data-preset="${id}"]`);
  if (btn) btn.classList.add('applied');
  Object.entries(preset).forEach(([sid, val]) => {
    const el = document.getElementById(sid);
    if (!el) return;
    el.value = val;
    updateSlider(el);
  });
  applyFX();
}

function updateSlider(el) {
  const unit = el.getAttribute('data-unit') || '';
  const val  = parseFloat(el.value);

  setSliderTrack(el);

  const valEl = document.getElementById(el.id + '-val');
  if (valEl) {
    const d = Math.abs(val - Math.round(val)) < 0.005 ? Math.round(val) : val.toFixed(2);
    valEl.textContent = d + unit;
  }

  const id = el.id;
  if (id.startsWith('hc-mp3-')) return;

  if (id === 'hc-gain')       { FX.gain       = val; }
  else if (id === 'hc-preamp')     { FX.preamp     = val; }
  else if (id === 'hc-bass')       { FX.bass       = val; }
  else if (id === 'hc-treble')     { FX.treble     = val; }
  else if (id === 'hc-reverb')     { FX.reverb     = val; }
  else if (id === 'hc-distortion') { FX.distortion = val; }
  else if (id === 'hc-stereo')     { FX.stereoWidth = val; }
  else if (id === 'hc-depth') {
    FX.voiceDepth = val;
    if (vcBody && audioCtx) {
      const freq = Math.max(120, 260 - val * 4);
      const gain = Math.max(-6, Math.min(8, val * 0.4));
      vcBody.frequency.linearRampToValueAtTime(freq, audioCtx.currentTime + 0.02);
      vcBody.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + 0.02);
    }
  }
  else if (id === 'hc-pitch') {
    FX.pitch = val;
    applyVoiceProfile(FX.voiceProfile, FX.voiceIntensity);
  }
  else if (id === 'hc-voice-intensity') {
    applyVoiceProfile(FX.voiceProfile, val / 100);
  }
  else if (id === 'hc-monitor-vol') { FX.monitorVol = val / 100; }
  else if (id === 'hc-yt-vol') return;
  else if (id.startsWith('hc-eq')) {
    FX_EQ[id] = val;
    const idx = parseInt(id.replace('hc-eq', ''), 10) - 1;
    if (eqNodes[idx] && audioCtx) {
      eqNodes[idx].gain.linearRampToValueAtTime(val, audioCtx.currentTime + 0.02);
    }
  }

  applyFX();
}

function openWidget() {
  const w = document.getElementById('hc-widget');
  const o = document.getElementById('hc-overlay');
  if (!w) return;
  w.style.display = 'flex';
  o.classList.add('hc-open');
  requestAnimationFrame(() => w.classList.add('hc-open'));
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  if (!analyserNode) startIdleVisualizer();
  else startVisualizer();
}

function closeWidget() {
  const w = document.getElementById('hc-widget');
  const o = document.getElementById('hc-overlay');
  if (!w) return;
  w.classList.remove('hc-open');
  o.classList.remove('hc-open');
  setTimeout(() => { if (w && !w.classList.contains('hc-open')) w.style.display = 'none'; }, 220);
  if (vizAnimFrame) { cancelAnimationFrame(vizAnimFrame); vizAnimFrame = null; }
}

const SEC_MAP = {
  fx:      'hc-sec-fx',
  vc:      'hc-sec-vc',
  monitor: 'hc-sec-monitor',
  eq:      'hc-sec-eq',
  pre:     'hc-sec-pre',
  mp3:     'hc-sec-mp3',
  youtube: 'hc-sec-youtube',
};

function setupNav() {
  const btns = document.querySelectorAll('.hc-nav-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(SEC_MAP).forEach(sid => {
        const el = document.getElementById(sid);
        if (el) el.classList.remove('active');
      });
      const target = document.getElementById(SEC_MAP[btn.dataset.section]);
      if (target) target.classList.add('active');
    });
  });
  if (btns[0]) btns[0].classList.add('active');
}

function updateMonitorUI() {
  const toggle = document.getElementById('hc-monitor-toggle');
  const txt    = document.getElementById('hc-monitor-toggle-text');
  const quick  = document.getElementById('hc-quick-mute');
  if (toggle) {
    toggle.classList.toggle('active', FX.monitorEnabled);
    const old = toggle.querySelector('svg');
    if (old) old.remove();
    const iconSvg = FX.monitorEnabled ? ICONS.monitorOn : ICONS.monitorOff;
    toggle.insertAdjacentHTML('afterbegin', iconSvg.replace('<svg ', '<svg style="width:20px;height:20px" '));
  }
  if (txt) txt.textContent = FX.monitorEnabled ? 'المراقبة مفعّلة' : 'المراقبة متوقفة';
  if (quick) {
    quick.style.borderColor = FX.monitorEnabled ? 'rgba(0,245,255,0.8)' : 'rgba(255,80,80,0.8)';
    quick.style.background  = FX.monitorEnabled ? 'rgba(0,245,255,0.12)' : 'rgba(255,80,80,0.08)';
  }
}

function toggleMonitor() {
  FX.monitorEnabled = !FX.monitorEnabled;
  updateMonitorUI();
  applyFX();
}

function setupMonitorControls() {
  const toggle = document.getElementById('hc-monitor-toggle');
  const quick  = document.getElementById('hc-quick-mute');
  if (toggle) toggle.addEventListener('click', toggleMonitor);
  if (quick)  quick.addEventListener('click', e => { e.stopPropagation(); toggleMonitor(); });
  updateMonitorUI();
}

function monitorStatus() {
  setInterval(() => {
    const dot = document.getElementById('hc-status');
    const lbl = document.getElementById('hc-active-lbl');
    if (!dot || !lbl) return;
    const active = !!audioCtx && audioCtx.state === 'running';
    dot.className = 'hc-status-dot' + (active ? '' : ' inactive');
    lbl.textContent = active ? 'شغال' : 'متوقف';
  }, 1000);
}

function setupVoiceButtons() {
  const btns = document.querySelectorAll('.hc-voice-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const profileKey = btn.dataset.voice;
      const profile = VOICE_PROFILES[profileKey];
      const desc = document.getElementById('hc-voice-desc');
      if (desc && profile) desc.textContent = '• ' + (profile.description || profile.label);
      applyVoiceProfile(profileKey, FX.voiceIntensity);
    });
  });
}

/* ============================================================
   مشغل الأغاني + المكتبة
============================================================ */
let mp3Ctx        = null;
let mp3Source     = null;
let mp3GainNode   = null;
let mp3MicMixGain = null;
let mp3Buffer     = null;
let mp3StartTime  = 0;
let mp3Offset     = 0;
let mp3Playing    = false;
let mp3ProgTimer  = null;
let libCurrentId  = null;

function mp3Fmt(s) {
  s = Math.max(0, Math.floor(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function mp3UpdateProgress() {
  if (!mp3Playing || !mp3Buffer) return;
  const elapsed = mp3Offset + (mp3Ctx.currentTime - mp3StartTime);
  const dur = mp3Buffer.duration;
  const cur = document.getElementById('hc-mp3-cur');
  const durEl = document.getElementById('hc-mp3-dur');
  if (cur) cur.textContent = mp3Fmt(elapsed);
  if (durEl) durEl.textContent = mp3Fmt(dur);
  const pct = Math.min(100, (elapsed / dur) * 100);
  const fill = document.getElementById('hc-mp3-bar-fill');
  if (fill) fill.style.width = pct + '%';
  updateLibPlayButtons();
}

async function mp3EnsureCtx() {
  if (mp3Ctx && mp3Ctx.state !== 'closed') return;
  mp3Ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (mp3Ctx.state === 'suspended') await mp3Ctx.resume().catch(() => {});
  mp3GainNode = mp3Ctx.createGain();
  mp3GainNode.gain.value = parseFloat(document.getElementById('hc-mp3-gain').value) / 100 *
                            parseFloat(document.getElementById('hc-mp3-vol').value) / 100;
  const dest = mp3Ctx.createMediaStreamDestination();
  mp3GainNode.connect(dest);
  mp3GainNode.connect(mp3Ctx.destination);
  mp3Ctx._dest = dest;
}

function mp3Play() {
  if (!mp3Buffer || !mp3Ctx) return;
  if (mp3Playing) return;
  if (mp3Ctx.state === 'suspended') mp3Ctx.resume().catch(() => {});
  mp3Source = mp3Ctx.createBufferSource();
  mp3Source.buffer = mp3Buffer;
  mp3Source.connect(mp3GainNode);
  if (audioCtx && audioCtx.state === 'running' && destNode) {
    try {
      const bridge = audioCtx.createMediaStreamSource(mp3Ctx._dest.stream);
      const mixGain = audioCtx.createGain();
      const mixPct = parseFloat(document.getElementById('hc-mp3-mix').value) / 100;
      mixGain.gain.value = mixPct;
      bridge.connect(mixGain);
      mixGain.connect(destNode);
      mp3MicMixGain = mixGain;
      mp3Source._bridge = bridge;
    } catch (_) {}
  }
  mp3Source.start(0, mp3Offset);
  mp3StartTime = mp3Ctx.currentTime;
  mp3Playing = true;
  mp3Source.onended = () => { if (mp3Playing) mp3Stop(); };
  mp3ProgTimer = setInterval(mp3UpdateProgress, 250);
  const btn = document.getElementById('hc-mp3-play');
  if (btn) btn.classList.add('hc-mp3-active');
  updateLibPlayButtons();
}

function mp3Pause() {
  if (!mp3Playing || !mp3Source) return;
  mp3Offset += mp3Ctx.currentTime - mp3StartTime;
  mp3Source.stop();
  mp3Playing = false;
  clearInterval(mp3ProgTimer);
  const btn = document.getElementById('hc-mp3-play');
  if (btn) btn.classList.remove('hc-mp3-active');
  updateLibPlayButtons();
}

function mp3Resume() {
  if (mp3Playing || !mp3Buffer) return;
  mp3Play();
}

function mp3Stop() {
  if (mp3Source) { try { mp3Source.stop(); } catch (_) {} mp3Source = null; }
  mp3Playing = false;
  mp3Offset = 0;
  clearInterval(mp3ProgTimer);
  const cur = document.getElementById('hc-mp3-cur');
  const fill = document.getElementById('hc-mp3-bar-fill');
  const btn = document.getElementById('hc-mp3-play');
  if (cur) cur.textContent = '0:00';
  if (fill) fill.style.width = '0%';
  if (btn) btn.classList.remove('hc-mp3-active');
  updateLibPlayButtons();
}

function mp3UpdateGain() {
  if (!mp3GainNode) return;
  const vol  = parseFloat(document.getElementById('hc-mp3-vol').value)  / 100;
  const gain = parseFloat(document.getElementById('hc-mp3-gain').value) / 100;
  mp3GainNode.gain.value = vol * gain;
}

function mp3UpdateMix() {
  if (!mp3MicMixGain) return;
  mp3MicMixGain.gain.value = parseFloat(document.getElementById('hc-mp3-mix').value) / 100;
}

function initMP3Player() {
  const input    = document.getElementById('hc-mp3-input');
  const label    = document.getElementById('hc-mp3-label');
  const btnPlay  = document.getElementById('hc-mp3-play');
  const btnPause = document.getElementById('hc-mp3-pause');
  const btnStop  = document.getElementById('hc-mp3-stop');
  const barBg    = document.getElementById('hc-mp3-bar-bg');

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    mp3Stop();
    libCurrentId = null;
    await mp3EnsureCtx();
    const ab = await file.arrayBuffer();
    try {
      mp3Buffer = await mp3Ctx.decodeAudioData(ab);
      const nameEl = document.getElementById('hc-mp3-name');
      const durEl = document.getElementById('hc-mp3-dur');
      if (nameEl) nameEl.textContent = file.name.replace(/\.[^.]+$/, '');
      if (durEl) durEl.textContent = mp3Fmt(mp3Buffer.duration);
      label.classList.add('hc-mp3-ready');
      mp3Play();
    } catch (e) {
      alert('فشل فك الصوت: ' + e.message);
    }
  });

  label.addEventListener('click', () => input.click());
  btnPlay.addEventListener('click', () => {
    if (!mp3Buffer) { input.click(); return; }
    mp3Playing ? mp3Pause() : mp3Play();
  });
  btnPause.addEventListener('click', () => {
    if (mp3Playing) mp3Pause(); else mp3Resume();
  });
  btnStop.addEventListener('click', () => { mp3Stop(); libCurrentId = null; });

  barBg.addEventListener('click', e => {
    if (!mp3Buffer) return;
    const pct = e.offsetX / barBg.offsetWidth;
    const wasPlaying = mp3Playing;
    if (mp3Playing) mp3Pause();
    mp3Offset = pct * mp3Buffer.duration;
    const cur = document.getElementById('hc-mp3-cur');
    const fill = document.getElementById('hc-mp3-bar-fill');
    if (cur) cur.textContent = mp3Fmt(mp3Offset);
    if (fill) fill.style.width = (pct * 100) + '%';
    if (wasPlaying) mp3Play();
  });

  document.getElementById('hc-mp3-vol').addEventListener('input',  mp3UpdateGain);
  document.getElementById('hc-mp3-gain').addEventListener('input', mp3UpdateGain);
  document.getElementById('hc-mp3-mix').addEventListener('input',  mp3UpdateMix);
}

/* ============================================================
   IndexedDB
============================================================ */
let soundDB = null;

function openSoundDB() {
  return new Promise((resolve, reject) => {
    if (soundDB) return resolve(soundDB);
    const req = indexedDB.open('mrtree_sounds_db', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('sounds')) {
        db.createObjectStore('sounds', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => { soundDB = req.result; resolve(soundDB); };
    req.onerror   = () => reject(req.error);
  });
}

async function dbSaveSound(record) {
  const db = await openSoundDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sounds', 'readwrite');
    tx.objectStore('sounds').put(record);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

async function dbListSounds() {
  const db = await openSoundDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sounds', 'readonly');
    const req = tx.objectStore('sounds').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => reject(req.error);
  });
}

async function dbGetSound(id) {
  const db = await openSoundDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sounds', 'readonly');
    const req = tx.objectStore('sounds').get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function dbDeleteSound(id) {
  const db = await openSoundDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sounds', 'readwrite');
    tx.objectStore('sounds').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

async function playLibrarySound(id) {
  const sound = await dbGetSound(id);
  if (!sound) return;
  await mp3EnsureCtx();

  if (libCurrentId === id && mp3Playing) {
    mp3Pause();
    return;
  }

  mp3Stop();
  libCurrentId = id;

  try {
    const ab = await sound.blob.arrayBuffer();
    mp3Buffer = await mp3Ctx.decodeAudioData(ab);
    mp3Offset = 0;
    mp3Play();
    const nameEl = document.getElementById('hc-mp3-name');
    if (nameEl) nameEl.textContent = sound.name;
  } catch (e) {
    alert('فشل تشغيل الصوت: ' + e.message);
  }
}

function updateLibPlayButtons() {
  document.querySelectorAll('.hc-lib-item').forEach(item => {
    const id = item.dataset.id;
    const btn = item.querySelector('.hc-lib-play');
    if (!btn) return;
    if (id === libCurrentId && mp3Playing) {
      btn.textContent = '⏸';
      btn.classList.add('playing');
      item.classList.add('playing');
    } else {
      btn.textContent = '▶';
      btn.classList.remove('playing');
      item.classList.remove('playing');
    }
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

async function renderSoundLibrary() {
  const list = document.getElementById('hc-lib-list');
  if (!list) return;
  const sounds = await dbListSounds();
  if (!sounds.length) {
    list.innerHTML = '<div class="hc-lib-empty">لا توجد أصوات محفوظة بعد</div>';
    return;
  }
  sounds.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  list.innerHTML = sounds.map(s => `
    <div class="hc-lib-item" data-id="${s.id}">
      <button class="hc-lib-play" title="تشغيل">▶</button>
      <span class="hc-lib-name">${escapeHtml(s.name)}</span>
      <button class="hc-lib-rename" title="تعديل الاسم">✏</button>
      <button class="hc-lib-delete" title="حذف">🗑</button>
    </div>
  `).join('');

  list.querySelectorAll('.hc-lib-item').forEach(item => {
    const id = item.dataset.id;
    item.querySelector('.hc-lib-play').addEventListener('click', () => playLibrarySound(id));
    item.querySelector('.hc-lib-rename').addEventListener('click', async () => {
      const sound = await dbGetSound(id);
      if (!sound) return;
      const newName = prompt('الاسم الجديد:', sound.name);
      if (newName === null) return;
      const trimmed = newName.trim();
      if (!trimmed) return;
      sound.name = trimmed;
      await dbSaveSound(sound);
      renderSoundLibrary();
    });
    item.querySelector('.hc-lib-delete').addEventListener('click', async () => {
      const sound = await dbGetSound(id);
      if (!sound) return;
      if (!confirm(`حذف "${sound.name}"؟`)) return;
      if (libCurrentId === id) { mp3Stop(); libCurrentId = null; }
      await dbDeleteSound(id);
      renderSoundLibrary();
    });
  });

  updateLibPlayButtons();
}

function initSoundLibrary() {
  const input = document.getElementById('hc-lib-input');
  if (!input) return;
  input.addEventListener('change', async () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    for (const file of files) {
      try {
        const blob = file.slice(0, file.size, file.type);
        const id = 'snd_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        const name = file.name.replace(/\.[^.]+$/, '');
        await dbSaveSound({ id, name, blob, size: file.size, createdAt: Date.now() });
      } catch (e) {
        console.warn('[MrtreeCord] فشل حفظ صوت:', e);
      }
    }
    input.value = '';
    renderSoundLibrary();
  });
  renderSoundLibrary();
}
  let ytCurrentId = null;

  function extractYouTubeId(input) {
    if (!input) return null;
    const url = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*?&v=)([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  function ytCommand(func, args) {
    const iframe = document.getElementById('hc-yt-player');
    if (!iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command', func: func, args: args || [],
      }), '*');
    } catch (_) {}
  }

  function ytLoadVideo(id, autoplay) {
    const iframe = document.getElementById('hc-yt-player');
    if (!iframe) return;
    ytCurrentId = id;
    const params = `?enablejsapi=1&rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
    iframe.src = `https://www.youtube.com/embed/${id}${params}`;
    setTimeout(() => {
      const vol = document.getElementById('hc-yt-vol');
      if (vol) ytCommand('setVolume', [parseInt(vol.value, 10)]);
    }, 900);
  }

  function ytSetVolume(pct) {
    ytCommand('setVolume', [Math.max(0, Math.min(100, pct))]);
  }

  async function startBroadcast() {
    if (!audioCtx) { alert('شغّل المايك أول (ادخل روم صوتي).'); return; }
    if (broadcastStream) { stopBroadcast(); return; }
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const audioTracks = displayStream.getAudioTracks();
      if (audioTracks.length === 0) {
        displayStream.getTracks().forEach(t => t.stop());
        alert('⚠️ ما تم التقاط صوت!\n\n1️⃣ اختر "التاب هذا"\n2️⃣ فعّل ✅ "مشاركة الصوت"');
        return;
      }
      const audioOnlyStream = new MediaStream(audioTracks);
      broadcastSource = audioCtx.createMediaStreamSource(audioOnlyStream);
      broadcastGain   = audioCtx.createGain();
      broadcastGain.gain.value = 1;
      broadcastSource.connect(broadcastGain);
      broadcastGain.connect(destNode);
      broadcastStream = displayStream;
      audioTracks[0].addEventListener('ended', () => { stopBroadcast(); });
      updateBroadcastUI(true);
    } catch (e) {
      if (e.name === 'NotAllowedError') {}
      else if (e.name === 'NotSupportedError') alert('⚠️ متصفحك ما يدعم التقاط صوت التاب.');
      else alert('فشل البث: ' + e.message);
    }
  }

  function stopBroadcast() {
    try {
      if (broadcastSource) { broadcastSource.disconnect(); broadcastSource = null; }
      if (broadcastGain)   { broadcastGain.disconnect();   broadcastGain = null;   }
      if (broadcastStream) {
        broadcastStream.getTracks().forEach(t => t.stop());
        broadcastStream = null;
      }
    } catch (_) {}
    updateBroadcastUI(false);
  }

  function updateBroadcastUI(active) {
    const btn = document.getElementById('hc-yt-broadcast');
    const txt = document.getElementById('hc-yt-broadcast-text');
    if (!btn || !txt) return;
    if (active) {
      btn.classList.add('broadcasting');
      txt.textContent = 'إيقاف البث';
      const svg = btn.querySelector('svg');
      if (svg) svg.outerHTML = ICONS.broadcastOff.replace('<svg ', '<svg style="width:20px;height:20px;stroke:#ff4060;fill:none" ');
    } else {
      btn.classList.remove('broadcasting');
      txt.textContent = 'ابدأ البث';
      const svg = btn.querySelector('svg');
      if (svg) svg.outerHTML = ICONS.broadcast.replace('<svg ', '<svg style="width:20px;height:20px;stroke:#00f5ff;fill:none" ');
    }
  }

  function initYouTubePlayer() {
    const urlInput     = document.getElementById('hc-yt-url');
    const loadBtn      = document.getElementById('hc-yt-load');
    const btnPlay      = document.getElementById('hc-yt-play');
    const btnPause     = document.getElementById('hc-yt-pause');
    const btnStop      = document.getElementById('hc-yt-stop');
    const volSlider    = document.getElementById('hc-yt-vol');
    const broadcastBtn = document.getElementById('hc-yt-broadcast');
    if (!urlInput || !loadBtn) return;

    function doLoad() {
      const id = extractYouTubeId(urlInput.value);
      if (!id) {
        urlInput.style.borderColor = 'rgba(255,80,80,0.9)';
        urlInput.style.boxShadow = '0 0 14px rgba(255,80,80,0.5)';
        setTimeout(() => {
          urlInput.style.borderColor = '';
          urlInput.style.boxShadow = '';
        }, 1200);
        return;
      }
      ytLoadVideo(id, true);
    }

    loadBtn.addEventListener('click', doLoad);
    urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLoad(); });
    if (btnPlay)  btnPlay.addEventListener('click',  () => ytCommand('playVideo'));
    if (btnPause) btnPause.addEventListener('click', () => ytCommand('pauseVideo'));
    if (btnStop)  btnStop.addEventListener('click',  () => ytCommand('stopVideo'));
    if (volSlider) volSlider.addEventListener('input', e => ytSetVolume(parseInt(e.target.value, 10)));
    if (broadcastBtn) broadcastBtn.addEventListener('click', startBroadcast);
  }

  function mount() {
    const bar = document.createElement('div');
    bar.id = 'hc-bar';
    bar.innerHTML = ICONS.bolt.replace('<svg ', '<svg id="hc-bar-icon" ') +
      `<span id="hc-bar-text">MRTREE CORD V2</span>`;
    bar.addEventListener('click', openWidget);

    const { overlay, widget } = buildWidget();

    document.body.appendChild(bar);
    document.body.appendChild(overlay);
    document.body.appendChild(widget);

    widget.querySelector('#hc-close').addEventListener('click', e => {
      e.stopPropagation();
      closeWidget();
    });

    setupNav();
    setupMonitorControls();
    setupVoiceButtons();

    document.querySelectorAll('.hc-slider').forEach(s => {
      setSliderTrack(s);
      s.addEventListener('input', () => updateSlider(s));
      s.addEventListener('change', () => updateSlider(s));
    });

    document.querySelectorAll('.hc-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });

    const canvas = document.getElementById('hc-canvas');
    if (canvas) {
      const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width > 0) canvas.width = rect.width;
      };
      resize();
      window.addEventListener('resize', resize);
    }

    monitorStatus();
    initMP3Player();
    initYouTubePlayer();
    initSoundLibrary();
  }

  function init() {
    if (document.body) {
      mount();
    } else {
      const obs = new MutationObserver(() => {
        if (document.body) { obs.disconnect(); mount(); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  init();
})();