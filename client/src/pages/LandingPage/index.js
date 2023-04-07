import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"
import axios from 'axios'

const Landingpage = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [isLogIn, setIsLogin] = useState(true)
    const [hasCalled, setHasCalled] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080`)
    }, [])

    useEffect(() => {
        setName('')
        setPassword('')
    }, [isLogIn])

    const submit = async () => {
        try {
            if (name.length < 3) throw 'Name must be longer than 3 characters'
            if (password.length < 3) throw 'Password must be longer than 3 characters'
            // await axios.post(`http://localhost:8080/createAccountOrSignIn`, {
            //     name, password, isLogIn
            // })
            navigate('/home');
        } catch (error) {
            console.log(error)
            alert(error?.message || JSON.stringify(error))
        }
    }
    return (
        <div className={styles.main}>
            <h1>{isLogIn ? 'Log in' : 'Create an account'}</h1>
            <input placeholder='Username' onChange={e => setName(e.target.value.trim())} value={name} />
            <input placeholder='Password' type={'password'} onChange={e => setPassword(e.target.value.trim())} value={password} />
            <button className={styles.button} onClick={submit}>
                {isLogIn ? 'Log me in' : 'Create account'}
            </button>
            <p>Or rather you can <span className={styles.login} onClick={() => setIsLogin(prev => !prev)}>{isLogIn ? 'CREATE AN ACCOUNT' : 'LOG INTO YOUR ACCOUNT'}</span></p>
        </div>
    )
}

export default Landingpage