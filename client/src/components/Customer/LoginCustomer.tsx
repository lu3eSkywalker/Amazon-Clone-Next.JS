import React from 'react'
import useLogin, { LoginForm } from '../Authentication/Login'

const LoginCustomer = () => {

const { formData, changeHandler, buttonHandler } = useLogin({userType: 'customer'});


  return (
 <LoginForm formData={formData} changeHandler={changeHandler} buttonHandler={buttonHandler} /> 
  )
}

export default LoginCustomer