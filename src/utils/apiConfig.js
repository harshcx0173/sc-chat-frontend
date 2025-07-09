export const getApiUrl = () => {
  const currentUrl = window.location.href;
  return currentUrl.includes('192.168') 
    ? 'https://gate-v2.onrender.com'
    : 'https://gate-v2.onrender.com';
}; 