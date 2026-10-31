import React, { useEffect, useRef } from 'react';
import { ArrowRight, Activity, Layers, GitCompare, Cpu, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';

interface LandingPageProps {
  onNavigate: (page: NavPage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interactive Quantum Particle Lattice Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const colors = ['#ea580c', '#38bdf8', '#10b981', '#9ca3af'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle interconnected lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(234, 88, 12, ${0.15 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Interactive Canvas */}
      <div className="relative bg-[#0d111a] border border-[#1e2638] rounded-xl p-8 sm:p-12 overflow-hidden shadow-sm technical-grid">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-950 border border-cyan-800/80 rounded-full text-xs font-mono font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>QUANTUMTRACE AI • PRODUCTION ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Trace the Quantum.<br />
            <span className="text-cyan-400">Find the Why.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            An evidence-driven quantum debugging environment that investigates circuit behaviour,
            compares ideal and noisy execution, explores alternative implementations, and explains validated findings.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('workspace')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-bold rounded-lg shadow transition"
            >
              <span>Launch Quantum Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('twin')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#131926] hover:bg-[#1a2336] text-slate-200 text-xs font-bold rounded-lg border border-[#1e2638] transition"
            >
              <span>Explore 3D Digital Twin</span>
            </button>
          </div>

          {/* Technical Annotations */}
          <div className="pt-4 flex flex-wrap gap-6 text-[11px] font-mono text-slate-400 border-t border-[#1e2638]">
            <div>FRAMEWORK: <strong className="text-cyan-400">Qiskit 2.x</strong></div>
            <div>NOISE: <strong className="text-slate-200">Lindblad T1/T2 & Depolarizing</strong></div>
            <div>FINGERPRINTS: <strong className="text-slate-200">Canonical SHA-256</strong></div>
            <div>VERIFICATION: <strong className="text-cyan-400">Wilson 95% CI</strong></div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Evidence-Driven Scientific Workflow</h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineered to isolate physical noise, algorithmic logic flaws, and readout artifacts without fabricated outputs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('phase1')}
            className="group bg-[#0d111a] p-6 rounded-lg border border-[#1e2638] hover:border-cyan-400 shadow-sm transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-800 group-hover:bg-cyan-500 group-hover:text-black transition">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1.5">Phase 1: Global Noise Studio</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Executes dual ideal and noise-aware simulations. Computes Total Variation Distance, Hellinger divergence, and Wilson score uncertainty intervals.
            </p>
            <span className="text-xs font-mono font-medium text-cyan-400 flex items-center space-x-1">
              <span>View Phase 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('phase2')}
            className="group bg-[#0d111a] p-6 rounded-lg border border-[#1e2638] hover:border-cyan-400 shadow-sm transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-800 group-hover:bg-cyan-500 group-hover:text-black transition">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1.5">Phase 2: Checkpoint Segmentation</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Partitions circuits into sequential prefixes. Evaluates state fidelity at each boundary to pinpoint exactly where divergence initiates.
            </p>
            <span className="text-xs font-mono font-medium text-cyan-400 flex items-center space-x-1">
              <span>View Phase 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('unified')}
            className="group bg-[#0d111a] p-6 rounded-lg border border-[#1e2638] hover:border-cyan-400 shadow-sm transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-800 group-hover:bg-cyan-500 group-hover:text-black transition">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1.5">Unified Diagnosis & Code Repair</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Synthesizes Phase 1 and 2 evidence, ranks causal hypotheses, highlights cross-phase agreement, and generates automated code repair diffs.
            </p>
            <span className="text-xs font-mono font-medium text-cyan-400 flex items-center space-x-1">
              <span>View Unified Diagnosis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Central Product Principle Card */}
      <div className="bg-[#070a0f] text-slate-100 rounded-xl p-8 border border-[#1e2638]">
        <div className="max-w-2xl space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            Guiding Product Principle
          </span>
          <h3 className="text-xl font-bold tracking-tight text-slate-100">
            "The debugging engine identifies and validates evidence. The AI explains that evidence. The developer remains in control of the proposed correction."
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every score, fingerprint hash, and distance metric is calculated from empirical samples and persisted in PostgreSQL. QuantumTrace AI never substitutes decorative graphics for scientific truth.
          </p>
        </div>
      </div>
    </div>
  );
};

