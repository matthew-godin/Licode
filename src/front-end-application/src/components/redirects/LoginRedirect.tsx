import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRedirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/signin');
    });
    setTimeout(function() {
        document.getElementsByTagName('div')[0].click();
    }, 100);
    return (
        <div />
    );
}

export default LoginRedirect;