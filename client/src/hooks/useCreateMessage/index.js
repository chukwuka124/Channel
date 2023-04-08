import { useState } from 'react'
import api from '../../api'

const useCreateMessage = () => {
    // const [message, setMessage] = useState()

    const createNewMessage = async (text, channelId, senderId, parentId, name) => {
        try {
            await api.post('/createMessage', { message: text, sender: senderId, channelId, parentId, name })
            // setMessage(result.data)
        }
        catch (err) { console.log(err) }
    }

    return [createNewMessage]
}

export default useCreateMessage
