export const fetchAuth = async (input: RequestInfo | URL, init?: RequestInit) => {
  const storedAuth = localStorage.getItem('auth-storage');
  let token = null;
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      token = parsed.state?.token;
    } catch (e) {
      console.error('Error parsing auth token', e);
    }
  }

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    console.warn('Unauthorized request - redirecting to login');
    // localStorage.removeItem('auth-storage');
    // window.location.href = '/login';
  }

  return response;
};
