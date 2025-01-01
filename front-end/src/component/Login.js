import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Login=()=>{
        const [email, setEmail]= React.useState('');
        const [password, setPassword]= React.useState('');
        const navigate = useNavigate();
        useEffect(()=>{
            const auth = localStorage.getItem('user');
            if(auth){
                navigate("/");
            }
        })
        const handleLogin= async ()=>{
            let result= await fetch("http://localhost:5000/login",{
                method: 'post',
                body: JSON.stringify({email, password}),
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            result= await result.json();
            console.warn(result);
            if(result.auth){
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', JSON.stringify(result.auth));

                navigate("/");
            }
            else{
                alert("please enter correct Details");
            }
        }
        return (
            <div className='login'>
                <h1>Login</h1>
                <input type ="text" className='inputbox' placeholder='Enter Email' value={email} onChange={(e)=>{ setEmail(e.target.value)}}/>
                <input type ="password" className='inputbox' placeholder='Enter password' value={password} onChange={(e)=>{ setPassword(e.target.value)}}/>
                <button onClick={handleLogin} type="button" className='appButton'>Login</button>
            </div>
        )
    
}
export default Login;