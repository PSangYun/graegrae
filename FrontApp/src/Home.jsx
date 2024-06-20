import React, {useState, useRef, useEffect} from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import './home.css';
import profileList from "./profileList"; 



export default function Home(){
    const navigate = useNavigate();

    const [randomProfile, setRandomProfile] = useState(null);
    const [menuClicked, setMenuClicked] = useState(false);

    // 랜덤 프로필 선택 함수
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * profileList.length);
        const selectedProfile = profileList[randomIndex];
        setRandomProfile(selectedProfile);
    }, []);

    const isMenuClicked=()=>{
        if(menuClicked==false){
            setMenuClicked(true);
        }else{
            setMenuClicked(false);
        }
    }
    return(
    <div className= "Home">
        {!menuClicked? (
            <><div>
                    <button className="menuBtn"
                        onClick={isMenuClicked}></button>
                </div><div className='homeRightSide'>
                        <div class="book" style={{ backgroundImage: `url(${randomProfile ? randomProfile.image : ''})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' , backgroundPosition:'center'}}>

                            <div className="cardBtnWrap">
                                <button className='cardBtn' onClick={() => navigate(`/profile/${randomProfile.name}`)}>자세히 보기</button>
                            </div>
                            <div class="cover">
                                <p style={{ color: '#6A3E1D' }}>Who?</p>
                            </div>
                        </div>
                    </div></>
            
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
