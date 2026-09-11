import type { DemoPreset, CommunityThreat, CaseRecord } from '../types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'preset-insta-sneakers',
    name: 'Instagram Sneaker Advance Payment Scam',
    platform: 'Instagram',
    previewBadge: 'Advance Token Scam',
    sellerHandle: '@drip_sneakers_india',
    expectedRisk: 'CRITICAL',
    description: 'Synthetic Demo Scenario: Luxury sneaker flash sale demanding ₹499 upfront token to a personal UPI before dispatching Cash on Delivery.',
    messageText: `Hey bro! 🔥 Flash Sale live! Nike Air Jordan 1 Retro High OG available for ₹2,499 only (Original Retail ₹18,500)!
Offer ends in 25 minutes! Only 2 pairs left in warehouse.
Cash on Delivery is available, but you must pay ₹499 advance booking token fee for courier insurance to UPI: sneakerhub.kicks@okaxis.
Remaining ₹2,000 pay to courier boy after opening box.
Hurry! Share screenshot of payment here immediately to block your size!`
  },
  {
    id: 'preset-indiapost-sms',
    name: 'Fake Courier / Delivery Fee Scam',
    platform: 'SMS',
    previewBadge: 'Postal Phishing Link',
    sellerHandle: '+91 98210 49122',
    expectedRisk: 'CRITICAL',
    description: 'Synthetic Demo Scenario: Urgent parcel failure notice with lookalike domain and micro-payment fee to harvest bank credentials.',
    messageText: `[IMPORTANT] IndiaPost Alert: Your parcel #IN74902189 is withheld at regional delivery hub due to incomplete street address and unpaid customs dispatch surcharge of ₹38.00.
Delivery will be terminated within 24 hours if address is not updated.
Update delivery details and clear pending fee now: http://indapost-tracking-hub.xyz/action
(India Post Department of Communications)`
  },
  {
    id: 'preset-whatsapp-job',
    name: 'WhatsApp Job Scam',
    platform: 'WhatsApp',
    previewBadge: 'Advance Deposit Job',
    sellerHandle: '+91 70441 98310',
    expectedRisk: 'HIGH',
    description: 'Synthetic Demo Scenario: Unsolicited part-time job offer promising ₹3,000-₹8,000/day for rating videos, requiring a "refundable activation security deposit".',
    messageText: `Hello! I am Tanya from Global Media Growth HR. 🌟
We are hiring part-time freelancers! Earn ₹3,000 - ₹8,000 daily simply by hitting like on YouTube channels and rating hotels on Google.
No degree needed. We already credited ₹150 for your first trial task!
To unlock premium daily payout tasks, you must deposit a 100% refundable security deposit of ₹1,000 to supervisor UPI: mediaops.security@paytm.
Send transaction UTR number to start receiving daily withdrawals!`
  },
  {
    id: 'preset-utility-bill',
    name: 'Utility / Power Bill Impersonation',
    platform: 'SMS',
    previewBadge: 'Disconnection Threat',
    sellerHandle: '+91 98450 12399',
    expectedRisk: 'CRITICAL',
    description: 'Synthetic Demo Scenario: Electricity disconnection threat impersonating state electricity board demanding immediate surcharge to personal UPI.',
    messageText: `URGENT ELECTRICITY ALERT: Dear Consumer, your electricity power connection will be disconnected tonight at 9:30 PM from the sub-division office because your previous month bill was not updated.
Immediately contact our electricity officer Mr. Sharma at 9845012399 or pay pending surcharge ₹120 to lineman UPI: discom.officer99@sbi to stop immediate power termination.
(State Electricity Board Discom)`
  },
  {
    id: 'preset-legit-store',
    name: 'Legitimate Order Confirmation',
    platform: 'Store',
    previewBadge: 'Order Confirmation',
    sellerHandle: '@fabcraft_india',
    expectedRisk: 'LOW',
    description: 'Synthetic Demo Scenario: Verified merchant order confirmation with registered GSTIN, official tracking link, and zero advance payment.',
    messageText: `Namaste! Thank you for your order #FC-89211 with FabCraft India.
We have confirmed your order for Handloom Cotton Kurti Set (₹1,850).
Your package is being prepared for dispatch with Open-Box Cash On Delivery and zero advance token.
You can track your shipment anytime on our official website: https://fabcraft.in/track/FC-89211 or checkout via Razorpay.
Our registered GSTIN is 27AABCA4589B1Z4, registered in Pune, Maharashtra.
Support: help@fabcraft.in.`
  }
];

export const INITIAL_COMMUNITY_THREATS: CommunityThreat[] = [
  {
    id: 'threat-1',
    title: 'Fake Sneaker Boutique "@drip_sneakers_india"',
    platform: 'Instagram',
    scamType: 'Advance Payment & Ghosting',
    reportedHandleOrUPI: 'sneakerhub.kicks@okaxis',
    description: 'Advertises Nike Dunks and Jordans at ₹2,499. Takes ₹499 advance payment for courier priority, then immediately blocks buyers.',
    upvoteCount: 164,
    reportedDate: '2 hours ago',
    lossReported: '₹499 - ₹2,500',
    verifiedCount: 42,
    severity: 'CRITICAL'
  },
  {
    id: 'threat-2',
    title: 'India Post Address Update SMS Phishing',
    platform: 'SMS',
    scamType: 'Credential & Card Harvesting',
    reportedHandleOrUPI: 'http://indapost-tracking-hub.xyz/action',
    description: 'Mass SMS targeting Indian numbers claiming package delivery is stalled. Link redirects to a fake postal portal asking for ₹38 card payment.',
    upvoteCount: 310,
    reportedDate: '5 hours ago',
    lossReported: 'Card unauthorized debit',
    verifiedCount: 89,
    severity: 'CRITICAL'
  },
  {
    id: 'threat-3',
    title: 'WhatsApp Work-From-Home Rating Bot',
    platform: 'WhatsApp',
    scamType: 'Prepaid Task Fraud',
    reportedHandleOrUPI: 'mediaops.security@paytm',
    description: 'Recruits victims to rate hotels on Google Maps. Pays ₹150 initially to build trust, then demands ₹1,000 "security deposit" to unlock withdrawal wallet.',
    upvoteCount: 89,
    reportedDate: 'Yesterday',
    lossReported: '₹1,000 - ₹25,000',
    verifiedCount: 24,
    severity: 'HIGH'
  },
  {
    id: 'threat-4',
    title: 'State Electricity Board Lineman Impersonation',
    platform: 'SMS',
    scamType: 'Power Cutoff Extortion',
    reportedHandleOrUPI: 'discom.officer99@sbi',
    description: 'Sends urgent SMS threatening electricity disconnection at 9:30 PM. Demands immediate payment to a personal UPI ID posing as a power board officer.',
    upvoteCount: 235,
    reportedDate: 'Yesterday',
    lossReported: '₹120 - ₹5,000',
    verifiedCount: 57,
    severity: 'CRITICAL'
  },
  {
    id: 'threat-5',
    title: 'WhatsApp "Scan QR for Refund" PIN Trap',
    platform: 'WhatsApp',
    scamType: 'Reverse Charge UPI Trap',
    reportedHandleOrUPI: '+91 88492 11094',
    description: 'Seller claims order return approved. Sends a QR code telling victim to "enter 6-digit UPI PIN to receive money", which debits their account.',
    upvoteCount: 220,
    reportedDate: '2 days ago',
    lossReported: '₹1,450 - ₹15,000',
    verifiedCount: 61,
    severity: 'CRITICAL'
  },
  {
    id: 'threat-6',
    title: 'Instagram Replica Watch Account "@lux_chronos_india.shop"',
    platform: 'Instagram',
    scamType: 'Advance Token for COD Fraud',
    reportedHandleOrUPI: 'chronos.deals88@okhdfcbank',
    description: 'Advertises replica luxury watches at ₹2,499. Demands ₹499 advance UPI token before dispatch, then blocks buyer without shipping.',
    upvoteCount: 142,
    reportedDate: '3 days ago',
    lossReported: '₹499 - ₹2,499',
    verifiedCount: 38,
    severity: 'HIGH'
  }
];

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'case-101',
    title: 'Instagram Air Jordan 1 Replica Seller Check',
    platform: 'Instagram',
    scamCategory: 'Advance Payment Courier Trap',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    date: '10 Sep 2026',
    sellerHandle: '@sneaker_drip_mumbai',
    savedLossEstimate: '₹3,200',
    status: 'Loss Avoided',
    notes: 'Seller demanded ₹500 advance UPI payment to dispatch fake Jordans. Checked on ScamShield, avoided sending payment.',
    originalSnippet: 'Pay ₹500 token to sneaks.mumbai@okaxis to confirm order. Remaining COD.'
  },
  {
    id: 'case-102',
    title: 'BlueDart Tracking Reschedule Link',
    platform: 'SMS',
    scamCategory: 'Delivery Phishing Surcharge',
    riskLevel: 'CRITICAL',
    riskScore: 91,
    date: '08 Sep 2026',
    sellerHandle: '+91 97182 30192',
    savedLossEstimate: '₹15,000 (Card protect)',
    status: 'Reported to 1930',
    notes: 'Phishing SMS received claiming address missing. ScamShield flagged typosquat link bluedart-reschedule.xyz.',
    originalSnippet: 'Bluedart alert: update address and pay ₹25 at bluedart-reschedule.xyz'
  },
  {
    id: 'case-103',
    title: 'WhatsApp Furniture Seller Verification',
    platform: 'WhatsApp',
    scamCategory: 'Reverse UPI QR Scam',
    riskLevel: 'CRITICAL',
    riskScore: 96,
    date: '04 Sep 2026',
    sellerHandle: '+91 80922 41109',
    savedLossEstimate: '₹8,500',
    status: 'Loss Avoided',
    notes: 'Buyer on marketplace sent QR code and told me to enter UPI PIN to receive money. Flagged immediately.',
    originalSnippet: 'Scan QR and input PIN to approve incoming refund of ₹8,500.'
  },
  {
    id: 'case-104',
    title: 'Artisan Terracotta Pottery Store Order',
    platform: 'Online Marketplace',
    scamCategory: 'Legitimate Commercial Order',
    riskLevel: 'LOW',
    riskScore: 8,
    date: '01 Sep 2026',
    sellerHandle: '@mati_creations',
    savedLossEstimate: '₹0 (Safe Order)',
    status: 'Under Review',
    notes: 'Legitimate merchant order with verified Razorpay checkout, active GSTIN, and open-box COD.',
    originalSnippet: 'Check our verified catalog on maticreations.in with official Razorpay COD and zero advance.'
  }
];

export const SAFETY_CHECKLIST_QUESTIONS = [
  {
    id: 'q1',
    question: 'Is the seller asking for money to be sent to a personal UPI ID (e.g. name@okaxis) rather than an official merchant checkout?',
    riskWeight: 25,
    warningIfYes: 'Personal UPI IDs have zero merchant dispute resolution or chargeback protection.'
  },
  {
    id: 'q2',
    question: 'Are they demanding an "advance token", "courier fee", or "insurance deposit" before sending Cash on Delivery?',
    riskWeight: 30,
    warningIfYes: 'Advance token requests for COD are the #1 social commerce scam pattern in India.'
  },
  {
    id: 'q3',
    question: 'Did they send a QR code or link saying you must "Enter your UPI PIN to receive money/refund"?',
    riskWeight: 40,
    warningIfYes: 'UPI PIN is strictly for PAYING money out. Entering your PIN NEVER credits money to you.'
  },
  {
    id: 'q4',
    question: 'Does the website use an unusual free domain extension (like .xyz, .top, .live, .click) instead of .in or .com?',
    riskWeight: 25,
    warningIfYes: 'Phishing delivery portals and fake clone shops overwhelmingly use disposable cheap TLDs.'
  },
  {
    id: 'q5',
    question: 'Is the seller using high-pressure urgency ("Offer expires in 15 mins", "Only 1 piece left, pay now")?',
    riskWeight: 20,
    warningIfYes: 'Artificial time scarcity is a classic psychological manipulation to prevent careful verification.'
  }
];

export const DEFENSE_TEMPLATES = [
  {
    id: 'tpl-1',
    title: 'Demand Official Cash on Delivery with Open Box',
    description: 'Use when a seller insists on advance courier token for COD.',
    text: `I prefer standard Cash on Delivery with open-box verification upon delivery, as recommended for social commerce purchases. I do not pay advance tokens or courier insurance fees to personal UPI IDs. If you have an official merchant gateway (e.g., Razorpay/Cashfree), please share the verified link.`
  },
  {
    id: 'tpl-2',
    title: 'Request GSTIN & Registered Business Details',
    description: 'Use to verify if an Instagram or WhatsApp seller is a real business.',
    text: `Before completing the transfer, please share your registered business name and 15-digit GSTIN number so I can verify your registration on the GST portal. We do direct bank transfers only to registered business current accounts.`
  },
  {
    id: 'tpl-3',
    title: 'Reject "Scan QR to Receive Refund" Trap',
    description: 'Use when someone sends a QR code or asks for UPI PIN to "send" you a refund.',
    text: `Entering a UPI PIN is only used for debiting money, not receiving funds. RBI and NPCI guidelines state that no PIN is required to receive money. If you wish to send a refund, you can transfer directly to my UPI VPA without any QR code or PIN approval.`
  }
];
