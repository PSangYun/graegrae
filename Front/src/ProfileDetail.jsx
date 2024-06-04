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

    const carouselImages = [
        card[0], card[1], card[2], card[3]
    ];

    return(
        <div className="ProfileDetail">
            <div className="detailSideBar">
            <button className='profile home' onClick={() => navigate('/Home')}><img src={process.env.PUBLIC_URL + '/homeIcon.png'} alt="homeIcon home"/></button>
            <button className='profile profile' onClick={() => navigate('/Profile')}><img src={process.env.PUBLIC_URL + '/profileIcon.png'} alt="homeIcon profile"/></button>
            <button className='profile chat' onClick={() => navigate('/Chat')}><img src={process.env.PUBLIC_URL + '/chatIcon.png'} alt="homeIcon chat"/></button>
            <button className='profile question' onClick={() => alert("업데이트 예정입니다.")}><img src={process.env.PUBLIC_URL + '/questionIcon.png'} alt="homeIcon question"/></button>
            <button className='profile settings' onClick={()=> navigate('/Setting')}><img src={process.env.PUBLIC_URL + '/settingIcon.png'} alt="homeIcon setting"/></button>
            </div>
            <div className="ProfileMainContent">
                <img src={process.env.PUBLIC_URL + profile.background} alt="profileBackground" className="profileBackground"/>
                <img src={process.env.PUBLIC_URL + profile.image} alt={profile.name} className="profileImage"/>
                <h1 className="profileName">{profile.name}</h1>
                <h3 className="profileComment">{profile.comment}</h3>
                <Carroussel className="Carroussel" profileId = {profile.id} images={carouselImages}/>
                
            </div>
            
        </div>
    );
}
