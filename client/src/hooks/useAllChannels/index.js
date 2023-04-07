import { useEffect, useState } from 'react'
import api from '../../api'

const useChannels = () => {
    const [channels, setChannels] = useState()

    useEffect(() => {
        const run = async () => {
            try {
                const result = await api.get('/allChannels')
                setChannels(result.data)
            }
            catch (err) { console.log(err) }
            // setChannels(await getChannels())
        }
        run()
    }, [])

    // const getChannels = async () => {
    //     try {
    //         const result = await api.get('/allChannels')
    //         return result.data
    //     }
    //     catch (err) { console.log(err) }
    // }

    return channels
}

export default useChannels