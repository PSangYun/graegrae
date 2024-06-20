import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import './setting.css';

import { useSelector, useDispatch } from "react-redux";
import authSlice from './store/auth-slice';

import { ref, set, push, onValue, update, remove } from 'firebase/database';
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { dbService, authService } from './firebase/fbInstance';
import { current } from "@reduxjs/toolkit";

export default function Setting(){
    const navigate = useNavigate();
    const apiKey = process.env.REACT_APP_API_KEY;


    const user=useSelector(state => state.auth);
    const dispatch=useDispatch();
    const { logout, login } = authSlice.actions;
    const auth=getAuth();

    const [userData, setUserData] = useState({email: "", nickname: "" });
    const [newNickname, setNewNickname] = useState("");
    const [currentPassword, setCurrentPassword]=useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [menuClicked, setMenuClicked] = useState(false);
    const isMenuClicked=()=>{
        if(menuClicked==false){
            setMenuClicked(true);
        }else{
            setMenuClicked(false);
        }
    }


    const [isGoogleLogin,setIsGoogleLogin] = useState(true);
    
    const logoutHandler = () => {
        dispatch(logout());
        alert('로그아웃 되었습니다.');
        navigate('/');
    }


    const [isEditClicked,setIsEditClicked]=useState(false);

    const deleteData = (path) => {
        const dataRef=ref(dbService, path);
        remove(dataRef)
            .then(() => {
                console.log('Data removed successfully.');
            })
            .catch((error) => {
                console.error('Error removing data: ', error);
            });
    };

    const handleDeleteChat=()=>{
        if(window.confirm("모든 채팅 기록을 삭제하시겠습니까?")){
            const whoUser=user.uid  
                ? user.uid
                : user.userInfo.id
            const path=`Chat/${whoUser}`;
            const path2=`Chat/sejong/${whoUser}`;
            const path3=`Chat/you/${whoUser}`;
            const path4=`Chat/lee/${whoUser}`;
            const path5=`Chat/ahn/${whoUser}`;
            const path6=`Chat/bang/${whoUser}`;
            const path7=`Chat/dangun/${whoUser}`;
            const path8=`Chat/gwang/${whoUser}`;
            const path9=`Chat/jang/${whoUser}`;
            const path10=`Chat/jeong/${whoUser}`;
            const path11=`Chat/kim/${whoUser}`;

            deleteData(path);
            deleteData(path2);
            deleteData(path3);
            deleteData(path4);
            deleteData(path5);
            deleteData(path6);
            deleteData(path7);
            deleteData(path8);
            deleteData(path9);
            deleteData(path10);
            deleteData(path11);
            
            alert("모든 채팅 기록이 삭제되었습니다.")
        }
    }

    const requireUser = async (currentPassword)=>{        
        try {
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    email: userData.email,
                    password: currentPassword,
                    returnSecureToken: true,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.error && data.error.message) {
                throw new Error(data.error.message);
            }

            return data.idToken; // reauthenticated user's idToken 반환
        } catch (error) {
            setError("Reauthentication failed: " + error.message);
            alert('현재 비밀번호와 일치하지 않습니다.');
            return null;
        }
    };

    const handleUpdateProfile = async () => {
        setError("");
        setSuccess("");

        if(!currentPassword){
            setError("사용자 인증을 위해 현 비밀번호 인증이 필요합니다.");
            return;
        }

        if(newPassword !== confirmPassword){
            setError("패스워드가 일치하지 않습니다.");
            // setIsEditClicked(false);
            return;
        }

        const idToken=await requireUser(currentPassword);
        if(!idToken) return;

        try{
            const userRef=ref(dbService, 'User/' + user.uid);

            if (newNickname) {
                await update(userRef, { nickname: newNickname });
            }

            if (newPassword) {
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        idToken: idToken,
                        password: newPassword,
                        returnSecureToken: true,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                dispatch(login({
                    token: data.idToken, 
                    experationTime: data.expiresIn,
                    uid: data.localId
                }));

                if (data.error && data.error.message) {
                    throw new Error(data.error.message);
                }
            }

            // dispatch(login({
            //     token: data.idToken, 
            //     experationTime: data.expiresIn,
            //     uid: data.localId
            // }));

            setSuccess("Profile updated successfully.");
            alert('변경 완료');
            setIsEditClicked(false);
            setError("");

        } catch(error){
            setError(error.message);
            setSuccess("");
            alert('변경 실패');
        }
    }


    useEffect(() => {
        // const userRef=ref(dbService, 'User/' + user.uid);
        const userRef=user.uid  
            ? ref(dbService, 'User/' + user.uid)
            : ref(dbService, 'User/' + user.userInfo.id);
        
            setIsGoogleLogin(!user.uid);


        const unsubscribe = onValue(userRef, (snapshot) => {
            const data=snapshot.val();
            if (data){
                setUserData({
                    email: data.email, 
                    nickname: data.nickname || data.name, 
                });
            }
        });

        return () => {
            unsubscribe();
        };
    })

    return(
        <div className="settingPg">
            {!menuClicked? (
                <><button className="menuBtn"
                    onClick={isMenuClicked}></button><div className="settingRightSide">
                        <div className="settingTitle">설정</div>
                        <div className="settingMyInfoWrap">
                            <div className="settingMyInfoTitle">내 정보
                            {!isGoogleLogin &&  !isEditClicked ?(
                                            <button className="editBtn"
                                                onClick={() => setIsEditClicked(true)}
                                            >
                                                수정하기</button>

                                        ):(
                                            <button className="editCompleteBtn"
                                            onClick={handleUpdateProfile}
                                        >
                                            완료</button>
                                        )}
                            </div>
                            <div className="settingLine"></div>
                            <div className="settingEditWrap">
                                {!isEditClicked ? (
                                    <>  <div className="editTypeWrap">
                                        <div className="editType">닉네임</div>
                                        <div className="editType">아이디</div>
                                        <div className="editType">비밀번호</div>

                                    </div>
                                        <div className="editedWrap">
                                            {/* <div className="edited">{user.uid}</div> */}
                                            <div className="edited">{userData.nickname}</div>
                                            <div className="edited">{userData.email}</div>
                                            <div className="edited">*********</div>

                                        </div>
                                    </>
                                ) : (
                                    <>  <div className="editTypeWrap">
                                        <div className="editType">닉네임</div>
                                        <div className="editType">아이디</div>
                                        <div className="editType">현재 비밀번호</div>
                                        <div className="editType">새 비밀번호</div>
                                        <div className="editType">비밀번호 확인</div>
                                    </div>
                                        <div className="editedWrap">
                                            <input
                                                className="editInput"
                                                type='text'
                                                placeholder={userData.nickname}
                                                value={newNickname}
                                                onChange={(e) => setNewNickname(e.target.value)}>
                                            </input>
                                            <div className="editInput">{userData.email}</div>
                                            <input
                                                className="editInput"
                                                type='password'
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            >
                                            </input>
                                            <input
                                                className="editInput"
                                                type='password'
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            >
                                            </input>
                                            <input
                                                className="editInput"
                                                type='password'
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            >
                                            </input>
                                        </div>
                                        </>
                                )}

                            </div>
                            {/* {error && <p style={{ color: "red" }}>{error}</p>}
    {success && <p style={{ color: "green" }}>{success}</p>} */}
                        </div>
                        <div className="settingChat">
                            <div className="settingChatTitle">채팅설정</div>
                            <div className="settingLine"></div>
                            <button className="settingDeleteChat"
                                onClick={handleDeleteChat}>
                                모든 채팅 기록 삭제하기</button>

                        </div>
                        <button onClick={logoutHandler} className="settingLogout">로그아웃</button>
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