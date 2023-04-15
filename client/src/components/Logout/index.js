import React, { useState } from 'react'
import styles from "./styles.module.css"
import { useNavigate } from "react-router-dom";

const Logout = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.userInfo}>
            <p>Hi {user.name},</p>
            <button className={styles.smallButton} onClick={() => {
                localStorage.removeItem('user')
                navigate('/')
            }}>Logout</button>
        </div>
    )
}

export default Logout