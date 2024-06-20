import React from "react";
import profileList from "./profileList";
import './dialogProfiles.css';

export default function Dialog({ onClose ,onStartChat }) {
    
    return (
        <div className="container">
            <div className="containerDialog">
                <div className="containerHeader">
                    <div className="dialogTitle">인물목록</div>
                    <button className="dialogCloseBtn" onClick={onClose}>X</button>
                </div>
                <div className="dialogBody">
                    {profileList.map((profile, index) => (
                        <button key={index}
                            className="dialogProfileBtn"
                            onClick={() => onStartChat(profile)}
                            >
                            <img src={profile.image} className="dialogProfileImg" alt={profile.name}/>
                            {profile.name}
                        </button>
                ))}
                </div>
            </div>
        </div>
    );
}