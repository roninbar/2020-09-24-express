const usernameInput = document.getElementById('username');
const incomingElement = document.getElementById('incoming');
const outgoingInput = document.getElementById('outgoing');

const socket = io();

socket.on('message', function ({ username, text }) {
    removeTypingMessage(username);
    const li = document.createElement('li');
    li.className = username;
    li.innerHTML = `<strong>${username}:</strong> ${text}`;
    incomingElement.appendChild(li);
});

socket.on('typing', function ({ username }) {
    const string = `${username} is typing...`;
    console.info(string);
    if (!incomingElement.querySelector(`.${username}.typing`)) {
        const li = document.createElement('li');
        li.className = `${username} typing`;
        li.innerText = string;
        incomingElement.appendChild(li);
    }
});

socket.on('stoptyping', function ({ username }) {
    console.info(`${username} stopped typing.`);
    removeTypingMessage(username);
});

let timeoutId = 0;

outgoingInput.addEventListener('keydown', function () {
    clearTimeout(timeoutId);
    const { value: username } = usernameInput;
    socket.emit('typing', { username });
    timeoutId = setTimeout(function () {
        socket.emit('stoptyping', { username });
    }, 2000);
});

document.querySelector('#connect form').addEventListener('submit', function (event) {
    event.preventDefault();
    const { value: username } = usernameInput;
    document.querySelector('h1').innerText = `Type away, ${username}...`;
    document.querySelector('#connect').classList.add('hide');
    document.querySelector('#messages').classList.remove('hide');
});

document.querySelector('#messages form').addEventListener('submit', function (event) {
    event.preventDefault();
    clearTimeout(timeoutId);
    const { value: username } = usernameInput;
    socket.emit('message', { username, text: outgoingInput.value });
    outgoingInput.value = '';
});

function removeTypingMessage(username) {
    const lis = incomingElement.querySelectorAll(`.${username}.typing`);
    for (let li of lis) {
        incomingElement.removeChild(li);
    }
}

