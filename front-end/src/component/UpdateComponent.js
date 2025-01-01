import React, { useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
const UpdateProduct = () => {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [company, setCompany] = React.useState('');
    const params= useParams();
    const navigate= useNavigate();
    useEffect(()=>{
        getProductDetails();
    },[])
    const getProductDetails= async()=>{
        let result= await fetch(`http://localhost:5000/products/${params.id}`,{
            headers:{
                authorization: `bear ${JSON.parse(localStorage.getItem('token'))}`
            }
        });
        result= await result.json();
        console.warn(result);
        setName(result.name);
        setPrice(result.price);
        setCategory(result.category);
        setCompany(result.company);

    };
    const updateProduct = async () => {
       let result= await fetch(`http://localhost:5000/products/${params.id}`, {
        method:'Put',
        body:JSON.stringify({name, price, category, company}),
        headers:{
            'Content-Type':'application/json',
            authorization: `bear ${JSON.parse(localStorage.getItem('token'))}`
        }
       });
       result= await result.json();
       if(result){
        navigate('/');
       }
    }
    return (
        <div className='product'>
            <h1>Update Product</h1>
            <input className='inputbox' type="text" placeholder='Enter Product Name' value={name} onChange={(e) => { setName(e.target.value) }} />

            <input className='inputbox' type="text" placeholder='Enter Product price' value={price} onChange={(e) => { setPrice(e.target.value) }} />
            <input className='inputbox' type="text" placeholder='Enter Product category' value={category} onChange={(e) => { setCategory(e.target.value) }} />
            <input className='inputbox' type="text" placeholder='Enter Product company' value={company} onChange={(e) => { setCompany(e.target.value) }} />
            <button onClick={updateProduct} className='appButton'>Update Product</button>
        </div>
    )
}
export default UpdateProduct;