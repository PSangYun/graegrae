import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './profile.css';
import profileList from './profileList';


export default function Profile(){
    const navigate = useNavigate();

    const handleProfileClick = (profile) => {
        navigate(`/profile/${profile.name}`,{state:{profile}});
    }

    return(
    <div className= "Profile">
        <div className='sidebar'>
            <button className='profile home' onClick={() => navigate('/Home')}><img src={process.env.PUBLIC_URL + '/homeIcon.png'} alt="homeIcon home"/>홈</button>
            <button className='profile profile' onClick={() => navigate('/Profile')}><img src={process.env.PUBLIC_URL + '/profileIcon.png'} alt="homeIcon profile"/>위인 프로필</button>
            <button className='profile chat' onClick={() => navigate('/Chat')}><img src={process.env.PUBLIC_URL + '/chatIcon.png'} alt="homeIcon chat"/>채팅</button>
            <button className='profile question' onClick={() => alert("업데이트 예정입니다.")}><img src={process.env.PUBLIC_URL + '/questionIcon.png'} alt="homeIcon question"/>도움말</button>
            <button className='profile settings' onClick={()=> navigate('/Setting')}><img src={process.env.PUBLIC_URL + '/settingIcon.png'} alt="homeIcon setting"/>설정</button>
        </div>
        <div className='mainScreen'>
            <div className='profileH1'><img src={process.env.PUBLIC_URL + '/profileIcon.png'} alt="profileH1"/>위인 프로필</div>
            <div className='Greats'>
                {profileList.map((profile, index) => (
                    <button key={index} className='great1' onClick={() => handleProfileClick(profile)}>
                        <img className="greatProfileList" src={process.env.PUBLIC_URL + profile.image} alt="profileH1"/> {profile.name}
                    </button>
                ))}
            </div>
        </div>
    </div>
    );
}
