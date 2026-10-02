#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { browsers, buildUsername, FormatError, formatProxy, generateBulk, type BrowserId, type ProxyEndpoint, type Targeting } from './index.js';

if (process.argv.includes('--help')) {
  process.stdout.write('Read a JSON object from stdin: {browser, proxy: {host, port, username, password, protocol}, prefix?, count?, targeting?}. Optional prefix/count generates bulk sessions. Credentials stay local. Output contains credentials; keep it private.\n');
} else {
  try {
    // Credentials are intentionally stdin-only, so they do not enter shell history or process arguments.
    const input = readFileSync(0, 'utf8');
    if (Buffer.byteLength(input) > 16384) throw new Error('Input is too large.');
    const request = JSON.parse(input) as { browser: BrowserId; proxy: ProxyEndpoint; prefix?: string; count?: number; targeting?: Targeting };
    if (!browsers.some(browser => browser.id === request.browser)) throw new Error('Choose a supported browser.');
    if (request.targeting && !request.proxy.username) throw new FormatError('username', 'Targeting needs a proxy username and password.');
    const output = request.count !== undefined
      ? generateBulk(request.proxy, request.browser, request.prefix ?? '', request.count, request.targeting).batches.map(batch => batch.join('\n'))
      : formatProxy(request.targeting && request.proxy.username ? { ...request.proxy, username: buildUsername(request.proxy.username, request.targeting) } : request.proxy, request.browser);
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  } catch (error) {
    // JSON syntax errors may quote credential-bearing input; never forward parser errors.
    process.stderr.write(error instanceof SyntaxError ? 'Invalid JSON input.\n' : error instanceof Error && error.name === 'FormatError' ? error.message + '\n' : 'Invalid request. Use --help for the input schema.\n');
    process.exitCode = 1;
  }
}
