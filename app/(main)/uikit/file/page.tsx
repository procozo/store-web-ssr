'use client';

import React, { useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ProductServiceHandler } from '@/demo/service/ProductServiceHandler';
import { useRouter } from 'next/navigation';
import withAuth from '@/demo/service/WithAuth';
const FileDemo = () => {
    const toast = useRef<Toast | null>(null);
    const [data, setData] = useState([]);
    const [file, setFile] = useState();
    const router = useRouter();
    const onUpload = () => {
        console.log('uploaded');
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            ProductServiceHandler.setProducts(file).then((res: any) => {
                console.log(res);
                if (res) {
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Success',
                        detail: 'File Uploaded',
                        life: 3000
                    });
                    router.push('/');
                }
            });
        }
    };

    const onTemplateSelect = () => {
        console.log('data');
    };

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12">
                <div className="card">
                    <h5>Store Management</h5>
                    <p>Add the proper file here by uploading the same (.csv, .xlsx)</p>
                    <p>Note : Your old data will be replaced with latest updated data set</p>
                    <div>
                        <div style={fileInputContainerStyle}>
                            <label htmlFor="fileInput" style={fileInputLabelStyle}>
                                <span style={chooseFileButtonStyle}>Choose File</span>
                            </label>
                            <input type="file" accept=".csv" id="fileInput" onChange={handleFileChange} style={fileInputStyle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const fileInputContainerStyle: any = {
    position: 'relative'
};

const fileInputLabelStyle = {
    cursor: 'pointer',
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '4px'
};

const chooseFileButtonStyle: any = {
    cursor: 'pointer'
};

const fileInputStyle: any = {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer'
};

export default withAuth(FileDemo);
