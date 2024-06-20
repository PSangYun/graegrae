import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './profile.css';
import profileList from './profileList';

export default function Profile() {
    const navigate = useNavigate();
    const [menuClicked, setMenuClicked] = useState(false);

    const handleProfileClick = (profile) => {
        navigate(`/profile/${profile.name}`, { state: { profile } });
    };

    const isMenuClicked=()=>{
        if(menuClicked==false){
            setMenuClicked(true);
        }else{
            setMenuClicked(false);
        }
    }

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const profileChunks = chunkArray(profileList, 5);

    return (
        <div className="Profile">
            {!menuClicked ? (
                <div className='mainScreen'>
                    <button className="menuBtn" onClick={isMenuClicked}></button>
                    <div className='profileH1'>
                        <img src={process.env.PUBLIC_URL + '/profileIcon.png'} alt="profileH1" />위인 프로필
                    </div>
                    <div className='Greats'>
                        {profileChunks.map((chunk, chunkIndex) => (
                            <div key={chunkIndex} className='profileChunk'>
                                {chunk.map((profile, index) => (
                                    <button key={index} className='great1' onClick={() => handleProfileClick(profile)}>
                                        <img className="greatProfileList" src={process.env.PUBLIC_URL + profile.image} alt="profileH1" /> {profile.name}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
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
