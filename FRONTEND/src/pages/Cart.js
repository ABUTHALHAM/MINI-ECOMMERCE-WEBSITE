import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Cart = ({ cartItems, setCartItems }) => {
  const [completed, setCompleted] = useState(false);

  const increaseQty = (item) => {
    if (item.qty >= item.product.stock) {
      return toast.error('Product stock limit reached');
    }
    const updatedItems = cartItems.map(i =>
      i.product._id === item.product._id ? { ...i, qty: i.qty + 1 } : i
    );
    setCartItems(updatedItems);
  };

  const decreaseQty = (item) => {
    if (item.qty <= 1) return;
    const updatedItems = cartItems.map(i =>
      i.product._id === item.product._id ? { ...i, qty: i.qty - 1 } : i
    );
    setCartItems(updatedItems);
  };

  const removeItem = (item) => {
    const updatedItems = cartItems.filter(i => i.product._id !== item.product._id);
    setCartItems(updatedItems);
    toast.success('Item removed from cart');
  };

  const placeOrderHandler = () => {
    fetch(`${process.env.REACT_APP_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),  // send as { cartItems: [...] }
})

      .then(res => {
        if (!res.ok) throw new Error('Failed to place order');
        return res.json();
      })
      .then(() => {
        setCartItems([]);
        setCompleted(true);
        toast.success('Order placed successfully!');
      })
      .catch(err => {
        toast.error(`Order failed: ${err.message}`);
      });
  };

  const subtotalUnits = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.qty * item.product.price, 0)
    .toFixed(2);

  return (
    <>
      {cartItems.length > 0 ? (
        <Fragment>
          <div className="container container-fluid">
            <h2 className="mt-5">
              Your Cart: <b>{cartItems.length} items</b>
            </h2>

            <div className="row d-flex justify-content-between">
              <div className="col-12 col-lg-8">
                {cartItems.map((item) => (
                  <Fragment key={item.product._id}>
                    <hr />
                    <div className="cart-item">
                      <div className="row align-items-center">
                        <div className="col-4 col-lg-3">
                          <img
                            src={item.product.images[0].image}
                            alt={item.product.name}
                            height="90"
                            width="115"
                          />
                        </div>

                        <div className="col-5 col-lg-3">
                          <Link to={`/product/${item.product._id}`}>
                            {item.product.name}
                          </Link>
                        </div>

                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                          <p id="card_item_price">${item.product.price}</p>
                        </div>

                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                          <div className="stockCounter d-inline">
                            <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>
                              -
                            </span>
                            <input
                              type="number"
                              className="form-control count d-inline"
                              value={item.qty}
                              readOnly
                            />
                            <span className="btn btn-primary plus" onClick={() => increaseQty(item)}>
                              +
                            </span>
                          </div>
                        </div>

                        <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                          <i
                            id="delete_cart_item"
                            className="fa fa-trash btn btn-danger"
                            onClick={() => removeItem(item)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
                <hr />
              </div>

              <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                  <h4>Order Summary</h4>
                  <hr />
                  <p>
                    Subtotal:{' '}
                    <span className="order-summary-values">{subtotalUnits} (Units)</span>
                  </p>
                  <p>
                    Est. total:{' '}
                    <span className="order-summary-values">${totalPrice}</span>
                  </p>
                  <hr />
                  <button
                    id="checkout_btn"
                    className="btn btn-primary btn-block"
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <h2 className="text-center mt-5">
          {completed ? 'Order placed successfully!' : 'Your cart is empty'}
        </h2>
      )}
    </>
  );
};
