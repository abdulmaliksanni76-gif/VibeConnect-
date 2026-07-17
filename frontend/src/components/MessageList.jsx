import React from "react";
import MessageBubble from "./MessageBubble";

const getRelativeDate = (dateString) => {
  const date = new Date(dateString);

  const today = new Date();

  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString())
    return "Today";

  if (date.toDateString() === yesterday.toDateString())
    return "Yesterday";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MessageList = ({
  messages,
  userId,
  touchStart,
  setTouchStart,
  setReplyingTo,
  inputRef,
  downloadFile,
  setFullScreenMedia,
  scrollToMessage,
  messagesEndRef
}) => {
  return (
    <div className="messages-window">

      {messages.map((message, index) => {

        const currentDate = new Date(
          message.createdAt
        ).toDateString();

        const prevDate =
          index > 0
            ? new Date(
                messages[index - 1].createdAt
              ).toDateString()
            : null;

        const showDate =
          index === 0 ||
          currentDate !== prevDate;

        return (
          <div
            key={message._id}
            id={message._id}
            onTouchStart={(e) =>
              setTouchStart(
                e.touches[0].clientX
              )
            }
            onTouchEnd={(e) => {

              const touchEnd =
                e.changedTouches[0].clientX;

              if (touchEnd - touchStart > 60) {

                setReplyingTo(message);

                inputRef.current?.focus();

              }

            }}
          >

            {showDate && (

              <div className="date-divider">

                <span>
                  {getRelativeDate(
                    message.createdAt
                  )}
                </span>

              </div>

            )}

            <MessageBubble
              message={message}
              userId={userId}
              downloadFile={downloadFile}
              setFullScreenMedia={
                setFullScreenMedia
              }
              scrollToMessage={
                scrollToMessage
              }
            />

          </div>
        );

      })}

      <div
        ref={messagesEndRef}
        style={{
          height: 1
        }}
      />

    </div>
  );
};

export default MessageList;