import React, {useState, useRef, useEffect} from "react";
import './chat.css';
import ChatStart from "./ChatStart";
import Dialog from "./DialogProfiles";
import DialogInfo from "./DialogInfo";
import { Navigate, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import authSlice from './store/auth-slice';

import { dbService, authService } from './firebase/fbInstance';
import { ref, set, push, onChildAdded, onValue } from "firebase/database";

export default function Chat(){
    const navigate = useNavigate();
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isListClicked, setIsListClicked] = useState(null);

    const [chatList, setChatList] = useState([]);
    const [greats, setGreats] = useState([]);

    const [key, setKey] = useState(0);
    const [lastMessage, setLastMessage] = useState(null);

    const [lastMessages, setLastMessages] = useState({});

    const user=useSelector(state => state.auth);
    const who=user.uid
        ?user.uid
        :user.userInfo.id;

    useEffect(()=>{

        const chatRef = ref(dbService, `Chat/${who}/great`);
        onValue(chatRef, (snapshot) => {
            const data=snapshot.val();
            if (data) {
                setChatList(data);
                if (data.length > 0) {
                    setSelectedProfile(data[0]);
                }
            }
        });

        fetchLastMessages();
    }, []);

    useEffect(() => {
        if(chatList.length>0)
            fetchLastMessages();
    }, [chatList]);

    const fetchLastMessages = () => {
        chatList.forEach(profile => {
            const lastMsgRef=ref(dbService, `Chat/${profile.id}/${who}`);
            onValue(lastMsgRef, (snapshot) => {
                const data = snapshot.val();
                if(data) {
                    const lastMessage = Object.values(data).pop();
                    setLastMessages(prevMessages => ({
                        ...prevMessages, 
                        [profile.name]: lastMessage
                    }));
                }
            });
        });
    };

    const toggleDialog=()=>{
        setIsDialogOpen(!isDialogOpen);
    };
    const handleStartChat = (profile) => {
        setSelectedProfile(profile);
        setIsDialogOpen(false);
        if (!chatList.some(p => p.name === profile.name)) {
            setChatList([...chatList, profile]);
            setGreats([...greats, profile.name]);

            const chatRef = ref(dbService, `Chat/${who}`);
            set(chatRef, {
                great: [...chatList, profile]
            });
        }
        setKey(prevKey => prevKey + 1);
    };

    const toggleInfoDialog = () => { // Info 다이얼로그 열기/닫기 토글 함수
        setIsInfoOpen(!isInfoOpen);
    };
    const handleListClick = (profile)=>{
        setIsListClicked(profile);
        setSelectedProfile(profile);
        if (profile !== selectedProfile) {
            setKey((prevKey) => prevKey + 1);
            setLastMessage(null);
        }
    }
    const handleLastMessage = (msg) => {
        setLastMessage(msg);
    };

    const handleMsg = (name, msg) => {
        setLastMessages(prevMessages => ({
            ...prevMessages,
            [name]: msg
        }));
    };

    useEffect(() => {
        if (lastMessage && selectedProfile) {
            handleMsg(selectedProfile.name, lastMessage);
        }
    }, [lastMessage, selectedProfile]);

    return(
        <div className="Chatbody">
            {isDialogOpen && <Dialog onClose={toggleDialog} onStartChat={handleStartChat} />}
            <div className='chatSideBar'>
                <button className='chat home' onClick={() => navigate('/Home')}><img src={process.env.PUBLIC_URL + '/homeIcon.png'} alt="homeIcon home"/></button>
                <button className='chat profile' onClick={() => navigate('/Profile')}><img src={process.env.PUBLIC_URL + '/profileIcon.png'} alt="homeIcon profile"/></button>
                <button className='chat chat' onClick={() => navigate('/Chat')}><img src={process.env.PUBLIC_URL + '/chatIcon.png'} alt="homeIcon chat"/></button>
                <button className='chat question' onClick={() => alert("업데이트 예정입니다.")}><img src={process.env.PUBLIC_URL + '/questionIcon.png'} alt="homeIcon question"/></button>
                <button className='chat setting' onClick={() => navigate('/Setting')}><img src={process.env.PUBLIC_URL + '/settingIcon.png'} alt="homeIcon setting"/></button>
            </div>
            <div className="chatListBody">
                <div className="chatListTitle">
                    채팅목록
                    <button className="chatPlusChatBtn" onClick={toggleDialog}/>
                </div>
                <div className="chatLists">
                    {selectedProfile ? (
                        chatList.map((profile, index) => (
                            <button
                                key={index}
                                className={`chatListWrap ${selectedProfile === profile ? 'clicked' : ''}`}
                                onClick={()=>handleListClick(profile)}
                            >
                                <img className="chatListImg" src={profile.image} alt={profile.name} />
                                <div className="chatListrightWrap">
                                    <div className="chatListName">{profile.name}</div>
                                    <div className="chatListMsg">{lastMessages[profile.name] ? lastMessages[profile.name].message : '채팅내용이 없습니다'}</div>
                                </div>
                            </button>
                        ))
                    ):(
                        <div></div>
                    )
                    }
                    
                </div>
            </div>
            <div className="chatRightSide">
                {!chatList.length === 0 || selectedProfile ? (
                    <>
                        <div className='chatPersonName'>
                            <img className="personImg" src={selectedProfile.image} alt={selectedProfile.name}/>
                            {selectedProfile.name}
                            <button className="chatInfoBtn" onClick={() => setIsInfoOpen(true)}></button>
                            
                        </div>
                        <ChatStart key={key} profile={selectedProfile} onLastMessage={handleLastMessage} lastMsg={handleMsg}  />
                    </>
                ) : (
                        <div className="startChatWrap">
                            위인 AI 와 대화를 시작해보세요!
                            <button className="StartChatBtn" onClick={toggleDialog}>채팅 시작하기</button>
                        </div>
                )}
                 {isInfoOpen && <DialogInfo profile={selectedProfile} onClose={toggleInfoDialog} />}

            </div>
  
        </div>

    );
}