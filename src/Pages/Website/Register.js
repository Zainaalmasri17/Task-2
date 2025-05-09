import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { baseURL, REGISTER } from '../../API/Api';
import { useNavigate } from 'react-router-dom';
import Loadingsub from '../../Components/Loading/Loading';
import Cookie from "cookie-universal";
import axios from 'axios';
export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate=useNavigate();
       const[err,seterr]=useState("");
       const[loading,setLoading]=useState(false);
       const cookie= Cookie();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/${REGISTER}`, form);
      setLoading(false);
      const token = res.data.token;
      cookie.set('bearer', token);
      window.location.pathname = '/login';
    } catch (err) {
      setLoading(false);
      seterr(err?.response?.status === 422 ? 'Wrong email or password' : 'Internal Server Error');
    }
  };

  return (
    <>
      {loading && <Loadingsub/>}
      <div className="container">
        <div className="row" style={{ height: '100vh' }}>
          <Form className="form" onSubmit={handleSubmit}>
            <div className="custom-form">
              <h1 style={{ marginBottom: '30px' }}>Register Now</h1>
              <Form.Group className="form-custom" controlId="exampleForm.ControlInput1">
                <Form.Control type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your Name" required />
                <Form.Label>Name</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom" controlId="exampleForm.ControlInput2">
                <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your Email" required />
                <Form.Label>Email</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom" controlId="exampleForm.ControlInput3">
                <Form.Control type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" minLength="6" required />
                <Form.Label>Password</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom" controlId="exampleForm.ControlInput4">
                <Form.Control type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" minLength="6" required />
                <Form.Label>Confirm Password</Form.Label>
              </Form.Group>
              <button className="btn btn-primary">Register</button>
              {err !== "" && <span className="error">{err}</span>}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
