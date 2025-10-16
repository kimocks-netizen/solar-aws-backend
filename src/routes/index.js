const iotRoutes = require('./iotRoutes');
const weatherRoutes = require('./weatherRoutes');
const healthRoutes = require('./healthRoutes');
const iotSenderRoutes = require('./iotSenderRoutes');
const plcRoutes = require('./plcRoutes');
const monitorRoutes = require('./monitorRoutes');

const routes = {
  ...iotRoutes,
  ...weatherRoutes,
  ...healthRoutes,
  ...iotSenderRoutes,
  ...plcRoutes,
  ...monitorRoutes
};

module.exports = routes;