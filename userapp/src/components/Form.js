//Files
import './Form.css';

//Packages
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as yup from 'yup';

const formStructure = yup.object().shape({
    name: yup
        .string()
        .min(3, 'Name must have 3 or more characters')
        .required('Name is required'),
    email:yup
        .string()
        .email('Please provide a valid email')
        .required(' An email is required'),
    password: yup
        .string()
        .min(8, 'The password must have 8 or more characters')
        .required('Password must be included'),
    terms: yup.boolean().oneOf([true], 'Please agree to terms')
});

const Form = () => {
    const [buttonOff, setButtonOff] = useState(true);


//initial state for form inputs 
    const [formData, setFormData] =useState({
        name:'',
        email:'',
        password:'',
        terms:''
    });


// setting state for errors
    const [errors, setErrors] =useState({
        name:' ',
        email:'',
        password:'',
        terms:''
        });

// state for the post request 
    const [post, setPost] = useState([]);


    useEffect(() => {
        formStructure.isValid(formData).then(valid => {
            setButtonOff(!valid);});
        }, [formData]);


const formSubmit=evt => {
    evt.preventDefault();
    axios
    .post('https://reqres.in/api/users', formData)
    .then(res => {
        setPost(res.data);
        console.log('success', post);
        setFormData({
            name:'',
            email:'',
            password:'',
            terms:''
        });
    })
    .catch(err => console.log(err.response));
};

const validateChange=evt => {
    yup
    .reach(formStructure, evt.target.name)
    .validate(evt.target.value || evt.target.checked)
    .then(valid => {
        setErrors({
            ...errors,
            [evt.target.name]: ''
        });
    })
    .catch (err => {
        setErrors({
            ...errors,
            [evt.target.name]: err.errors[0]
        });
    });
    };

const inputChange = evt => {
    evt.persist();
    const newFormData = {
        ...formData, [evt.target.name]:
        evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value
    };
    validateChange(evt);
    setFormData(newFormData)
    };

return(
    <form onSubmit={formSubmit} className='form-section'>
        <div className ='form-box'>
        <label htmlFor="name" className='field-Input'>
            <input type='text' name='name' placeholder='Name' value={formData.name} onChange={inputChange}  />
            Name:
        </label>

        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
        <label htmlFor="email" className='field-Input'>
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={inputChange} />
            Email:
        </label>

        {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
        <label htmlFor="password" className='field-Input'>
            <input type='text' name='password' placeholder='Password' value={formData.password} onChange={inputChange} />
            Password:
        </label>

        {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
        <label htmlFor="terms" className='field-Input'>
            <input type='checkbox' name = 'terms' checked={formData.terms} onChange={inputChange}/>
            Agree to Terms & Conditions:
        </label>
        
        <pre> {JSON.stringify(post, null, 2)}</pre>
        <button disabled={buttonOff} type='submit'>
            Submit
        </button>
        </div>
    </form>
    )
}

export default Form; 