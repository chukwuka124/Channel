import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAllMessages, useChannels, useCreateMessage } from '../../hooks'
import styles from "./styles.module.css"
import { useUser } from '../../hooks'
import Message from '../../components/Message'
import { useNavigate, useRoutes } from "react-router-dom";
import { BackButton, Logout } from '../../components'

const Channel = () => {
    const { id } = useParams()
    const [messageCreated, setMessageCreated] = useState(false)
    const messages = useAllMessages(id, messageCreated)
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
        await createNewMessage(message, id, user.id, newMessageParentId)
        setMessage('');
        setMessageCreated(true);
        setNewMessageParentId(null)
    }

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
                                        key={message.id}
                                        message={message}
                                        user={user}
                                        setNewMessageParentId={setNewMessageParentId}
                                        messageCreated={messageCreated}
                                    />
                                ))}
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

            {user && <Logout user={user} />}

            <BackButton href={"/allChannels"} />
        </>
    )
}

export default Channel