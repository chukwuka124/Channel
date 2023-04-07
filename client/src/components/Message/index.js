import { useEffect, useRef, useState } from 'react'
import styles from "./styles.module.css"
import clsx from 'clsx'
import { AiFillCloseCircle } from 'react-icons/ai'

const Message = ({ message, user, setNewMessageParentId, messageCreated }) => {
    const [isReplying, setIsReplying] = useState(false)
    const replyingAlertRef = useRef(null)
    const repliesRef = useRef(null)
    const [isShowingReplies, setIsShowingReplies] = useState(false)

    useEffect(() => {
        if (isReplying) {
            replyingAlertRef.current.style.display = 'block'
            setNewMessageParentId(message.id)
        }
        else {
            replyingAlertRef.current.style.display = 'none'
            setNewMessageParentId(null)
        }
    }, [isReplying])

    useEffect(() => {
        if (messageCreated) setIsReplying(false)
    }, [messageCreated])

    useEffect(() => {
        if (isShowingReplies) {
            repliesRef.current.style.display = 'block'
        }
        else repliesRef.current.style.display = 'none'
    }, [isShowingReplies])

    return (
        <div key={message.id} className={clsx(styles.message, message.sender_id === user.id && styles.sender, message.sender_id !== user.id && styles.receiver)}>
            <div className={styles.messageHeader}>
                <div className={styles.messageUser}>{message.sender}</div>
                <div className={styles.messageDate}>
                    {new Date(message.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    })
                    }
                </div>
            </div>
            <div className={clsx(styles.messageBody, message.sender_id === user.id && styles.senderBody, message.sender_id !== user.id && styles.receiverBody)}>
                {message.text}
                <div>
                    {message.replies && message.replies.length > 0 &&
                        <div className={styles.replies}>Replies: {message.replies.length}</div>}

                </div>
            </div>
            <div>
                <button className={styles.smallButton} onClick={() => setIsReplying(!isReplying)}>
                    {isReplying ? "Cancel reply" : "Reply"}
                </button>
                {message.replies && message.replies.length > 0 &&
                    <button
                        className={styles.smallButton}
                        onClick={() => setIsShowingReplies(!isShowingReplies)}>
                        {isShowingReplies ? "Hide replies" : "Show replies"}
                    </button>}
            </div>

            <div ref={repliesRef}>
                {message.replies && message.replies.map((reply) => (
                    <div className={message.sender_id === user.id ? styles.senderReply : styles.receiverReply}>
                        <Message key={reply.id} message={reply} user={user} setNewMessageParentId={setNewMessageParentId} messageCreated={messageCreated} />
                    </div>
                ))}
            </div>

            <div ref={replyingAlertRef} className={styles.replyingAlert} onClick={() => setIsReplying(false)} >
                <div>
                    <span style={{ color: 'red' }}>Replying to </span>
                    <span style={{ fontWeight: "bold", fontSize: "15px" }}>{message.sender}:</span> {message.text}
                </div>
            </div>

        </div>
    )
}

export default Message