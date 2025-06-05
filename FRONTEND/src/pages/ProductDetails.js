import React from 'react';
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ProductDetails = ({cartItems,setCartItems}) => {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const {id} = useParams();

    useEffect(()=>{
        fetch(process.env.REACT_APP_API_URL + '/products/' + id)
        .then((res)=> res.json())
        .then((res)=>setProduct(res.product)); 
    },[]);


    function addToCart() {
        const itemExist = cartItems.find((item)=> item.product._id === product._id) 
        if(!itemExist){
            const newItem = {product,qty}
            setCartItems((state) => [...state, newItem]);
            toast.success('Item added to cart');
        }
    }

    const increaseQty = () => {
        if (product.stock == qty) { 
            return toast.error('Product stock limit reached');

        }
        setQty((prevQty) => prevQty + 1);

    }
    const decreaseQty = () => {
        if (qty <= 1) {
            return;
        }
        setQty((prevQty) => prevQty - 1);
    }


  return (
    <>
      <div className="container container-fluid">
        <div className="row f-flex justify-content-around">
          <div className="col-12 col-lg-5 img-fluid" id="product_image">
            <img
              src={product && product.images[0].image}
              alt="sdf"
              height="500"
              width="500"
            />
          </div>

          <div className="col-12 col-lg-5 mt-5">
            <h3>{product && product.name}</h3>
            <p id={product && product.id}>Product # 387874kkfjkf</p>

            <hr />

            {product && <div className="rating-outer">
              <div className="rating-inner"  style={{ width: `${(product.ratings/ 5) * 100}%` }}></div>
            </div>}

            <hr />

            <p id="product_price">${product && product.price}.</p>
            <div className="stockCounter d-flex align-items-center">
              <span className="btn btn-danger minus mr-2" onClick={decreaseQty}>-</span>

                <input
                type="number"
                className="form-control count mx-2"
                value={qty}
                readOnly
                style={{ width: '60px' }}
                />

              <span className="btn btn-primary plus mr-3" onClick={increaseQty}>+</span>
            </div>
            <button
              type="button"
              id="cart_btn"
              onClick={addToCart} disabled={product && product.stock === 0}
              className="btn btn-primary d-inline ml-3 my-3 "
            >
              Add to Cart
            </button>

            <hr />

            <p>
              Status: <span id="stock_status" className={product && product.stock >0 ?"text-success":"text-danger"}>{product && product.stock >0 ? "In Stock" : "Out of Stack"}</span>
            </p>

            <hr />

            <h4 className="mt-2">Description:</h4>
            <p>
              {product && product.description}
            </p>

            <hr />

            <p id="product_seller" className="mb-3">
              Sold by: <strong>{product && product.seller}</strong>
            </p>

            <div className="rating w-50"></div>
          </div>
        </div>
      </div>
    </>
  );
};
