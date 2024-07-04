const config = {
    development: {
      frontendUrl: process.env.FRONTEND_URL,
      socketUrl: process.env.SOCKET_URL,
      apiUrl: process.env.API_URL || 'http://localhost:3000'
    },
    production: {
      frontendUrl: process.env.FRONTEND_URL,
      socketUrl: process.env.SOCKET_URL,
      apiUrl: process.env.API_URL
    }
  };
  
  const environment = process.env.NODE_ENV || 'development';
  
  export default config[environment];
  