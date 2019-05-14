const ws = new WebSocket('ws://localhost:81');

ws.onerror = function(err) {
    console.error('failed to make websocket connection');
    throw err;
};

ws.onopen = function() {
    console.log('connection established');
};

ws.onmessage = function(event) {
    console.log(event);
    const li = document.createElement('li');
    li.textContent = event.data;
    const ul = document.getElementById('message-container');
    ul.appendChild(li);
};

const form = document.getElementById('chat');
console.log(form);
form.addEventListener('submit', function(event) {
    const textInput = document.getElementById('chat-message');
    const chatText = textInput.value;
    textInput.value = '';
    console.log(chatText);
    ws.send(chatText);
    event.preventDefault();
});