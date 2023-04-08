import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css"
import api from '../../api'
import { useUser } from '../../hooks'

const Landingpage = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [isLogIn, setIsLogin] = useState(true)
    const [hasCalled, setHasCalled] = useState(false)
    const navigate = useNavigate();
    const user = useUser()

    useEffect(() => {
        api.get(`/`)
    }, [])

    useEffect(() => {
        setName('')
        setPassword('')
    }, [isLogIn])

    useEffect(() => {
        if (user)
            navigate('/home')
    }, [user])

    const submit = async () => {
        try {
            if (name.length < 3) throw 'Name must be longer than 3 characters'
            if (password.length < 3) throw 'Password must be longer than 3 characters'

            const user = await api.post(`/createAccountOrSignIn`, {
                name, password, isLogIn
            })

            if (user.status === 200 && user.data) {
                localStorage.setItem("user", JSON.stringify(user.data))
                navigate('/home');
            }
        } catch (error) {
            console.log(error)
            alert(error?.response.data.message || JSON.stringify(error))
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