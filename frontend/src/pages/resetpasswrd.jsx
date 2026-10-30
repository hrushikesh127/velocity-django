import React from 'react'
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiclient from '../utils/apiclient';
import { toast } from 'react-toastify';
import './resetpasswrd.css';



const resetpasswordschema= z.object({
     password: z.string()
        .min(4, "Password must be at least 8 characters"),

    confirmPassword: z.string()
        .min(1, "Confirm password is required")
}).refine((data)=>data.password === data.confirmPassword,{
    'message':"password do not match",
    path:['confirmPassword']
})

function Resetpassword() {
    const [searchparams] =useSearchParams()
    const uid= searchparams.get('uid');
    const token= searchparams.get('token');
    const {register,reset,handleSubmit,formState:{errors}}=useForm({resolver:zodResolver(resetpasswordschema)});
    console.log(uid,token)
    const onsubmit= async(data)=>{
        const newpassword = data.password;
        const uid64 = uid;
        

        try {
            await apiclient.post('reset-password/', {newpassword,uid64,token});
            toast.success('password reset succussfully')
            
        } catch (error) {
            toast.error('something went wrong')
            
        }
    }

  return (
    <div className="resetpassword">
        <form onSubmit={handleSubmit(onsubmit)}>
            <input {...register('password')} type="text" placeholder='Enter password'/>
            <input {...register('confirmPassword')} type="text" placeholder='Confirm password'/>
            {errors.confirmPassword && <em>{errors.confirmPassword.message}</em>}
            <button type='submit'>Reset password</button>
        </form>

    </div>
    
   
  )
}

export default Resetpassword;