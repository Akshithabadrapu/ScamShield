import React, { useState } from 'react';
import type { CommunityThreat } from '../types';
import { 
  Users, Search, ThumbsUp, ShieldAlert, Plus, Clock 
} from 'lucide-react';

interface CommunityIntelligenceProps {
  threats: CommunityThreat[];
  onUpvoteThreat: (threatId: string) => void;
  onAddThreat: (newThreat: Omit<CommunityThreat, 'id' | 'upvoteCount' | 'verifiedCount' | 'reportedDate'>) => void;
}

export const CommunityIntelligence: React.FC<CommunityIntelligenceProps> = ({ 
  threats, 
  onUpvoteThreat, 
  onAddThreat 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [showReportModal, setShowReportModal] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formPlatform, setFormPlatform] = useState<CommunityThreat['platform']>('Instagram');
  const [formScamType, setFormScamType] = useState('Advance Payment & Ghosting');
  const [formIdentifier, setFormIdentifier] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLoss, setFormLoss] = useState('₹1,500');

  const platforms = ['All', 'Instagram', 'WhatsApp', 'Telegram', 'SMS', 'Online Marketplace'];
  const categories = ['All', 'Advance Payment', 'Phishing', 'Task Scam', 'Utility Scam', 'Fake Refund'];
  const riskLevels = ['All', 'CRITICAL', 'HIGH', 'MEDIUM'];

  const filteredThreats = threats.filter(threat => {
    const matchesPlatform = selectedPlatform === 'All' || threat.platform === selectedPlatform;
    
    const matchesCategory = selectedCategory === 'All' || (() => {
      const text = (threat.scamType + ' ' + threat.title + ' ' + threat.description).toLowerCase();
      if (selectedCategory === 'Advance Payment') return text.includes('advance') || text.includes('token') || text.includes('deposit');
      if (selectedCategory === 'Phishing') return text.includes('phish') || text.includes('credential') || text.includes('card') || text.includes('sms');
      if (selectedCategory === 'Task Scam') return text.includes('task') || text.includes('job') || text.includes('freelance');
      if (selectedCategory === 'Utility Scam') return text.includes('utility') || text.includes('power') || text.includes('electricity') || text.includes('bill');
      if (selectedCategory === 'Fake Refund') return text.includes('refund') || text.includes('reverse') || text.includes('qr');
      return true;
    })();

    const matchesRisk = selectedRisk === 'All' || threat.severity === selectedRisk;

    const matchesSearch = 
      threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.reportedHandleOrUPI.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.scamType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPlatform && matchesCategory && matchesRisk && matchesSearch;
  });

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formIdentifier.trim()) return;

    onAddThreat({
      title: formTitle,
      platform: formPlatform,
      scamType: formScamType,
      reportedHandleOrUPI: formIdentifier,
      description: formDescription || 'Reported by community member via ScamShield verification center.',
      lossReported: formLoss || 'Unspecified',
      severity: 'HIGH'
    });

    setShowReportModal(false);
    setFormTitle('');
    setFormIdentifier('');
    setFormDescription('');
  };

  return (
    <section style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              color: '#facc15',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              <Users size={14} />
              <span>DEMO DATA / SYNTHETIC RECORDS</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Community Scam Intelligence
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '680px', lineHeight: 1.45, marginBottom: '0.75rem' }}>
              Crowdsourced threat warnings submitted by shoppers across India. Search reported UPI IDs, 
              fake store handles, and phishing SMS patterns before making payment.
            </p>
            <div style={{
              display: 'inline-block',
              padding: '0.45rem 0.85rem',
              borderRadius: '0.4rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              lineHeight: 1.4
            }}>
              💡 <strong>Future Production Capability:</strong> This showcase illustrates how crowdsourced threat reports from millions of shoppers will automatically flag recurring scam handles and UPIs across India in real-time.
            </div>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="btn-danger"
            style={{ padding: '0.75rem 1.35rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>Report a Suspicious Seller</span>
          </button>
        </div>

        {/* 4-Way Search & Filter Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: '#0b1120',
            border: '1px solid #1e293b',
            borderRadius: '0.5rem',
            padding: '0.65rem 0.95rem',
            marginBottom: '1rem'
          }}>
            <Search size={18} color="#64748b" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search UPI VPA, Instagram handle, phone, keyword, or courier..."
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '0.9rem',
                width: '100%'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* Row 1: Platform Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '70px' }}>
                Platform:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {platforms.map(p => {
                  const isSelected = selectedPlatform === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? '#2563eb' : '#10172b',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        border: isSelected ? '1px solid #3b82f6' : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '70px' }}>
                Category:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {categories.map(c => {
                  const isSelected = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.2)' : '#10172b',
                        color: isSelected ? '#38bdf8' : '#94a3b8',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Severity / Risk Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', minWidth: '70px' }}>
                Severity:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {riskLevels.map(r => {
                  const isSelected = selectedRisk === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRisk(r)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected 
                          ? (r === 'CRITICAL' ? 'rgba(239, 68, 68, 0.25)' : r === 'HIGH' ? 'rgba(249, 115, 22, 0.25)' : '#2563eb')
                          : '#10172b',
                        color: isSelected 
                          ? (r === 'CRITICAL' ? '#fca5a5' : r === 'HIGH' ? '#fdba74' : '#ffffff')
                          : '#94a3b8',
                        border: isSelected 
                          ? (r === 'CRITICAL' ? '1px solid #ef4444' : r === 'HIGH' ? '1px solid #f97316' : '1px solid #3b82f6')
                          : '1px solid #1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {r === 'All' ? 'All Severities' : r}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Threat Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredThreats.map(threat => {
            const isCrit = threat.severity === 'CRITICAL';
            const isHigh = threat.severity === 'HIGH';
            
            return (
              <div 
                key={threat.id} 
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: isCrit ? '3px solid #ef4444' : isHigh ? '3px solid #f97316' : '3px solid #eab308'
                }}
              >
                <div>
                  
                  {/* Card Top Row: Platform, Risk Level, Date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: '#1e293b',
                        color: '#94a3b8',
                        border: '1px solid #334155'
                      }}>
                        {threat.platform}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: isCrit ? 'rgba(239, 68, 68, 0.18)' : isHigh ? 'rgba(249, 115, 22, 0.18)' : 'rgba(234, 179, 8, 0.18)',
                        color: isCrit ? '#fca5a5' : isHigh ? '#fdba74' : '#fde047',
                        border: isCrit ? '1px solid rgba(239, 68, 68, 0.4)' : isHigh ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid rgba(234, 179, 8, 0.4)'
                      }}>
                        {threat.severity}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} />
                      <span>{threat.reportedDate}</span>
                    </span>
                  </div>

                  {/* Title & Pattern / Category */}
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    {threat.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                      Pattern: {threat.scamType}
                    </span>
                  </div>

                  {/* Reported Identifier Box */}
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#0b1120',
                    border: '1px solid #1e293b',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                      Reported Identifier / UPI / Link
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#fca5a5',
                      fontFamily: 'JetBrains Mono, monospace',
                      wordBreak: 'break-all'
                    }}>
                      {threat.reportedHandleOrUPI}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1rem' }}>
                    {threat.description}
                  </p>
                </div>

                {/* Footer of Card: Loss, Reports & Confirm */}
                <div>
                  <div style={{
                    borderTop: '1px solid #1e293b',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                      Loss: <span style={{ color: '#f87171', fontWeight: 600 }}>{threat.lossReported}</span>
                    </div>

                    <button
                      onClick={() => onUpvoteThreat(threat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: threat.userUpvoted ? 'rgba(37, 99, 235, 0.25)' : '#10172b',
                        border: threat.userUpvoted ? '1px solid #3b82f6' : '1px solid #1e293b',
                        color: threat.userUpvoted ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '0.76rem',
                        fontWeight: 600
                      }}
                    >
                      <ThumbsUp size={13} />
                      <span>Confirm / Upvote ({threat.upvoteCount})</span>
                    </button>
                  </div>

                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.68rem',
                    color: '#475569',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Prototype Demo Record</span>
                    <span>{threat.verifiedCount} Verifications</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredThreats.length === 0 && (
          <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <ShieldAlert size={42} color="#f59e0b" style={{ margin: '0 auto 0.85rem' }} />
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
              No community matches found.
            </div>
            <div style={{ fontSize: '0.86rem', color: '#94a3b8', maxWidth: '460px', margin: '0 auto 1.25rem', lineHeight: 1.45 }}>
              No reported threat records match your search or filter criteria in the prototype demo dataset.
            </div>
            <button
              onClick={() => { setSearchTerm(''); setSelectedPlatform('All'); setSelectedCategory('All'); setSelectedRisk('All'); }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '1.75rem',
            backgroundColor: '#0f172a',
            border: '1px solid #243254',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
              Report a Suspicious Seller or UPI ID
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Add to the synthetic community intelligence pool to alert other shoppers before they pay.
            </p>

            <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Incident Title / Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Fake Designer Store @fashion_hub_in"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#151e36',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Platform
                  </label>
                  <select
                    value={formPlatform}
                    onChange={e => setFormPlatform(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '0.4rem',
                      backgroundColor: '#151e36',
                      border: '1px solid #1e293b',
                      color: '#f8fafc',
                      fontSize: '0.88rem'
                    }}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="SMS">SMS Phishing</option>
                    <option value="Online Marketplace">Online Marketplace</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Loss Amount / Claim
                  </label>
                  <input
                    type="text"
                    value={formLoss}
                    onChange={e => setFormLoss(e.target.value)}
                    placeholder="e.g. ₹500 advance token"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '0.4rem',
                      backgroundColor: '#151e36',
                      border: '1px solid #1e293b',
                      color: '#f8fafc',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Scam Category / Vector
                </label>
                <input
                  type="text"
                  value={formScamType}
                  onChange={e => setFormScamType(e.target.value)}
                  placeholder="e.g. Advance Payment & Ghosting, Reverse UPI QR, Phishing SMS"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#151e36',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Reported UPI ID / Phone / URL / Handle *
                </label>
                <input
                  type="text"
                  required
                  value={formIdentifier}
                  onChange={e => setFormIdentifier(e.target.value)}
                  placeholder="e.g. paynow.token@okhdfcbank or @seller_scam"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#151e36',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  What Happened? (Description)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Describe the seller's demand, payment pressure, or how the trap operated..."
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#151e36',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
