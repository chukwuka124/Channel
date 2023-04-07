import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./styles.module.css"

const Homepage = () => {
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
        </div>
    )
}

export default Homepage