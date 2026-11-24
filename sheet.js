
// Environment variables di Vercel:
// APPS_SCRIPT_URL
// APPS_SCRIPT_TOKEN
// APP_PIN

export default async function handler(req, res) {
  // Hanya menerima POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed'
    });
  }

  // Validasi PIN aplikasi
  const pin = process.env.APP_PIN;

  if (!pin || req.headers['x-pin'] !== pin) {
    return res.status(401).json({
      ok: false,
      error: 'PIN salah'
    });
  }

  // Validasi konfigurasi Apps Script
  const scriptUrl = process.env.APPS_SCRIPT_URL;
  const scriptToken = process.env.APPS_SCRIPT_TOKEN;

  if (!scriptUrl || !scriptToken) {
    return res.status(500).json({
      ok: false,
      error: 'Konfigurasi Apps Script belum lengkap'
    });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        ...req.body,
        token: scriptToken
      }),
      redirect: 'follow'
    });

    // Ambil respons dari Apps Script
    const responseText = await response.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        'Respons Apps Script bukan JSON yang valid. Periksa URL deployment dan konfigurasi Apps Script.'
      );
    }

    // Teruskan hasil dari Apps Script ke frontend
    return res.status(200).json(result);

  } catch (error) {
    console.error('Job Tracker API Error:', error);

    return res.status(500).json({
      ok: false,
      error: error.message || 'Terjadi kesalahan pada server'
    });
  }
}
