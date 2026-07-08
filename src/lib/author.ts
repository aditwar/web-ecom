'use server';

import {
  IAuthorLogin,
  IAuthorReg,
  IAuthorUpdate,
} from '@/app/type';
import { cookies } from 'next/headers';

const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export const regAuthor = async (data: IAuthorReg) => {
  const res = await fetch(`${base_url}/author`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();

  return { result, ok: res.ok };
};

export const loginAuthor = async (data: IAuthorLogin) => {
  const res = await fetch(`${base_url}/author/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json();

  return { result, ok: res.ok };
};

export const verifyAuthor = async (token: string) => {
  const res = await fetch(`${base_url}/author/verify`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();

  return { result, ok: res.ok };
};

export const updateAuthor = async (
  payload: IAuthorUpdate,
  appToken: string,
) => {
  try {
    const cookieStore = await cookies();
    const formData = new FormData();

    if (payload.avatar instanceof File) {
      formData.append('avatar', payload.avatar);
    } else if (
      typeof payload.avatar === 'string' &&
      payload.avatar.startsWith('http')
    ) {
      formData.append('avatar', payload.avatar);
    } else {
      formData.append('avatar', 'null');
    }

    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined && value !== null && key !== 'avatar') {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    }

    const res = await fetch(`${base_url}/author/${payload.id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });
    const result = await res.json();

    if (res.ok) {
      cookieStore.set('author', JSON.stringify(result.author), {
        httpOnly: true,
        path: '/',
      });

      if (result.appToken) {
        cookieStore.set('appToken', result.appToken, {
          httpOnly: true,
          path: '/',
        });
      }
    }
    return { result, ok: res.ok };
  } catch (err) {
    console.error('Error in updateAuthor:', err);
    return { result: null, ok: false };
  }
};

export const linkUserToAuthor = async (
  token: string,
  authorEmail: string,
  usersEmail?: string,
  provider?: string,
) => {
  const res = await fetch(`${base_url}/author/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ authorEmail, usersEmail, provider }),
  });

  const result = await res.json();

  return { result, ok: res.ok };
};

export const deleteAuthor = async (
  token: string,
  id: number,
  email: string,
) => {
  const res = await fetch(`${base_url}/author/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, email }),
  });
  const result = await res.json();

  return { result, ok: res.ok };
};
