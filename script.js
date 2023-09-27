const CLIENT_ID = "RHTrD2FGUTfj3ysE";
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");
const messageList = document.getElementById("messageList");
const membersList = document.getElementById("membersList");
const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    // Will be sent out as clientData via events
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

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

  room.on("members", (m) => {
    members = m;
    updateMembersList();
  });

  room.on("member_join", (member) => {
    members.push(member);
    updateMembersList();
  });

  room.on("member_leave", ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembersList();
  });

  room.on("data", (message, member) => {
    console.log(member.clientData.name);
    if (member) {
      putMessageToList(message, member.clientData.name);
    } else {
      // Message is from server
    }
  });
});

drone.on("close", (event) => {
  console.log("Connection was closed", event);
});

drone.on("error", (error) => {
  console.error(error);
});

function getRandomName() {
  const adjs = [
    "autumn",
    "hidden",
    "bitter",
    "misty",
    "silent",
    "empty",
    "dry",
    "dark",
    "summer",
    "icy",
    "delicate",
    "quiet",
    "white",
    "cool",
    "spring",
    "winter",
    "patient",
    "twilight",
    "dawn",
    "crimson",
    "wispy",
    "weathered",
    "blue",
    "billowing",
    "broken",
    "cold",
    "damp",
    "falling",
    "frosty",
    "green",
    "long",
    "late",
    "lingering",
    "bold",
    "little",
    "morning",
    "muddy",
    "old",
    "red",
    "rough",
    "still",
    "small",
    "sparkling",
    "throbbing",
    "shy",
    "wandering",
    "withered",
    "wild",
    "black",
    "young",
    "holy",
    "solitary",
    "fragrant",
    "aged",
    "snowy",
    "proud",
    "floral",
    "restless",
    "divine",
    "polished",
    "ancient",
    "purple",
    "lively",
    "nameless",
  ];
  const nouns = [
    "waterfall",
    "river",
    "breeze",
    "moon",
    "rain",
    "wind",
    "sea",
    "morning",
    "snow",
    "lake",
    "sunset",
    "pine",
    "shadow",
    "leaf",
    "dawn",
    "glitter",
    "forest",
    "hill",
    "cloud",
    "meadow",
    "sun",
    "glade",
    "bird",
    "brook",
    "butterfly",
    "bush",
    "dew",
    "dust",
    "field",
    "fire",
    "flower",
    "firefly",
    "feather",
    "grass",
    "haze",
    "mountain",
    "night",
    "pond",
    "darkness",
    "snowflake",
    "silence",
    "sound",
    "sky",
    "shape",
    "surf",
    "thunder",
    "violet",
    "water",
    "wildflower",
    "wave",
    "water",
    "resonance",
    "sun",
    "wood",
    "dream",
    "cherry",
    "tree",
    "fog",
    "frost",
    "voice",
    "paper",
    "frog",
    "smoke",
    "star",
  ];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] +
    "_" +
    nouns[Math.floor(Math.random() * nouns.length)]
  );
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

messageInput.addEventListener("input", adjustSize);
sendButton.addEventListener("click", sendMessage);

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
    //   const marginBorder = 20.2;
    const marginBorder = 10;
    console.log(newFormHeight);
    console.log(minFormHeight);
    messageContainer.style.bottom = `${
      newFormHeight + minFormHeight - 4 + marginBorder
    }px`; // Set the bottom property
    this.style.overflowY = "hidden";
  }
}

function sendMessage(event) {
  event.preventDefault();
  const message = messageInput.value;
  console.log(message);
  if (message === "") {
    return;
  } else {
    messageInput.value = "";
    console.log(message);
    drone.publish({
      room: "observable-seminarskiAlgebra",
      message: message,
    });
  }
  messageInput.value = "";
  messageInput.style.height = "auto";
  messageContainer.style.bottom = "100px"; // Reset the bottom property
  // messageList.scrollTop = messageList.scrollHeight;
}

function createMessageListElement(message, member) {
  const messageListElement = document.createElement("li");
  const nameElement = document.createElement("p");
  const messageElement = document.createElement("p");
  nameElement.innerText = member;
  messageElement.innerText = message;
  messageListElement.append(nameElement, messageElement);
  return messageListElement;
}

function putMessageToList(message, member) {
  const wasTop =
    messageContainer.scrollTop ===
    messageContainer.scrollHeight - messageContainer.clientHeight;
  messageList.appendChild(createMessageListElement(message, member));
  if (wasTop) {
    messageContainer.scrollTop =
      messageContainer.scrollHeight - messageContainer.clientHeight;
  }
}

const updateMembersList = () => {
  membersList.innerHTML = "";
  members.map((member) => {
    membersList.appendChild(createMembersListElement(member));
  });
};

const createMembersListElement = (member) => {
  const membersListElement = document.createElement("li");
  membersListElement.innerText = member.clientData.name;
  return membersListElement;
};
