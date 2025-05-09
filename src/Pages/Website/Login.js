import { Form } from "react-bootstrap";
import { baseURL, LOGIN } from "../../API/Api";
import { useState } from "react";
import Loadingsub from "../../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import axios from "axios";
export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate=useNavigate();
  const[err,seterr]=useState("");
  const[loading,setloading]=useState(false);
  const cookie= Cookie();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const res = await axios.post(`${baseURL}/${LOGIN}`, form);
      setloading(false);
      const token = res.data.token;
      cookie.set("bearer", token);
      window.location.pathname = "/";
    } catch (err) {
      setloading(false);
      seterr(err?.response?.status === 422 ? "Wrong phone or password" : "Internal Server Error");
    }
  };

  return (
    <>
      {loading && <Loadingsub/>}
      <div className="container">
        <div className="row" style={{ height: "100vh" }}>
          <Form className="form" onSubmit={handleSubmit}>
            <div className="custom-form">
              <h1 style={{ marginBottom: "30px" }}>Login</h1>
              <Form.Group className="form-custom" controlId="exampleForm.ControlInput1">
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  required
                />
                <Form.Label>Email</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom" controlId="exampleForm.ControlInput2">
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  minLength="6"
                  required
                />
                <Form.Label>Password</Form.Label>
              </Form.Group>
              <button className="btn btn-primary">Login</button>
              {err !== "" && <span className="error">{err}</span>}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
