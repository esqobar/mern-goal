import {useEffect, useState} from "react";
import {FaUser} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {register, reset} from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const { name, email, password, confirmPassword } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if(isError){
            toast.error(message)
        }

        if(isSuccess || user){
            navigate('/')
        }

        dispatch(reset())
    }, [ user, isLoading, isError, isSuccess, message ]);


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if(password !== confirmPassword){
            toast.error('Passwords do not match')
        } else {
            const userData = {
                name,
                email,
                password,
            }
            dispatch(register(userData))
        }
    }

    if(isLoading) {
        return <Spinner />
    }

    return (
        <>
            <section className='heading'>
                <h1>
                    <FaUser /> Register
                </h1>
                <p>Please create an account</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input type='text' className='form-control' id='name' name='name' value={name}
                               placeholder='Please Enter your Name' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <input type='email' className='form-control' id='email' name='email' value={email}
                               placeholder='Please Enter your Email' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <input type='password' className='form-control' id='password' name='password' value={password}
                               placeholder='Please Enter your Password' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <input type='password' className='form-control' id='confirmPassword' name='confirmPassword' value={confirmPassword}
                               placeholder='Please Enter Confirm your Password' onChange={onChange} />
                    </div>
                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>Submit</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register