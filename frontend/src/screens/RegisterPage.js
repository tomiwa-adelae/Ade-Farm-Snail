import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { registerUser } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Showcase from '../components/Showcase';

const RegisterPage = () => {
   const params = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const [showPassword, setshowPassword] = useState(false);
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const registerState = useSelector((state) => state.register);
   const { loading, user } = registerState;

   const errorState = useSelector((state) => state.error);
   const { msg } = errorState;

   useEffect(() => {
      const r = params.redirect ? params.redirect.split('=')[1] : '/';

      if (user) {
         navigate(`/${r}`);
      }
   }, [navigate, user, params]);

   const togglePassword = () => {
      setshowPassword(!showPassword);
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      // Create userObject
      const user = {
         firstName,
         lastName,
         email,
         password,
      };

      dispatch(registerUser(user));
   };

   return (
      <div className="registerpage">
         <Showcase
            title="Sign Up"
            img="https://ocdn.eu/pulscms-transforms/1/5jxktkqTURBXy8zMWI5OWFkYTkyMzllZTg3Y2M3Zjk2Mzc5M2VhZjZhZC5qcGVnkpUDADzNBkDNA4STBc0EsM0Cdg"
         />

         <div className="register">
            <div className="content">
               <form onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="firstName">First Name</label>
                     <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        id="firstName"
                     />
                  </div>
                  <div>
                     <label htmlFor="lastName">Last Name</label>
                     <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        id="lastName"
                     />
                  </div>
                  <div>
                     <label htmlFor="email">Email Address</label>
                     <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        id="email"
                     />
                  </div>
                  <div className="password">
                     <label htmlFor="password">Password</label>
                     <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <i
                        onClick={togglePassword}
                        className={
                           showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        }
                     ></i>
                  </div>

                  {msg && <Message msg={msg} variant="error" box />}

                  <div>
                     <button className="btn btn-primary">
                        {' '}
                        {loading ? <Loader /> : 'Create Account'}
                     </button>
                  </div>
                  <strong>
                     Already have an account? <Link to="/login">Log In</Link>
                  </strong>
               </form>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;