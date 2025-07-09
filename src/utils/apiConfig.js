export const getApiUrl = () => {
  const currentUrl = window.location.href;
  return currentUrl.includes('192.168') 
    ? 'https://sc-chat-backend.onrender.com'
    : 'https://sc-chat-backend.onrender.com';
}; 