import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // localStroage에서 token에 해당하는 값을 초기값으로
        token: localStorage.getItem('token'),
        
        // localStorage에 인증 토큰이 존재한다면 로그인 상태를 불리언 값으로
        isLoggedIn: !!localStorage.getItem('token'),
        //uid: localStorage.getItem('uid'), 
        // user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        uid: null, 
        userInfo: null
    },
    reducers: {
        login(state, action) {
            state.token = action.payload.token;
            state.isLoggedIn = true;
            
            state.uid=action.payload.uid;
            state.userInfo=null;

            // localStroage에 token이라는 키로 인증 토큰을 저장
            localStorage.setItem('token', action.payload.token);
            
            // localStorage experationTime이라는 키로 토큰 만료 기간을 저장 
            localStorage.setItem('experationTime', action.payload.experationTime);

            localStorage.setItem('uid', action.payload.uid);
            localStorage.removeItem('userInfo');
        },
        logout(state) {
            state.token = null;
            state.isLoggedIn = false;
            state.uid=null;
            
            // localStorage에 token이라는 키의 값을 제거한다.
            localStorage.removeItem('token');
            
            // localStorage에 experationTime이라는 키의 값 제거
            localStorage.removeItem('experationTime');
            localStorage.removeItem('uid');
            // localStorage.removeItem('user');
            state.userInfo=null;
            localStorage.removeItem('userInfo');
        }, 
        setUserInfo: (state, action) => {
            state.isLoggedIn = true;
            state.uid=null;
            state.userInfo=action.payload;

            localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            localStorage.removeItem('uid');
        }
    }
});

export default authSlice;