import React, { useState } from 'react'
import styles from "./styles.module.css"
import { useUser } from '../../hooks';
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    return (
        <button className={styles.button} onClick={() => {
            localStorage.removeItem('user')
            navigate('/')
        }}>Logout</button>
    )
}

export default Logout