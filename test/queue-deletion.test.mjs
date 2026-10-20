import assert from 'node:assert/strict';
import test from 'node:test';
import { SonarrClient, RadarrClient } from '../dist/arr-client.js';

for (const Client of [SonarrClient, RadarrClient]) {
  test(`${Client.name}: DELETE defaults, explicit false, empty/JSON responses and failures`, async (t) => {
    const calls = [];
    let response = new Response(null, { status: 204 });
    t.mock.method(globalThis, 'fetch', async (url, options) => {
      calls.push({ url: new URL(url), options });
      return response;
    });
    const client = new Client({ url: 'http://example.invalid', apiKey: 'test-key' });
    await client.deleteQueueItem(42);
    assert.equal(calls[0].url.pathname, '/api/v3/queue/42');
    assert.equal(calls[0].options.method, 'DELETE');
    assert.equal(calls[0].options.headers['X-Api-Key'], 'test-key');
    assert.deepEqual(Object.fromEntries(calls[0].url.searchParams), {
      removeFromClient: 'true', blocklist: 'false', skipRedownload: 'false',
    });
    response = new Response('', { status: 200 });
    await client.deleteQueueItem(42, { removeFromClient: false, blocklist: true, skipRedownload: true });
    assert.deepEqual(Object.fromEntries(calls[1].url.searchParams), {
      removeFromClient: 'false', blocklist: 'true', skipRedownload: 'true',
    });
    response = Response.json({});
    await client.deleteQueueItem(42);
    for (const status of [404, 500]) {
      response = new Response('private upstream details', { status });
      const before = calls.length;
      await assert.rejects(client.deleteQueueItem(42), (error) => {
        assert.match(error.message, /not confirmed/);
        assert.doesNotMatch(error.message, /private upstream details/);
        return true;
      });
      assert.equal(calls.length, before + 1, 'never retry a DELETE');
    }
    const before = calls.length;
    for (const id of [undefined, null, '42', '../movie/42', 0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      await assert.rejects(client.deleteQueueItem(id), /queueId/);
    }
    for (const field of ['removeFromClient', 'blocklist', 'skipRedownload']) {
      for (const value of ['false', 1, null]) {
        await assert.rejects(client.deleteQueueItem(42, { [field]: value }), /boolean/);
      }
    }
    assert.equal(calls.length, before, 'invalid inputs must never reach the API');
  });
}

test('MCP exposes and routes both queue deletion tools', async () => {
  const { createServer } = await import('node:http');
  const { once } = await import('node:events');
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');
  const calls = [];
  const upstream = createServer((req, res) => {
    calls.push({ method: req.method, url: req.url });
    res.writeHead(204).end();
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const url = `http://127.0.0.1:${upstream.address().port}`;
  const transport = new StdioClientTransport({
    command: process.execPath, args: ['dist/index.js'],
    env: { ...process.env, MCP_TRANSPORT: 'stdio', SONARR_URL: `${url}/sonarr`, SONARR_API_KEY: 'test', RADARR_URL: `${url}/radarr`, RADARR_API_KEY: 'test' },
    stderr: 'pipe',
  });
  const client = new Client({ name: 'queue-test', version: '1.0.0' });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    for (const service of ['sonarr', 'radarr']) {
      const name = `${service}_delete_queue_item`;
      const tool = tools.find(tool => tool.name === name);
      assert.ok(tool);
      assert.equal(tool.annotations.destructiveHint, true);
      const result = await client.callTool({ name, arguments: { queueId: 42 } });
      assert.ok(!result.isError);
      assert.equal(JSON.parse(result.content[0].text).success, true);
      assert.deepEqual(calls.at(-1), { method: 'DELETE', url: `/${service}/api/v3/queue/42?removeFromClient=true&blocklist=false&skipRedownload=false` });
      const before = calls.length;
      const invalid = await client.callTool({ name, arguments: { queueId: 'bad' } });
      assert.equal(invalid.isError, true);
      assert.equal(calls.length, before);
    }
  } finally {
    await client.close();
    upstream.close();
  }
});
