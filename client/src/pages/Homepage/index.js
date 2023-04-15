import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from "./styles.module.css"
import { useNavigate } from "react-router-dom";
import { useUser } from '../../hooks'
import { Logout } from '../../components';

const Homepage = () => {
    const navigate = useNavigate();
    const user = useUser()

    useEffect(() => {
        if (!user) navigate('/')
    }, [user])
    return (
        <div className={styles.main}>
            <Link to='/allChannels'>
                <button className={styles.button}>
                    Join a channel
                </button>
            </Link>

            <Link to='/newChannel'>
                <button className={styles.button}>
                    Create a channel
                </button>
            </Link>

            {user && <Logout user={user} />
            }
        </div>
    )
}

export default Homepage