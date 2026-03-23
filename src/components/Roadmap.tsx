import { Target, Brain, Calendar, Wrench, BookOpen, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { RoadmapData } from '../types';

export function Roadmap({ data }: { data: RoadmapData }) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 mt-4 mb-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white tracking-tight">Your Personalized Roadmap</h2>
        <p className="text-slate-400">Based on your unique profile, here is your path to success.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Skills */}
        <div className="bg-indigo-500/10 p-6 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-300">Best Skills for You</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.bestSkills?.map(skill => (
              <span key={skill} className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Why it fits */}
        <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-emerald-300">Why This Fits You</h3>
          </div>
          <p className="text-emerald-200/80 text-sm leading-relaxed">{data.whyItFits}</p>
        </div>
      </div>

      {/* 30 Day Plan */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-700 text-slate-300 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">30-Day Learning Plan</h3>
        </div>
        <div className="space-y-4">
          {[
            { week: 'Week 1', desc: data.thirtyDayPlan?.week1 },
            { week: 'Week 2', desc: data.thirtyDayPlan?.week2 },
            { week: 'Week 3', desc: data.thirtyDayPlan?.week3 },
            { week: 'Week 4', desc: data.thirtyDayPlan?.week4 },
          ].map((item, i) => (
            <div key={item.week} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                {i < 3 && <div className="w-0.5 h-full bg-slate-700 my-1"></div>}
              </div>
              <div className="pb-6">
                <h4 className="font-semibold text-slate-200">{item.week}</h4>
                <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tools */}
        <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 text-slate-400 rounded-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Tools to Learn</h3>
          </div>
          <ul className="space-y-2">
            {data.toolsToLearn?.map(tool => (
              <li key={tool} className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div>
                {tool}
              </li>
            ))}
          </ul>
        </div>

        {/* Free Resources */}
        <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 text-slate-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Free Resources</h3>
          </div>
          <ul className="space-y-3">
            {data.freeResources?.map(res => (
              <li key={res.name} className="text-sm">
                <span className="font-semibold text-slate-200">{res.name}:</span>{' '}
                <span className="text-slate-400">{res.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategy & Growth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3 text-green-400 font-semibold">
            <DollarSign className="w-4 h-4" /> First Income
          </div>
          <p className="text-sm text-green-300/80">{data.firstIncomeStrategy}</p>
        </div>
        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3 text-red-400 font-semibold">
            <AlertTriangle className="w-4 h-4" /> Mistakes to Avoid
          </div>
          <ul className="space-y-1">
            {data.mistakesToAvoid?.map(m => (
              <li key={m} className="text-sm text-red-300/80 flex items-start gap-2">
                <span className="mt-1 shrink-0">-</span> <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold">
            <TrendingUp className="w-4 h-4" /> Long-Term Growth
          </div>
          <p className="text-sm text-blue-300/80">{data.longTermGrowth}</p>
        </div>
      </div>
    </div>
  );
}
