// an api to manage channels
const express = require('express');

const channelsRouter = require('./posts/postsRouter.js');

const server = express();

server.use(express.json());









server.listen(8000, () => console.log('\nAPI running\n'));
