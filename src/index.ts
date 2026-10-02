export const browsers = [
  { id: 'generic', name: 'Generic', batchSize: 200 },
  { id: 'adspower', name: 'AdsPower', batchSize: 200 },
  { id: 'dolphin-anty', name: 'Dolphin Anty', batchSize: 200 },
  { id: 'gologin', name: 'GoLogin', batchSize: 200 },
  { id: 'octo-browser', name: 'Octo Browser', batchSize: 200 },
  { id: 'morelogin', name: 'MoreLogin', batchSize: 100 },
  { id: 'multilogin', name: 'Multilogin', batchSize: 25 },
  { id: 'incogniton', name: 'Incogniton', batchSize: 200 },
  { id: 'kameleo', name: 'Kameleo', batchSize: 200 },
  { id: 'dicloak', name: 'DICloak', batchSize: 200 },
  { id: 'bitbrowser', name: 'BitBrowser', batchSize: 200 },
  { id: 'ixbrowser', name: 'ixBrowser', batchSize: 200 },
  { id: 'geelark', name: 'GeeLark', batchSize: 200 },
] as const;

export type BrowserId = typeof browsers[number]['id'];
export type Protocol = 'http' | 'https' | 'socks5' | 'socks5h';
export type ProxyEndpoint = { host: string; port: number; username?: string; password?: string; protocol: Protocol };
export type Targeting = { country?: string; region?: string; city?: string; asn?: string; session?: string; lifetime?: string };
export type ProxyFormat = { id: string; label: string; value: string; note?: string };

export class FormatError extends Error {
  constructor(readonly field: string, message: string) {
    super(message);
    this.name = 'FormatError';
  }
}

const countries = new Set(('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW XK').split(' '));
const targetKeys = ['country', 'region', 'city', 'asn', 'session', 'lifetime'] as const;

/** Preserve the base and existing options; replace keys explicitly supplied by the caller. */
export function buildUsername(username: string, changes: Targeting): string {
  if (!username || /[\s:@/\u0000-\u001f\u007f]/u.test(username)) {
    throw new FormatError('username', 'Enter a proxy username without spaces or delimiters.');
  }
  const [base, ...tokens] = username.split('-');
  if (!/^[a-z0-9]{12}$/i.test(base)) throw new FormatError('username', 'Use your 12-character TrueProxies base username for targeting or session generation.');
  const values = new Map<string, string>();
  for (let i = 0; i < tokens.length; i += 2) {
    const key = tokens[i].toLowerCase();
    if (key === 'rotate') {
      if (values.has(key)) throw new FormatError('username', 'Remove repeated targeting options from the username.');
      values.set(key, '');
      i -= 1;
      continue;
    }
    if (!(targetKeys as readonly string[]).includes(key) || !tokens[i + 1] || values.has(key)) {
      throw new FormatError('username', 'Enter the base username or a username with valid, unrepeated targeting options.');
    }
    values.set(key, tokens[i + 1]);
  }
  for (const key of targetKeys) {
    if (changes[key] !== undefined) {
      const value = changes[key]!.trim();
      if (value) values.set(key, value); else values.delete(key);
    }
  }
  if (changes.session) values.delete('rotate');
  const country = values.get('country');
  if (country && !countries.has(country.toUpperCase())) throw new FormatError('country', 'Use a two-letter country code, such as us or gb.');
  const region = values.get('region');
  if (region && !/^[a-z0-9]{1,3}$/i.test(region)) throw new FormatError('region', 'Use a subdivision code without its country prefix, such as ca.');
  const city = values.get('city');
  if (city && !/^[a-z0-9_]{1,32}$/i.test(city)) throw new FormatError('city', 'Use 1–32 letters, numbers or underscores for the city.');
  const asn = values.get('asn');
  if (asn && (!/^\d{1,10}$/.test(asn) || Number(asn) < 1 || Number(asn) > 4294967295)) throw new FormatError('asn', 'Use an ASN from 1 to 4294967295, with digits only.');
  const session = values.get('session');
  if (session && !/^[a-z0-9]{1,32}$/i.test(session)) throw new FormatError('session', 'Use 1–32 letters or numbers for the session ID.');
  if (session && values.has('rotate')) throw new FormatError('session', 'Remove rotate when using a session ID.');
  const lifetime = values.get('lifetime');
  if (lifetime && (!/^\d+$/.test(lifetime) || Number(lifetime) < 60 || Number(lifetime) > 86400)) throw new FormatError('lifetime', 'Use a session lifetime from 60 to 86400 seconds.');
  if (lifetime && !session) throw new FormatError('session', 'Add a session ID when setting a session lifetime.');
  const suffix = targetKeys.flatMap(key => values.has(key) ? [key, ['country', 'region', 'city'].includes(key) ? values.get(key)!.toLowerCase() : values.get(key)!] : []);
  if (values.has('rotate')) suffix.push('rotate');
  return [base, ...suffix].join('-');
}

export function validateEndpoint(proxy: ProxyEndpoint): void {
  if (!proxy || typeof proxy.host !== 'string' || !/^[a-z0-9.:-]{1,253}$/i.test(proxy.host) || proxy.host.startsWith('-') || proxy.host.endsWith('-')) {
    throw new FormatError('host', 'Enter a host without a protocol, path or brackets.');
  }
  if (!Number.isInteger(proxy.port) || proxy.port < 1 || proxy.port > 65535) throw new FormatError('port', 'Use a port from 1 to 65535.');
  try { new URL(`http://${proxy.host.includes(':') ? `[${proxy.host}]` : proxy.host}:${proxy.port}`); } catch { throw new FormatError('host', 'Enter a valid hostname, IPv4 address or IPv6 address.'); }
  if (!['http', 'https', 'socks5', 'socks5h'].includes(proxy.protocol)) throw new FormatError('protocol', 'Select HTTP, HTTPS or SOCKS5.');
  if (Boolean(proxy.username) !== Boolean(proxy.password)) throw new FormatError('password', 'Enter both the proxy username and password, or leave both empty for trusted IP authentication.');
  for (const key of ['username', 'password'] as const) {
    const value = proxy[key];
    if (value !== undefined && (typeof value !== 'string' || value.length > 255 || /[\u0000-\u001f\u007f]/u.test(value))) throw new FormatError(key, 'Remove control characters and use at most 255 characters.');
  }
}

export function proxyUrl(proxy: ProxyEndpoint): string {
  validateEndpoint(proxy);
  const host = proxy.host.includes(':') ? `[${proxy.host}]` : proxy.host;
  const auth = proxy.username ? `${encodeURIComponent(proxy.username)}:${encodeURIComponent(proxy.password!)}@` : '';
  return `${proxy.protocol}://${auth}${host}:${proxy.port}`;
}

/** Only documented layouts; ambiguous delimiter-bearing fields fail instead of being rewritten. */
export function formatProxy(proxy: ProxyEndpoint, browser: BrowserId, name?: string): ProxyFormat[] {
  validateEndpoint(proxy);
  if (!browsers.some(item => item.id === browser)) throw new FormatError('browser', 'Choose a supported browser.');
  if (name && !/^[a-z0-9]{1,32}$/i.test(name)) throw new FormatError('name', 'Use 1–32 letters or numbers for the proxy name.');
  const protocol = proxy.protocol === 'socks5h' ? 'socks5' : proxy.protocol;
  const host = proxy.host.includes(':') ? `[${proxy.host}]` : proxy.host;
  const endpoint = `${host}:${proxy.port}`;
  const auth = proxy.username ? `${proxy.username}:${proxy.password}` : '';
  const colon = auth ? `${endpoint}:${auth}` : endpoint;
  const authFirst = auth ? `${auth}@${endpoint}` : endpoint;
  const fields = [proxy.host, proxy.username ?? '', proxy.password ?? ''];
  const rawSafe = !fields.some(value => /[\s:%@/?#[\]{}\\]/u.test(value));
  const hasRawCredentialDelimiter = [proxy.username ?? '', proxy.password ?? ''].some(value => /[\s:%@/?#[\]{}\\]/u.test(value));
  const selectProtocol = `Select ${protocol.toUpperCase()} separately in the browser. Port ${proxy.port} is preserved from your input.`;
  const row = (id: string, label: string, value: string, note?: string): ProxyFormat => ({ id, label, value, note });
  const uri = row('uri', 'Protocol URL', proxyUrl(proxy));
  if (browser === 'generic') return [uri, ...(rawSafe ? [row('host-first', 'Host:port:username:password', colon), row('auth-first', 'Username:password@host:port', authFirst)] : [])];
  if (browser === 'kameleo') return [row('auth-first', 'Username:password@host:port', uri.value.slice(uri.value.indexOf('://') + 3), 'Confirm the proxy type after pasting; Kameleo detects it by port.')];
  if (hasRawCredentialDelimiter || (browser === 'morelogin' && !rawSafe)) {
    throw new FormatError('credentials', 'This browser’s text importer cannot safely represent these delimiters. Use its separate host, port, username and password fields.');
  }
  if (browser === 'dolphin-anty' && protocol === 'https') throw new FormatError('protocol', 'Dolphin Anty has no HTTPS proxy type. Use HTTP with port 8080 or SOCKS5 with port 1080.');
  const hostFirst = row('host-first', auth ? 'Host:port:username:password' : 'Host:port', colon, selectProtocol);
  const schemeColon = row('protocol-host-first', auth ? 'Protocol://host:port:username:password' : 'Protocol://host:port', `${protocol}://${colon}`);
  const plainAuth = row('auth-first', auth ? 'Username:password@host:port' : 'Host:port', authFirst, selectProtocol);
  const schemeAuth = row('protocol-auth-first', auth ? 'Protocol://username:password@host:port' : 'Protocol://host:port', `${protocol}://${authFirst}`);
  if (browser === 'adspower') return [hostFirst, ...(name ? [row('remark', 'Proxy list with remark', `${colon}{${name}}`, selectProtocol)] : [])];
  if (browser === 'dolphin-anty') return [hostFirst, ...(auth ? [plainAuth] : []), schemeColon, ...(auth ? [schemeAuth] : []), ...(name ? [row('named', 'Protocol and proxy name', `${protocol}://${colon}:${name}`)] : [])];
  if (browser === 'gologin') return [hostFirst, ...(protocol === 'http' ? [schemeColon, ...(name ? [row('named', 'HTTP and proxy name', `${protocol}://${colon}:${name}`)] : [])] : [schemeAuth, ...(name ? [row('named', 'Protocol and proxy name', `${protocol}://${authFirst}:${name}`)] : [])])];
  if (browser === 'octo-browser') return [hostFirst, ...(auth ? [plainAuth, row('auth-colon', 'Username:password:host:port', `${auth}:${endpoint}`, selectProtocol)] : []), schemeColon, ...(auth ? [schemeAuth, row('protocol-auth-colon', 'Protocol://username:password:host:port', `${protocol}://${auth}:${endpoint}`)] : [])];
  if (browser === 'morelogin') return [schemeColon, ...(auth ? [schemeAuth] : [])];
  if (browser === 'geelark') return [schemeColon];
  return [hostFirst];
}

export function bulkFormatId(browser: BrowserId): string {
  if (browser === 'adspower') return 'remark';
  if (browser === 'dolphin-anty' || browser === 'gologin') return 'named';
  if (browser === 'generic') return 'uri';
  if (browser === 'kameleo') return 'auth-first';
  if (['octo-browser', 'morelogin', 'geelark'].includes(browser)) return 'protocol-host-first';
  return 'host-first';
}

/** Unique session IDs request separate best-effort sessions; exits may still coincide. */
export function generateBulk(proxy: ProxyEndpoint, browser: BrowserId, prefix: string, count: number, targeting: Targeting = {}): { lines: string[]; batches: string[][]; endpoints: ProxyEndpoint[] } {
  if (!Number.isInteger(count) || count < 1 || count > 200) throw new FormatError('count', 'Generate from 1 to 200 lines.');
  if (!/^[a-z0-9]+$/i.test(prefix) || prefix.length + Math.max(2, String(count).length) > 32) throw new FormatError('prefix', 'Use letters and numbers for the prefix; prefix plus the sequence must fit in 32 characters.');
  if (!proxy.username || !proxy.password) throw new FormatError('username', 'Bulk session generation needs a proxy username and password.');
  const endpoints = Array.from({ length: count }, (_, index) => ({ ...proxy, username: buildUsername(proxy.username!, { ...targeting, session: prefix + String(index + 1).padStart(2, '0') }) }));
  const id = bulkFormatId(browser);
  const lines = endpoints.map(endpoint => formatProxy(endpoint, browser, endpoint.username!.split('-session-')[1].split('-')[0]).find(format => format.id === id)!.value);
  const size = browsers.find(item => item.id === browser)!.batchSize;
  const batches = Array.from({ length: Math.ceil(lines.length / size) }, (_, index) => lines.slice(index * size, (index + 1) * size));
  return { lines, batches, endpoints };
}
