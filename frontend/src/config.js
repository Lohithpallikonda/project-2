// API Configuration
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE || 
                (process.env.NODE_ENV === 'production' 
                  ? 'https://project-2-y4zj.onrender.com'  // Render.com backend URL
                  : '')  // Local development uses proxy
};

export default config;