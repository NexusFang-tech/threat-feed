# Live Threat Feed Dashboard

**Live:** [nexusfang-tech.github.io/threat-feed](https://nexusfang-tech.github.io/threat-feed)

Real-time threat intelligence dashboard powered by AbuseIPDB's global blacklist. Displays a live confidence-tiered IP feed, attack category breakdown with animated bars, origin country statistics, and a global threat level meter — all with a vaporwave cybersecurity aesthetic.

## Features

- **Live IP threat feed** — Pulls recently reported malicious IPs with confidence scores, categories, and country of origin
- **Confidence tiering** — Color-coded severity based on AbuseIPDB confidence percentage (Critical 90%+, High 70%+, Medium 40%+, Low)
- **Attack category breakdown** — Visual distribution of attack types (brute force, port scan, web attack, DDoS, etc.)
- **Country stats** — Top attacking countries by report volume
- **Threat level meter** — Animated gauge reflecting current global threat activity
- **Serverless proxy** — Netlify Functions backend to protect the API key and cache responses hourly to preserve quota

## Tech Stack

`Vanilla JS` · `Netlify Functions` · `AbuseIPDB API` · `Node.js` · `HTML Canvas` · `CSS`

## Repo Description

> Real-time threat intelligence dashboard pulling AbuseIPDB's global blacklist with confidence-tiered IP feed, attack category breakdown, origin country stats, and animated threat level meter. Netlify serverless proxy with hourly caching.
