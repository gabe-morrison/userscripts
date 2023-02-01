// ==UserScript==
// @name        crediblebh/attach.js
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/common/add_attachment.asp*
// @grant       none
// @version     1.0
// @author      -
// @description 1/27/2023, 8:56:24 AM
// ==/UserScript==




const fileInput = document.getElementById('cwfileinput');
const textInput = document.querySelector('input[type="text"]');

const predictFolder = () => {
  const admissionRegex = new RegExp(['Referral'].join('|', 'i'));
  const assessmentRegex = new RegExp(['Stressful Events'].join('|', 'i'));
  const financialRegex = new RegExp(['Benefit', 'SSI', 'Financial', 'SNAP', 'Energy', 'Asst', 'Payee', 'Deposit', 'Account', 'MSA', 'GA ', 'EAP ', 'GRH'].join('|', 'i'));
  const hospitalRegex = new RegExp(['Disch', 'Regions', 'United', 'Abbott', 'Mercy', 'Admis', 'ANW'].join('|', 'i'));
  const housingRegex = new RegExp(['Lease', 'Housing', 'DSP', 'Dale', 'PHA', 'Inspection', 'Rent', 'Subsidy', 'Apartment', 'Unit', 'Section 8', 'Sect 8', 'MHR'].join('|', 'i'));;
  const labsRegex = new RegExp(['CBC', 'Lipid', 'Panel', 'Lab', 'A1C'].join('|', 'i'));
  const legalRegex = new RegExp(['Order', 'Commitment', 'PD', 'Petition', 'PPS', 'SSID', 'Recommit', 'Extension', 'Rule 20', "Waiver", 'Revocation', 'Court', 'NTP',
                                 'Affidavit', 'Examiner', '60-90', '6090', 'Warrant', 'Appr',].join('|', 'i'));
  const medicalRegex = new RegExp(['Visit', 'AVS', 'Rx', 'Endoc', 'HP', 'Allina', 'Physical', 'Nystrom', 'Scan', ' DA.', 'ology', 'UFM'].join('|', 'i'));
  const correspondenceRegex = new RegExp(['Letter', 'Email', 'Messages'].join('|', 'i'));
  const roiRegex = new RegExp(['ROI', 'Release'].join('|', 'i'));
  const vocRegex = new RegExp(['job', 'work'].join('|', 'i'));
  const regexObj = {
    'admission': admissionRegex,
    'assessment': assessmentRegex,
    'financial': financialRegex,
    'hospital': hospitalRegex,
    'housing': housingRegex,
    'labs': labsRegex,
    'legal': legalRegex,
    'medical': medicalRegex,
    'correspondence': correspondenceRegex,
    'roi': roiRegex,
    'voc': vocRegex
  };
	for (const [key, reg] of Object.entries(regexObj)) {
    if (reg.test(textInput.value)) {
       switch (key) {
         case 'admission':
           return 53;
         case 'assessment':
           return 172;
         case 'financial':
           return 54;
         case 'hospital':
           return 55;
         case 'housing':
           return 56;
         case 'labs':
           return 57;
         case 'legal':
           return 58;
         case 'medical':
           return 59;
         case 'correspondence':
           return 60;
         case 'roi':
           return 68;
         case 'voc':
           return 62;
         default:
           return 11;
       }
    }
  }
  return 11;
}

fileInput.addEventListener('change', () => {
	textInput.value = document.querySelector('p.name').textContent;
	document.querySelector('input[type="checkbox"]').checked = true;
  document.querySelector('select').value = predictFolder();
})





