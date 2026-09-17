// Supabase-backed database layer using native fetch
const SUPABASE_URL = 'https://uzfnzovchpomgogmxhrt.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Zm56b3ZjaHBvbWdvZ214aHJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTY0NDQyMiwiZXhwIjoyMTA1MjIwNDIyfQ.Bs_zEJebVQyj4Bl13taDT2mLiGh-o5mtFM6asc7FJJo';

// Helper: fetch with error handling
async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation', // Required for INSERT/UPDATE to get data back
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase error: ${response.status} ${errorText}`);
  }

  // DELETE returns 204
  if (response.status === 204) return null;

  return response.json();
}

// Get user by email
export async function getUserByEmail(email) {
  const data = await supabaseFetch(`users?email=eq.${encodeURIComponent(email)}&select=*`);
  return data && data.length > 0 ? data[0] : null;
}

export async function getUsers() {
  return supabaseFetch('users?select=*');
}

export async function getUserByUsername(username) {
  const data = await supabaseFetch(`users?username=eq.${encodeURIComponent(username)}&select=*`);
  return data && data.length > 0 ? data[0] : null;
}

export async function getUserById(id) {
  const data = await supabaseFetch(`users?id=eq.${id}&select=*`);
  return data && data.length > 0 ? data[0] : null;
}

export async function createUser(user) {
  const data = await supabaseFetch('users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  return data[0];
}

export async function updateUser(id, updates) {
  const data = await supabaseFetch(`users?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
  return data[0];
}

export async function getBlogs() {
  return supabaseFetch('blogs?select=*');
}

export async function getBlogById(id) {
  const data = await supabaseFetch(`blogs?id=eq.${id}&select=*`);
  return data && data.length > 0 ? data[0] : null;
}

export async function getBlogsByUser(userId) {
  return supabaseFetch(`blogs?user_id=eq.${userId}&select=*`);
}

export async function getPublishedBlogs() {
  return supabaseFetch('blogs?status=eq.published&select=*');
}

export async function createBlog(blog) {
  const data = await supabaseFetch('blogs', {
    method: 'POST',
    body: JSON.stringify(blog)
  });
  return data[0];
}

export async function updateBlog(id, updates) {
  const data = await supabaseFetch(`blogs?id=eq.${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
  return data[0];
}

export async function deleteBlog(id) {
  await supabaseFetch(`blogs?id=eq.${id}`, { method: 'DELETE' });
}
