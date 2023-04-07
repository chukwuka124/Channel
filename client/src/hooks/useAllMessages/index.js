import { useEffect, useState } from 'react'
import api from '../../api'

const useAllMessages = (id, messageCreated) => {
    const [messages, setMessages] = useState()

    useEffect(() => {
        if (messageCreated || id) getMessages()
    }, [id, messageCreated])

    const getMessages = async () => {
        try {
            const result = await api.get(`/allMessages?channelId=${id}`)
            setMessages(result.data)
        }
        catch (err) { console.log(err) }
    }
    return messages
}

export default useAllMessages