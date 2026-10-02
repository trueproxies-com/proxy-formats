# Recorded browser observations

These CSVs export limited native-browser observations recorded for TrueProxies on 1–2 October 2026. They are manually recorded observations, not automated test fixtures or a completed compatibility matrix.

| CSV | Recorded rows | Protocol rows | Distinct source labels |
|---|---:|---|---:|
| [AdsPower](adspower-2026-10-01.csv) | 10 | 10 HTTP 8080 | 10 |
| [Dolphin Anty](dolphin-anty-2026-10-01.csv) | 12 | 7 HTTP 8080; 5 SOCKS5 1080 | 7 |
| [GoLogin](gologin-2026-10-01.csv) | 6 | 3 HTTP 8080; 3 SOCKS5 1080 | 6 |
| [Incogniton](incogniton-2026-10-02.csv) | 30 | 10 HTTPS-labelled 8080; 10 HTTPS-labelled 8443; 10 SOCKS5 1080 | 10 |

Profile labels are anonymized separately in each file, in source order. A distinct label is not proof of a simultaneously running profile or a separate physical profile. Repeated Dolphin labels retain protocol changes and retry observations; initial errors remain visible. No new runs were added to fill missing cells.

The next three paragraphs qualify the three 1 October exports. Empty cells mean not recorded. `geo_match` was not recorded in those source CSVs and stays empty. Country and city describe the observed exit, not the requested target. A check marked `pass` describes the recorded connection check; it does not establish every other column, continuous connectivity, or browser-wide privacy.

WebRTC observations cover eight AdsPower rows and one row each for Dolphin and GoLogin. “No indicator” means no unexpected address was recorded in that observation, not a guarantee against leaks. DNS evidence is mixed or unavailable, and WARP was active during the recorded work. Off-country resolver review flags are retained; they neither prove a leak nor establish DNS privacy. The AdsPower before/after DNS note is a historical observation whose two states are not independently timestamped here.

`load_ms` and `dcl_ms` retain available source values only. They are uncontrolled individual page-load observations, not ten-run medians or comparable speed benchmarks. No speed result is recorded for Dolphin or GoLogin.

These files do not establish TLS-to-proxy HTTPS 8443, IPv6, the required 0/1/4/24-hour in-profile session hold, all import variants, vendor APIs, second-network recovery, or the full error matrix. Octo Browser, MoreLogin and Multilogin have no recorded observations in this export. Consult the [setup guides](https://trueproxies.com/integrations/anti-detect-browsers/) for their current evidence limits.

## Incogniton observations

The 2 October rows use Incogniton 5.0.1.2 and Chromium 152.0.7977.54 with the existing Residential IPv4 GB service, not the planned Traffic pack. VPN-off was not established. The preceding WARP and timing qualifications describe the three 1 October exports; they do not substitute for this run's conditions.

All ten built-in checks connected on SOCKS5/1080 and the native HTTPS label with port 8080. All ten port-8443 checks showed `Connection failed`. Four SOCKS5 checks reported a country different from the subsequent browser observation. `reported_check_country`, `reported_timezone` and `reported_ping_ms` preserve native check metadata; `exit_ip_country` and `exit_city` are actual browser results. Blank browser fields on port-check rows mean no browser measurement is assigned to that row.

The ten actual browser observations used nine SOCKS5 profiles and P03's separately saved port-8080 variant after SOCKS5 browser failures. P03's browser fields therefore remain blank on its SOCKS5 check row and appear on its port-8080 row. All requested countries matched; four of five requested cities matched exactly. Three timezone comparisons matched and seven differed; combined language/geolocation acceptance remains unverified. The 13238.5 ms median describes this mixed-protocol legacy-service run only.

WebRTC's `Leak detected` verdict is retained with an important limit: the profiles used Incogniton's Altered mode, and no owner physical-route baseline was established. It does not prove that a physical address leaked. DNS verdicts remain partial or unavailable. A separately recorded session comparison held the same private IPv4 after 63.5 minutes. The actual four-hour browser attempt returned `ERR_CONNECTION_CLOSED`, so no exit comparison was available; the 24-hour comparison remains open. Native `Connected` and a successful browser observation do not prove uninterrupted connectivity or anonymity.

The [separate induced-fault receipt](incogniton-induced-faults-2026-10-02.json) preserves three later checks without changing the thirty baseline rows. Saved fields were reopened and verified before each check. SOCKS5 on 8080 with correct credentials and HTTPS-labelled 8080 with the misspelled `country-usa` option both displayed `Connected`. SOCKS5 on 1080 with a deliberately invalid password displayed `Connection failed`. All three used an unassigned diagnostic library entry. No browser connectivity, authentication or targeting acceptance is inferred, and the checker did not expose an authentication error code.

Credentials, proxy hosts, exit addresses and original profile labels are excluded. Original free-text notes are omitted to avoid publishing identifiers or credentials. Non-address observation fields are retained without upgrading their verdicts. These observations are offered under the repository's MIT license.
