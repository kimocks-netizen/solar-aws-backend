const Server = require('./src/server');

const PORT = process.env.PORT || 8080;
const server = new Server();

server.listen(PORT);
