import config from '../config';

export const getHostname = (fallback) => {
  // window does not exists in nodejs, ignore
  try {
    return config?.theme ?? window.location.hostname ?? fallback ?? 'tipple.com.au';
  } catch(error) {
    return config?.theme ?? fallback ?? 'tipple.com.au';
  }
}