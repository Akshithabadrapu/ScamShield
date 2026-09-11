import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScamChecker } from './components/ScamChecker';
import { CommunityIntelligence } from './components/CommunityIntelligence';
import { MyCases } from './components/MyCases';
import { ActionCenter } from './components/ActionCenter';
import { Footer } from './components/Footer';
import { INITIAL_CASES, INITIAL_COMMUNITY_THREATS } from './data/demoData';
import type { CaseRecord, CommunityThreat, ScamAnalysisResult } from './types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'check' | 'community' | 'cases' | 'action'>('check');
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [threats, setThreats] = useState<CommunityThreat[]>(INITIAL_COMMUNITY_THREATS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveCase = (result: ScamAnalysisResult) => {
    // Avoid duplicate save
    if (cases.some(c => c.id === result.id)) return;

    const snippetText = result.rawText 
      ? (result.rawText.slice(0, 140) + (result.rawText.length > 140 ? '...' : ''))
      : (result.attachedEvidence && result.attachedEvidence.length > 0 
          ? `[Attached ${result.attachedEvidence.length} visual evidence screenshot(s)]` 
          : 'Scam investigation');

    const newCase: CaseRecord = {
      id: result.id,
      title: `${result.scamCategory} Check`,
      platform: result.rawText.toLowerCase().includes('http') ? 'SMS' : 'Instagram',
      scamCategory: result.scamCategory,
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      sellerHandle: result.senderHandle || (result.extractedIdentifiers.sellerHandles[0] || 'Unknown Seller'),
      savedLossEstimate: result.estimatedLossPotential,
      status: (result.riskLevel === 'CRITICAL' || result.riskLevel === 'HIGH') ? 'Loss Avoided' : 'Under Review',
      notes: result.headline,
      originalSnippet: snippetText,
      attachedEvidence: result.attachedEvidence,
      analysisResult: result
    };

    setCases([newCase, ...cases]);
    showToast('Saved to My Cases portfolio!');
  };

  const handleDeleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
    showToast('Case removed.');
  };

  const handleUpvoteThreat = (id: string) => {
    setThreats(threats.map(t => {
      if (t.id === id) {
        const isUpvoted = t.userUpvoted;
        return {
          ...t,
          upvoteCount: isUpvoted ? t.upvoteCount - 1 : t.upvoteCount + 1,
          userUpvoted: !isUpvoted
        };
      }
      return t;
    }));
  };

  const handleAddThreat = (newThreat: Omit<CommunityThreat, 'id' | 'upvoteCount' | 'verifiedCount' | 'reportedDate'>) => {
    const created: CommunityThreat = {
      ...newThreat,
      id: 'threat-' + Date.now(),
      upvoteCount: 1,
      userUpvoted: true,
      reportedDate: 'Just now',
      verifiedCount: 1
    };
    setThreats([created, ...threats]);
    showToast('Threat reported to community intel!');
  };

  const scrollToChecker = () => {
    setActiveTab('check');
    const el = document.getElementById('scam-checker-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0f1d' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 100,
          backgroundColor: '#1e293b',
          border: '1px solid #3b82f6',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          borderRadius: '0.75rem',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#f8fafc',
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <CheckCircle2 size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        casesCount={cases.length} 
      />

      {/* Active Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'check' && (
          <>
            <Hero 
              onScrollToChecker={scrollToChecker} 
              onNavigateToCommunity={() => setActiveTab('community')}
            />
            <ScamChecker 
              onSaveCase={handleSaveCase} 
              savedCaseIds={cases.map(c => c.id)} 
              threats={threats}
              onNavigateToActionCenter={() => setActiveTab('action')}
            />

            {/* How It Works Hackathon Section */}
            <section id="how-it-works" style={{ padding: '3rem 0 4rem', backgroundColor: '#0d1326', borderTop: '1px solid #1a243d' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    How ScamShield Works
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
                    A 3-step verification architecture designed to protect digital shoppers in social commerce.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  
                  <div className="glass-panel" style={{ padding: '1.75rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                      fontSize: '1.1rem', marginBottom: '1rem'
                    }}>
                      01
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                      Paste Message or Seller UPI
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Copy any WhatsApp chat, Instagram DM, SMS tracking alert, or payment QR description into the checker.
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.75rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '0.5rem', backgroundColor: 'rgba(249, 115, 22, 0.15)',
                      color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                      fontSize: '1.1rem', marginBottom: '1rem'
                    }}>
                      02
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                      Audit 18+ Scam Heuristics
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      The engine inspects lookalike domains, advance tokens for COD, reverse UPI PIN traps, and urgency psychological triggers.
                    </p>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.75rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                      fontSize: '1.1rem', marginBottom: '1rem'
                    }}>
                      03
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                      Verify Before You Pay
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      Review the risk score, warning signals, and pre-written defense templates to test the seller safely before sending any money.
                    </p>
                  </div>

                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <button onClick={scrollToChecker} className="btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                    <span>Try a Verification Now</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

              </div>
            </section>
          </>
        )}

        {activeTab === 'community' && (
          <CommunityIntelligence 
            threats={threats} 
            onUpvoteThreat={handleUpvoteThreat} 
            onAddThreat={handleAddThreat} 
          />
        )}

        {activeTab === 'cases' && (
          <MyCases 
            cases={cases} 
            onDeleteCase={handleDeleteCase} 
            onNavigateToChecker={() => setActiveTab('check')} 
            onNavigateToActionCenter={() => setActiveTab('action')}
          />
        )}

        {activeTab === 'action' && (
          <ActionCenter />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

    </div>
  );
}
export default App;
