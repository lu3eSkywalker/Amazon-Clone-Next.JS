import React from 'react';
import useLogin,  { LoginForm }  from '../Authentication/Login';

const LoginSeller = () => {
    const { formData, changeHandler, buttonHandler } = useLogin({userType: 'seller'});


  return (
    <LoginForm formData={formData} changeHandler={changeHandler} buttonHandler={buttonHandler} />
  )
}

export default LoginSeller;