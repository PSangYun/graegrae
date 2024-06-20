import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

import { signInWithEmailAndPassword } from "firebase/auth";
import { authService, dbService } from './firebase/fbInstance';
import { ref, set } from "firebase/database"

import { useSelector, useDispatch } from 'react-redux';
import authSlice from './store/auth-slice';

import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login(){
    const navigate = useNavigate();
    const apiKey = process.env.REACT_APP_API_KEY;


    const dispatch=useDispatch();
    const { login, setUserInfo } = authSlice.actions;

    const [id,setId]=useState('');
    const [pw, setPw]=useState('')
    const [idValid, setIdValid]=useState(false);
    const [pwValid, setPwValid]=useState(false);
    const [notAllow, setNotAllow]=useState(true);


    const handleId=(e)=>{
        const value = e.target.value;
        setId(value);
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(value)) {
            setIdValid(true);
        } else {
            setIdValid(false);
        }
    }

    const handlePw = (e) => {
        const value = e.target.value;
        setPw(value);
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;
        if (regex.test(value)) {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    }



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onClickConfirmBt();
        }
    }
    const onClickConfirmBt = async () => {
        //login_back(id, pw);
        try{
            const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
            const response=await fetch(url, {
                method: 'POST', 
                body: JSON.stringify({
                    email: id, 
                    password: pw, 
                    returnSecureToken: true,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data=await response.json();

            if(data.error && data.error.message) {
                throw new Error(data.error.message);
            }
            if(response.ok){
                dispatch(login({
                    token: data.idToken, 
                    experationTime: data.expiresIn,
                    uid: data.localId
                }));
            }
            
            console.log(data);
            alert('로그인 성공');
            navigate("/Home");
        } catch(error){
            console.log(error);
            alert('로그인 실패');
        }


    }

    const googleLogin = () => {
        window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?
		client_id=${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
		&redirect_uri=${process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI}
		&response_type=code
		&scope=email profile`;
    }
    const googleLgn = useGoogleLogin({
        onSuccess: async (response) => {
            try{
                console.log('Google login response: ', response);
                const token=response.access_token;
                if(!token){
                    throw new Error('No token received');
                }
                // const userInfo = jwtDecode(token);
                const userInfoResponse=await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userInfo=await userInfoResponse.json();
                dispatch(setUserInfo(userInfo));

                const userRef=ref(dbService, 'User/' + userInfo.id);
                set(userRef, userInfo);

                alert('로그인 성공');
                navigate('/home');
            } catch (error){
                console.error('Google login failed: ', error);
                alert('Google 로그인 실패');
            }
            
            
        }, 
        onError: () => console.log('Google Login Faield')
    });

    useEffect(() => {
        if (idValid && pwValid) {
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    }, [idValid, pwValid]);

    return (
        <div className='loginpage'>
            <img className='loginLogo' src="/logo.png" alt="Logo"/>
            <div className='loginTitleWrap'>로그인</div>

            <div className='loginInputWrap'>
                <input 
                    type='text'
                    className='loginInput'
                    placeholder='이메일을 입력하세요'
                    value={id} 
                    onChange={handleId}
                    onKeyDown={handleKeyDown}
                />
            </div>  
            <div className='loginErrorMessageWrap'>
                {!idValid && id.length > 0 && (
                    <div>올바른 이메일을 입력해주세요</div>
                )}
            </div>

            <div className='loginInputWrap'>
                <input 
                    type='password'
                    className='loginInput'
                    placeholder='비밀번호를 입력하세요'
                    value={pw}
                    onChange={handlePw}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className='loginErrorMessageWrap'>
                {!pwValid && pw.length > 0 && (
                    <div>영문, 숫자, 특수문자 포함 10자리 이상 입력해주세요</div>
                )}
            </div>

            <div>
                <button onClick={onClickConfirmBt} disabled={notAllow} className='loginLoginBt'>
                    확인
                </button>
            </div>
            <div>
                <button className='loginJoinBt' onClick={() => navigate('/join')}>회원가입</button>
            </div>

            <div className='loginLine'></div>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}>
            <div>
                {/* <button onClick={googleLogin} className='loginGoogleBt'></button> */}
                <button onClick={googleLgn} className='loginGoogleBt'></button>
            </div>

            </GoogleOAuthProvider>

        </div>
    );
}
