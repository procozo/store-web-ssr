/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { AuthService } from '@/demo/service/AuthService';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [storage, setStorage] = useState(false);
    const [loading, setLoading] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const toast = useRef<Toast | null>(null);
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const login = () => {
        try {
            setLoading(true);

            AuthService.authenticate({ email: email, password: password }).then((data: any) => {
                console.log(data);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('refresh_token', data.refreshToken);
                sessionStorage.setItem('userID', data.userID);
                if (data?.auth) {
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Success',
                        detail: data?.message,
                        life: 3000
                    });
                    router.push('/');
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'error',
                        detail: 'Please check the username and password',
                        life: 3000
                    });
                }
                setLoading(false);
            });
        } catch (error) { }
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast}></Toast>
            <div className="flex flex-column align-items-center justify-content-center">
                <div>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email1" type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full  mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputId="password1" value={password} feedback={false} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full mb-5" inputClassName="w-full p-3 "></Password>

                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={login}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
