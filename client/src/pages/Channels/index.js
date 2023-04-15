import React, { useEffect, useState } from 'react'
import { useChannels, useUser } from '../../hooks'
import styles from "./styles.module.css"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { BackButton, Logout } from '../../components';

const Channels = () => {
    const channels = useChannels()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const user = useUser()

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [])

    useEffect(() => {
        if (!user) navigate('/')
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
                                <div key={channel.id}>
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
<<<<<<< HEAD
=======

            {user && <Logout user={user} />}
            <BackButton href='/home' />
>>>>>>> 1d2cff6c252164fdf05b05e15916a67deb39746e
        </div>
    )
}

export default Channels