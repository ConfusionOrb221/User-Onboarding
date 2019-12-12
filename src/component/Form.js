import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const LoginForm = ({values, errors, touched, isSubmitting, status}) => {
    const [userData, setUserData] = useState([]);

    useEffect(() =>{
        status && setUserData(userData => [...userData, status]);
        console.log(userData);
    }, [status])
    console.log()
    return (
        <>
        <Form>
            <div>
                {touched.name && errors.name && <p> {errors.name} </p>}
                <Field type="text" name="name" placeholder="Name" />
            </div>
            <div>
                {touched.email && errors.email && <p> {errors.email} </p>}
                <Field type="email" name="email" placeholder="Email" />
            </div>
            <div>
                {touched.password && errors.password && <p> {errors.password} </p>}
                <Field type="password" name="password" placeholder="Password" />
            </div>
            <div>
                <label>
                    {errors.tos}
                    <Field type="checkbox" name="tos" checked={values.tos} />
                    Accept Tos
                </label>
            </div>
            <button disabled={isSubmitting} type="submit"> Submit </button>
        </Form>
            <h1> Users </h1>
        { userData.length === 0 ? <></> : 
            userData.map(i => (
                <div>
                    <ul>
                        <li> {i.name} </li>
                        <li> {i.email} </li>
                        <li> {i.password} </li>
                    </ul>
                </div>
            ))
        }
        </>
    );
};

const FormikLoginForm = withFormik({
    mapPropsToValues({name, email, password, tos}){
        return {
            name: name || '',
            email: email || '',
            password: password || '',
            tos: tos || false,
        }
    },
    validationSchema: Yup.object().shape({
        name: Yup.string()
        .required('Name is required'),
        email: Yup.string()
        .email('Email not valid')
        .required('Email is required'),
        password: Yup.string()
        .min(13, 'Password must be 13 characters or longer')
        .required('Password is required'),
        tos: Yup.boolean()
        .oneOf([true], 'Must Accept Terms and Conditions')
        .required()
    }),
    handleSubmit(values, {resetForm, setErrors, setStatus, setSubmitting}){
        if(values.tos === false){
            setErrors({ tos: 'Must Accept Terms and Conditions'})
            return;
        } else {
            axios
                .post('https://reqres.in/api/users', values)
                .then(res =>{
                    console.log(res);
                    resetForm();
                    setStatus(res.data);
                    setSubmitting(false);
                })
                .catch(err =>{
                    console.log(err);
                    setSubmitting(false);
                });
        }
    }
})(LoginForm);

export default FormikLoginForm;