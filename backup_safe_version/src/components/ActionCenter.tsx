import React, { useState } from 'react';
import { SAFETY_CHECKLIST_QUESTIONS, DEFENSE_TEMPLATES } from '../data/demoData';
import { 
  LifeBuoy, AlertOctagon, PhoneCall, ExternalLink, 
  Copy, Check, ShieldCheck, FileText 
} from 'lucide-react';

export const ActionCenter: React.FC = () => {
  // Checklist state (array of answered question IDs marked 'Yes')
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);

  const toggleFlag = (id: string) => {
    if (flaggedQuestions.includes(id)) {
      setFlaggedQuestions(flaggedQuestions.filter(qId => qId !== id));
    } else {
      setFlaggedQuestions([...flaggedQuestions, id]);
    }
  };

  // Calculate danger score based on checklist
  const dangerScore = flaggedQuestions.reduce((acc, id) => {
    const q = SAFETY_CHECKLIST_QUESTIONS.find(item => item.id === id);
    return acc + (q ? q.riskWeight : 0);
  }, 0);

  const copyTemplate = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  // Incident Report Draft state
  const [draftDate, setDraftDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [draftCategory, setDraftCategory] = useState<string>('Advance Payment Social Commerce Scam');
  const [draftIdentifier, setDraftIdentifier] = useState<string>('sneakerhub.kicks@okaxis / @drip_sneakers_india');
  const [draftAmount, setDraftAmount] = useState<string>('₹499');
  const [draftUtr, setDraftUtr] = useState<string>('328490123984 (Sample)');
  const [draftNarrative, setDraftNarrative] = useState<string>(
    'Seller on Instagram demanded an advance token fee before Cash on Delivery dispatch. After the UPI payment was completed, the seller blocked communications and never shipped the parcel.'
  );
  const [draftCopied, setDraftCopied] = useState(false);

  const generatedDraft = `INCIDENT REPORT DRAFT FOR CYBERCRIME.GOV.IN / 1930 HELPLINE
--------------------------------------------------
INCIDENT DATE: ${draftDate}
FRAUD CATEGORY: ${draftCategory}
SUSPECT IDENTIFIER / UPI / HANDLE: ${draftIdentifier}
DISPUTED AMOUNT: ${draftAmount}
TRANSACTION UTR / REF NO: ${draftUtr}

NARRATIVE / CHRONOLOGY:
${draftNarrative}

EVIDENTIARY ATTACHMENTS PRESERVED:
- Chat logs with timestamps
- Payment UPI confirmation screenshot with bank reference number
- Seller profile screenshot and contact number

DISCLAIMER: Drafted via ScamShield for citizen filing. Review and confirm all details before submission.`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft);
    setDraftCopied(true);
    setTimeout(() => setDraftCopied(false), 2000);
  };

  return (
    <section style={{ padding: '2.5rem 0 4.5rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            <LifeBuoy size={14} />
            <span>Emergency Protection & Action Protocols</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Action Center: Before & After You Pay
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '680px' }}>
            Step-by-step emergency instructions if money was debited, an interactive pre-payment safety questionnaire, 
            and ready-to-send verification challenge messages.
          </p>
        </div>

        {/* 5-Step Emergency Response Protocol Banner */}
        <div className="glass-panel" style={{
          padding: '1.75rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fca5a5' }}>
                5-Step Emergency Response Protocol (Golden Hour Response)
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                If money was transferred or unauthorized debit occurred, follow these 5 steps immediately:
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            
            {/* Step 1 */}
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#0b1120', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#ef4444',
                  color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>1</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>STOP PAYMENT</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Immediately cancel recurring authorizations. Do not send any secondary "refund processing", "tax", or "insurance" fees.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#0b1120', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#f97316',
                  color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>2</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>PRESERVE EVIDENCE</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Capture full chat screenshots showing timestamps, seller bio, phone numbers, payment QR codes, and UPI transaction UTR numbers.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#0b1120', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#eab308',
                  color: '#000000', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>3</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>CONTACT BANK</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Call your bank's 24/7 fraud desk immediately. Request an immediate freeze / lien on the beneficiary account under inter-bank coordination.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#0b1120', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#3b82f6',
                  color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>4</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>BLOCK & REPORT</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Block the fraudulent handle or phone number on WhatsApp / Instagram and report the profile to platform moderation.
              </p>
            </div>

            {/* Step 5 */}
            <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#0b1120', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10b981',
                  color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>5</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>1930 & CYBER PORTAL</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                Dial 1930 (National Cyber Fraud Reporting Helpline) and register the incident on cybercrime.gov.in within 2 hours.
              </p>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="tel:1930"
              className="btn-danger"
              style={{ fontSize: '0.85rem', textDecoration: 'none', padding: '0.6rem 1.25rem' }}
            >
              <PhoneCall size={16} />
              <span>Call Cyber Helpline (1930)</span>
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.85rem', textDecoration: 'none', padding: '0.6rem 1.25rem' }}
            >
              <ExternalLink size={16} />
              <span>National Cyber Crime Portal</span>
            </a>
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic' }}>
            Note: ScamShield provides safety heuristics and evidence organization. ScamShield does NOT automatically file formal police or cybercrime complaints. Official complaints must be filed directly via 1930 or cybercrime.gov.in.
          </div>
        </div>

        {/* Interactive Incident Report Draft Generator */}
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                <FileText size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  Incident Report Draft Generator (1930 / cybercrime.gov.in)
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Quickly assemble a structured narrative to paste into the official portal or read out on helpline 1930.
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyDraft}
              className="btn-primary"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {draftCopied ? <Check size={14} /> : <Copy size={14} />}
              <span>{draftCopied ? 'Draft Copied to Clipboard!' : 'Copy Draft for 1930 / cybercrime.gov.in'}</span>
            </button>
          </div>

          {/* Form Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Incident Date
              </label>
              <input
                type="date"
                value={draftDate}
                onChange={e => setDraftDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#0b1120',
                  border: '1px solid #1e293b',
                  color: '#f8fafc',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Scam Category / Vector
              </label>
              <input
                type="text"
                value={draftCategory}
                onChange={e => setDraftCategory(e.target.value)}
                placeholder="e.g. Advance Payment Social Commerce Scam"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#0b1120',
                  border: '1px solid #1e293b',
                  color: '#f8fafc',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Suspect Identifier / UPI / Handle
              </label>
              <input
                type="text"
                value={draftIdentifier}
                onChange={e => setDraftIdentifier(e.target.value)}
                placeholder="e.g. sneakerhub.kicks@okaxis"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#0b1120',
                  border: '1px solid #1e293b',
                  color: '#f8fafc',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Disputed Amount & UTR
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={draftAmount}
                  onChange={e => setDraftAmount(e.target.value)}
                  placeholder="₹499"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: '#0b1120',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem'
                  }}
                />
                <input
                  type="text"
                  value={draftUtr}
                  onChange={e => setDraftUtr(e.target.value)}
                  placeholder="UTR Number"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: '#0b1120',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
              Incident Chronology / Narrative
            </label>
            <textarea
              rows={2}
              value={draftNarrative}
              onChange={e => setDraftNarrative(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.375rem',
                backgroundColor: '#0b1120',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                fontSize: '0.82rem',
                resize: 'none',
                marginBottom: '1rem'
              }}
            />
          </div>

          {/* Formatted Preview Box */}
          <div style={{
            backgroundColor: '#070d18',
            border: '1px solid #1e293b',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.78rem',
            color: '#a5f3fc',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap'
          }}>
            {generatedDraft}
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 500 }}>
            ⚠️ Review before submitting. ScamShield drafts reports for citizen filing and does not submit complaints on your behalf.
          </div>
        </div>

        {/* Two-Column Section: Pre-Payment Checklist & Defense Templates */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          
          {/* Column 1: Interactive Pre-Payment Safety Checklist */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  Pre-Payment 5-Point Checklist
                </h3>
              </div>

              {/* Danger Gauge Pill */}
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: dangerScore >= 50 ? 'rgba(239, 68, 68, 0.2)' : dangerScore > 0 ? 'rgba(249, 115, 22, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: dangerScore >= 50 ? '#fca5a5' : dangerScore > 0 ? '#fdba74' : '#6ee7b7',
                border: dangerScore >= 50 ? '1px solid #ef4444' : dangerScore > 0 ? '1px solid #f97316' : '1px solid #10b981'
              }}>
                {dangerScore >= 50 ? `🚨 DO NOT PAY (${dangerScore}% Risk)` : dangerScore > 0 ? `⚠️ Caution (${dangerScore}% Risk)` : `✅ All Clear (0% Risk)`}
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Select any conditions that apply to your current transaction. If any red flag is triggered, stop before paying:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {SAFETY_CHECKLIST_QUESTIONS.map(q => {
                const isChecked = flaggedQuestions.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleFlag(q.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: isChecked ? 'rgba(239, 68, 68, 0.1)' : '#0b1120',
                      border: isChecked ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div onClick
                        style={{ marginTop: '0.2rem', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isChecked ? '#fca5a5' : '#cbd5e1', lineHeight: 1.35 }}>
                          {q.question}
                        </span>
                        {isChecked && (
                          <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.35rem', fontWeight: 500 }}>
                            ⚠️ {q.warningIfYes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Ready-to-Send Seller Challenge Templates */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileText size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Seller Verification Templates
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              1-click copy-paste defense messages to test if an Instagram or WhatsApp seller is genuine:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DEFENSE_TEMPLATES.map(tpl => {
                const isCopied = copiedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#0b1120',
                      border: '1px solid #1e293b'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                        {tpl.title}
                      </span>
                      <button
                        onClick={() => copyTemplate(tpl.id, tpl.text)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '0.375rem',
                          backgroundColor: isCopied ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                          border: isCopied ? '1px solid #10b981' : '1px solid #334155',
                          color: isCopied ? '#6ee7b7' : '#cbd5e1',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.6rem' }}>
                      {tpl.description}
                    </div>

                    <p style={{
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      backgroundColor: '#151e36',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.375rem',
                      lineHeight: 1.45,
                      fontStyle: 'italic'
                    }}>
                      "{tpl.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
