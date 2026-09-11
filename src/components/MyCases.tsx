import React, { useState } from 'react';
import type { CaseRecord } from '../types';
import { 
  FolderCheck, ShieldCheck, AlertOctagon, 
  Trash2, Eye, PlusCircle, Filter, LifeBuoy, ArrowRight,
  Image as ImageIcon
} from 'lucide-react';

interface MyCasesProps {
  cases: CaseRecord[];
  onDeleteCase: (caseId: string) => void;
  onNavigateToChecker: () => void;
  onNavigateToActionCenter?: () => void;
}

export const MyCases: React.FC<MyCasesProps> = ({ 
  cases, 
  onDeleteCase, 
  onNavigateToChecker,
  onNavigateToActionCenter 
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'HIGH_RISK' | 'LOW_RISK'>('ALL');

  // Compute summary stats
  const totalCases = cases.length;
  const highRiskCases = cases.filter(c => c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH').length;
  const lowRiskCases = cases.filter(c => c.riskLevel === 'SAFE' || c.riskLevel === 'LOW' || c.riskLevel === 'INSUFFICIENT_EVIDENCE').length;
  const lossAvoidedCases = cases.filter(c => c.status === 'Loss Avoided').length;

  const filteredCases = cases.filter(c => {
    if (filterType === 'HIGH_RISK') {
      return c.riskLevel === 'CRITICAL' || c.riskLevel === 'HIGH';
    }
    if (filterType === 'LOW_RISK') {
      return c.riskLevel === 'SAFE' || c.riskLevel === 'LOW' || c.riskLevel === 'INSUFFICIENT_EVIDENCE';
    }
    return true;
  });

  return (
    <section style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        
        {/* Section Header with Demo Transparency */}
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
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              <FolderCheck size={14} />
              <span>Personal Dispute & Safety Portfolio (Prototype Demo Data)</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
              My Verification Cases
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '640px' }}>
              Audit trail of analyzed interactions, flagged payment traps, and preserved evidence 
              for guidance and reference during official 1930 reports.
            </p>
          </div>

          <button
            onClick={onNavigateToChecker}
            className="btn-primary"
            style={{ padding: '0.75rem 1.35rem', fontSize: '0.88rem' }}
          >
            <PlusCircle size={16} />
            <span>Verify New Message</span>
          </button>
        </div>

        {/* Metric Summary Grid with Transparent Product Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
              Cases Logged
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
              {totalCases}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              Saved in local browser state
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
              High Risk Cases
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginBottom: '0.2rem' }}>
              {highRiskCases}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
              Scam patterns intercepted
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
              Low Risk Cases
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginBottom: '0.2rem' }}>
              {lowRiskCases}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
              No strong scam signals detected
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.4rem' }}>
              Losses Avoided (Demo)
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#facc15', marginBottom: '0.2rem' }}>
              {lossAvoidedCases} of {totalCases}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fde047' }}>
              Payments stopped before transfer
            </div>
          </div>

        </div>

        {/* Filter Bar: ALL / HIGH RISK / LOW RISK */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#94a3b8" />
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Filter Cases:</span>
            
            <button
              onClick={() => setFilterType('ALL')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: filterType === 'ALL' ? 700 : 500,
                backgroundColor: filterType === 'ALL' ? '#2563eb' : '#10172b',
                color: filterType === 'ALL' ? '#ffffff' : '#94a3b8',
                border: filterType === 'ALL' ? '1px solid #3b82f6' : '1px solid #1e293b',
                cursor: 'pointer'
              }}
            >
              ALL ({totalCases})
            </button>

            <button
              onClick={() => setFilterType('HIGH_RISK')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: filterType === 'HIGH_RISK' ? 700 : 500,
                backgroundColor: filterType === 'HIGH_RISK' ? 'rgba(239, 68, 68, 0.25)' : '#10172b',
                color: filterType === 'HIGH_RISK' ? '#fca5a5' : '#94a3b8',
                border: filterType === 'HIGH_RISK' ? '1px solid #ef4444' : '1px solid #1e293b',
                cursor: 'pointer'
              }}
            >
              HIGH RISK ({highRiskCases})
            </button>

            <button
              onClick={() => setFilterType('LOW_RISK')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: filterType === 'LOW_RISK' ? 700 : 500,
                backgroundColor: filterType === 'LOW_RISK' ? 'rgba(16, 185, 129, 0.25)' : '#10172b',
                color: filterType === 'LOW_RISK' ? '#6ee7b7' : '#94a3b8',
                border: filterType === 'LOW_RISK' ? '1px solid #10b981' : '1px solid #1e293b',
                cursor: 'pointer'
              }}
            >
              LOW RISK ({lowRiskCases})
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Showing {filteredCases.length} of {cases.length} cases
          </div>
        </div>

        {/* Case Table / List */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredCases.map((c, index) => {
              const isCrit = c.riskLevel === 'CRITICAL';
              const isHigh = c.riskLevel === 'HIGH';
              const isSafe = c.riskLevel === 'SAFE' || c.riskLevel === 'LOW';

              return (
                <div
                  key={c.id}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: index !== filteredCases.length - 1 ? '1px solid #1e293b' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    backgroundColor: index % 2 === 0 ? 'rgba(21, 30, 54, 0.4)' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 340px' }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      backgroundColor: isCrit || isHigh ? 'rgba(239, 68, 68, 0.15)' : isSafe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                      color: isCrit || isHigh ? '#ef4444' : isSafe ? '#10b981' : '#f97316'
                    }}>
                      {isCrit || isHigh ? <AlertOctagon size={20} /> : <ShieldCheck size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                          {c.title}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '0.25rem',
                          backgroundColor: '#1e293b',
                          color: '#cbd5e1'
                        }}>
                          {c.platform}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          backgroundColor: isCrit || isHigh ? 'rgba(239, 68, 68, 0.15)' : isSafe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                          color: isCrit || isHigh ? '#fca5a5' : isSafe ? '#6ee7b7' : '#fdba74'
                        }}>
                          {c.riskLevel} ({c.riskScore}/100)
                        </span>
                        {c.attachedEvidence && c.attachedEvidence.length > 0 && (
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '0.25rem',
                            backgroundColor: 'rgba(56, 189, 248, 0.12)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <ImageIcon size={11} />
                            <span>{c.attachedEvidence.length} Screenshot{c.attachedEvidence.length > 1 ? 's' : ''}</span>
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                        Seller: <span className="mono" style={{ color: '#38bdf8' }}>{c.sellerHandle}</span> • Logged: {c.date}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {c.notes}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Status
                      </div>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: c.status === 'Loss Avoided' ? '#34d399' : c.status === 'Reported to 1930' ? '#38bdf8' : '#eab308'
                      }}>
                        {c.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => setSelectedCase(c)}
                        title="View Case Details"
                        style={{
                          padding: '0.45rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#10172b',
                          border: '1px solid #1e293b',
                          color: '#cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        onClick={() => onDeleteCase(c.id)}
                        title="Delete Case"
                        style={{
                          padding: '0.45rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#10172b',
                          border: '1px solid #1e293b',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {cases.length === 0 ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <FolderCheck size={42} color="#38bdf8" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  No saved investigations yet.
                </div>
                <div style={{ fontSize: '0.86rem', color: '#94a3b8', maxWidth: '440px', margin: '0 auto 1.25rem', lineHeight: 1.45 }}>
                  Analyze a suspicious message or seller on the Check Scam page and click "Save Case to Portfolio" to preserve your evidence and audit trail.
                </div>
                <button onClick={onNavigateToChecker} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                  Verify a Message
                </button>
              </div>
            ) : filteredCases.length === 0 ? (
              <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <FolderCheck size={36} style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  No cases found under "{filterType === 'HIGH_RISK' ? 'HIGH RISK' : 'LOW RISK'}" filter
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Switch filters above or verify a new message to add to your cases.
                </div>
                <button onClick={() => setFilterType('ALL')} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                  Show All Cases
                </button>
              </div>
            ) : null}
          </div>

        </div>

      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
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
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            backgroundColor: '#0f172a',
            border: '1px solid #243254',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '0.25rem',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8'
              }}>
                Case Ref: {selectedCase.id}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{selectedCase.date}</span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
              {selectedCase.title}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              Category: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{selectedCase.scamCategory}</span>
            </div>

            {/* Preserved Evidence Box */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#0b1120',
              border: '1px solid #1e293b',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
                Preserved Evidence Snippet
              </div>
              <p className="mono" style={{ fontSize: '0.82rem', color: '#fca5a5', lineHeight: 1.45 }}>
                "{selectedCase.originalSnippet}"
              </p>
            </div>

            {/* Preserved Visual Evidence Screenshots */}
            {selectedCase.attachedEvidence && selectedCase.attachedEvidence.length > 0 && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#0b1120',
                border: '1px solid #1e293b',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={14} color="#38bdf8" />
                  <span>Preserved Screenshot Evidence ({selectedCase.attachedEvidence.length})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                  {selectedCase.attachedEvidence.map(item => (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: '0.375rem',
                        overflow: 'hidden',
                        border: '1px solid #334155',
                        backgroundColor: '#1e293b'
                      }}
                    >
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '65px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '0.25rem 0.35rem', fontSize: '0.62rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.4rem', backgroundColor: '#151e36' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Risk Assessment</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedCase.riskScore >= 60 ? '#ef4444' : '#10b981' }}>
                  {selectedCase.riskScore}/100 ({selectedCase.riskLevel})
                </div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '0.4rem', backgroundColor: '#151e36' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Protected Loss (Est.)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>
                  {selectedCase.savedLossEstimate}
                </div>
              </div>
            </div>

            {/* Score Breakdown itemization */}
            {selectedCase.analysisResult?.scoreBreakdown && selectedCase.analysisResult.scoreBreakdown.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Score Signal Contributions ({selectedCase.riskScore}/100):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {selectedCase.analysisResult.scoreBreakdown.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#0b1120',
                      border: '1px solid #1e293b',
                      fontSize: '0.78rem'
                    }}>
                      <span style={{ color: '#cbd5e1' }}>{item.label}</span>
                      <span style={{
                        fontWeight: 800,
                        fontFamily: 'JetBrains Mono, monospace',
                        color: item.points > 0 ? '#f87171' : '#34d399'
                      }}>
                        {item.points > 0 ? `+${item.points}` : item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If analysisResult is stored, display warning signals explainability */}
            {selectedCase.analysisResult && selectedCase.analysisResult.warningSignals.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Documented Warning Signals:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedCase.analysisResult.warningSignals.map(sig => (
                    <div key={sig.id} style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#151e36',
                      borderLeft: sig.severity === 'critical' ? '3px solid #ef4444' : '3px solid #f97316',
                      fontSize: '0.78rem'
                    }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                        {sig.title}
                      </div>
                      <div style={{ color: '#94a3b8', lineHeight: 1.35 }}>
                        {sig.whyItIncreasesRisk}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              {onNavigateToActionCenter && (selectedCase.riskLevel === 'CRITICAL' || selectedCase.riskLevel === 'HIGH') && (
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    onNavigateToActionCenter();
                  }}
                  className="btn-danger"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.8rem' }}
                >
                  <LifeBuoy size={14} />
                  <span>Action Center Steps</span>
                  <ArrowRight size={12} />
                </button>
              )}

              <button
                onClick={() => setSelectedCase(null)}
                className="btn-secondary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem', marginLeft: 'auto' }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
