import React, { useState } from 'react';
import type { ScamAnalysisResult } from '../types';
import { 
  AlertOctagon, AlertTriangle, CheckCircle2, Info, ShieldAlert, 
  Copy, Check, BookmarkPlus, Share2, Users, ArrowRight, LifeBuoy, Ban,
  Image as ImageIcon, Network, Sparkles, HelpCircle
} from 'lucide-react';

interface AnalysisResultViewProps {
  result: ScamAnalysisResult;
  onSaveCase: (result: ScamAnalysisResult) => void;
  isSaved?: boolean;
  onNavigateToActionCenter?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ 
  result, 
  onSaveCase, 
  isSaved,
  onNavigateToActionCenter
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const isHighRisk = result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH';
  const isInsufficient = result.riskLevel === 'INSUFFICIENT_EVIDENCE' || result.isInsufficientEvidence;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.4)', label: 'CRITICAL RISK' };
      case 'HIGH': return { text: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.4)', label: 'HIGH RISK' };
      case 'MEDIUM': return { text: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.4)', label: 'MEDIUM RISK' };
      case 'INSUFFICIENT_EVIDENCE': return { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.35)', label: 'INSUFFICIENT EVIDENCE' };
      case 'LOW': default: return { text: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.4)', label: 'LOW RISK' };
    }
  };

  const riskStyle = getRiskColor(result.riskLevel);

  const copySummaryText = () => {
    const summary = `[ScamShield Verification Report]
Verdict: ${result.riskLevel} (${result.riskScore}/100)
Headline: ${result.headline}
Category: ${result.scamCategory}
Assessment: ${result.assessmentDisclaimer}
Community Match: ${result.communityMatch?.hasMatch ? 'MATCH FOUND (' + result.communityMatch.corroboratingReportsCount + ' reports)' : 'No community match'}
Extracted Identifiers: ${result.extractedIdentifiers.upiIds.join(', ') || 'None'}
Recommendation: ${result.recommendedActions[0] || 'Verify before paying'}`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid ${riskStyle.border}`,
      boxShadow: `0 15px 40px -15px ${riskStyle.bg}`
    }}>

      {/* Prominent High-Risk STOP PAYMENT Banner */}
      {isHighRisk && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #ef4444',
          borderRadius: '0.75rem',
          padding: '1.15rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Ban size={22} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fca5a5', letterSpacing: '0.02em' }}>
                  🚨 DON'T PAY — STOP PAYMENT
                </div>
                <div style={{ fontSize: '0.82rem', color: '#fecaca' }}>
                  Critical fraud indicators detected. Do not send advance tokens, courier charges, or enter UPI PIN.
                </div>
              </div>
            </div>

            {onNavigateToActionCenter && (
              <button
                onClick={onNavigateToActionCenter}
                className="btn-danger"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                <LifeBuoy size={14} />
                <span>Victim Support Steps</span>
              </button>
            )}
          </div>

          <div style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '0.75rem',
            color: '#fed7aa',
            fontWeight: 700,
            lineHeight: 1.4
          }}>
            PROTOCOL: STOP PAYMENT → PRESERVE EVIDENCE → CONTACT BANK / PAYMENT PROVIDER → BLOCK / REPORT → USE OFFICIAL CYBERCRIME REPORTING CHANNELS
          </div>
        </div>
      )}

      {/* Insufficient Evidence Alert Banner */}
      {isInsufficient && (
        <div style={{
          backgroundColor: 'rgba(234, 179, 8, 0.12)',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          borderRadius: '0.75rem',
          padding: '1.15rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#eab308',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <HelpCircle size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fef08a', letterSpacing: '0.02em', marginBottom: '0.15rem' }}>
              INSUFFICIENT EVIDENCE FOR DEFINITIVE RISK RATING
            </div>
            <div style={{ fontSize: '0.82rem', color: '#fef9c3' }}>
              The uploaded screenshot could not be reliably interpreted. Add the message text or an identifier for a stronger assessment.
            </div>
          </div>
        </div>
      )}
      
      {/* Top Banner with Risk Verdict & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Circular Score Visual */}
          <div style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: isInsufficient 
              ? '#334155' 
              : `conic-gradient(${riskStyle.text} ${result.riskScore * 3.6}deg, #1e293b 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 25px ${riskStyle.bg}`,
            flexShrink: 0
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: isInsufficient ? '1rem' : '1.5rem', fontWeight: 800, color: riskStyle.text, lineHeight: 1 }}>
                {isInsufficient ? 'N/A' : result.riskScore}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>
                SCORE
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: riskStyle.bg,
                color: riskStyle.text,
                border: `1px solid ${riskStyle.border}`
              }}>
                {riskStyle.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Evaluated {result.timestamp}
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
              {result.headline}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.2rem' }}>
              Category: <strong style={{ color: riskStyle.text }}>{result.scamCategory}</strong>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {result.assessmentDisclaimer}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSaveCase(result)}
            disabled={isSaved}
            className="btn-secondary"
            style={{
              padding: '0.5rem 0.85rem',
              fontSize: '0.82rem',
              backgroundColor: isSaved ? 'rgba(16, 185, 129, 0.15)' : undefined,
              borderColor: isSaved ? '#10b981' : undefined,
              color: isSaved ? '#6ee7b7' : undefined
            }}
          >
            {isSaved ? <Check size={14} /> : <BookmarkPlus size={14} />}
            <span>{isSaved ? 'Investigation Saved' : 'Save Investigation'}</span>
          </button>

          <button
            onClick={copySummaryText}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
          >
            {copiedSummary ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
            <span>{copiedSummary ? 'Copied' : 'Share Verdict'}</span>
          </button>
        </div>
      </div>

      {/* WHY THIS SCORE? Section (Itemized Score Breakdown) */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#0b1120',
        border: '1px solid #1e293b',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sparkles size={16} color="#38bdf8" />
            <span>WHY THIS SCORE? ({result.riskScore}/100)</span>
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Itemized Risk Breakdown
          </span>
        </div>

        {/* Itemized Points Breakdown List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {result.scoreBreakdown && result.scoreBreakdown.length > 0 ? (
            result.scoreBreakdown.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '0.4rem',
                backgroundColor: item.points > 0 ? 'rgba(239, 68, 68, 0.06)' : item.points < 0 ? 'rgba(16, 185, 129, 0.06)' : '#151e36',
                border: item.points > 0 ? '1px solid rgba(239, 68, 68, 0.2)' : item.points < 0 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #243254',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontWeight: 800,
                    color: item.points > 0 ? '#f87171' : item.points < 0 ? '#34d399' : '#94a3b8',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    minWidth: '40px'
                  }}>
                    {item.points > 0 ? `+${item.points}` : item.points < 0 ? `${item.points}` : '0'}
                  </span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.label}</span>
                </div>
                {item.explanation && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {item.explanation}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Baseline general precaution assessment
            </div>
          )}
        </div>

        {/* SUMMARY Box */}
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: '#10172b',
          borderLeft: `3px solid ${riskStyle.text}`,
          fontSize: '0.85rem',
          color: '#cbd5e1',
          lineHeight: 1.5
        }}>
          <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '0.2rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SUMMARY RATIONALE
          </strong>
          {result.explanation}
        </div>
      </div>

      {/* EVIDENCE ANALYZED: Screenshots & OCR Text Snippets */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#0b1120',
        border: '1px solid #1e293b',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={16} color="#38bdf8" />
            <span>EVIDENCE ANALYZED</span>
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {result.attachedEvidence && result.attachedEvidence.length > 0 
              ? `${result.attachedEvidence.length} image(s) processed by client OCR engine` 
              : 'Text message evidence submitted'}
          </span>
        </div>

        {/* Uploaded Screenshot Evidence Thumbnails */}
        {result.attachedEvidence && result.attachedEvidence.length > 0 ? (
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>
              Attached Evidence Files ({result.attachedEvidence.length}):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {result.attachedEvidence.map(item => (
                <div
                  key={item.id}
                  style={{
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: '1px solid #243254',
                    backgroundColor: '#151e36',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ width: '100%', height: '95px', backgroundColor: '#070b14', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '0.45rem 0.55rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{(item.size / 1024).toFixed(0)} KB</span>
                      {item.extractedText && (
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>OCR Extracted</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extracted OCR Text Console */}
            {result.attachedEvidence.some(e => e.extractedText && e.extractedText.trim().length > 0) && (
              <div style={{
                marginTop: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#070b14',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Sparkles size={14} color="#38bdf8" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      [ Extracted OCR Text Console ]
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Analyzed by Dynamic Risk Engine
                  </span>
                </div>
                <div style={{ padding: '0.85rem 1rem' }}>
                  <pre className="mono" style={{
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0
                  }}>
                    {result.attachedEvidence.map(e => e.extractedText).filter(Boolean).join('\n---\n')}
                  </pre>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            No visual screenshots attached. Analysis evaluated textual evidence.
          </div>
        )}

        {/* Text Evidence Snippet (if message text was directly submitted) */}
        {result.rawText && (!result.attachedEvidence || result.attachedEvidence.length === 0 || !result.attachedEvidence.some(e => e.extractedText === result.rawText)) && (
          <div style={{ marginTop: '0.85rem', padding: '0.75rem', borderRadius: '0.375rem', backgroundColor: '#070b14', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>
              Submitted Message Content ({result.rawText.length} characters)
            </div>
            <p className="mono" style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
              "{result.rawText.length > 280 ? result.rawText.slice(0, 280) + '...' : result.rawText}"
            </p>
          </div>
        )}
      </div>

      {/* Extracted Identifiers Section */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#0b1120',
        border: '1px solid #1e293b',
        marginBottom: '1.75rem'
      }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Extracted Identifiers & Evidence
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* UPI VPAs */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
              Detected UPI VPAs
            </div>
            {result.extractedIdentifiers.upiIds.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {result.extractedIdentifiers.upiIds.map((upi, i) => (
                  <div key={i} className="mono" style={{
                    fontSize: '0.8rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '0.375rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{upi}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(upi)}
                      title="Copy UPI"
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>None extracted</div>
            )}
          </div>

          {/* Links & Domains */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
              URLs & Domains
            </div>
            {result.extractedIdentifiers.urls.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {result.extractedIdentifiers.urls.map((url, i) => (
                  <div key={i} className="mono" style={{
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '0.375rem',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    color: '#fdba74',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                    wordBreak: 'break-all'
                  }}>
                    {url}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>None extracted</div>
            )}
          </div>

          {/* Contact Numbers / Handles */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
              Phone & Handles
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {result.extractedIdentifiers.phoneNumbers.map((ph, i) => (
                <span key={i} className="mono" style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#1e293b',
                  color: '#e2e8f0'
                }}>
                  {ph}
                </span>
              ))}
              {result.extractedIdentifiers.sellerHandles.map((handle, i) => (
                <span key={i} className="mono" style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8'
                }}>
                  {handle}
                </span>
              ))}
              {result.extractedIdentifiers.phoneNumbers.length === 0 && result.extractedIdentifiers.sellerHandles.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>None extracted</span>
              )}
            </div>
          </div>

          {/* Trigger Tokens */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
              Scam Vector Keywords
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {result.extractedIdentifiers.suspiciousKeywords.map((kw, i) => (
                <span key={i} style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '0.25rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  {kw}
                </span>
              ))}
              {result.extractedIdentifiers.suspiciousKeywords.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>Standard commercial terminology</span>
              )}
            </div>
          </div>

          {/* Other Identifiers */}
          {result.extractedIdentifiers.otherIdentifiers && result.extractedIdentifiers.otherIdentifiers.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.35rem' }}>
                Other Identifiers
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {result.extractedIdentifiers.otherIdentifiers.map((other, i) => (
                  <span key={i} className="mono" style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.375rem',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155'
                  }}>
                    {other}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Community Intelligence Match Section (Demo Dataset) */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: result.communityMatch?.hasMatch ? 'rgba(239, 68, 68, 0.08)' : 'rgba(30, 41, 59, 0.4)',
        border: result.communityMatch?.hasMatch ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid #1e293b',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color={result.communityMatch?.hasMatch ? '#f87171' : '#38bdf8'} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              Community Intelligence Check (Demo Dataset)
            </h3>
          </div>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: '999px',
            backgroundColor: result.communityMatch?.hasMatch ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.15)',
            color: result.communityMatch?.hasMatch ? '#fca5a5' : '#94a3b8',
            border: result.communityMatch?.hasMatch ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            {result.communityMatch?.hasMatch ? 'COMMUNITY MATCH FOUND' : 'NO COMMUNITY MATCH'}
          </span>
        </div>

        {result.communityMatch?.hasMatch ? (
          <div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.6rem' }}>
              <strong>{result.communityMatch.summaryNote || 'This identifier appears in prototype community reports matching this pattern.'}</strong>
            </div>

            {/* Matched Identifiers Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {result.communityMatch.matchedIdentifiers.map((idStr, idx) => (
                <span key={idx} className="mono" style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '0.35rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  {idStr}
                </span>
              ))}
            </div>

            {/* Matching Threats Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.75rem' }}>
              {result.communityMatch.matchingThreats.map(threat => (
                <div key={threat.id} style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#070b14',
                  border: '1px solid #1e293b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {threat.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>
                      {threat.verifiedCount} corroborating shopper reports
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Reported Pattern: <span style={{ color: '#fdba74' }}>{threat.scamType}</span> • Target: <span className="mono" style={{ color: '#cbd5e1' }}>{threat.reportedHandleOrUPI}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Notice: Prototype Demo Dataset. This identifier appears in prototype community reports matching this pattern. Community intelligence is illustrative demo data and not definitive proof of criminal activity.
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            No community reports found in demo dataset for these extracted identifiers. However, our heuristic risk engine evaluates the interaction independently based on detected behavioral signals.
          </div>
        )}
      </div>

      {/* Explanation Box */}
      <div style={{
        padding: '1rem 1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#101930',
        border: '1px solid #1e2d4d',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <div style={{ padding: '0.35rem', borderRadius: '0.375rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', marginTop: '0.1rem' }}>
          <Info size={18} />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>
            Signal Analysis & Risk Rationale
          </div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
            {result.explanation}
          </div>
        </div>
      </div>

      {/* Warning Signals Grid with "Why it increases risk" explainability */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} color="#38bdf8" />
          <span>Detected Warning Signals ({result.warningSignals.length})</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
          {result.warningSignals.map(signal => {
            const isCrit = signal.severity === 'critical';
            const isWarn = signal.severity === 'warning';
            const borderCol = isCrit ? 'rgba(239, 68, 68, 0.35)' : isWarn ? 'rgba(249, 115, 22, 0.35)' : 'rgba(59, 130, 246, 0.35)';
            const bgCol = isCrit ? 'rgba(239, 68, 68, 0.08)' : isWarn ? 'rgba(249, 115, 22, 0.08)' : 'rgba(59, 130, 246, 0.08)';
            const iconCol = isCrit ? '#ef4444' : isWarn ? '#f97316' : '#38bdf8';

            return (
              <div 
                key={signal.id} 
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '0.625rem',
                  backgroundColor: bgCol,
                  border: `1px solid ${borderCol}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem'
                }}
              >
                <div style={{ marginTop: '0.2rem', color: iconCol }}>
                  {isCrit ? <AlertOctagon size={18} /> : isWarn ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {signal.title}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: iconCol,
                      border: `1px solid ${borderCol}`
                    }}>
                      {signal.severity} • {signal.category}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '0.45rem' }}>
                    {signal.description}
                  </div>

                  {/* Why it increases risk */}
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '0.375rem',
                    borderLeft: `3px solid ${iconCol}`
                  }}>
                    <strong style={{ color: '#e2e8f0' }}>Why this increases risk: </strong>
                    {signal.whyItIncreasesRisk}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RELATED SCAM PATTERN (INTELLIGENCE GRAPH) */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Network size={16} color="#38bdf8" />
            <span>RELATED SCAM PATTERN (INTELLIGENCE GRAPH)</span>
          </h3>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Heuristic Entity Linkage
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem',
          padding: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: '#0b1120',
          border: '1px solid #1e293b'
        }}>
          {/* Node 1: Social Handle */}
          <div style={{
            flex: '1 1 140px',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.5rem',
            backgroundColor: '#151e36',
            border: '1px solid #243254',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
              1. Seller Handle
            </div>
            <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {result.senderHandle || result.extractedIdentifiers.sellerHandles[0] || '@unspecified'}
            </div>
          </div>

          <div style={{ color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} />
          </div>

          {/* Node 2: WhatsApp / Phone */}
          <div style={{
            flex: '1 1 140px',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.5rem',
            backgroundColor: '#151e36',
            border: '1px solid #243254',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
              2. Contact Vector
            </div>
            <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fdba74', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {result.extractedIdentifiers.phoneNumbers[0] || result.providedIdentifiers?.whatsappPhone || 'Unlinked Phone'}
            </div>
          </div>

          <div style={{ color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} />
          </div>

          {/* Node 3: Payment UPI */}
          <div style={{
            flex: '1 1 140px',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.5rem',
            backgroundColor: '#151e36',
            border: '1px solid #243254',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
              3. Payment VPA
            </div>
            <div className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fca5a5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {result.extractedIdentifiers.upiIds[0] || result.providedIdentifiers?.upiId || 'Personal UPI'}
            </div>
          </div>

          <div style={{ color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={16} />
          </div>

          {/* Node 4: Fraud Pattern */}
          <div style={{
            flex: '1 1 160px',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.5rem',
            backgroundColor: result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : '#151e36',
            border: result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH' ? '1px solid #ef4444' : '1px solid #243254',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
              4. Recurring Pattern
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH' ? '#f87171' : '#34d399', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {result.scamCategory}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Actions vs Traps to Avoid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        
        {/* Recommended Actions */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '0.75rem',
          backgroundColor: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} />
            <span>Recommended Safe Next Steps</span>
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result.recommendedActions.map((action, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#10b981', fontWeight: 800 }}>•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dangerous Actions to Avoid */}
        <div style={{
          padding: '1.25rem',
          borderRadius: '0.75rem',
          backgroundColor: 'rgba(239, 68, 68, 0.06)',
          border: '1px solid rgba(239, 68, 68, 0.25)'
        }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertOctagon size={16} />
            <span>Dangerous Traps to Avoid</span>
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result.dangerousActionsToAvoid.map((pitfall, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>✕</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Guidance to Action Center */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '0.75rem',
        backgroundColor: '#0d1527',
        border: '1px solid #253352',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
            Victim Support & Emergency Guidance Flow
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            STOP PAYMENT → PRESERVE EVIDENCE → CONTACT BANK FRAUD DESK → BLOCK SELLER → FILE ON 1930 HELPLINE
          </div>
        </div>

        {onNavigateToActionCenter && (
          <button
            onClick={onNavigateToActionCenter}
            className="btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
          >
            <span>Open Action Center Guidance</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

    </div>
  );
};
