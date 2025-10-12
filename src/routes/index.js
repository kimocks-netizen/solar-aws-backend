const iotRoutes = require('./iotRoutes');
const weatherRoutes = require('./weatherRoutes');
const healthRoutes = require('./healthRoutes');

const routes = {
  ...iotRoutes,
  ...weatherRoutes,
  ...healthRoutes
};

module.exports = routes;