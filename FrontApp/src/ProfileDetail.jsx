import React, {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import profileList from "./profileList";
import './profileDetail.css'
import Carroussel from "./Carousel";

export default function ProfileDetail() {
    const navigate = useNavigate();
    const {profileId} = useParams();
    const profile = profileList.find(p => p.name === profileId);
    const card = profile.cards;

    const [menuClicked, setMenuClicked] = useState(false);

    const carouselImages = [
        card[0], card[1], card[2], card[3]
    ];

    const isMenuClicked=()=>{
        if(menuClicked==false){
            setMenuClicked(true);
        }else{
            setMenuClicked(false);
        }
    }


    return(
        <div className="ProfileDetail">
            {!menuClicked ? (
                <div className="ProfileMainContent">
                    <button className="promenuBtn"
                        onClick={isMenuClicked}></button>
                        
                    <img src={process.env.PUBLIC_URL + profile.background} alt="profileBackground" className="profileBackground"/>
                    <img src={process.env.PUBLIC_URL + profile.image} alt={profile.name} className="profileImage"/>
                    <h1 className="profileName">{profile.name}</h1>
                    <h3 className="profileComment">{profile.comment}</h3>
                    <Carroussel className="Carroussel" profileId = {profile.id} images={carouselImages}/>
                
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
