const express = require('express');
const cors = require('cors');
const { resolve } = require('path');
const ws = require('ws');

const { networkInterfaces } = require('os');
const nets = networkInterfaces();

const PORT = 80;
const PORT_WS = 5202;
let status = false;

const getStatus = () => {
    return status;
};

const getAddress = () => {
    const results = Object.create(null);
    let address = null;
    try {
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                const familyV4Value =
                    typeof net.family === 'string' ? 'IPv4' : 4;
                if (net.family === familyV4Value && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }
        address = results[Object.keys(results)[0]][0];
    } catch (error) {
        console.log(error);
    }
    return address;
};

const server = express();
server.use(cors());
server.use(express.static(resolve(__dirname, '../')));
server.listen(PORT, () => (status = true));

const wss = new ws.Server(
    {
        port: PORT_WS,
    },
    () => console.log(`websocket open on ${PORT_WS}`)
);

const broadcast = (message) => {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
};

module.exports = {
    broadcast,
    getStatus,
    getAddress,
};
