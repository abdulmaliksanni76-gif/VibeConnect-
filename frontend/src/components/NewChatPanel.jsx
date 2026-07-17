import React, { useEffect, useState } from "react";
import API from "../services/api";
import UserAvatar from "./UserAvatar";
import { ArrowLeft, Search } from "lucide-react";
import "./NewChatPanel.css";
import { useNavigate } from "react-router-dom";

const NewChatPanel = ({
    open,
    onClose,
    conversations
}) => {

    const [searchEmail, setSearchEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

    const delay = setTimeout(async () => {

        if (!searchEmail.trim()) {

            setUsers([]);

            return;

        }

        try {

            setLoading(true);

            const res = await API.get(
                `/users/search?email=${encodeURIComponent(searchEmail)}`
            );

            setUsers(res.data);

        } catch (err) {

            console.log(err);

            setUsers([]);

        } finally {

            setLoading(false);

        }

    }, 300);

    return () => clearTimeout(delay);

}, [searchEmail]);

const createConversation = async (user) => {

    try{

        const res = await API.post(

            "/chat/create",

            {

                participantId:user._id

            }

        );

        window.dispatchEvent(

            new Event("chat_updated")

        );

        onClose();
        setSearchEmail("");
        setUsers([]);
        navigate(`/chat/${res.data._id}`);

    }

    catch(err){

        console.log(err);

    }

};

    return (

        <div
            className={`new-chat-panel ${
                open ? "open" : ""
            }`}
        >

            <div className="new-chat-header">

                <button
                    className="new-chat-back-btn"
                    onClick={onClose}
                >
                    <ArrowLeft size={22}/>
                </button>

                <h2>
                    New Chat
                </h2>

            </div>

            <div className="new-chat-search">

                <Search
                    size={18}
                    className="new-chat-search-icon"
                />

                <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />

            </div>

            {/* <div className="new-chat-users">

                {loading &&

                Array.from({length:5}).map((_,i)=>(

                <div
                    key={i}
                    className="skeleton-card"
                >

                <div className="skeleton-avatar"/>

                <div className="skeleton-lines">

                <div className="skeleton-line long"/>

                <div className="skeleton-line short"/>

                </div>

                </div>

                ))
                }

                {!loading && users.length === 0 && searchEmail && (

                    <p className="search-status">
                        No users found.
                    </p>

                )}

                {users.map((user) => (

                    <div
                        key={user._id}
                        className="new-chat-user-card"
                        onClick={() => createConversation(user)}
                    >

                        <UserAvatar
                            user={user}
                            size={46}
                        />

                        <div className="new-chat-user-info">

                            <h4>
                                {user.username}
                            </h4>

                            <span>
                                {user.email}
                            </span>

                        </div>

                    </div>

                ))}

            </div> */}
            <div className="new-chat-users">

    {searchEmail.trim() === "" ? (

        <>

            <p className="new-chat-section-title">
                Recent Contacts
            </p>

            {conversations.length === 0 ? (

                <p className="search-status">
                    No recent chats.
                </p>

            ) : (

                conversations.map((conversation) => {

                    const currentUserId = localStorage.getItem("userId");

                    const otherUser = conversation.participants.find(
                        (p) => String(p._id) !== String(currentUserId)
                    );

                    if (!otherUser) return null;

                    return (

                        <div
                            key={conversation._id}
                            className="new-chat-user-card"
                            onClick={() => createConversation(otherUser)}
                        >

                            <UserAvatar
                                user={otherUser}
                                size={46}
                            />

                            <div className="new-chat-user-info">

                                <h4>
                                    {otherUser.username}
                                </h4>

                                <span>
                                    {otherUser.email}
                                </span>

                            </div>

                        </div>

                    );

                })

            )}

        </>

    ) : (

        <>

            {loading &&

                Array.from({ length: 5 }).map((_, i) => (

                    <div
                        key={i}
                        className="skeleton-card"
                    >

                        <div className="skeleton-avatar" />

                        <div className="skeleton-lines">

                            <div className="skeleton-line long" />

                            <div className="skeleton-line short" />

                        </div>

                    </div>

                ))

            }

            {!loading && users.length === 0 && (

                <p className="search-status">
                    No users found.
                </p>

            )}

            {!loading && users.map((user) => (

                <div
                    key={user._id}
                    className="new-chat-user-card"
                    onClick={() => createConversation(user)}
                >

                    <UserAvatar
                        user={user}
                        size={46}
                    />

                    <div className="new-chat-user-info">

                        <h4>
                            {user.username}
                        </h4>

                        <span>
                            {user.email}
                        </span>

                    </div>

                </div>

            ))}

        </>

    )}

</div>

        </div>

    );

};

export default NewChatPanel;