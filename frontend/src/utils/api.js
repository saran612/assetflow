const BASE_URL = 'http://localhost:8000';

export async function apiCall(endpoint, method = 'GET', body = null, isMultipart = false) {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let options = {
    method,
    headers,
  };

  if (body) {
    if (isMultipart) {
      // Do not set Content-Type header so the browser auto-generates boundary
      options.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    let errorDetail = 'Request failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch (_) {}
    throw new Error(typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
  }

  return response.json();
}
