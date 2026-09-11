import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, Users, FolderCheck, LifeBuoy, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: 'check' | 'community' | 'cases' | 'action';
  onSelectTab: (tab: 'check' | 'community' | 'cases' | 'action') => void;
  casesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, casesCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'check' as const, label: 'Check Scam', icon: ShieldCheck },
    { id: 'community' as const, label: 'Community Intelligence', icon: Users },
    { id: 'cases' as const, label: 'My Cases', icon: FolderCheck, badge: casesCount > 0 ? casesCount : undefined },
    { id: 'action' as const, label: 'Action Center', icon: LifeBuoy }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      backgroundColor: 'rgba(10, 15, 29, 0.85)',
      borderBottom: '1px solid #1e293b'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => onSelectTab('check')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            position: 'relative',
            width: '2.6rem',
            height: '2.6rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <ShieldCheck size={26} color="#ffffff" strokeWidth={2.4} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                Scam<span style={{ color: '#38bdf8' }}>Shield</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0.15rem 0.45rem',
                borderRadius: '0.375rem',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                MVP
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              Verify before you pay.
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          <style>{`
            @media (min-width: 768px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '0.625rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#38bdf8' : '#94a3b8'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Metric Pill & Emergency 1930 */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.78rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span style={{ color: '#6ee7b7', fontWeight: 600 }}>Demo Dataset Active</span>
          </div>

          <a
            href="tel:1930"
            title="National Cyber Crime Helpline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <AlertOctagon size={14} color="#ef4444" />
            <span>SOS: 1930</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#10172b',
          borderBottom: '1px solid #1e293b',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.2)' : '#151e36',
                  color: isActive ? '#38bdf8' : '#e2e8f0',
                  border: isActive ? '1px solid #3b82f6' : '1px solid #243254',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
