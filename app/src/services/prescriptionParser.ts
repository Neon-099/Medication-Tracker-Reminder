import { type Medication } from '../context/MedicationContext';

export const parsePrescriptionText = (text: string): Partial<Medication> => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const result: Partial<Medication> = {
    riskLevel: 'low',
    status: 'active',
    frequency: 'once',
  };

  // Regex patterns
  // Matches: 10mg, 10 mg, 10-20mg, 5ml, 1 tablet, 1.5 tabs
  const dosageRegex = /(\d+(?:\.\d+)?(?:\s*-\s*\d+(?:\.\d+)?)?)\s*(mg|mcg|g|ml|units|iu|tablets?|capsules?|pills?|tabs?|caps?|oz)/i;
  
  // Matches: once daily, twice a day, q8h, qd, bid, tid, etc.
  const frequencyRegex = /(once|twice|thrice|three times|two times|daily|every \d+\s*h(?:ours)?|q\d+h?|bid|tid|qid|qd|qhs|am|pm|at bedtime|as needed|prn)/i;
  
  // Keywords to identify junk lines when looking for the name
  const junkKeywords = [
    'pharmacy', 'rx', 'date', 'dr.', 'phone', 'tel', 'fax', 'address', 'store', 
    'refill', 'qty', 'tablets', 'capsules', 'discard', 'exp', 'ticket', 'price', 'copy'
  ];
  
  let nameFound = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    // Dosage Detection
    if (!result.dosage) {
      const match = line.match(dosageRegex);
      if (match) {
        // Check if this line is likely just a Quantity line (e.g. "Qty: 30 tablets")
        if (!lowerLine.includes('qty') && !lowerLine.includes('quantity')) {
          result.dosage = match[0];
        }
      }
    }

    // Frequency Detection
    if (frequencyRegex.test(line)) {
      if (lowerLine.includes('twice') || lowerLine.includes('bid') || lowerLine.includes('two times')) {
        result.frequency = 'twice';
      } else if (lowerLine.includes('thrice') || lowerLine.includes('tid') || lowerLine.includes('three times')) {
        result.frequency = 'thrice';
      } else if (lowerLine.match(/daily|once|qd|q24h/)) {
        result.frequency = 'once';
      } else if (lowerLine.match(/every|q\d/)) {
        result.frequency = 'daily'; 
      }
    }

    // Instructions Detection
    if (lowerLine.startsWith('take') || lowerLine.includes('mouth') || lowerLine.includes('food') || lowerLine.includes('water')) {
      result.instructions = line;
    }

    // Name Detection (Heuristic: First line that isn't junk and isn't just numbers)
    if (!nameFound) {
      const isJunk = junkKeywords.some(keyword => lowerLine.includes(keyword)) || /^\d+$/.test(line) || line.length < 3;
      const isDosageLine = dosageRegex.test(line) && line.length < 20; // Short line with dosage is likely not the name

      if (!isJunk && !isDosageLine) {
        // Clean up leading numbers/bullets
        const cleanName = line.replace(/^[\d\-\.\)]+\s+/, '');
        result.name = cleanName;
        nameFound = true;
      }
    }
  }

  return result;
};