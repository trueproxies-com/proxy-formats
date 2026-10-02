# TrueProxies proxy formats

Dependency-free TypeScript library and stdin-only CLI for documented anti-detect browser proxy layouts. No network calls or credential storage. Protocol and port are preserved. Output contains credentials: keep it private.

[Online formatter and checker](https://trueproxies.com/tools/proxy-checker/) · [Browser setup guides](https://trueproxies.com/integrations/anti-detect-browsers/)

## Library

Build with `npm run build`. Exports: `formatProxy`, `proxyUrl`, `buildUsername`, `generateBulk`, `browsers`, `FormatError`, with TypeScript declarations.

```ts
import { formatProxy, generateBulk } from '@trueproxies/proxy-formats';
const proxy = {
  host: 'proxy.example.invalid', port: 1080, protocol: 'socks5',
  username: 'demouser0001-country-us', password: 'example-only',
} as const;
const formats = formatProxy(proxy, 'gologin');
const { batches } = generateBulk(proxy, 'morelogin', 'profile', 200);
```

`buildUsername(username, targeting)` requires the 12-character TrueProxies base username. It preserves unspecified options, replaces supplied ones, and removes an option supplied as an empty string. Country: two-letter code (`gb`, not `uk`). Region: subdivision without country prefix (`ca`, not `us-ca`). City: 1–32 letters/numbers/underscores. ASN: positive 32-bit integer. Session: 1–32 letters/numbers. Lifetime: 60–86400 seconds, requires a session; your service may impose a lower maximum. Setting a session removes `rotate`.

Bulk generation requires username/password credentials, creates 1–200 sequential session IDs and splits MoreLogin lists at 100 lines and Multilogin lists at 25. Names are included for AdsPower, Dolphin Anty and GoLogin. Separate session IDs request best-effort sessions; they do not guarantee different exits or uninterrupted stickiness.

Use your service's port. TrueProxies: HTTP 8080, TLS-to-proxy HTTPS 8443, SOCKS5 1080. A vendor's HTTPS label does not establish TLS-to-proxy support. Dolphin Anty has no HTTPS type. Generic URLs preserve SOCKS5H; vendor layouts use SOCKS5, with DNS behavior configured in the browser.

## CLI

Build, then `node dist/cli.js --help`. Supply JSON through stdin to avoid credentials in arguments or shell history. Placeholder example:

```sh
node dist/cli.js <<'JSON'
{"browser":"gologin","proxy":{"host":"proxy.example.invalid","port":1080,"protocol":"socks5","username":"demouser0001","password":"example-only"},"prefix":"profile","count":10,"targeting":{"country":"us"}}
JSON
```

Without `count`: labeled format objects. With `count`: newline-separated import batches. Optional `targeting` applies in either mode. Input cap: 16 KiB. Errors omit submitted credentials. Do not commit or upload real output.

## Format sources

Official documentation checked 1 October 2026. These are documented layouts, not claims of native-app acceptance. IPv6, transport, plan availability and batch import need confirmation in the actual browser. Ambiguous credential delimiters, percent signs and backslashes fail for raw importers; use separate fields. Generic URLs and Kameleo encode credentials. Mobile proxy change URLs are not generated.

| Browser ID | Output and guidance | Official source |
|---|---|---|
| `generic` | URL; safe host-first/auth-first | Standard URL encoding |
| `adspower` | Host-first; bulk `{remark}`; protocol separate | [Profiles](https://help.adspower.com/docs/creating_browser_profiles), [list](https://help.adspower.com/docs/proxy_list) |
| `dolphin-anty` | Host-first/auth-first with optional protocol; bulk names | [Input](https://docs.dolphin-anty.com/en/working-with-proxies/how-to-add-a-proxy-in-dolphin-anty) |
| `gologin` | Host-first; HTTP host-first URL; SOCKS auth-first URL; names | [Manager](https://gologin.com/docs/proxy/proxy-management/adding-proxies) |
| `octo-browser` | Host-first/auth-first/auth-colon with optional protocol; bulk explicit protocol | [Single](https://docs.octobrowser.net/en/proxy/temp-proxy/), [bulk](https://docs.octobrowser.net/en/proxy/bulk-add/) |
| `morelogin` | Protocol-prefixed host-first/auth-first; 100 per batch; raw IPv6 rejected | [Import](https://support.morelogin.com/en/articles/10204324-add-proxy) |
| `multilogin` | Host-first; protocol separate; 25 per batch | [Formats](https://multilogin.com/help/en_US/http-and-socks-proxies) |
| `incogniton` | Host-first; protocol separate | [Management](https://docs.incogniton.com/proxy-management/integrating-proxies) |
| `kameleo` | Encoded auth-first; confirm detected protocol; text-list import unverified | [Strings](https://help.kameleo.io/article/53-supported-proxy-connection-strings), [manager](https://help.kameleo.io/article/62-built-in-proxy-manager) |
| `dicloak` | Host-first; plan-dependent bulk | [Input](https://help.dicloak.com/configuring-proxy302-proxy/), [bulk](https://help.dicloak.com/bulk-operations-for-proxy-list/) |
| `bitbrowser` | Host-first; use actual import template/type fields | [Protocols](https://doc.bitbrowser.net/help1/proxy/http-https-sock5-ssh), [manager](https://doc.bitbrowser.net/help1/proxy/proxy-ip-management) |
| `ixbrowser` | Host-first; 200 per batch; HTTP default, set SOCKS5 explicitly | [Import](https://www.ixbrowser.com/blog-detail/288/) |
| `geelark` | Protocol-prefixed host-first | [Import](https://help.geelark.com/Proxies-7fc88fa5ead344ff8b975cddf51592a9) |

Use a password with AdsPower targeting: credential-free import can drop the username. This package does not route proxies, validate connectivity or call vendor APIs.

## Recorded observations

[Sanitized native-browser CSVs](observations/README.md) preserve 58 recorded rows for AdsPower, Dolphin Anty, GoLogin and Incogniton, including failures, retries, missing cells and DNS review flags. They are limited observations, not acceptance of the full seven-browser matrix. Incogniton's built-in check metadata is separated from actual browser measurements. The data is available in the repository and is excluded from the npm package.

MIT. Vendor names identify input compatibility; no affiliation is implied.
