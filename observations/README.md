# Recorded browser observations

These CSVs export the limited native-browser observations recorded for TrueProxies on 1 October 2026. They are manually recorded observations, not automated test fixtures or a completed compatibility matrix.

| CSV | Recorded rows | Protocol rows | Distinct source labels |
|---|---:|---|---:|
| [AdsPower](adspower-2026-10-01.csv) | 10 | 10 HTTP 8080 | 10 |
| [Dolphin Anty](dolphin-anty-2026-10-01.csv) | 12 | 7 HTTP 8080; 5 SOCKS5 1080 | 7 |
| [GoLogin](gologin-2026-10-01.csv) | 6 | 3 HTTP 8080; 3 SOCKS5 1080 | 6 |

Profile labels are anonymized separately in each file, in source order. A distinct label is not proof of a simultaneously running profile or a separate physical profile. Repeated Dolphin labels retain protocol changes and retry observations; initial errors remain visible. No new runs were added to fill missing cells.

Empty cells mean not recorded. `geo_match` was not recorded in these source CSVs and stays empty. Country and city describe the observed exit, not the requested target. A check marked `pass` describes the recorded connection check; it does not establish every other column, continuous connectivity, or browser-wide privacy.

WebRTC observations cover eight AdsPower rows and one row each for Dolphin and GoLogin. “No indicator” means no unexpected address was recorded in that observation, not a guarantee against leaks. DNS evidence is mixed or unavailable, and WARP was active during the recorded work. Off-country resolver review flags are retained; they neither prove a leak nor establish DNS privacy. The AdsPower before/after DNS note is a historical observation whose two states are not independently timestamped here.

`load_ms` and `dcl_ms` retain available source values only. They are uncontrolled individual page-load observations, not ten-run medians or comparable speed benchmarks. No speed result is recorded for Dolphin or GoLogin.

These files do not establish TLS-to-proxy HTTPS 8443, IPv6, the required 0/1/4/24-hour in-profile session hold, all import variants, vendor APIs, second-network recovery, or the full error matrix. Octo Browser, MoreLogin, Multilogin and Incogniton have no recorded observations in this export. Consult the [setup guides](https://trueproxies.com/integrations/anti-detect-browsers/) for their current evidence limits.

Credentials, proxy hosts, exit addresses and original profile labels are excluded. Original free-text notes are omitted to avoid publishing identifiers or credentials. Non-address observation fields are retained without upgrading their verdicts. These observations are offered under the repository's MIT license.
