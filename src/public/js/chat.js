const socket = io()

const chatContainer = document.querySelector('.chat-container');
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.send-btn');

sendBtn.addEventListener('click', ()=>{
    if(chatInput.value.trim().length > 0){
        socket.emit('message', {message: chatInput.value})
        chatInput.value = ''
    }
})
socket.on('messages', (messages) => {
    let listMessages = '';
    messages.forEach(msg => {
        listMessages += `<p>${msg.postTime} - ${msg.message}</p>`;
    });
    chatContainer.innerHTML = listMessages;
});

const getMessages = ()=>{
    fetch('/messages/')
    .then(res => res.json())
    .then(data =>{
        let messages = data.message;
        let listMessages = ''
        messages.forEach(msg => {
            listMessages += `<p>${msg.postTime} - ${msg.message}</p>`;
        });
        chatContainer.innerHTML = listMessages;
    })
}
getMessages()