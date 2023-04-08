import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAllMessages, useChannels, useCreateMessage } from '../../hooks'
import styles from "./styles.module.css"
import { useUser } from '../../hooks'
import Message from '../../components/Message'
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

const Channel = () => {
    const { id } = useParams()
    const [messageCreated, setMessageCreated] = useState(false)
    const { messages, setMessages } = useAllMessages(id, messageCreated)
    const channels = useChannels()
    const [isLoading, setIsLoading] = useState(true)
    const [channelName, setChannelName] = useState('')
    const [allMessages, setAllMessages] = useState()
    const [message, setMessage] = useState('')
    const user = useUser()
    const [createNewMessage] = useCreateMessage()
    const [newMessageParentId, setNewMessageParentId] = useState(null)
    const navigate = useNavigate();

    const handleCreateMessage = async (e) => {
        e.preventDefault();
        await createNewMessage(message, id, user.id, newMessageParentId, user.name)
        setMessage('');
        setMessageCreated(true);
        setNewMessageParentId(null)
    }
    const bottomRef = useRef(null);
    useEffect(() => {
        if (!!channelName)
            socket.emit('join', { name: user.name, groupId: id });
    }, [channelName])
    useEffect(() => {
        socket.on('newMessage', (data) => {
            setMessages(data)
        });

    }, [])
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 700);
    }, [messages]);

    useEffect(() => {
        const name = channels !== undefined ? channels.filter(channel => channel.id === parseInt(id))[0].name : null
        name !== null && setChannelName(name)
        name !== null && setIsLoading(false)
    }, [channels])

    useEffect(() => {
        messages && setAllMessages(messages)
    }, [messages])

    useEffect(() => {
        if (!user) navigate('/')
    }, [])

    return (
        <>
            <div className={styles.container}>
                {isLoading ?
                    <div className={styles.alert}>Loading...</div>
                    :
                    <>
                        <div className={styles.subtitle}><div>{channelName}</div></div>
                        <div className={styles.messages}>
                            {allMessages === undefined ?
                                <div className={styles.alert}>There are no messages in this channel</div>
                                :
                                allMessages.map(message => (
                                    <Message
                                        message={message}
                                        user={user}
                                        setNewMessageParentId={setNewMessageParentId}
                                        messageCreated={messageCreated}
                                    />
                                ))}
                            <div ref={bottomRef} />
                        </div>
                    </>
                }
            </div>

            <form className={styles.form} onSubmit={(e) => handleCreateMessage(e)}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Send a message"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        setMessageCreated(false)
                    }}
                />
                <button type="submit" className={styles.button}>
                    Send
                </button>
            </form>
        </>
    )
};

export default Channel;