// Env vars di Vercel: APPS_SCRIPT_URL, APPS_SCRIPT_TOKEN, APP_PIN
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  if (req.headers['x-pin'] !== process.env.APP_PIN) return res.status(401).json({ ok: false, error: 'PIN salah' });
  try {
    const r = await fetch(process.env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ ...req.body, token: process.env.APPS_SCRIPT_TOKEN }),
      redirect: 'follow',
    });
    res.status(200).json(await r.json());
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
