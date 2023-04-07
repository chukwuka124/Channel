import React, { useEffect, useState } from 'react'
import { useChannels } from '../../hooks'
import styles from "./styles.module.css"
import { Link } from 'react-router-dom'

const Channels = () => {
    const channels = useChannels()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }
            , 500)
    }, [])

    return (
        <div className={styles.container}>
            {isLoading ? <div className={styles.alert}>Loading...</div> :
                <>
                    <div className={styles.subtitle}>Join a Channel</div>
                    <div className={styles.channels}>
                        {channels === undefined ?
                            <>
                                <div className={styles.alert}>There are no existing channels... Create a new one below</div>
                                <Link to='/newChannel'>
                                    <button className={styles.button}>
                                        Create a channel
                                    </button>
                                </Link>
                            </>
                            :
                            channels.map(channel => (
                                <div key={channel._d}>
                                    <Link to={`/channel/${channel.id}`}>
                                        <button className={styles.button}>
                                            {channel.name}
                                        </button>
                                    </Link>
                                </div>
                            ))}
                    </div>
                </>
            }

        </div>
    )
}

export default Channels