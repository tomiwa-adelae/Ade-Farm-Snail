import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import Showcase from '../components/Showcase';
import { getProducts } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import AdminCreateProductModal from '../components/AdminCreateProductModal';
import { clearErrors } from '../actions/errorActions';

const AdminProductListPage = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [openProductModal, setOpenProductModal] = useState(false);

   const loginState = useSelector((state) => state.login);
   const { user } = loginState;

   const productState = useSelector((state) => state.products);
   const { loading, products } = productState;

   const errorState = useSelector((state) => state.error);
   const { msg } = errorState;

   useEffect(() => {
      dispatch(clearErrors());
      if (!user) {
         return navigate('/login/redirect=/');
      }

      dispatch(getProducts());
   }, [navigate, user, dispatch]);

   return (
      <div className="adminproductlistpage">
         <Showcase
            img="https://ocdn.eu/pulscms-transforms/1/5jxktkqTURBXy8zMWI5OWFkYTkyMzllZTg3Y2M3Zjk2Mzc5M2VhZjZhZC5qcGVnkpUDADzNBkDNA4STBc0EsM0Cdg"
            title="All Products"
         />

         <div className="adminproductlist">
            <div className="content">
               <div className="main">
                  <div className="head">
                     <h3>All Products</h3>

                     <div onClick={() => setOpenProductModal(true)}>
                        <i className="fas fa-plus"></i> Create new Product{' '}
                     </div>
                  </div>

                  {loading && <Loader />}

                  {msg && <Message msg={msg} variant="error" box />}

                  {products && products.length === 0 && (
                     <Message
                        msg="You have no Products! Create Now"
                        variant="success"
                        box
                     />
                  )}

                  {products &&
                     products.map((product) => (
                        <Link
                           key={product._id}
                           to={`/admin/product/${product._id}`}
                        >
                           <div className="item-box">
                              <div className="img">
                                 <img src={product.image} alt={product.image} />
                              </div>
                              <div className="name">
                                 <h5>{product.name}</h5>
                              </div>
                              <div>
                                 <h5># {product.price}</h5>
                              </div>
                              <div>
                                 <h5>
                                    <Moment format="MM-DD-YYYY">
                                       {product.createdAt}
                                    </Moment>
                                 </h5>
                              </div>
                           </div>
                        </Link>
                     ))}
               </div>

               {openProductModal && (
                  <AdminCreateProductModal
                     closeModal={() => {
                        setOpenProductModal(false);
                        dispatch(clearErrors());
                     }}
                  />
               )}
            </div>
         </div>
      </div>
   );
};

export default AdminProductListPage;
