import React from 'react';
import { ShieldCheck, AlertOctagon } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'check' | 'community' | 'cases' | 'action') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer style={{
      backgroundColor: '#070b14',
      borderTop: '1px solid #1e293b',
      padding: '3rem 0 2rem',
      color: '#94a3b8'
    }}>
      <div className="container">
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid #151e36'
        }}>
          
          {/* Brand Col */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Scam<span style={{ color: '#38bdf8' }}>Shield</span>
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Protecting online shoppers from social-commerce fraud, advance-payment traps, and deceptive UPI schemes.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>
              Tagline: <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>"Verify before you pay."</span>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => onSelectTab('check')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>
                  Check Scam
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>
                  Community Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('cases')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>
                  My Cases
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('action')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>
                  Action Center
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Col */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Helplines & Resources
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5' }}>
                <AlertOctagon size={14} color="#ef4444" />
                <span>Cyber Fraud Helpline: <strong>1930</strong></span>
              </div>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                National Cyber Crime Portal ↗
              </a>
              <a href="https://www.npci.org.in" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                NPCI UPI Safety Guidelines ↗
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div style={{ maxWidth: '680px', lineHeight: 1.4 }}>
            Built for Hackathon Demo. Realistic synthetic demo data only — no real private user information stored.
            <div style={{ color: '#475569', marginTop: '0.25rem' }}>
              Disclaimer: Risk assessment based on detected signals — not proof of fraud or criminal activity. ScamShield provides risk assessment and guidance. It does not determine criminal liability.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>ScamShield MVP</span> • <span>Verify before you pay</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
