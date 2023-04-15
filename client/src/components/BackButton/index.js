import React from 'react'
import styles from "./styles.module.css"
import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom";

const BackButton = ({ href }) => {
    const navigate = useNavigate();
    return (
        <IoMdArrowRoundBack
            className={styles.backbutton}
            size={30}
            onClick={() => navigate(href)}
        />
    )
}

export default BackButton