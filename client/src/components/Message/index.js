import { useEffect, useRef, useState } from 'react'
import styles from "./styles.module.css"
import clsx from 'clsx'
import { BsHandThumbsUp, BsHandThumbsDown, BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from 'react-icons/bs'
import api from '../../api'

const Message = ({ message, user, setNewMessageParentId, messageCreated }) => {
    const [isReplying, setIsReplying] = useState(false)
    const replyingAlertRef = useRef(null)
    const repliesRef = useRef(null)
    const [isShowingReplies, setIsShowingReplies] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)

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

    useEffect(() => {
        if (message.likes && message.likes.length > 0) {
            message.likes.forEach(like => {
                if (like === user.id) setIsLiked(true)
            })
        }
        if (message.dislikes && message.dislikes.length > 0) {
            message.dislikes.forEach(dislike => {
                if (dislike === user.id) setIsDisliked(true)
            })
        }
    }, [])

    const handleLike = async () => {
        if (isDisliked) await handleUndislike()
        await api.patch(`/incrementMessageLikes`, { userId: user.id, messageId: message.id })
        setIsLiked(true)
    }

    const handleUnlike = async () => {
        await api.patch(`/decrementMessageLikes`, { userId: user.id, messageId: message.id })
        setIsLiked(false)
    }

    const handleDislike = async () => {
        if (isLiked) await handleUnlike()
        await api.patch(`/incrementMessageDislikes`, { userId: user.id, messageId: message.id })
        setIsDisliked(true)
    }

    const handleUndislike = async () => {
        await api.patch(`/decrementMessageDislikes`, { userId: user.id, messageId: message.id })
        setIsDisliked(false)
    }

    return (
        <div className={clsx(styles.message, message.sender_id === user.id && styles.sender, message.sender_id !== user.id && styles.receiver)}>
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
                {
                    isLiked ?
                        <button className={styles.smallButton} onClick={() => handleUnlike()}>
                            <BsFillHandThumbsUpFill />
                        </button>
                        :
                        <button className={styles.smallButton} onClick={() => handleLike()}>
                            <BsHandThumbsUp />
                        </button>
                }
                {
                    isDisliked ?
                        <button className={styles.smallButton} onClick={() => handleUndislike()}>
                            <BsFillHandThumbsDownFill />
                        </button>
                        :
                        <button className={styles.smallButton} onClick={() => handleDislike()}>
                            <BsHandThumbsDown />
                        </button>}
            </div>

            <div ref={repliesRef}>
                {message.replies && message.replies.map((reply) => (
                    <div key={reply.id} className={message.sender_id === user.id ? styles.senderReply : styles.receiverReply}>
                        <Message message={reply} user={user} setNewMessageParentId={setNewMessageParentId} messageCreated={messageCreated} />
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