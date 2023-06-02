const express = require("express");
const app = express();
const port = 4949;
const path = require("path");
const socketIo = require("socket.io");

//salas para troca de mensagens acessando pela rota de cada uma
app.use("/geral", express.static(path.join(__dirname, "public")));
app.use("/grupo", express.static(path.join(__dirname, "public")));

const server = app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});

//conexão do socket com servidor
const io = socketIo(server);

//criando as salas de chat
const messages = {
  geral: [],
  grupo: [],
};

//fluxo de conversa para o chat geral
const geral = io.of("/geral").on("connection", (socket) => {
  socket.emit("update_messages", messages.geral);

  socket.on("new_message", (message) => {
    messages.geral.push(message);
    geral.emit("update_messages", messages.geral);
  });
});

//fluxo de conversa para o chat reservado do grupo
const grupo = io.of("/grupo").on("connection", (socket) => {
  socket.emit("update_messages", messages.grupo);

  socket.on("new_message", (message) => {
    messages.grupo.push(message);
    grupo.emit("update_messages", messages.grupo);
  });
});
