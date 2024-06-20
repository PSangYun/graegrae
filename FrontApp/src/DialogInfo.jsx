import React from "react";
import './dialogInfo.css';
import { Navigate, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import authSlice from './store/auth-slice';

import { dbService, authService } from './firebase/fbInstance';
import { ref, child, get, update, remove } from "firebase/database";

export default function DialogInfo({ profile, onClose }) {
    const navigate = useNavigate();

    const user=useSelector(state => state.auth);
    const who=user.uid
        ?user.uid
        :user.userInfo.id;
        

    const handleDelete=async()=>{
        if(window.confirm("채팅 기록을 삭제하시겠습니까?")){
            const path=`Chat/${profile.id}/${who}`;
            const dataRef=ref(dbService, path);
            remove(dataRef)
                .then(() => {
                    console.log('Data removed successfully.');
                })
                .catch((error) => {
                    console.error('Error removing data: ', error);
                });

            const path2=ref(dbService, `Chat/${who}/great`);
            try{
                const snapshot = await get(path2);
                if(snapshot.exists()){
                    let greatList=snapshot.val();

                    greatList=greatList.filter(person => person.id !== profile.id);

                    await update(ref(dbService, `Chat/${who}`), {great: greatList});
                    alert('삭제되었습니다.');
                    navigate('/Home');
                    

                } else{
                    console.log("no data");
                }
            } catch(error) {
                console.error("Error");
            }
        }
    };

    const handleinfoProfile=()=>{
        navigate(`/profile/${profile.name}`,{state:{profile}});
    }
    return (
        <div className="container">
        <div className="dialogInfoContainer">
            <div className="infocontainerHeader">
            <div className="infodialogTitle">정보</div>
                <button className='dialoginfoCloseBtn' onClick={onClose}>X</button>
            </div>
            <div className="dialogInfoBody">
            <div className='dialogName'>{profile.name}</div>
                <img className='dialogImg'src={profile.image} alt={profile.name} />
                <button className="dialogNavigate"
                onClick={handleinfoProfile}>프로필 보기</button>
                
                <button className="deleteChatBtn" onClick={handleDelete}>채팅 기록 삭제하기</button>
            </div>
        </div>
        </div>
    );
}