import { EventsInput, EventsUpdate, IEditImage, IEvents } from '@/app/type';
import { toast } from 'react-toastify';

const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export const createEvent = async (data: EventsInput, appToken: string) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('priceRupiah', String(data.priceRupiah));
  formData.append(
    'date',
    data.date instanceof Date ? data.date.toISOString() : data.date,
  );
  formData.append('location', data.location);
  formData.append('seats', String(data.seats));
  formData.append('isAvailable', String(data.isAvailable));
  formData.append('category', data.category);
  formData.append('content', data.content);

  if (typeof data.image === 'object') {
    formData.append('image', data.image);
  } else {
    formData.append('image', data.image);
  }

  formData.append('author', JSON.stringify(data.author));

  const res = await fetch(`${base_url}/events`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${appToken}`,
      credentials: 'include',
    },
  });

  const result: any = await res.json();

  if (!res.ok) {
    toast.error('fE Create Event GAGAL LHO');
    return;
  }

  return { result, ok: res.ok };
};

export const getEvent = async (query: string = '') => {
  const url = query ? `${base_url}/events?${query}` : `${base_url}/events`;

  const res = await fetch(url, { cache: 'no-cache' });
  const result = await res.json();

  return { result, event: result.event, ok: res.ok, events: result.event };
};

export const getEventSlug = async (slug: string) => {
  const res = await fetch(`${base_url}/events/${slug}`, { cache: 'no-cache' });

  const result = await res.json();

  if (!result.event) throw 'getEventSlug result.event tidak dapat';

  return { result, event: result.event, ok: res.ok };
};

export const updateEvent = async (
  data: EventsUpdate & { file?: File },
  appToken: string,
) => {
  try {
    const formData = new FormData();

    if (data.file) {
      formData.append('file', data.file);
    }

    if (data.image instanceof File) {
      formData.append('image', data.image);
    } else if (typeof data.image === 'string') {
      formData.append('image', data.image);
    }

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && key !== 'file') {
        formData.append(key, String(value));
      }
    }

    const res = await fetch(`${base_url}/events/${data.id}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });

    const result = await res.json();

    return { result, ok: res.ok };
  } catch (err) {
    console.error('Error in updateEvent:', err);
    return { result: null, ok: false };
  }
};

export const editImage = async (
  appToken: string,
  id: number,
  data: IEditImage,
  file: File,
) => {
  const formData = new FormData();
  formData.append('file', file);

  if (typeof data.image === 'object') {
    formData.append('image', data.image);
  } else {
    formData.append('image', data.image);
  }

  const res = await fetch(`${base_url}/events/${id}/editimage`, {
    method: 'PATCH',
    body: formData,
    headers: {
      Authorization: `Bearer ${appToken}`,
      credentials: 'include',
    },
  });
  const result = await res.json();

  return { result, ok: res.ok };
};

export const deleteEvent = async (appToken: string, id: number) => {
  const res = await fetch(`${base_url}/events/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${appToken}`,
    },
  });
  const result = await res.json();

  return { result, ok: res.ok };
};
