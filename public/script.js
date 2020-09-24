const usernameInput = document.getElementById('username');
const incomingElement = document.getElementById('incoming');
const outgoingInput = document.getElementById('outgoing');

const socket = io();

socket.on('message', function ({ username, message }) {
    removeTypingMessage(username);
    const li = document.createElement('li');
    li.className = username;
    li.innerHTML = `<strong>${username}:</strong> ${message}`;
    incomingElement.appendChild(li);
});

socket.on('starttyping', function ({ username }) {
    const string = `${username} is typing...`;
    console.info(string);
    if (!incomingElement.querySelector(`.${username}.istyping`)) {
        const li = document.createElement('li');
        li.className = `${username} istyping`;
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
    socket.emit('starttyping', { username });
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
    const { value: username } = usernameInput;
    socket.emit('message', { username, message: outgoingInput.value });
    outgoingInput.value = '';
});

function removeTypingMessage(username) {
    const lis = incomingElement.querySelectorAll(`.${username}.istyping`);
    for (let li of lis) {
        incomingElement.removeChild(li);
    }
}

