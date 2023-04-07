import { useState } from 'react'
import api from '../../api'

const useCreateChannel = () => {

    const [channel, setChannel] = useState()

    const createChannel = async (name) => {
        try {
            const result = await api.post('/createChannel', { name })
            setChannel(result.data)
        }
        catch (err) { console.log(err) }
    }
    return [channel, createChannel]
}

export default useCreateChannel