//removendo as barras do path das rotas
const room = window.location.pathname.replace(/\//g, "");

//adicionando o path da sala escolhida
const socket = io(`http://localhost:4949/${room}`);

// iniciando usuário como null
let user = null;

// atualizando as mensagens
socket.on("update_messages", (messages) => {
  updateMessagesOnScreen(messages);
});

function updateMessagesOnScreen(messages) {
  const div_messages = document.querySelector("#messages");

  let list_Messages = "<ul>";
  messages.forEach((message) => {
    list_Messages += `<li><strong>${message.user}</strong> -  ${message.msg}</li>`;
  });
  list_Messages += "</ul>";

  div_messages.innerHTML = list_Messages;
}

// capturando os valores do form de input e de usuário e manipulando os valores
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#message_form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!user) {
      alert("Defina um usuário...");
      return;
    }

    const message = document.forms["message_form"]["msg"].value;
    document.forms["message_form"]["msg"].value = "";
    socket.emit("new_message", { user: user, msg: message });
  });

  const userForm = document.querySelector("#user_form");
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e);
    user = document.forms["user_form"]["user"].value;

    userForm.parentNode.removeChild(userForm);
  });
});
