// server/utils/socketEmitter.js
let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

export const emitToRoom = (room, event, data) => {
  if (!ioInstance) {
    console.warn("⚠️ socketEmitter: io not initialized");
    return;
  }
  ioInstance.to(room).emit(event, data);
};
