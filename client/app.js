const form = document.getElementById('form');
const getMessagesButton = document.getElementById('get-messages-button');
const messageList = document.getElementById('message-list');
let messageIndex = 0;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    name: form.children.name.value, 
    message: form.children.message.value
  };

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/messages');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('POST success')
      } else {
        console.log('POST error', xhr.status);
      }
    }
  }
  xhr.send(JSON.stringify(data));
});

getMessagesButton.addEventListener('click', (e) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/messages');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('GET success');
        handleMessages(JSON.parse(xhr.responseText));
      } else {
        console.log('GET error', xhr.status);
      }
    }
  }
  xhr.send();
});

function handleMessages(messages) {
  for (let i = messageIndex; i < messages.length; i++) {
    appendMessage(messages[i]);
    messageIndex++;
  }
}

function appendMessage(item) {
  const nameSpan = document.createElement('span');
  nameSpan.className = 'name-col';
  const nameText = document.createTextNode(item.name);
  nameSpan.appendChild(nameText);

  const messageSpan = document.createElement('span');
  messageSpan.className = 'message-col';
  const messageText = document.createTextNode(item.message);
  messageSpan.appendChild(messageText);

  const li = document.createElement('li');
  li.appendChild(nameSpan);
  li.appendChild(messageSpan);
  messageList.appendChild(li);
}