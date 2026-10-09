// One-time local Studio setup; accepts a management-capable token over hidden stdin.
process.stdin.setEncoding('utf8');
if (process.stdin.isTTY) process.stdin.setRawMode(true);
console.log('Ready for Sanity token on stdin (input is hidden).');
const token = await new Promise((resolve) => {
  let value = '';
  process.stdin.on('data', function handler(chunk) {
    value += chunk;
    if (/[\r\n]/.test(value)) {
      process.stdin.off('data', handler);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve(value.trim());
    }
  });
  process.stdin.resume();
});
const endpoint = 'https://api.sanity.io/v2026-10-01/projects/svrzh6fe/cors';
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const response = await fetch(endpoint, { headers });
if (!response.ok) {
  console.log(
    `CORS management unavailable with this credential (${response.status}). Configure origins in Sanity Manage.`,
  );
  process.exitCode = 1;
} else {
  const result = await response.json();
  const entries = Array.isArray(result) ? result : result.origins || [];
  if (entries.some((entry) => entry.origin === 'http://localhost:3000' && entry.allowCredentials)) {
    console.log('Local Studio CORS already configured.');
  } else {
    const write = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ origin: 'http://localhost:3000', allowCredentials: true }),
    });
    console.log(
      write.ok
        ? 'Local Studio CORS configured.'
        : `CORS update unavailable (${write.status}). Configure origins in Sanity Manage.`,
    );
  }
}
