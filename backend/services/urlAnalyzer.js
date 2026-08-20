const OFFICIAL_DOMAINS = new Set([
  'apple.com',
  'github.com',
  'google.com',
  'microsoft.com',
  'paypal.com',
  'amazon.com',
  'linkedin.com',
  'mozilla.org',
  'openai.com',
  'whatsapp.com'
].map(domain => domain.trim()));

const SUSPICIOUS_TLDS = new Set(['click', 'country', 'gq', 'icu', 'live', 'monster', 'rest', 'top', 'xyz']);
const SHORTENER_DOMAINS = new Set(['bit.ly', 'cutt.ly', 'is.gd', 'rb.gy', 't.co', 'tinyurl.com']);
const OFFICIAL_BRANDS = ['apple', 'github', 'google', 'microsoft', 'paypal', 'amazon', 'linkedin', 'mozilla', 'openai', 'whatsapp'];

const isSubdomainOf = (hostname, domain) => hostname === domain || hostname.endsWith(`.${domain}`);

function analyzeUrl(parsedUrl) {
  const hostname = parsedUrl.hostname.toLowerCase().replace(/\.$/, '');
  const labels = hostname.split('.');
  const topLevelDomain = labels.at(-1);
  const reasons = [];
  const impersonatedBrand = OFFICIAL_BRANDS.find(brand => hostname.includes(brand) && !isSubdomainOf(hostname, `${brand}.com`) && !isSubdomainOf(hostname, `${brand}.org`));

  if (impersonatedBrand) reasons.push(`The domain appears to impersonate ${impersonatedBrand}.`);

  if (parsedUrl.username || parsedUrl.password) reasons.push('The URL hides a destination behind embedded credentials.');
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) reasons.push('The link uses an IP address instead of a recognizable domain.');
  if (hostname.includes('xn--')) reasons.push('The domain uses punycode, which can disguise lookalike characters.');
  if (SUSPICIOUS_TLDS.has(topLevelDomain)) reasons.push(`The domain uses the high-risk .${topLevelDomain} top-level domain.`);
  if (SHORTENER_DOMAINS.has(hostname)) reasons.push('The link uses a URL shortener, so its final destination is hidden.');
  if (/(login|verify|secure|account|update|confirm|wallet|password|signin|support)/i.test(hostname)) {
    reasons.push('The domain contains a credential or account-action keyword.');
  }
  if (labels.length > 4 || labels.some(label => label.split('-').length > 3)) {
    reasons.push('The domain has an unusually complex subdomain structure.');
  }

  if (reasons.length >= 2 || impersonatedBrand || parsedUrl.username || parsedUrl.password || hostname.includes('xn--')) {
    return {
      link_type: 'malicious',
      risk_level: 'dangerous',
      threat_score: Math.min(100, 75 + reasons.length * 8),
      ai_summary: `Malicious link: ${reasons.join(' ')}`
    };
  }

  if ([...OFFICIAL_DOMAINS].some(domain => isSubdomainOf(hostname, domain)) && reasons.length === 0) {
    return {
      link_type: 'official',
      risk_level: 'safe',
      threat_score: 0,
      ai_summary: 'Official link: the domain matches a recognized official service and no suspicious URL indicators were found.'
    };
  }

  if (reasons.length > 0) {
    return {
      link_type: 'suspicious',
      risk_level: 'warning',
      threat_score: 55,
      ai_summary: `Suspicious link: ${reasons.join(' ')}`
    };
  }

  return {
    link_type: 'unknown',
    risk_level: 'warning',
    threat_score: 35,
    ai_summary: 'Unknown link: this domain is not on the official-domain list, so verify the owner before opening it.'
  };
}

module.exports = { analyzeUrl };