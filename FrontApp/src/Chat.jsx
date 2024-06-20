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
    const [isListClicked, setIsListClicked] = useState(null);

    const [chatList, setChatList] = useState([]);
    const [greats, setGreats] = useState([]);

    const [key, setKey] = useState(0);
    const [lastMessage, setLastMessage] = useState(null);

    const [lastMessages, setLastMessages] = useState({});

    const [menuClicked, setMenuClicked] = useState(false);

    const isMenuClicked=()=>{
        if(menuClicked==false){
            setMenuClicked(true);
        }else{
            setMenuClicked(false);
        }
    }

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

    
    const handleListClick = (profile)=>{
        setIsListClicked(profile);
        setSelectedProfile(profile);
        if (profile !== selectedProfile) {
            setKey((prevKey) => prevKey + 1);
            setLastMessage(null);
        }
        
        navigate('/chatStart', { state: { profile, lastMessages } });
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
                   

            {!menuClicked? (
            <div className="chatListBody">
                <div className="chatListTitle">
                    <button className="chatmenuBtn"
                        onClick={isMenuClicked}></button>
                    
                    <div className="listTitle" >채팅목록</div>
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
                    <div className="listbottomSpace"></div>
                    
                </div>
            </div>
            
        ):(
            <div className='homeSidebar'>
                <button className="sidebarclose"
                onClick={isMenuClicked}>X</button>
                <button className='home home' onClick={() => {navigate('/Home'); setMenuClicked(false);}}><img src={process.env.PUBLIC_URL + '/homeIcon.png'} alt="homeIcon home"/>홈</button>
                <button className='home profile' onClick={() => {navigate('/Profile'); setMenuClicked(false);}}><img src={process.env.PUBLIC_URL + '/profileIcon.png'} alt="homeIcon profile"/>위인 프로필</button>
                <button className='home chat' onClick={() => {navigate('/Chat'); setMenuClicked(false);}}><img src={process.env.PUBLIC_URL + '/chatIcon.png'} alt="homeIcon chat"/>채팅</button>
                <button className='home question' onClick={() => alert("업데이트 예정입니다.")}><img src={process.env.PUBLIC_URL + '/questionIcon.png'} alt="homeIcon question"/>도움말</button>
                <button className='home settings' onClick={()=> {navigate('/Setting'); setMenuClicked(false);}}><img src={process.env.PUBLIC_URL + '/settingIcon.png'} alt="homeIcon setting"/>설정</button>
            </div>
        )}
  
        </div>

    );
}

/*

<div className="chatRightSide">
                {!chatList.length === 0 || selectedProfile ? (
                    <>
                        <ChatStart key={key} profile={selectedProfile} onLastMessage={handleLastMessage} lastMsg={handleMsg}  />
                    </>
                ) : (
                        <div className="startChatWrap">
                            위인 AI 와 대화를 시작해보세요!
                            <button className="StartChatBtn" onClick={toggleDialog}>채팅 시작하기</button>
                        </div>
                )}
                 

            </div>
 */