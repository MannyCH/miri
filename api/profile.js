export default function handler(req, res) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !String(authHeader).startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      error: 'Missing bearer token.',
    });
  }

  return res.status(200).json({
    ok: true,
    profile: {
      defaultServings: 2,
      bmr: null,
      weightKg: null,
      heightCm: null,
      nutritionMode: 'normal',
    },
  });
}
