const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return res.status(500).json({
      ok: false,
      error: 'Contact form is not configured.',
    });
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Please fill in your name, email, and message.',
    });
  }

  if (!isEmail(email)) {
    return res.status(400).json({
      ok: false,
      error: 'Please enter a valid email address.',
    });
  }

  const web3FormsResponse = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New portfolio brief from ${name}`,
      from_name: 'Doms.dev Portfolio',
      name,
      email,
      message,
    }),
  });

  const result = await web3FormsResponse.json().catch(() => ({}));

  if (!web3FormsResponse.ok || !result.success) {
    return res.status(502).json({
      ok: false,
      error: result.message || 'Email provider rejected the request.',
    });
  }

  return res.status(200).json({ ok: true });
}
