
const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export const verifyAuth = async (token: string) => {
  const res = await fetch(`${base_url}/auth/verify`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();

  return { result, ok: res.ok };
};

export const upgradeToAuthor = async (
  data: { email: string; avatar?: string; avatarFile?: File | null },
  token?: string,
) => {
  let res: Response;
  if (data.avatarFile) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('avatar', data.avatarFile);
    res = await fetch(`${base_url}/auth/upgrade`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
  } else {
    const payload: any = { email: data.email };
    if (data.avatar) payload.avatar = data.avatar;
    res = await fetch(`${base_url}/auth/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  }
  const result = await res.json().catch(() => ({}));
  return { result, ok: res.ok, status: res.status };
};