import React, { useRef } from "react";
import "./MessageBubble.css";
import {
    Check,
    CheckCheck,
    FileText,
    Play,
} from "lucide-react";
import AudioPlayer from "./AudioPlayer";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const MessageBubble = ({
    message,
    isMine,
    showDate,
    dateLabel,
    userId,

    downloadFile,
    setFullScreenMedia,
    scrollToMessage,

    handleContextMenu,
    setReplyingTo,
    inputRef,
}) => {
    const pressTimer = useRef(null);
    const touchStart = useRef(0);

    // ------------------------
    // Swipe to Reply
    // ------------------------

    const onSwipeStart = (e) => {
        touchStart.current = e.touches[0].clientX;
    };

    const onSwipeEnd = (e) => {
        const end = e.changedTouches[0].clientX;

        if (end - touchStart.current > 60) {
            setReplyingTo(message);
            inputRef?.current?.focus();
        }
    };

    // ------------------------
    // Long Press Menu
    // ------------------------

    const startLongPress = (e) => {
        pressTimer.current = setTimeout(() => {
            const touch = e.touches[0];

            handleContextMenu(
                {
                    preventDefault() {},
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                },
                message._id
            );
        }, 500);
    };

    const cancelLongPress = () => {
        clearTimeout(pressTimer.current);
    };

    return (
        <>
            {showDate && (
                <div className="date-divider">
                    <span>{dateLabel}</span>
                </div>
            )}

            <div
                className={`message-wrapper ${
                    isMine
                        ? "sent-wrapper"
                        : "received-wrapper"
                }`}
                id={message._id}
            >
                <div
                    className={`message-bubble ${
                        isMine ? "sent" : "received"
                    } ${
                        message.fileType
                            ? "media-bubble"
                            : ""
                    }`}
                    onContextMenu={(e) =>
                        handleContextMenu(e, message._id)
                    }
                    onTouchStart={(e) => {
                        onSwipeStart(e);
                        startLongPress(e);
                    }}
                    onTouchEnd={(e) => {
                        cancelLongPress();
                        onSwipeEnd(e);
                    }}
                    onTouchMove={cancelLongPress}
                >
                    {/* IMAGE */}

                    {message.fileType === "image" && (
                        <img
                            src={message.fileUrl}
                            className="msg-media-preview"
                            alt=""
                            onClick={() =>
                                setFullScreenMedia({
                                    url: message.fileUrl,
                                    type: "image",
                                })
                            }
                        />
                    )}

                    {/* VIDEO */}

                    {message.fileType === "video" && (
                        <div
                            className="video-preview"
                            onClick={() =>
                                setFullScreenMedia({
                                    url: message.fileUrl,
                                    type: "video",
                                })
                            }
                        >
                            <video
                                src={message.fileUrl}
                                preload="metadata"
                            />

                            <div className="play-overlay">
                                <Play
                                    size={42}
                                    fill="white"
                                />
                            </div>
                        </div>
                    )}

                    {/* DOCUMENT */}

                    {message.fileType === "doc" && (
                        <div
                            className="doc-preview"
                            onClick={() =>
                                downloadFile(
                                    message.fileUrl,
                                    message.fileName
                                )
                            }
                        >
                            <FileText size={34} />

                            <div className="doc-info">
                                <span className="doc-name">
                                    {message.fileName ||
                                        "Document"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* AUDIO */}

                    {message.fileType === "audio" && (
                        <AudioPlayer
                            url={message.fileUrl}
                        />
                    )}

                    {/* Caption / Text */}

                    {/* ---------------- Reply Preview ---------------- */}

                    {message.replyTo && (
                        <div
                            className="reply-message-preview"
                            onClick={() => scrollToMessage(message.replyTo._id)}
                        >
                            <div className="reply-line" />

                            {/* Image thumbnail */}

                            {message.replyTo.fileType === "image" && (
                                <img
                                    className="reply-thumb"
                                    src={message.replyTo.fileUrl}
                                    alt=""
                                />
                            )}

                            {/* Video thumbnail */}

                            {message.replyTo.fileType === "video" && (
                                <video
                                    className="reply-thumb"
                                    src={message.replyTo.fileUrl}
                                />
                            )}

                            {/* Voice */}

                            {message.replyTo.fileType === "audio" && (
                                <div className="reply-audio-icon">
                                    🎤
                                </div>
                            )}

                            {/* Document */}

                            {message.replyTo.fileType === "doc" && (
                                <div className="reply-doc-icon">
                                    📄
                                </div>
                            )}

                            <div className="reply-content">

                                <span className="reply-user">
                                    {message.replyTo.sender?.username}
                                </span>

                                <span className="reply-message">

                                    {message.replyTo.text ||

                                        message.replyTo.fileName ||

                                        (message.replyTo.fileType === "image"
                                            ? "Photo"

                                        : message.replyTo.fileType === "video"
                                            ? "Video"

                                        : message.replyTo.fileType === "audio"
                                            ? "Voice note"

                                        : "Document")}

                                </span>

                            </div>

                        </div>
                    )}
                    {/* Caption / Text */}

                    {message.text && (
                        <p
                            className={
                                message.fileType
                                    ? "media-caption"
                                    : "message-text"
                            }
                        >
                            {message.text}
                        </p>
                    )}

                    {/* Time */}

                    <div className="msg-time">
                        {new Date(
                            message.createdAt
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}

                        {isMine && (
                            <span className="status-icons">
                                {message.status ===
                                "read" ? (
                                    <CheckCheck
                                        size={14}
                                        className="read"
                                    />
                                ) : message.status ===
                                  "delivered" ? (
                                    <CheckCheck
                                        size={14}
                                        className="delivered"
                                    />
                                ) : (
                                    <Check
                                        size={14}
                                        className="sent"
                                    />
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageBubble;