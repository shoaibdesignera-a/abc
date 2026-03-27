import React, { useMemo, useState } from 'react';
import { generateCryptoSignal } from './services/geminiService';
import { SignalRequest, TradingSignal } from './types';

const timeframes: TradingSignal['timeframe'][] = ['15m', '30m', '1h', '4h', '1d'];
const riskProfiles: SignalRequest['riskProfile'][] = ['conservative', 'balanced', 'aggressive'];

const signalTheme: Record<TradingSignal['signal'], string> = {
  strong_buy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  buy: 'bg-lime-100 text-lime-700 border-lime-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  sell: 'bg-orange-100 text-orange-700 border-orange-200',
  strong_sell: 'bg-rose-100 text-rose-700 border-rose-200',
};

const formatSignal = (signal: TradingSignal['signal']) => signal.replace('_', ' ').toUpperCase();

const App: React.FC = () => {
  const [pair, setPair] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState<TradingSignal['timeframe']>('15m');
  const [riskProfile, setRiskProfile] = useState<SignalRequest['riskProfile']>('balanced');
  const [marketContext, setMarketContext] = useState('');
  const [chartFileName, setChartFileName] = useState('');
  const [chartImageBase64, setChartImageBase64] = useState<string | undefined>(undefined);
  const [chartImageMimeType, setChartImageMimeType] = useState<string | undefined>(undefined);
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => pair.trim().length > 0 && !isLoading, [pair, isLoading]);

  const handleFileUpload = async (file?: File) => {
    if (!file) {
      setChartFileName('');
      setChartImageBase64(undefined);
      setChartImageMimeType(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, data = ''] = result.split(',');
      setChartFileName(file.name);
      setChartImageBase64(data);
      setChartImageMimeType(file.type || 'image/png');
    };
    reader.readAsDataURL(file);
  };

  const createSignal = async () => {
    if (!canSubmit) return;
    setError('');
    setIsLoading(true);

    try {
      const response = await generateCryptoSignal({
        pair: pair.trim().toUpperCase(),
        timeframe,
        riskProfile,
        marketContext,
        chartImageBase64,
        chartImageMimeType,
      });
      setSignal(response);
    } catch (err) {
      console.error(err);
      setError('Could not generate signal. Check API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/30">
            Crypto Signal Maker
          </p>
          <h1 className="text-4xl md:text-5xl font-black">AI Signal Bot with News + Pattern Context</h1>
          <p className="text-slate-300 max-w-3xl">
            Upload a chart screenshot (15m, 30m, 1h, 4h, 1d), add context, and generate a structured signal with entry zone,
            TP/SL levels, pattern detection, and recent-news-aware reasoning.
          </p>
        </header>

        <section className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Trading pair</span>
              <input
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                placeholder="BTC/USDT"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Timeframe</span>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as TradingSignal['timeframe'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
              >
                {timeframes.map((tf) => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Risk profile</span>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value as SignalRequest['riskProfile'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
              >
                {riskProfiles.map((risk) => (
                  <option key={risk} value={risk}>{risk}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Chart screenshot (optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-violet-500/20 file:text-violet-100 file:px-3 file:py-2"
              />
              {chartFileName && <p className="text-xs text-violet-200">Loaded: {chartFileName}</p>}
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Market notes (optional)</span>
              <textarea
                rows={4}
                value={marketContext}
                onChange={(e) => setMarketContext(e.target.value)}
                placeholder="Ex: Breakout above resistance, RSI divergence, CPI news in 2 hours..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
              />
            </label>

            <button
              onClick={createSignal}
              disabled={!canSubmit}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 font-semibold rounded-xl py-3 transition"
            >
              {isLoading ? 'Analyzing…' : 'Generate Signal'}
            </button>
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </div>

          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6">
            {!signal ? (
              <div className="h-full min-h-[420px] grid place-items-center text-slate-400 text-center px-8">
                Run the model to get a structured crypto setup. This is decision support, not financial advice.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{signal.pair} · {signal.timeframe}</h2>
                  <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${signalTheme[signal.signal]}`}>
                    {formatSignal(signal.signal)}
                  </span>
                  <span className="text-sm text-slate-300">Confidence: {signal.confidence}%</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4"><b>Entry zone:</b> {signal.entryZone}</div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4"><b>Stop loss:</b> {signal.stopLoss}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Take profit levels</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {signal.takeProfit.map((tp, idx) => <li key={idx}>{tp}</li>)}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4"><b>Detected pattern:</b> {signal.pattern}</div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Rationale</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      {signal.rationale.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Risk notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                      {signal.riskNotes.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm">
                  <h3 className="font-semibold mb-2">News context</h3>
                  <p className="text-slate-300">{signal.newsSummary}</p>
                </div>

                {signal.sources.length > 0 && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {signal.sources.slice(0, 6).map((source, index) => (
                        <a
                          key={`${source.uri}-${index}`}
                          href={source.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                        >
                          {source.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
