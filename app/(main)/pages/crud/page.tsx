/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { ProductServiceHandler } from '@/demo/service/ProductServiceHandler';
import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import withAuth from '@/demo/service/WithAuth';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: any = {
        store_id: '',
        product_name: '',
        sku: '',
        price: '',
        date: ''
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<any>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router = useRouter()
    useEffect(() => {
        ProductServiceHandler.getProducts().then((data) => {
            if (data?.statusCode === 401) {
                alert("u are logged out");
                router.replace('/auth/access')
            } else {
                (data?.data?.data as []).shift()
                setProducts(data.data.data as any)
            }

        });
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);

        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        // product.product_name =
        if ((product as any)?.product_name?.trim()) {
            console.log("submitted", product)
            let _products = [...(products as any)];
            let _product = { ...product };
            if (product._id) {
                console.log(product?._id)
                const index = findIndexById(product._id);

                _products[index] = _product;
                ProductServiceHandler.updateProducts(product).then((res: any) => {
                    if (res?.statusCode === 200) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Product Updated',
                            life: 3000
                        });
                        setProduct(res?.data?.data)
                    } else {
                        toast.current?.show({
                            severity: 'error',
                            summary: 'failed to update',
                            detail: 'Product Not Updated',
                            life: 3000
                        });
                    }
                })

            } else {
                _product._id = createId();
                _product.date = Date.now()
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setProducts(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val._id !== product._id);

        ProductServiceHandler.deleteProducts(product).then((res: any) => {
            if (res?.statusCode === 200) {
                setProducts(_products);
                setDeleteProductDialog(false);
                setProduct(emptyProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'failed to delete',
                    detail: 'Product Not deleted',
                    life: 3000
                });
            }
        })


    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i]._id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, product_name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        // console.log(_product)
        _product[`${product_name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" /> */}
                {/* <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} /> */}
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const [filters, setFilters] = useState({
        store_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        product_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sku: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.CONTAINS },
        price: { value: null, matchMode: FilterMatchMode.CONTAINS },
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const setDataInput = (e: any) => {
        console.log(e.target.value)
        // setGlobalFilter(e.target.value)
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilter(value);
    }

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;
        console.log(value)
        setFilters(_filters);
        setGlobalFilterValue(value);
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Store Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Store Management</h5>
                    <p>Add the proper file here by uploading the same (.csv, .xlsx)</p>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="store_id"
                        paginator
                        rows={10}
                        filters={filters}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilterFields={['store_id', 'product_name', 'proce', 'date', 'sku']}
                        emptyMessage="No products found."
                        header={header}
                    >
                        <Column filter selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column filter field="product_name" header="Name" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column filter field="sku" header="SKU" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column filter field="store_id" header="store id"></Column>
                        <Column filter field="price" header="Price" sortable></Column>
                        <Column filter field="date" header="Date" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Store Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Product Name</label>
                            <InputText
                                id="product_name"
                                value={product.product_name as any}
                                onChange={(e) => onInputChange(e, 'product_name')}

                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.product_name
                                })}
                            />
                            {/* {submitted && !product.name && <small className="p-invalid">Name is required.</small>} */}
                        </div>

                        <div className="field ">
                            <label htmlFor="store_id">store id</label>
                            <InputText id="store_id" value={product.store_id as any} onChange={(e: any) => onInputChange(e, 'store_id')} />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="INR" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label htmlFor="sku">SKU</label>
                                <InputText id="sku" value={product.sku as any} onChange={(e: any) => onInputChange(e, 'sku')} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.product_name as any}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
};

export default withAuth(Crud);
