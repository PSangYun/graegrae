import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './join.css'; 
import { addUser } from './userList'; 

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set, push } from 'firebase/database'
import { authService, dbService } from './firebase/fbInstance';

import { useSelector, useDispatch } from 'react-redux';
import authSlice from './store/auth-slice';

export default function Join(){
    const navigate = useNavigate();

    const dispatch=useDispatch();
    const { login } = authSlice.actions;

    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameValid, setNameValid]=useState(false);
    const [idValid, setIdValid]=useState(false);
    const [pwValid, setPwValid]=useState(false);
    const [confirmPwValid, setConfirmPwValid]=useState(false);
    const [notAllow, setNotAllow]=useState(true);

    const apiKey = process.env.REACT_APP_API_KEY;

    const handleSubmit = (e) => {
        e.preventDefault();
        // 폼 제출 로직 추가 (예: 입력 데이터 검증)
        console.log("Form submitted:", { name, id, password, confirmPassword });
    };
    const handleName = (e) => {
        const value = e.target.value;
        setName(value);
        if(value.length<2){
            setNameValid(false);
        }else{
            setNameValid(true);
        }
    }

    const handleEmail=(e)=>{
        const value = e.target.value;
        setId(value);
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(regex.test(value)){
            setIdValid(true);
        }else{
            setIdValid(false);
        }
    }
    const handlePw=(e)=>{
        const value = e.target.value;
        setPassword(value);
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;
        if(regex.test(value)){
            setPwValid(true);
        }else{
            setPwValid(false);
        }
    }
    const handleConfirmPw = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if(value === password){
            setConfirmPwValid(true);
        }else{
            setConfirmPwValid(false);
        }
        
    }
    const onClickConfirmBt= async()=>{

        try{
            const url=`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
            const response = await fetch(url, {
                method: 'POST', 
                body: JSON.stringify({
                    email: id, 
                    password: password, 
                    returnSecureToken: true
                }), 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data=await response.json();

            if(data.error && data.error.message) {
                throw new Error(data.error.message);
            }

            const userId=data.localId;
            await set(ref(dbService, 'User/' + userId), {
                email: id, 
                nickname: name, 
            });
            
            if(response.ok){
                console.log(data);
                alert('회원가입이 완료되었습니다');
                navigate('/');
            }
            
            // console.log(data);
            // alert('회원가입이 완료되었습니다');
            // navigate('/login');
        } catch(error){
            console.log(error);
            alert('회원가입 실패');
        }

    };
    useEffect(()=>{
        if(nameValid&&idValid&&pwValid&&confirmPwValid){
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    },[nameValid,idValid,pwValid,confirmPassword])



  return (
    <div className='joinPage'>
        <img className='joinLogo' src="logo.png" alt="Logo"/>
        <div className='joinWrap'>
            
            <div class='joinTitleWrap'>회원가입</div>

            <div className='joinInputWrap'>
                <input 
                    type='text'
                    className='joinInput'
                    placeholder='닉네임'
                    value={name}
                    onChange={handleName}/>
            </div>  

            <div className='joinErrorMessageWrap'>
                {name.length>0 && !nameValid &&(
                        <div>닉네임을 두 글자 이상입력해주세요</div>
                    )
                }
            </div>  
            <div className='joinInputWrap'>
                <input 
                    type='text'
                    className='joinInput'
                    placeholder='이메일'
                    value={id}
                    onChange={handleEmail}/>
            </div>
            <div className='joinErrorMessageWrap'>
                {!idValid && id.length>0 &&(
                        <div>올바른 이메일을 입력해주세요</div>
                    )
                }
            </div>  
            <div className='joinInputWrap'>
                <input 
                    type='password'
                    className='joinInput'
                    placeholder='비밀번호'
                    value={password}
                    onChange={handlePw}/>
            </div>
            <div className='joinErrorMessageWrap'>
                    {
                    !pwValid && password.length>0 &&(
                            <div>영문, 숫자, 특수문자 포함 10자리 이상 입력해주세요</div>
                        )
                    }
                </div>
            <div className='joinInputWrap'>
                <input 
                    type='password'
                    className='joinInput'
                    placeholder='비밀번호 확인'
                    value={confirmPassword}
                    onChange={handleConfirmPw}/>
            </div>
            <div className='joinErrorMessageWrap'>
                {!confirmPwValid && confirmPassword.length>0 &&(
                        <div>비밀번호가 일치하지 않습니다.</div>
                    )
                }  
            </div>
            <div>
                <button onClick={onClickConfirmBt} disabled={notAllow} className='loginLoginBt'>
                    확인
                </button>
            </div>
            <div className='isExistIdWrap'>
                이미 아이디가 있습니까?
                <button className='ExistId' onClick={()=>navigate('/')}> 로그인 </button>
            </div>
        </div>
    </div>
  );
}
