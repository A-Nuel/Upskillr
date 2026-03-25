import { ShieldAlert, Zap, Wrench, ShieldCheck, ArrowLeft } from 'lucide-react';
import { AISurvivalGuide } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: AISurvivalGuide;
  onBack: () => void;
}

export function AISurvivalGuideView({ data, onBack }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-slate-950 rounded-2xl shadow-2xl border border-indigo-500/30 mt-4 mb-8"
    >
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roadmap
        </button>
      </div>

      <div className="text-center space-y-4 pb-8 border-b border-slate-800">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/30">
          <Zap className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">
          Future-Proofing: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{data.skill}</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Don't compete with AI. Command it. Here is your classified dossier on surviving and thriving in the age of automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reality Check */}
        <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-amber-300">The Reality Check</h3>
          </div>
          <p className="text-sm text-amber-200/60 mb-4 font-mono uppercase tracking-wider">What AI Will Automate</p>
          <ul className="space-y-3">
            {(data.automationThreat || []).map((threat, i) => (
              <li key={i} className="flex items-start gap-3 text-amber-100/80 text-sm">
                <span className="mt-1 text-amber-500/50 shrink-0">×</span>
                <span>{threat}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-amber-500/10 text-xs text-amber-400/60 font-medium">
            Takeaway: Stop optimizing for these tasks. Let AI do the heavy lifting.
          </div>
        </div>

        {/* Human Advantage */}
        <div className="bg-emerald-500/5 p-6 rounded-xl border border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-300">The Human Advantage</h3>
          </div>
          <p className="text-sm text-emerald-200/60 mb-4 font-mono uppercase tracking-wider">Your Unassailable Moat</p>
          <ul className="space-y-3">
            {(data.humanAdvantage || []).map((adv, i) => (
              <li key={i} className="flex items-start gap-3 text-emerald-100/80 text-sm">
                <span className="mt-1 text-emerald-500/50 shrink-0">✓</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-emerald-500/10 text-xs text-emerald-400/60 font-medium">
            Takeaway: Double down your learning efforts here.
          </div>
        </div>
      </div>

      {/* 10x Multiplier */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 rounded-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">The 10x Multiplier</h3>
          </div>
          <p className="text-indigo-100/90 leading-relaxed text-lg">
            {data.multiplierStrategy}
          </p>
        </div>
      </div>

      {/* Tool Stack */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-800 text-slate-300 rounded-lg">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Your Essential AI Tool Stack</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.toolStack || []).map((tool, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-indigo-500/30 transition-colors">
              <h4 className="font-bold text-indigo-300 mb-1">{tool.name}</h4>
              <p className="text-sm text-slate-400">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
