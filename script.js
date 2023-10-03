const CLIENT_ID = "RHTrD2FGUTfj3ysE";
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");
const messageList = document.getElementById("messageList");
const nameButton = document.getElementById("nameButton");
const nameInput = document.getElementById("nameInput");
const nameContainer = document.getElementById("nameContainer");
const messageForm = document.getElementById("messageForm");
let username;

const drone = new ScaleDrone(CLIENT_ID, { data: { color: getRandomColor() } });
console.log(drone);

drone.on("open", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Successfully connected to Scaledrone");

  const room = drone.subscribe("observable-seminarskiAlgebra");
  room.on("open", (error) => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully joined room");
  });

  room.on("message", (message) => {
    if (message) {
      console.log("message:");
      console.log(message);
      putMessageToList(message);
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

messageInput.addEventListener("input", adjustSize);
sendButton.addEventListener("click", sendMessage);
nameButton.addEventListener("click", setName);

function setName(event) {
  event.preventDefault();
  const name = nameInput.value;
  console.log(name);
  if (name === "" || typeof name === "undefined") {
    alert("Enter your name");
  } else {
    nameInput.value = "";
    username = name;
    nameContainer.style.display = "none";
    messageForm.style.display = "block";
  }
}

function adjustSize() {
  const maxFormHeight = 200;
  const minFormHeight = 50;
  this.style.height = "auto";
  const newFormHeight = this.scrollHeight;

  if (newFormHeight > maxFormHeight) {
    this.style.height = maxFormHeight + "px";
    this.style.overflowY = "scroll";
  } else if (newFormHeight < minFormHeight) {
    this.style.height = minFormHeight + "px";
  } else {
    this.style.height = newFormHeight + "px";
    const marginBorder = 10;
    console.log(newFormHeight);
    console.log(minFormHeight);
    messageContainer.style.bottom = `${
      newFormHeight + minFormHeight - 4 + marginBorder
    }px`;
    this.style.overflowY = "hidden";
  }
}

function sendMessage(event) {
  event.preventDefault();
  console.log("Outside: " + username);
  let message = {
    name: username,
    text: messageInput.value,
  };
  console.log(message);
  console.log("name:" + message.name);
  if (message.name === "" || typeof message.name === "undefined") {
    alert("Enter your name");
  } else {
    if (message.text === "" || typeof message.text === "undefined") {
      return;
    } else {
      messageInput.value = "";
      drone.publish({
        room: "observable-seminarskiAlgebra",
        message: message,
      });
    }
    messageInput.value = "";
    messageInput.style.height = "auto";
    messageContainer.style.bottom = "100px";
  }
}

function createMessageListElement(message) {
  const { name, text } = message.data;
  const { timestamp } = message;
  const { color } = message.member.clientData;
  const time = new Date(timestamp * 1000).toLocaleString();
  const messageListElement = document.createElement("li");
  const messageElement = document.createElement("p");
  const timeElement = document.createElement("p");
  messageElement.innerText = `${name}: ${text}`;
  timeElement.innerText = time;
  messageElement.style.backgroundColor = color;
  messageListElement.append(messageElement, timeElement);
  return messageListElement;
}

function putMessageToList(message) {
  const wasTop =
    messageContainer.scrollTop ===
    messageContainer.scrollHeight - messageContainer.clientHeight;
  messageList.appendChild(createMessageListElement(message));
  if (wasTop) {
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
}
