import React, {useState} from 'react'

const Chat = ({socket, setIsChatting, postOwnerSocketId}) => {
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState('')
    socket.on('recieveMessage', (data) => {
        console.log(`inside recieve message`)
        console.log(data)
        setChatHistory(chatHistory+data.message)
    })
    const handleSendMsg = (e) => {
        e.preventDefault();
        setChatHistory(chatHistory+message)
        setMessage('');
        socket.emit('sendMessage', {message, postOwnerSocketId})
     }
     const handleChatClose = () => {
        setIsChatting(false)
     }
    return (
        <div>
            <form onSubmit={handleSendMsg}>
                <label>
                    <p>Live Chat with </p>
                    <p>{chatHistory}</p>
                </label>
                <input value={message} placeholder="type message here" onChange={ e => setMessage(e.target.value)}></input>
                <button type="submit">Send</button>
                <button onClick={handleChatClose}>End Chat</button>
            </form>
        </div>
    )
}

export default Chat
