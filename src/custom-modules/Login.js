import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Emblem from './Emblem'
import TranslateMenu from './TranslateMenu'
import Footer from './Footer'
import '../css/login.css'
import '../css/index.css'

/**
 * Komponenti Login
 * @returns {JSX.Element} Forma e hyrjes
 */
function Login() {
    /** Hook per perkthimin */
    const { t } = useTranslation()

    return (
        <div className='login-page'>
            <TranslateMenu />
            <Formik
                initialValues={{ id: '', password: '' }}
                validate={values => {
                    const errors = {}
                    if (!values.id) {
                        errors.id = t('Ju lutem plotesoni gjitha fushat!')
                    } else if (!/^[0-9]+$/.test(values.id)) {
                        errors.id = t('Format Jo-Valid!')
                    }
                    if (!values.password) {
                        errors.password = t('Ju lutem plotesoni gjitha fushat!')
                    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(values.password)) {
                        errors.password = t('Passwordi duhet te kete 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character, dhe te kete 8 karaktere i gjatë')
                    }
                    return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                    // Simulate login attempt
                    alert(t('login_attempt', { id: values.id, password: values.password }))
                    setSubmitting(false)
                }}
            >
                {({ isSubmitting }) => (
                    <Form id='login-form'>
                        <Emblem />
                        <label>
                            {t('username')}:
                            <Field
                                type='number'
                                name='id'
                                pattern='[0-9]*'
                            />
                            <ErrorMessage name='id' component='div' className='error' />
                        </label>
                        <br/>
                        <label>
                            {t('password')}:
                            <Field
                                type='password'
                                name='password'
                                autoComplete='new-password'
                            />
                            <ErrorMessage name='password' component='div' className='error' />
                        </label>
                        <br/>
                        <a href='/'>{t('forgot_password')}</a>
                        <button
                            className='accent-button'
                            type='submit'
                            disabled={isSubmitting}
                        >
                            {t('login_button')}
                        </button>
                        <br/>
                    </Form>
                )}
            </Formik>
            <Footer />
        </div>
    )
}

export default Login;