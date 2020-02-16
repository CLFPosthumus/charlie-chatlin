'use strict';

import { getCurrentDate } from '../utils/utils';

const clients = new Map();

function register(user, client) {
  const users = [...clients.values()].map(c => c.user);

  if (users.some(u => u.username === user.username)) {
    throw new Error('Username is already taken.');
  }

  if (users.some(u => u.avatarId === user.avatarId)) {
    throw new Error('Avatar is already taken.');
  }

  clients.set(client.id, { client, user });
  return user;
}

function unregister(clientId) {
  clients.delete(clientId);
}

function getUserByClientId(id) {
  const client = clients.get(id);

  if (!client) throw new Error('Client does not exist.');

  return client.user;
}

function broadcastMessage(message) {
  [...clients.values()]
    .map(c => c.client)
    .forEach(client => client.emit('message', message));
}

function broadcastUser(clientId, user) {
  [...clients.values()]
    .map(c => c.client)
    .filter(client => client.id !== clientId)
    .forEach(client => {
      client.emit('user-joined', { ...user, joinedOn: getCurrentDate() });
    });
}

function saveSubscription(clientId, subscription) {
  const client = clients.get(clientId);

  if (!client) throw new Error('Client does not exist.');

  clients.set(clientId, { ...client, subscription });
}

export default {
  register,
  unregister,
  getUserByClientId,
  broadcastMessage,
  broadcastUser,
  saveSubscription
};
