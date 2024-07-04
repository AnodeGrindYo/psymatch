const getLocalIP = () => {
    return fetch('http://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => data.ip)
      .catch(error => {
        console.error('Error fetching local IP:', error);
        return 'localhost';
      });
  };
  
  export default getLocalIP;
  