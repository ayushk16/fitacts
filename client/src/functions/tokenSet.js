import axios from 'axios';
import config from './config';

const setUserToken = ({ user, token, refreshToken }) => {
  if (token) {
    localStorage.setItem('token', token);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

const getUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.id) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const removeUserToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Attempts to refresh the accessToken using the stored refreshToken
 */
const refreshAuthToken = async () => {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    return null;
  }

  try {
    const res = await axios.post(`${config.API_BASE_URL}/login/refresh`, {
      refreshToken: currentRefreshToken,
    });

    if (res.data?.data?.token?.accessToken) {
      const newAccessToken = res.data.data.token.accessToken;
      const newRefreshToken = res.data.data.token.refreshToken || currentRefreshToken;
      const user = res.data.data.user || getUser();

      setUserToken({
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      });

      return newAccessToken;
    }
    return null;
  } catch (err) {
    console.error('Failed to refresh auth token:', err);
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      removeUserToken();
    }
    return null;
  }
};

// Setup global Axios interceptors for automatic token inclusion & 401 refresh
axios.interceptors.request.use(
  (reqConfig) => {
    const token = getToken();
    if (token) {
      reqConfig.headers['x-access-token'] = token;
      reqConfig.headers['Authorization'] = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/login')
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAuthToken();
      if (newToken) {
        originalRequest.headers['x-access-token'] = newToken;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export {
  setUserToken,
  getToken,
  getRefreshToken,
  getUser,
  removeUserToken,
  refreshAuthToken,
};