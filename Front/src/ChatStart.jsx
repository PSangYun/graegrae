import React, {useState, useRef, useEffect} from "react";

import { useSelector, useDispatch } from "react-redux";
import authSlice from './store/auth-slice';

import { dbService, authService } from './firebase/fbInstance';
import { ref, set, push, onChildAdded } from "firebase/database";

export default function ChatStart({profile, onLastMessage, lastMsg}) {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatWrapRef = useRef(null);
    const [chatList, setChatList]=useState([]);

    const prevMessagesRef = useRef([]);

    const user=useSelector(state => state.auth);
    const who=user.uid
        ?user.uid
        :user.userInfo.id;
    const userRef=ref(dbService, `Chat/${profile.id}/${who}`);
    
    /*마지막 메세지 저장*/
    const [lastMessage, setLastMessage] = useState(null);
    
    useEffect(() => {
        prevMessagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        const unsubscribe = onChildAdded(userRef, (snapshot) => {
            const newMessage = snapshot.val();
            // setMessages(prevMessages => [...prevMessages, newMessage]);
            // if (onLastMessage) {
            //     onLastMessage(newMessage);
            // }

            setMessages(prevMessages => {
                if (!prevMessages.some(msg => msg.message === newMessage.message && msg.sender === newMessage.sender)) {
                    if (onLastMessage) {
                        onLastMessage(newMessage);
                    }
                    return [...prevMessages, newMessage];
                }
                return prevMessages;
            });
        });

        return () => unsubscribe();
    }, []);

    const addMessage = (sender, message) => {
        const newMessage = { sender, message };
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, newMessage];
            setLastMessage(newMessage);
            return newMessages;
        });
        if (onLastMessage) {
            onLastMessage(newMessage);
        }

        const newMessageRef=push(userRef);
        set(newMessageRef, newMessage);

        // if(sender!='user' && !chatList.includes(sender)){
        //     setChatList([...chatList, sender]);
        // }

        // const userRef=ref(dbService, `Chat/${profile.id}/${who}`);
        // const chatRef=ref(dbService, `Chat/${who}`);
        // set(chatRef, )

    };

    const handleSendMessage = async () => {
        const message = userInput.trim();
        if (message.length === 0) return;

        addMessage('user', message);
        setUserInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/chat-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_message: message,
                    character_name: profile.id, 
                    who: who
                }),
            });

            const data = await response.json();
            const aiResponse = data.response_message || 'No response';
            addMessage(`${profile.name}`, aiResponse);

            // const chatRef = ref(dbService, `Chat/${who}/${profile.id}`);
            // set(chatRef, {
            //     great: profile.name, 
            //     last: aiResponse,
            // });

            // if(!chatList.includes(profile.name)){
            //     setChatList([...chatList, profile.name]);
            // }

            // const chatRef = ref(dbService, `Chat/${who}`);
            // set(chatRef, {
            //     great: [...chatList]
            // });


        } catch (error) {
            console.error('오류 발생!', error);
            addMessage('bot', '오류 발생!');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (chatWrapRef.current) {
            chatWrapRef.current.scrollTop = chatWrapRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className='chatWrap' ref={chatWrapRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`messageWrapper ${msg.sender}`}>
                        {msg.sender !== 'user' && (
                            <div className='senderName'>
                                {msg.sender}
                            </div>
                        )}
                        <div className={msg.sender === 'user' ? "message user" : "message AI"}>
                            {msg.message}
                        </div>
                    </div>
                ))}
                {loading && <span className="message AI">...</span>}
            </div>
            <div className='inputWrap'>
                <input className="chatInput"
                    type='text' placeholder='메시지를 입력하세요'
                    value={userInput} onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown} />
                <button className="chatSendMsg" onClick={handleSendMessage}></button>
            </div>
        </>
    );
}
