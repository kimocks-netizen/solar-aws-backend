const iotRoutes = require('./iotRoutes');
const weatherRoutes = require('./weatherRoutes');
const healthRoutes = require('./healthRoutes');
const iotSenderRoutes = require('./iotSenderRoutes');
const plcRoutes = require('./plcRoutes');

const routes = {
  ...iotRoutes,
  ...weatherRoutes,
  ...healthRoutes,
  ...iotSenderRoutes,
  ...plcRoutes
};

module.exports = routes;