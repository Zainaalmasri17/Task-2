import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

export default function ShowUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search state
    const [selectedCity, setSelectedCity] = useState(""); // Filter state

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const uniqueCities = [...new Set(users.map(user => user.address.city))];

   
    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedCity === "" || user.address.city === selectedCity) 
    );

    return (
        <div className="bg-white w-100 p-3">
            <h1>Users Page</h1>

            
            <Form.Control 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            
            <Form.Select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="mb-3"
            >
                <option value="">All Cities</option>
                {uniqueCities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
            </Form.Select>

            <Table striped bordered hover>
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>City</th>
                        <th>Phone Number</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} style={{ textAlign: "center" }}>
                            <td>{user.id}</td>
                            <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                            <td>{user.email}</td>
                            <td>{user.address.city}</td>
                            <td>{user.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
