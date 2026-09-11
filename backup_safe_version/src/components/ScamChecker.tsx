import React, { useState, useRef } from 'react';
import { analyzeMessage } from '../utils/analyzer';
import { extractTextFromImage } from '../utils/ocr';
import { DEMO_PRESETS } from '../data/demoData';
import type { 
  ScamAnalysisResult, DemoPreset, CommunityThreat, 
  OptionalIdentifiers, AttachedEvidence 
} from '../types';
import { AnalysisResultView } from './AnalysisResultView';
import { 
  ShieldCheck, Sparkles, RefreshCw, Trash2, ArrowRight, 
  FileText, Lock, AlertOctagon, Image as ImageIcon, 
  X, ChevronDown, UserCheck, Camera, CheckCircle2
} from 'lucide-react';

interface ScamCheckerProps {
  onSaveCase: (result: ScamAnalysisResult) => void;
  savedCaseIds: string[];
  threats: CommunityThreat[];
  onNavigateToActionCenter?: () => void;
}

export const ScamChecker: React.FC<ScamCheckerProps> = ({ 
  onSaveCase, 
  savedCaseIds,
  threats,
  onNavigateToActionCenter
}) => {
  // 1. Initial State must be 100% CLEAN by default (No pre-filled text or results)
  const [inputText, setInputText] = useState('');
  const [attachedEvidence, setAttachedEvidence] = useState<AttachedEvidence[]>([]);
  const [optionalIdentifiers, setOptionalIdentifiers] = useState<OptionalIdentifiers>({
    instagramHandle: '',
    whatsappPhone: '',
    upiId: '',
    websiteUrl: '',
    otherIdentifier: ''
  });
  const [showDemoScenarios, setShowDemoScenarios] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string>('');
  const [loadedPresetNotice, setLoadedPresetNotice] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isOcrReading, setIsOcrReading] = useState(false);
  const [scanningStepText, setScanningStepText] = useState('SCANNING EVIDENCE...');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers with real OCR text extraction
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    const validFiles = files.filter(f => 
      ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'].includes(f.type)
    );

    if (validFiles.length === 0) {
      setErrorMessage('Please upload supported image formats: PNG, JPG, JPEG, WEBP, SVG.');
      return;
    }

    setErrorMessage(null);
    setIsOcrReading(true);

    const newEvidenceList: AttachedEvidence[] = [];

    for (const file of validFiles) {
      const previewUrl = URL.createObjectURL(file);
      let ocrExtracted = '';

      try {
        const ocrRes = await extractTextFromImage(file);
        ocrExtracted = ocrRes.text;
      } catch (err) {
        console.warn('OCR error during file ingestion:', err);
      }

      newEvidenceList.push({
        id: 'evidence-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl,
        extractedText: ocrExtracted,
        ocrPerformed: true
      });
    }

    setIsOcrReading(false);
    setAttachedEvidence(prev => [...prev, ...newEvidenceList]);
  };

  const handleRemoveEvidence = (id: string) => {
    setAttachedEvidence(prev => prev.filter(item => item.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Demo Presets Loading: Populates fields WITHOUT auto-running analysis
  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setInputText(preset.messageText);
    setErrorMessage(null);
    setResult(null);

    const updatedIds: OptionalIdentifiers = {
      instagramHandle: '',
      whatsappPhone: '',
      upiId: '',
      websiteUrl: '',
      otherIdentifier: ''
    };

    if (preset.sellerHandle) {
      if (preset.sellerHandle.startsWith('@')) {
        updatedIds.instagramHandle = preset.sellerHandle;
      } else if (preset.sellerHandle.includes('@')) {
        updatedIds.upiId = preset.sellerHandle;
      } else if (/^[0-9+ -]{8,15}$/.test(preset.sellerHandle)) {
        updatedIds.whatsappPhone = preset.sellerHandle;
      } else {
        updatedIds.otherIdentifier = preset.sellerHandle;
      }
    }

    setOptionalIdentifiers(updatedIds);
    setLoadedPresetNotice(`Demo loaded: "${preset.name}". Click "Analyze for Scam Risk" below to evaluate.`);
  };

  // Main Analyze Trigger with Multi-Step Scanning Sequence & OCR Integration
  const handleAnalyze = async () => {
    const hasText = inputText.trim().length > 0;
    const hasEvidence = attachedEvidence.length > 0;
    const hasAnyId = Object.values(optionalIdentifiers).some(val => val && val.trim().length > 0);

    if (!hasText && !hasEvidence && !hasAnyId) {
      setErrorMessage('Please paste a suspicious message, upload a screenshot, or enter an identifier to analyze.');
      return;
    }

    setErrorMessage(null);
    setLoadedPresetNotice(null);
    setIsScanning(true);
    setScanningStepText('SCANNING EVIDENCE...');

    // If attached evidence exists and OCR text wasn't extracted yet, run OCR now
    let evidenceToAnalyze = [...attachedEvidence];
    if (!hasText && evidenceToAnalyze.length > 0 && !evidenceToAnalyze.some(e => e.extractedText)) {
      setScanningStepText('SCANNING EVIDENCE & EXTRACTING TEXT...');
      for (let i = 0; i < evidenceToAnalyze.length; i++) {
        if (!evidenceToAnalyze[i].extractedText) {
          try {
            const res = await extractTextFromImage(evidenceToAnalyze[i].previewUrl);
            evidenceToAnalyze[i] = {
              ...evidenceToAnalyze[i],
              extractedText: res.text,
              ocrPerformed: true
            };
          } catch {}
        }
      }
      setAttachedEvidence(evidenceToAnalyze);
    }

    setTimeout(() => {
      setScanningStepText('EVALUATING RISK SIGNALS...');
    }, 280);

    setTimeout(() => {
      setScanningStepText('CHECKING COMMUNITY PATTERNS...');
    }, 560);

    setTimeout(() => {
      const evaluation = analyzeMessage(inputText, optionalIdentifiers, threats, evidenceToAnalyze);
      setResult(evaluation);
      setIsScanning(false);
    }, 840);
  };

  const handleClear = () => {
    setInputText('');
    setAttachedEvidence([]);
    setOptionalIdentifiers({
      instagramHandle: '',
      whatsappPhone: '',
      upiId: '',
      websiteUrl: '',
      otherIdentifier: ''
    });
    setActivePresetId('');
    setLoadedPresetNotice(null);
    setErrorMessage(null);
    setResult(null);
  };

  const isCurrentSaved = result ? savedCaseIds.includes(result.id) : false;

  return (
    <section id="scam-checker-section" style={{ padding: '2rem 0 3.5rem' }}>
      <div className="container">
        
        {/* Section Header: Clean & Professional */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={16} />
            <span>CHECK BEFORE YOU PAY</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Verify Any Seller, Message, or Screenshot
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.02rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.5 }}>
            Analyze suspicious messages, screenshots and payment identifiers before you send money.
          </p>
        </div>

        {/* Separated Demo Scenario Control (Clean & Unintrusive) */}
        <div style={{
          backgroundColor: '#10172b',
          border: '1px solid #1e293b',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TRY A SYNTHETIC DEMO
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                (5 Calibrated Scenarios)
              </span>
            </div>

            <button
              onClick={() => setShowDemoScenarios(!showDemoScenarios)}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>{showDemoScenarios ? 'Hide Demo Scenarios' : 'Explore Demo Scenarios'}</span>
              <ChevronDown size={14} style={{ transform: showDemoScenarios ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>
          </div>

          {showDemoScenarios && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
                Select a scenario to populate the evidence and identifiers. Then deliberately click <strong>"Analyze for Scam Risk"</strong>:
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '0.75rem'
              }}>
                {DEMO_PRESETS.map((preset, index) => {
                  const isSelected = activePresetId === preset.id;
                  const isCrit = preset.expectedRisk === 'CRITICAL';
                  const isLow = preset.expectedRisk === 'LOW';

                  return (
                    <div
                      key={preset.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '0.625rem',
                        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : '#151e36',
                        border: isSelected ? '1px solid #3b82f6' : '1px solid #243254',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.35rem' }}>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.35rem',
                            borderRadius: '0.2rem',
                            backgroundColor: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8'
                          }}>
                            Scenario {index + 1}
                          </span>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '0.25rem',
                            backgroundColor: isCrit ? 'rgba(239, 68, 68, 0.2)' : isLow ? 'rgba(16, 185, 129, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                            color: isCrit ? '#fca5a5' : isLow ? '#6ee7b7' : '#fdba74'
                          }}>
                            {preset.expectedRisk}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                          {preset.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3, marginBottom: '0.6rem' }}>
                          {preset.previewBadge} • {preset.platform}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPreset(preset)}
                        className="btn-secondary"
                        style={{
                          width: '100%',
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          backgroundColor: isSelected ? '#2563eb' : 'rgba(16, 23, 43, 0.8)',
                          color: isSelected ? '#ffffff' : '#cbd5e1',
                          borderColor: isSelected ? '#3b82f6' : '#243254',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? '✓ Demo Loaded' : 'Load Demo'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main Analysis Input Workspace */}
        <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem', position: 'relative' }}>
          
          {isScanning && <div className="scanner-beam" />}

          {/* Privacy Guard Notice */}
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.5rem',
            fontSize: '0.78rem',
            color: '#cbd5e1'
          }}>
            <Lock size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#38bdf8' }}>Privacy Guard:</strong> Do not upload OTPs, passwords, PINs, card numbers or banking credentials. ScamShield provides risk assessment and guidance. It does not determine criminal liability.
            </div>
          </div>

          {/* INPUT METHOD A: Paste Message */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={15} color="#38bdf8" />
                <span>PASTE MESSAGE (WhatsApp, Instagram DM, SMS, or QR Text)</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {inputText.length} characters
              </span>
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Paste Instagram DM, WhatsApp message, delivery SMS alert, or payment QR description here..."
              style={{
                width: '100%',
                padding: '0.9rem 1rem',
                borderRadius: '0.625rem',
                backgroundColor: '#0b1120',
                border: errorMessage && !inputText.trim() ? '1px solid #ef4444' : '1px solid #1e293b',
                color: '#f8fafc',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* INPUT METHOD B: Screenshot / Photo Evidence Upload (First-Class Feature) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ImageIcon size={15} color="#38bdf8" />
                <span>ADD EVIDENCE (Screenshots & Payment Proof)</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {attachedEvidence.length} image(s) attached
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Upload screenshots of Instagram DMs, WhatsApp chats, SMS messages, payment requests or suspicious pages.
            </p>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              style={{ display: 'none' }}
            />

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={isDragging ? 'dropzone-dragging' : ''}
              style={{
                padding: '1.75rem 1.25rem',
                borderRadius: '0.75rem',
                border: isDragging ? '2px dashed #38bdf8' : '2px dashed #243254',
                backgroundColor: isDragging ? 'rgba(56, 189, 248, 0.1)' : 'rgba(11, 17, 32, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                gap: '0.65rem',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.14)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)'
              }}>
                <Camera size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.2rem' }}>
                  Upload Screenshot or Drag & Drop Here
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '999px',
                  marginBottom: '0.35rem'
                }}>
                  Instagram • WhatsApp • SMS • Payment Request • Delivery Message
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Supports PNG, JPG, JPEG, WEBP • Client-side OCR text extraction (Zero cloud upload)
                </div>
              </div>
            </div>

            {/* OCR Processing Active Indicator */}
            {isOcrReading && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.65rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.8rem',
                color: '#38bdf8'
              }}>
                <RefreshCw size={15} className="animate-spin" />
                <span style={{ fontWeight: 600 }}>Extracting text from image via client-side OCR engine...</span>
              </div>
            )}

            {/* Attached Screenshots Thumbnails Gallery */}
            {attachedEvidence.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Attached Evidence Files ({attachedEvidence.length}):</span>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Ready for dynamic risk evaluation</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {attachedEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        position: 'relative',
                        padding: '0.65rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#151e36',
                        border: '1px solid #243254',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem'
                      }}
                    >
                      <img
                        src={ev.previewUrl}
                        alt={ev.name}
                        style={{ width: '52px', height: '52px', borderRadius: '0.35rem', objectFit: 'cover', flexShrink: 0, border: '1px solid #334155' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.3rem' }}>
                          {(ev.size / 1024).toFixed(0)} KB
                        </div>
                        {ev.extractedText ? (
                          <div style={{
                            fontSize: '0.68rem',
                            color: '#38bdf8',
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '0.25rem',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            maxWidth: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            <CheckCircle2 size={11} color="#38bdf8" />
                            <span>OCR Read: "{ev.extractedText.slice(0, 24)}..."</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            Visual evidence attached
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveEvidence(ev.id);
                        }}
                        title="Remove image"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.25rem'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* INPUT METHOD C: Optional Scam Identifiers */}
          <div style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            backgroundColor: '#0b1120',
            border: '1px solid #1e293b',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  SCAM IDENTIFIERS (Optional)
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                All fields optional • Cross-referenced with community intelligence
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              
              {/* Instagram Handle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={optionalIdentifiers.instagramHandle || ''}
                  onChange={e => setOptionalIdentifiers({ ...optionalIdentifiers, instagramHandle: e.target.value })}
                  placeholder="e.g. @drip_sneakers_india"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#10172b',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* WhatsApp / Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                  WhatsApp / Phone
                </label>
                <input
                  type="text"
                  value={optionalIdentifiers.whatsappPhone || ''}
                  onChange={e => setOptionalIdentifiers({ ...optionalIdentifiers, whatsappPhone: e.target.value })}
                  placeholder="e.g. +91 98450 12399"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#10172b',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* UPI ID */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                  UPI ID
                </label>
                <input
                  type="text"
                  value={optionalIdentifiers.upiId || ''}
                  onChange={e => setOptionalIdentifiers({ ...optionalIdentifiers, upiId: e.target.value })}
                  placeholder="e.g. sneakerhub.kicks@okaxis"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#10172b',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Website / URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                  Website / URL
                </label>
                <input
                  type="text"
                  value={optionalIdentifiers.websiteUrl || ''}
                  onChange={e => setOptionalIdentifiers({ ...optionalIdentifiers, websiteUrl: e.target.value })}
                  placeholder="e.g. tracking-portal.xyz"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#10172b',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Other Identifier */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
                  Other Identifier
                </label>
                <input
                  type="text"
                  value={optionalIdentifiers.otherIdentifier || ''}
                  onChange={e => setOptionalIdentifiers({ ...optionalIdentifiers, otherIdentifier: e.target.value })}
                  placeholder="e.g. Telegram tag, account ref"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '0.4rem',
                    backgroundColor: '#10172b',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

            </div>
          </div>

          {/* Loaded Preset Feedback Notice */}
          {loadedPresetNotice && !result && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} />
                <span>{loadedPresetNotice}</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Deliberate evaluation required
              </span>
            </div>
          )}

          {/* Validation Feedback */}
          {errorMessage && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.65rem 0.9rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <AlertOctagon size={16} color="#ef4444" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Row: Clear Workspace vs Analyze for Scam Risk */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleClear}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.15rem', fontSize: '0.84rem' }}
              >
                <Trash2 size={14} />
                <span>Clear Workspace</span>
              </button>
            </div>

            {(() => {
              const hasUsableInput = inputText.trim().length > 0 || attachedEvidence.length > 0 || Object.values(optionalIdentifiers).some(val => val && val.trim().length > 0);
              return (
                <button
                  onClick={handleAnalyze}
                  disabled={!hasUsableInput || isScanning}
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    opacity: hasUsableInput && !isScanning ? 1 : 0.45,
                    cursor: hasUsableInput && !isScanning ? 'pointer' : 'not-allowed',
                    filter: hasUsableInput ? 'none' : 'grayscale(0.4)'
                  }}
                  title={!hasUsableInput ? 'Please enter message text, upload screenshot, or choose a demo' : undefined}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>{scanningStepText}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>Analyze for Scam Risk</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              );
            })()}
          </div>

        </div>

        {/* Empty State when no result and no input */}
        {!result && !inputText.trim() && attachedEvidence.length === 0 && !Object.values(optionalIdentifiers).some(v => v && v.trim().length > 0) && (
          <div style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '0.85rem',
            border: '1px dashed #243254',
            marginTop: '1rem'
          }}>
            <ShieldCheck size={36} color="#475569" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Nothing to analyze yet
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '520px', margin: '0 auto' }}>
              Paste a message, upload a screenshot, or try a synthetic demo above to assess scam risk before you pay.
            </div>
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            <AnalysisResultView 
              result={result} 
              onSaveCase={onSaveCase} 
              isSaved={isCurrentSaved}
              onNavigateToActionCenter={onNavigateToActionCenter}
            />
          </div>
        )}

      </div>
    </section>
  );
};
