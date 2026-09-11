import type { 
  ScamAnalysisResult, WarningSignal, ExtractedIdentifiers, RiskLevel, 
  CommunityThreat, CommunityMatchInfo, OptionalIdentifiers, AttachedEvidence,
  ScoreBreakdownItem
} from '../types';

export function findCommunityMatches(
  identifiers: ExtractedIdentifiers,
  communityThreats: CommunityThreat[] = []
): CommunityMatchInfo {
  if (!communityThreats || communityThreats.length === 0) {
    return {
      hasMatch: false,
      matchedIdentifiers: [],
      corroboratingReportsCount: 0,
      matchingThreats: [],
      summaryNote: 'No community reports found in demo dataset.'
    };
  }

  const matchedThreats: CommunityThreat[] = [];
  const matchedIdentifiers: string[] = [];

  const checkMatch = (value: string, threat: CommunityThreat): boolean => {
    const cleanVal = value.toLowerCase().replace(/^@/, '').trim();
    if (!cleanVal || cleanVal.length < 3) return false;

    const repTarget = threat.reportedHandleOrUPI.toLowerCase();
    const title = threat.title.toLowerCase();
    const desc = threat.description.toLowerCase();

    return repTarget.includes(cleanVal) || 
           cleanVal.includes(repTarget) || 
           title.includes(cleanVal) || 
           desc.includes(cleanVal);
  };

  communityThreats.forEach(threat => {
    let matchedThisThreat = false;

    // Check UPI VPAs
    identifiers.upiIds.forEach(upi => {
      if (checkMatch(upi, threat)) {
        matchedThisThreat = true;
        matchedIdentifiers.push(`UPI: ${upi}`);
      }
    });

    // Check Seller Handles
    identifiers.sellerHandles.forEach(handle => {
      if (checkMatch(handle, threat)) {
        matchedThisThreat = true;
        matchedIdentifiers.push(`Handle: ${handle}`);
      }
    });

    // Check URLs
    identifiers.urls.forEach(url => {
      if (checkMatch(url, threat)) {
        matchedThisThreat = true;
        matchedIdentifiers.push(`URL: ${url}`);
      }
    });

    // Check Phones
    identifiers.phoneNumbers.forEach(phone => {
      const cleanPhone = phone.replace(/[\s+-]/g, '');
      const threatPhone = threat.reportedHandleOrUPI.replace(/[\s+-]/g, '');
      if (cleanPhone.length >= 8 && threatPhone.includes(cleanPhone)) {
        matchedThisThreat = true;
        matchedIdentifiers.push(`Phone: ${phone}`);
      }
    });

    // Check Other Identifiers
    if (identifiers.otherIdentifiers) {
      identifiers.otherIdentifiers.forEach(other => {
        if (checkMatch(other, threat)) {
          matchedThisThreat = true;
          matchedIdentifiers.push(`Identifier: ${other}`);
        }
      });
    }

    if (matchedThisThreat && !matchedThreats.some(t => t.id === threat.id)) {
      matchedThreats.push(threat);
    }
  });

  const uniqueMatchedIdentifiers = Array.from(new Set(matchedIdentifiers));
  const corroboratingReportsCount = matchedThreats.reduce((acc, t) => acc + (t.verifiedCount || 1), 0);

  if (matchedThreats.length > 0) {
    return {
      hasMatch: true,
      matchedIdentifiers: uniqueMatchedIdentifiers,
      corroboratingReportsCount,
      matchingThreats: matchedThreats,
      summaryNote: `${matchedThreats.length} community incident pattern(s) match these identifiers in the demo dataset.`
    };
  }

  return {
    hasMatch: false,
    matchedIdentifiers: [],
    corroboratingReportsCount: 0,
    matchingThreats: [],
    summaryNote: 'No community match found in demo dataset for these identifiers.'
  };
}

export function analyzeMessage(
  text: string, 
  providedIdentifiersOrHandle?: string | OptionalIdentifiers,
  communityThreats: CommunityThreat[] = [],
  attachedEvidence: AttachedEvidence[] = []
): ScamAnalysisResult {
  // Support text provided directly OR extracted from attached screenshots via OCR
  let effectiveText = text.trim();
  let isFromOcr = false;

  if (!effectiveText && attachedEvidence && attachedEvidence.length > 0) {
    const ocrTexts = attachedEvidence.map(e => e.extractedText || '').filter(t => t.trim().length > 0);
    if (ocrTexts.length > 0) {
      effectiveText = ocrTexts.join('\n\n').trim();
      isFromOcr = true;
    }
  }

  const cleanText = effectiveText;
  const lower = cleanText.toLowerCase();

  const warningSignals: WarningSignal[] = [];
  const dangerousActionsToAvoid: string[] = [];
  const recommendedActions: string[] = [];

  // Parse & Normalize Optional Identifiers
  let optionalIds: OptionalIdentifiers = {};
  let senderHandleDisplay = '';

  if (typeof providedIdentifiersOrHandle === 'string') {
    senderHandleDisplay = providedIdentifiersOrHandle.trim();
    if (senderHandleDisplay.startsWith('@')) {
      optionalIds.instagramHandle = senderHandleDisplay;
    } else if (senderHandleDisplay.includes('@')) {
      optionalIds.upiId = senderHandleDisplay;
    } else if (/^[0-9+ -]{8,15}$/.test(senderHandleDisplay)) {
      optionalIds.whatsappPhone = senderHandleDisplay;
    } else if (senderHandleDisplay.length > 0) {
      optionalIds.otherIdentifier = senderHandleDisplay;
    }
  } else if (providedIdentifiersOrHandle) {
    optionalIds = providedIdentifiersOrHandle;
    senderHandleDisplay = optionalIds.instagramHandle || optionalIds.whatsappPhone || optionalIds.upiId || optionalIds.websiteUrl || optionalIds.otherIdentifier || '';
  }

  // Normalization
  const normInstagram = optionalIds.instagramHandle ? optionalIds.instagramHandle.trim().toLowerCase() : '';
  const cleanInstagram = normInstagram ? (normInstagram.startsWith('@') ? normInstagram : `@${normInstagram}`) : '';
  const normPhone = optionalIds.whatsappPhone ? optionalIds.whatsappPhone.trim() : '';
  const normUpi = optionalIds.upiId ? optionalIds.upiId.trim().toLowerCase() : '';
  const normUrl = optionalIds.websiteUrl ? optionalIds.websiteUrl.trim() : '';
  const normOther = optionalIds.otherIdentifier ? optionalIds.otherIdentifier.trim() : '';

  // Extract Email Addresses (to separate from UPI IDs)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  const emailMatches: string[] = cleanText.match(emailRegex) || [];

  // Extract UPI IDs (must not be part of standard email address)
  const rawUpiRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]{2,20}\b/gi;
  const rawUpiMatches: string[] = cleanText.match(rawUpiRegex) || [];
  const upiList: string[] = rawUpiMatches.filter(vpa => !emailMatches.some(em => em.toLowerCase().startsWith(vpa.toLowerCase())));
  if (normUpi && !upiList.includes(normUpi)) {
    upiList.push(normUpi);
  }
  const uniqueUpis = Array.from(new Set(upiList));

  // Extract Phone Numbers
  const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g;
  const phoneMatches: string[] = cleanText.match(phoneRegex) || [];
  if (normPhone && !phoneMatches.includes(normPhone)) {
    phoneMatches.push(normPhone);
  }
  const uniquePhones = Array.from(new Set(phoneMatches));

  // Extract URLs
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  const urlMatches: string[] = cleanText.match(urlRegex) || [];
  if (normUrl && !urlMatches.includes(normUrl)) {
    urlMatches.push(normUrl);
  }
  const uniqueUrls = Array.from(new Set(urlMatches));

  // Extract Amounts (INR)
  const amountRegex = /(?:₹|rs\.?|inr)\s?([0-9,]+(?:\.[0-9]{2})?)/gi;
  const amountMatches: string[] = cleanText.match(amountRegex) || [];
  const uniqueAmounts = Array.from(new Set(amountMatches));

  // Extract Social Handles
  const handleRegex = /(?:^|\s)(@[a-zA-Z0-9_.]{3,30})/g;
  const handleMatches: string[] = [];
  let hMatch;
  while ((hMatch = handleRegex.exec(cleanText)) !== null) {
    handleMatches.push(hMatch[1]);
  }
  if (cleanInstagram && !handleMatches.includes(cleanInstagram)) {
    handleMatches.unshift(cleanInstagram);
  }
  const sellerHandles = Array.from(new Set(handleMatches));

  const otherIdentifiers: string[] = [];
  if (normOther) {
    otherIdentifiers.push(normOther);
  }

  const suspiciousKeywords: string[] = [];
  const scoreBreakdown: ScoreBreakdownItem[] = [];
  let score = 0;

  // --- Rule 1: Request for OTP / PIN / Reverse Charge QR Fraud ---
  const reverseUpiPatterns = [
    /enter.*(?:upi|pin|6-digit|4-digit)/i,
    /scan.*qr.*(?:receive|refund|credit|approve)/i,
    /pin.*(?:receive|refund|credit)/i,
    /enter pin/i,
    /approve the transfer/i,
    /share.*(?:otp|password|passcode)/i
  ];
  if (reverseUpiPatterns.some(p => p.test(lower))) {
    score += 35;
    suspiciousKeywords.push('UPI PIN to Receive', 'Reverse Charge QR');
    scoreBreakdown.push({
      label: 'OTP / PIN / Reverse Charge Request',
      points: 35,
      explanation: 'Deceptive prompt instructing to enter PIN or scan QR to "receive" or "refund" money'
    });
    warningSignals.push({
      id: 'sig-reverse-pin',
      title: 'Deceptive "Enter PIN to Receive Money" Trap',
      severity: 'critical',
      category: 'UPI Fraud',
      description: 'You are being instructed to enter a UPI PIN, scan a QR, or share an approval code to receive money.',
      whyItIncreasesRisk: 'In the UPI protocol, entering a PIN is strictly a DEBIT authorization. It can NEVER receive funds. Any claim otherwise is an account-draining trap.',
      scoreContribution: 35
    });
    dangerousActionsToAvoid.push('NEVER enter your UPI PIN on any prompt claiming to send you money or a refund.');
    dangerousActionsToAvoid.push('Do NOT scan unknown QR codes received over WhatsApp or SMS.');
  }

  // --- Rule 2: Advance Payment Request / Booking Token / Release Fee ---
  const advanceFeePatterns = [
    /advance.*(?:token|booking|fee|charge|deposit|courier|insurance)/i,
    /token.*(?:booking|amount|fee)/i,
    /pay.*advance/i,
    /courier.*insurance/i,
    /dispatch.*token/i,
    /remaining.*cod/i,
    /cod.*available.*pay.*advance/i,
    /block your piece/i,
    /(?:delivery|parcel|package|customs|courier|dispatch|shipment).*(?:release fee|clearance fee|release charge|holding fee|unblock fee|processing fee)/i,
    /release fee/i,
    /clearance fee/i
  ];
  const isAdvanceNegated = /(?:zero|no|without|0)\s+advance/i.test(lower);
  if (!isAdvanceNegated && advanceFeePatterns.some(p => p.test(lower))) {
    score += 25;
    suspiciousKeywords.push('Advance Booking Token', 'Courier Fee Prepayment', 'Advance before COD');
    scoreBreakdown.push({
      label: 'Advance Payment Requested',
      points: 25,
      explanation: 'Upfront booking token or courier fee demanded before Cash on Delivery dispatch'
    });
    warningSignals.push({
      id: 'sig-advance-token',
      title: 'Advance Payment Demanded for "Cash on Delivery"',
      severity: 'critical',
      category: 'Advance Fee Fraud',
      description: 'The seller claims Cash on Delivery is supported but requires an upfront "token" or "courier fee" to personal UPI before shipping.',
      whyItIncreasesRisk: 'Demanding upfront money while pretending to offer COD eliminates buyer protection. Once the token is transferred, fraudulent sellers routinely block the buyer.',
      scoreContribution: 25
    });
    dangerousActionsToAvoid.push('Do NOT pay advance courier tokens or booking fees to personal UPI VPAs.');
    recommendedActions.push('Insist on genuine open-box Cash on Delivery with zero upfront payments.');
  }

  // --- Rule 2B: Cash on Delivery Denied / Refused ---
  const codDeniedPatterns = [
    /(?:cod|cash on delivery).*(?:unavailable|not available|stopped|disabled|not possible|not supported|cancelled)/i,
    /no cod/i,
    /cod is (?:not|no longer|unavailable)/i
  ];
  if (codDeniedPatterns.some(p => p.test(lower))) {
    score += 20;
    suspiciousKeywords.push('Cash on Delivery Denied');
    scoreBreakdown.push({
      label: 'Cash on Delivery Refused / Denied',
      points: 20,
      explanation: 'Seller or courier notice refuses Cash on Delivery to coerce immediate prepaid digital transfer'
    });
    warningSignals.push({
      id: 'sig-cod-denied',
      title: 'Cash on Delivery Denied in Favor of Advance Payment',
      severity: 'critical',
      category: 'Payment Coercion',
      description: 'The seller or delivery notice explicitly denies or disables Cash on Delivery to force upfront digital payment.',
      whyItIncreasesRisk: 'Denying COD removes buyer protection and physical parcel verification, forcing prepayment to untraceable accounts.',
      scoreContribution: 20
    });
    dangerousActionsToAvoid.push('Do NOT pay advance fees when Cash on Delivery is suddenly revoked or claimed unavailable.');
  }

  // --- Rule 3: UPI / Direct Bank Transfer Request ---
  const mentionsUpi = /(?:upi id|send payment to (?:this )?upi|pay via upi|gpay|phonepe|paytm to)/i.test(lower);
  if ((uniqueUpis.length > 0 || mentionsUpi) && !lower.includes('razorpay') && !lower.includes('cashfree') && !lower.includes('billdesk')) {
    score += 20;
    suspiciousKeywords.push('Personal Peer-to-Peer UPI');
    scoreBreakdown.push({
      label: 'Suspicious Payment Instruction (P2P UPI)',
      points: 20,
      explanation: uniqueUpis.length > 0 
        ? `Direct transfer to personal VPA (${uniqueUpis.join(', ')}) without merchant escrow`
        : 'Direct transfer to personal UPI demanded without verified merchant gateway'
    });
    warningSignals.push({
      id: 'sig-personal-upi',
      title: 'Unverified Peer-to-Peer UPI Payment Requested',
      severity: 'warning',
      category: 'Payment Method',
      description: uniqueUpis.length > 0 
        ? `Payment requested via direct P2P UPI (${uniqueUpis.join(', ')}) instead of an official commercial payment aggregator.`
        : 'Payment requested via personal UPI ID instead of an official commercial payment aggregator.',
      whyItIncreasesRisk: 'P2P transfers carry zero escrow protection, merchant verification, or chargeback mediation. Funds cannot be recovered once transferred.',
      scoreContribution: 20
    });
  }

  // --- Rule 4: Suspicious Links & Typosquats ---
  const suspiciousTldPatterns = /\.(xyz|top|site|icu|tk|ml|ga|cf|gq|club|link|live|work|buzz|rest|pw|vip)(?:\/|\?|$)/i;
  const hasPhishingUrl = uniqueUrls.some(u => suspiciousTldPatterns.test(u));
  if (hasPhishingUrl) {
    score += 20;
    suspiciousKeywords.push('Disposable Domain Extension');
    scoreBreakdown.push({
      label: 'Suspicious / Disposable URL',
      points: 20,
      explanation: 'Link uses disposable TLD (.xyz, .top, etc.) or lookalike domain'
    });
    warningSignals.push({
      id: 'sig-suspicious-link',
      title: 'Suspicious Disposable Web Link',
      severity: 'critical',
      category: 'Phishing',
      description: 'The link utilizes a cheap, disposable top-level domain (.xyz, .top, .live) rather than an official corporate domain.',
      whyItIncreasesRisk: 'Disposable domains are favored by phishing operators because they can be registered anonymously for under ₹100 and discarded once blocked.',
      scoreContribution: 20
    });
    dangerousActionsToAvoid.push('Do NOT click links received from unknown mobile SMS or WhatsApp senders.');
    dangerousActionsToAvoid.push('Do NOT input payment card numbers, CVVs, or OTPs on unverified domains.');
  }

  // --- Rule 5: Fake Delivery / Redelivery Surcharge / Release Fee ---
  const postalImpersonation = /(indapost|indiapost|bluedart|delhivery|fedx|fedex|ekart|shadowfax|speedpost|courier|delivery|postal)/i;
  const deliveryNoticePatterns = /(withheld|held at|customs surcharge|pending fee|undelivered|incomplete street|update address|address update|reschedule delivery|release fee|delivery fee|delivery release)/i;
  if (deliveryNoticePatterns.test(lower) && (postalImpersonation.test(lower) || uniqueUrls.length > 0 || /parcel|package|shipment/i.test(lower))) {
    score += 25;
    suspiciousKeywords.push('Delivery Impersonation', 'Micro-fee Phishing');
    scoreBreakdown.push({
      label: 'Fake Delivery Fee / Surcharge',
      points: 25,
      explanation: 'Demands surcharge or release fee claiming parcel is held, delayed, or requires release payment'
    });
    warningSignals.push({
      id: 'sig-delivery-phishing',
      title: 'Fake Delivery Notice & Release Fee Trap',
      severity: 'critical',
      category: 'Impersonation',
      description: 'Claims a parcel or package is withheld and demands a surcharge or release fee to complete delivery.',
      whyItIncreasesRisk: 'Legitimate logistics firms do not demand release fees to informal UPI IDs or threaten immediate cancellation.',
      scoreContribution: 25
    });
    recommendedActions.push('Track parcels exclusively through the official courier mobile application or genuine .gov.in domain.');
  }

  // --- Rule 6: Urgency / Deadline Pressure ---
  const urgencyPatterns = [
    /(?:in \d{1,2} min|hurry|flash sale|limited time|last \d piece|within 24 hour|offer ends|expires|immediately)/i,
    /send screenshot.*immediately/i,
    /order will be cancelled/i
  ];
  if (urgencyPatterns.some(p => p.test(lower))) {
    score += 15;
    suspiciousKeywords.push('Artificial Urgency', 'Time Scarcity Trigger');
    scoreBreakdown.push({
      label: 'Urgency & Pressure Tactics',
      points: 15,
      explanation: 'Artificial time limit imposing rapid payment before verification'
    });
    warningSignals.push({
      id: 'sig-urgency',
      title: 'Artificial Urgency & Time Pressure',
      severity: 'warning',
      category: 'Psychological Manipulation',
      description: 'The message imposes artificial time scarcity ("expires in 25 mins", "only 2 left", "send screenshot immediately").',
      whyItIncreasesRisk: 'Urgency tactics create anxiety and rush the buyer into paying without verifying seller credentials or return policies.',
      scoreContribution: 15
    });
  }

  // --- Rule 7: Threat of Cancellation / Disconnection / Termination ---
  const threatPatterns = [
    /(?:parcel|order|package|shipment|delivery).*(?:cancelled|canceled|terminated|returned to sender|discarded)/i,
    /delivery will be terminated/i,
    /returned to sender/i,
    /account.*blocked/i,
    /legal action/i,
    /power termination/i,
    /will be disconnected/i,
    /electricity.*disconnect/i,
    /power.*cutoff/i
  ];
  if (threatPatterns.some(p => p.test(lower))) {
    score += 15;
    suspiciousKeywords.push('Disconnection/Termination Threat');
    scoreBreakdown.push({
      label: 'Intimidation & Cancellation Threat',
      points: 15,
      explanation: 'Threatens service cutoff, parcel termination, or account penalty'
    });
    warningSignals.push({
      id: 'sig-cancellation-threat',
      title: 'Intimidation & Cancellation Threat',
      severity: 'warning',
      category: 'Coercion',
      description: 'The message threatens imminent parcel termination, return to sender, or account penalty if immediate payment is not made.',
      whyItIncreasesRisk: 'Coercive penalties are designed to intimidate victims into compliance before they can consult bank helplines or family.',
      scoreContribution: 15
    });
  }

  // --- Rule 8: Unusually Large Discount / Counterfeit Luxury ---
  const luxuryCounterfeitPatterns = [
    /(?:rolex|gucci|louis vuitton|dior|iphone 16|air jordan).*for.*₹?[1-9][0-9]{2,3}\b/i,
    /(?:1st copy|master copy|replica|imported watch|first copy)/i
  ];
  if (luxuryCounterfeitPatterns.some(p => p.test(lower))) {
    score += 10;
    suspiciousKeywords.push('Counterfeit Replica Bait', '90%+ Discount');
    scoreBreakdown.push({
      label: 'Unrealistic Discount (Counterfeit Bait)',
      points: 10,
      explanation: '90%+ discount on luxury items used as lure for advance payments'
    });
    warningSignals.push({
      id: 'sig-counterfeit',
      title: 'Unusually Large Discount on Luxury Goods',
      severity: 'warning',
      category: 'Counterfeit Trap',
      description: 'Offers high-end luxury products at 95%+ below retail value alongside claims of "1st master copy" or "customs liquidation".',
      whyItIncreasesRisk: 'Impossibly cheap prices serve as bait to attract shoppers willing to risk advance booking tokens.',
      scoreContribution: 10
    });
  }

  // --- Rule 9: Prepaid Task / Rating Job Scheme ---
  const taskScamPatterns = [
    /(?:like.*youtube|rate.*google|like.*videos|hotel.*rating)/i,
    /(?:part-time|freelance).*earn.*(?:3000|5000|8000|daily)/i,
    /(?:refundable|security).*deposit/i,
    /trial task/i,
    /payout wallet/i
  ];
  if (taskScamPatterns.some(p => p.test(lower))) {
    score += 25;
    suspiciousKeywords.push('Rating Task Trap', 'Refundable Security Deposit');
    scoreBreakdown.push({
      label: 'Prepaid Task / Rating Deposit Trap',
      points: 25,
      explanation: 'Demands refundable security deposit to unlock promised task earnings'
    });
    warningSignals.push({
      id: 'sig-task-scam',
      title: 'Prepaid Task & Rating Deposit Trap',
      severity: 'critical',
      category: 'Advance Fee Scheme',
      description: 'Promises high daily income for rating videos or hotels, requiring a "refundable security deposit" to unlock withdrawal wallets.',
      whyItIncreasesRisk: 'Victims are paid small initial tokens to build trust, followed by escalating deposit demands that are never refunded.',
      scoreContribution: 25
    });
    dangerousActionsToAvoid.push('NEVER pay a "security deposit" or "activation fee" to receive promised earnings.');
  }

  // --- Rule 10: Repeated Payment Demands / Failed Transaction Claims ---
  const repeatedPaymentPatterns = [
    /server failure.*send/i,
    /payment failed.*pay again/i,
    /double payment/i,
    /resend payment/i
  ];
  if (repeatedPaymentPatterns.some(p => p.test(lower))) {
    score += 25;
    suspiciousKeywords.push('Repeated Payment Claim');
    scoreBreakdown.push({
      label: 'Repeated Payment Demand',
      points: 25,
      explanation: 'Claims previous transfer failed to extract duplicate payments'
    });
    warningSignals.push({
      id: 'sig-repeated-payment',
      title: 'Repeated Payment Demand ("Transaction Failed" Claim)',
      severity: 'warning',
      category: 'Payment Duplication',
      description: 'The sender claims a prior payment failed due to server issues and requests re-sending funds to the same or alternate UPI ID.',
      whyItIncreasesRisk: 'Scammers exploit banking notification delays to extract double or triple payments before the victim checks their statement.',
      scoreContribution: 25
    });
  }

  // --- Rule 11: Utility / Power Bill Impersonation & Disconnection Threat ---
  const utilityPatterns = /(?:electricity|power connection|power bill|lineman|sub-division office|discom|electricity officer)/i;
  const cutoffThreatPatterns = /(?:disconnect|disconnected|power termination|cutoff|cut off|stop immediate power)/i;
  if (utilityPatterns.test(lower) && cutoffThreatPatterns.test(lower)) {
    score += 25;
    suspiciousKeywords.push('Electricity Disconnection Threat', 'Discom Impersonation');
    scoreBreakdown.push({
      label: 'Utility / Authority Impersonation',
      points: 25,
      explanation: 'Impersonates electricity board threatening power disconnection for unpaid surcharge'
    });
    warningSignals.push({
      id: 'sig-utility-impersonation',
      title: 'Utility / Power Board Impersonation & Cutoff Threat',
      severity: 'critical',
      category: 'Utility Impersonation',
      description: 'The message impersonates an electricity board threatening imminent power disconnection unless immediate payment is sent to a personal number or UPI.',
      whyItIncreasesRisk: 'Utility providers never collect arrears via informal peer-to-peer UPI IDs or threaten disconnection via informal mobile messages outside formal billing notices.',
      scoreContribution: 25
    });
    dangerousActionsToAvoid.push('Do NOT transfer money to personal mobile numbers or UPI IDs claiming to represent the electricity board.');
    recommendedActions.push('Verify electricity bill dues exclusively through your official discom consumer portal or state electricity board app.');
  }

  // --- Mitigating Factors: Legitimate Safe Indicators ---
  let safePoints = 0;
  if (/gstin\b/i.test(lower) || /2[0-9][a-z]{5}[0-9]{4}[a-z]{1}[1-9a-z]{1}z[0-9a-z]{1}/i.test(lower)) {
    safePoints += 30;
    scoreBreakdown.push({
      label: 'Registered Business GSTIN (Mitigating)',
      points: -30,
      explanation: 'Valid 15-character GSTIN verifiable on government portal'
    });
    warningSignals.push({
      id: 'sig-gstin-verified',
      title: 'Registered Business GSTIN Provided',
      severity: 'info',
      category: 'Legitimate Trust Indicator',
      description: 'Message provides a valid 15-character GSTIN format verifiable on the government GST portal.',
      whyItIncreasesRisk: 'Decreases risk significantly: registered businesses face formal tax audits and legal accountability.',
      scoreContribution: -30
    });
  }
  if (/razorpay|cashfree|official gateway/i.test(lower)) {
    safePoints += 25;
    scoreBreakdown.push({
      label: 'Commercial Gateway Protection (Mitigating)',
      points: -25,
      explanation: 'Payment handled via KYC-verified merchant gateway'
    });
    warningSignals.push({
      id: 'sig-gateway-verified',
      title: 'Verified Commercial Payment Gateway',
      severity: 'info',
      category: 'Legitimate Trust Indicator',
      description: 'Checkout is conducted through an authorized merchant aggregator with grievance mechanisms.',
      whyItIncreasesRisk: 'Decreases risk: commercial gateways enforce merchant KYC and support formal dispute chargebacks.',
      scoreContribution: -25
    });
  }
  if (/open-box/i.test(lower) && !hasPhishingUrl) {
    safePoints += 20;
    scoreBreakdown.push({
      label: 'Open-Box Inspection (Mitigating)',
      points: -20,
      explanation: 'Recipient can open package before paying courier'
    });
    warningSignals.push({
      id: 'sig-openbox-allowed',
      title: 'Open-Box Inspection Permitted Upon Delivery',
      severity: 'info',
      category: 'Legitimate Trust Indicator',
      description: 'Allows the recipient to inspect parcel contents before paying the delivery agent.',
      whyItIncreasesRisk: 'Decreases risk: eliminates non-delivery and empty box scams by verifying goods beforehand.',
      scoreContribution: -20
    });
  }

  // Check Community Intelligence match
  const extractedIdentifiers: ExtractedIdentifiers = {
    upiIds: uniqueUpis,
    phoneNumbers: uniquePhones,
    urls: uniqueUrls,
    amounts: uniqueAmounts,
    sellerHandles: sellerHandles,
    otherIdentifiers: otherIdentifiers,
    suspiciousKeywords: Array.from(new Set(suspiciousKeywords))
  };

  const communityMatch = findCommunityMatches(extractedIdentifiers, communityThreats);
  if (communityMatch.hasMatch) {
    score += 15;
    scoreBreakdown.push({
      label: 'Community Pattern Match',
      points: 15,
      explanation: `${communityMatch.corroboratingReportsCount} corroborating reports match this pattern in prototype dataset`
    });
    warningSignals.push({
      id: 'sig-community-match',
      title: 'Community Threat Match',
      severity: 'critical',
      category: 'Community Intelligence',
      description: communityMatch.summaryNote,
      whyItIncreasesRisk: 'This identifier appears in ScamShield prototype demo community reports matching this scam pattern.',
      scoreContribution: 15
    });
  }

  // Cap score between 5 and 94 (never claim 100% certainty)
  let finalScore = Math.max(5, Math.min(94, score - safePoints));

  if (warningSignals.length === 0 && cleanText) {
    finalScore = 15;
    warningSignals.push({
      id: 'sig-unverified-general',
      title: 'Unverified Merchant Baseline',
      severity: 'info',
      category: 'General Precaution',
      description: 'No known scam heuristics detected, but no registered business credentials were provided.',
      whyItIncreasesRisk: 'Independent merchant identity could not be verified from text snippet alone.'
    });
  }

  // Determine Risk Level (0–24 LOW, 25–49 MEDIUM, 50–74 HIGH, 75–100 CRITICAL)
  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 75) riskLevel = 'CRITICAL';
  else if (finalScore >= 50) riskLevel = 'HIGH';
  else if (finalScore >= 25) riskLevel = 'MEDIUM';
  else riskLevel = 'LOW';

  // Determine Scam Category & Headline
  let scamCategory = 'General Commerce Caution';
  let headline = 'Moderate Risk: Exercise caution before transacting';

  if (riskLevel === 'LOW') {
    scamCategory = 'Low Scam Risk (Legitimate Indicators Detected)';
    headline = 'No strong scam indicators detected in the provided evidence.';
  } else if (warningSignals.some(w => w.id === 'sig-reverse-pin')) {
    scamCategory = 'UPI Reverse-Charge PIN Deception';
    headline = 'DO NOT PAY: Deceptive PIN Prompt Will Debit Your Account';
  } else if (warningSignals.some(w => w.id === 'sig-delivery-phishing') || hasPhishingUrl) {
    scamCategory = 'Parcel Delivery Phishing & Surcharge Scam';
    headline = 'DO NOT CLICK / PAY: Fake Delivery Notice Designed to Steal Credentials';
  } else if (warningSignals.some(w => w.id === 'sig-cod-denied')) {
    scamCategory = 'Cash on Delivery Denial & Advance Prepayment Trap';
    headline = 'HIGH RISK — STOP PAYMENT: Fake Delivery Fee & Coerced Advance Payment';
  } else if (warningSignals.some(w => w.id === 'sig-utility-impersonation')) {
    scamCategory = 'Utility / Power Bill Disconnection Scam';
    headline = 'DO NOT PAY: Power Disconnection Impersonation Extortion';
  } else if (warningSignals.some(w => w.id === 'sig-advance-token')) {
    scamCategory = 'Social Commerce Advance-Fee Scam';
    headline = 'HIGH RISK — STOP PAYMENT: Advance Booking Token Scam Pattern Detected';
  } else if (warningSignals.some(w => w.id === 'sig-task-scam')) {
    scamCategory = 'Prepaid Task / Part-Time Rating Trap';
    headline = 'HIGH RISK: Fraudulent Task Scheme Requiring Advance Deposits';
  }

  // Plain-English Explanation
  let explanation = '';
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    explanation = `Risk assessment based on detected signals. This interaction exhibits ${warningSignals.filter(w => w.severity === 'critical' || w.severity === 'warning').length} high-confidence fraud indicators. ` +
      `The combination of ${suspiciousKeywords.slice(0, 3).join(', ')} matches established social-commerce fraud patterns. ` +
      `We strongly recommend stopping payment and demanding official escrow or verified COD.`;
  } else if (riskLevel === 'MEDIUM') {
    explanation = `Risk assessment based on detected signals. This message contains unverified elements such as direct peer-to-peer payment or lack of official commercial registration. Proceed only with extreme caution.`;
  } else {
    explanation = `Risk assessment based on detected signals. No strong scam indicators were detected in the provided evidence. The interaction exhibits legitimate trust signals (e.g. verifiable business registration, official payment gateway, or open-box COD). Always maintain standard transaction precautions.`;
  }

  // Recommended actions
  if (recommendedActions.length === 0) {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      recommendedActions.push('STOP PAYMENT IMMEDIATELY: Do not transfer money to personal UPI VPAs.');
      recommendedActions.push('Preserve screenshots of chat messages, sender profile, and transaction demands.');
      recommendedActions.push('Use ScamShield Action Center to find official 1930 / cybercrime reporting steps.');
    } else {
      recommendedActions.push('Always confirm the official merchant name appears on the payment screen.');
      recommendedActions.push('Retain order invoice and tracking numbers for delivery.');
    }
  }

  if (dangerousActionsToAvoid.length === 0) {
    dangerousActionsToAvoid.push('Never enter your UPI PIN on prompts claiming to "receive" or "refund" money.');
    dangerousActionsToAvoid.push('Never share OTPs, bank credentials, or card details over WhatsApp or SMS.');
  }

  if (attachedEvidence && attachedEvidence.length > 0) {
    warningSignals.push({
      id: 'sig-evidence-attached',
      title: 'Visual Evidence Attached',
      severity: 'info',
      category: 'Evidence Preservation',
      description: `${attachedEvidence.length} screenshot image(s) attached (${attachedEvidence.map(e => e.name).join(', ')}).`,
      whyItIncreasesRisk: 'Visual evidence is preserved in local case storage for documentation and official 1930 helpline reporting.'
    });
  }

  // CRITICAL BUG FIX: Handle case where only visual evidence was uploaded with no text
  let isInsufficientEvidence = false;
  let evidenceSummaryNote = '';

  if (!cleanText && attachedEvidence && attachedEvidence.length > 0) {
    if (communityMatch.hasMatch) {
      finalScore = 40;
      riskLevel = 'MEDIUM';
      scamCategory = 'Community Flagged Identifier';
      headline = 'Community Report Match Found for Provided Identifier';
      explanation = `The uploaded screenshot is attached as supporting evidence. The provided identifier matches records in the ScamShield community demo dataset. Add the message text for full content signal analysis.`;
      evidenceSummaryNote = 'Screenshot attached as supporting evidence.';
    } else {
      // Unparsed screenshot alone must NEVER produce LOW RISK / GREEN
      finalScore = 0;
      riskLevel = 'INSUFFICIENT_EVIDENCE';
      scamCategory = 'Unparsed Visual Evidence';
      headline = 'The uploaded screenshot could not be reliably interpreted.';
      explanation = 'The uploaded screenshot could not be reliably interpreted. Add the message text or an identifier for a stronger assessment.';
      isInsufficientEvidence = true;
      evidenceSummaryNote = 'The provided evidence does not contain enough reliable information for a strong assessment.';
      recommendedActions.length = 0;
      recommendedActions.push('Paste the chat message text or payment instructions into the text area.');
      recommendedActions.push('Enter known seller identifiers (Instagram handle, WhatsApp number, or UPI ID).');
      scoreBreakdown.length = 0;
      scoreBreakdown.push({
        label: 'Screenshot Evidence Attached (Unparsed)',
        points: 0,
        explanation: 'Image text extraction unavailable; evidence preserved as supporting case file'
      });
    }
  }

  if (isFromOcr && !evidenceSummaryNote) {
    evidenceSummaryNote = 'Text was extracted directly from the uploaded screenshot via client-side OCR and analyzed for risk signals.';
  }

  // Loss Estimate
  let lossEstimate = uniqueAmounts.length > 0 ? uniqueAmounts[0] : '₹500 - ₹5,000';
  if (warningSignals.some(w => w.id === 'sig-reverse-pin')) {
    lossEstimate = 'Full account balance up to daily UPI limit';
  }

  return {
    id: 'analysis-' + Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    rawText: cleanText,
    senderHandle: senderHandleDisplay,
    providedIdentifiers: optionalIds,
    attachedEvidence: attachedEvidence,
    riskScore: finalScore,
    riskLevel,
    scamCategory,
    headline,
    explanation,
    warningSignals,
    scoreBreakdown,
    isInsufficientEvidence,
    evidenceSummaryNote,
    extractedIdentifiers,
    communityMatch,
    recommendedActions,
    dangerousActionsToAvoid,
    estimatedLossPotential: lossEstimate,
    assessmentDisclaimer: 'Risk assessment based on detected signals — not proof of fraud or criminal activity.'
  };
}
