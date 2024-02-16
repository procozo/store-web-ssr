import { Demo } from '@/types';

export const ProductServiceHandler = {
    getProducts() {
        let token = sessionStorage.getItem('token');
        console.log(token);
        return fetch('http://localhost:80/api/shop/getAllStoreItems', { headers: { 'auth-header': '' + token + '' } })
            .then((res) => res.json())
            .then((d) => d as any);
    },

    setProducts(fileInput: any) {
        let token = sessionStorage.getItem('token');
        var formdata = new FormData();
        formdata.append('file', fileInput, 'MOCK_DATA (1) - MOCK_DATA (1).csv - MOCK_DATA (1) - MOCK_DATA (1).csv.csv.csv');

        var requestOptions: any = {
            method: 'POST',
            headers: { 'auth-header': '' + token + '' },
            body: formdata,
            redirect: 'follow'
        };

        return fetch('http://localhost:80/api/shop/upload', requestOptions)
            .then((res) => res.json())
            .then((d) => d as any);
    },


    updateProducts(data: any) {
        let token = sessionStorage.getItem('token');

        var requestOptions: any = {
            method: 'PUT',
            headers: { 'auth-header': '' + token + '', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        return fetch('http://localhost:80/api/shop/updateProduct', requestOptions)
            .then((res) => res.json())
            .then((d) => d as any);
    },
    deleteProducts(data: any) {
        let token = sessionStorage.getItem('token');

        var requestOptions: any = {
            method: 'DELETE',
            headers: { 'auth-header': '' + token + '', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        return fetch('http://localhost:80/api/shop/deleteProduct', requestOptions)
            .then((res) => res.json())
            .then((d) => d as any);
    }
};
