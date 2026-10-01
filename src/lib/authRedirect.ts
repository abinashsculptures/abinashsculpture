// Builds the post-auth redirect URL. Production always returns to the live domain;
// localhost and Lovable preview hosts return to their own origin.
const PRODUCTION_URL = 'https://abinashsculptures.in';

export const getAuthRedirectUrl = (path = '/') => {
  const { hostname, origin } = window.location;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  const isPreview = hostname.endsWith('.lovable.app') || hostname.endsWith('.lovableproject.com');
  const base = isLocal || isPreview ? origin : PRODUCTION_URL;
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${safePath}`;
};
