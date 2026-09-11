import React from 'react';
import { ShieldCheck, Zap, AlertTriangle, Lock, ArrowDown, Users, ArrowRight, MessageSquare, AlertCircle, Search, Database, ShieldAlert } from 'lucide-react';

interface HeroProps {
  onScrollToChecker: () => void;
  onNavigateToCommunity: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToChecker, onNavigateToCommunity }) => {
  return (
    <section style={{
      padding: '3rem 0 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Hackathon Tagline Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.35rem 1rem',
          borderRadius: '999px',
          backgroundColor: 'rgba(37, 99, 235, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          marginBottom: '1.5rem'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8' }} className="animate-pulse-slow" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#93c5fd', letterSpacing: '0.02em' }}>
            Social-Commerce Fraud Defense System
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
          maxWidth: '880px',
          margin: '0 auto 1.25rem',
          color: '#ffffff'
        }}>
          SCAMSHIELD <br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            "Verify before you pay."
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)',
          color: '#cbd5e1',
          maxWidth: '720px',
          margin: '0 auto 2.25rem',
          lineHeight: 1.55,
          fontWeight: 450
        }}>
          Analyze suspicious messages, screenshots and payment identifiers before the next transfer.
        </p>

        {/* CTA Button Group */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          <button 
            onClick={onScrollToChecker}
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '0.85rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <ShieldCheck size={20} />
            <span>CHECK A SCAM</span>
            <ArrowDown size={16} />
          </button>

          <button 
            onClick={onNavigateToCommunity}
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '0.85rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Users size={18} />
            <span>VIEW COMMUNITY INTELLIGENCE</span>
          </button>
        </div>

        {/* 5-Step Visual Workflow Pipeline */}
        <div className="glass-panel" style={{
          maxWidth: '960px',
          margin: '0 auto 3rem',
          padding: '1.1rem 1.5rem',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          backgroundColor: 'rgba(11, 17, 32, 0.85)'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            5-Stage Real-Time Fraud Defense Pipeline
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.6rem'
          }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', backgroundColor: '#10172b', border: '1px solid #1e293b' }}>
              <MessageSquare size={15} color="#38bdf8" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc' }}>MESSAGE / SCREENSHOT</span>
            </div>

            <ArrowRight size={14} color="#64748b" />

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', backgroundColor: '#10172b', border: '1px solid #1e293b' }}>
              <AlertCircle size={15} color="#f97316" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc' }}>RISK SIGNALS</span>
            </div>

            <ArrowRight size={14} color="#64748b" />

            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', backgroundColor: '#10172b', border: '1px solid #1e293b' }}>
              <Search size={15} color="#a855f7" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc' }}>IDENTIFIER CHECK</span>
            </div>

            <ArrowRight size={14} color="#64748b" />

            {/* Step 4 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', backgroundColor: '#10172b', border: '1px solid #1e293b' }}>
              <Database size={15} color="#eab308" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f8fafc' }}>COMMUNITY MATCH</span>
            </div>

            <ArrowRight size={14} color="#64748b" />

            {/* Step 5 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.4rem 0.75rem', borderRadius: '0.4rem', backgroundColor: '#10172b', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
              <ShieldAlert size={15} color="#ef4444" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fca5a5' }}>ACTION</span>
            </div>
          </div>
        </div>

        {/* Trust & Metric Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1060px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#38bdf8' }}>
                <Zap size={20} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                &lt; 0.2s
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.2rem' }}>
              Real-time Heuristic Audit
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Zero latency client-side pattern analysis for UPI, URLs & urgency tokens.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <AlertTriangle size={20} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                18+
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.2rem' }}>
              Risk Signals Evaluated
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Heuristic patterns covering advance fees, reverse QR codes & phishing URLs.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <Lock size={20} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                100% Private
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.2rem' }}>
              No Data Stored Without Consent
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Safe local evaluation. Synthetic demo datasets for hackathon evaluation.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
