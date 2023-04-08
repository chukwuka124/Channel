import { useEffect, useState } from 'react'
import styles from "./styles.module.css"
import { useCreateChannel } from '../../hooks'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useUser } from '../../hooks'

const NewChannel = () => {
    const [name, setName] = useState('');
    const [created, setCreated] = useState(false);
    const [channel, createNewChannel] = useCreateChannel()
    const navigate = useNavigate();
    const user = useUser()

    useEffect(() => {
        if (!user) navigate('/')
    }, [])

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        await createNewChannel(name)
        setName('');
        setCreated(true);
    }
    return (
        <div className={styles.container}>
            <div className={styles.subtitle}>Create a new channel</div>
            <div className={styles.form}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Channel Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={async (e) => await handleCreateChannel(e)} className={styles.button}>
                    Create Channel
                </button>
            </div>

            {created &&
                <>
                    <div className={styles.alert}>Channel created!</div>
                    {channel !== undefined &&
                        <Link to={`/channel/${channel.id}`}>
                            <button className={styles.button}>
                                Go to '{channel.name}'
                            </button>
                        </Link>}
                </>
            }
        </div>
    )
}

export default NewChannel