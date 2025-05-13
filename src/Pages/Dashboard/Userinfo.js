import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';

export default function UserDetails() {
    const { id } = useParams(); 
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`https://jsonplaceholder.typicode.com/users/${id}`) 
            .then((response) => setUser(response.data))
            .catch((error) => console.error("Error fetching user details:", error));
    }, [id]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="bg-white w-100 p-3">
            <h1>User Details</h1>

            <Table striped bordered hover>
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th>Field</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody >
                    <tr><td><strong>Full Name</strong></td><td>{user.name}</td></tr>
                    <tr><td><strong>Email</strong></td><td>{user.email}</td></tr>
                    <tr><td><strong>Phone</strong></td><td>{user.phone}</td></tr>
                    <tr><td><strong>City</strong></td><td>{user.address.city}</td></tr>
                    <tr><td><strong>Suite</strong></td><td>{user.address.suite}</td></tr>
                    <tr><td><strong>Zip Code</strong></td><td>{user.address.zipcode}</td></tr>
                    <tr><td><strong>Website</strong></td><td>{user.website}</td></tr>
                    <tr><td><strong>Company Name</strong></td><td>{user.company.name}</td></tr>
                    <tr><td><strong>Company Catchphrase</strong></td><td>{user.company.catchPhrase}</td></tr>
                </tbody>
            </Table>

            <Link className="btn btn-secondary mt-3" to="/users">Back to Users</Link>
        </div>
    );
}
