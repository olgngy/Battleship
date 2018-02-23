const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let queue = [];    // list of sockets waiting for peers
let rooms = {};    // map socket.id => room
let allUsers = {}; // map socket.id => socket

function findPeerForLoneSocket(socket) {
  if (queue.length) {
    let peer = queue.pop();
    let room = socket.id + '#' + peer.id;
    let isFirstPlayer = true;
    peer.join(room);
    socket.join(room);
    rooms[peer.id] = room;
    rooms[socket.id] = room;
    peer.emit('start game', isFirstPlayer);
    socket.emit('start game', !isFirstPlayer);
  } else {
    queue.push(socket);
  }
}

function getPeerID(room, socketID) {
  let peerID = room.split('#');
  return peerID[0] === socketID ? peerID[1] : peerID[0];
}

io.on('connection', (socket) => {
  console.log('User ' + socket.id + ' connected');
  socket.on('bla bla', () => {
    console.log("Bla bla bla");
  });
  socket.on('add player', () => {
    allUsers[socket.id] = socket;
    findPeerForLoneSocket(socket);
  });
  socket.on('send hit', (data) => {
    let room = rooms[socket.id];
    let peerID = getPeerID(room, socket.id);
    peerID.emit('check hit', data);
  });
  socket.on('send result', (data) => {
    let room = rooms[socket.id];
    let peerID = getPeerID(room, socket.id);
    peerID.emit('hit result', data);
  });
  socket.on('disconnect', () => {
    console.log('User ' + socket.id + ' disconnected');
    let room = rooms[socket.id];
    if (room !== undefined) {
      socket.leave(room);
      let peerID = getPeerID(room, socket.id);
      findPeerForLoneSocket(allUsers[peerID]);
    }
  });
});

server.listen(port);