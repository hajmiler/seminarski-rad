function sendMessage() {
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");
  const messageContainer = document.getElementById("messageContainer");
  const maxFormHeight = 200;
  const minFormHeight = 50;

  messageInput.addEventListener("input", function () {
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
  });

  sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    const message = messageInput.value;
    const messageList = document.getElementById("messageList");
    const messageListElement = document.createElement("li");
    messageListElement.innerText = message;
    messageList.appendChild(messageListElement);

    messageInput.value = "";
    messageInput.style.height = "auto";
    messageContainer.style.bottom = "100px"; // Reset the bottom property
    messageList.scrollTop = messageList.scrollHeight;
  });
}

sendMessage();
