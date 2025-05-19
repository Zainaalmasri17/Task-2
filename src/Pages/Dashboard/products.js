import { useEffect, useState } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom"; // Import Link

export default function ShowProducts() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");

    useEffect(() => {
        axios.get("https://fakestoreapi.com/products")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const uniqueCategories = [...new Set(products.map(product => product.category))];

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "" || product.category === selectedCategory) &&
        (selectedPriceRange === "" || (
            selectedPriceRange === "low" && product.price < 50 ||
            selectedPriceRange === "medium" && product.price >= 50 && product.price <= 100 ||
            selectedPriceRange === "high" && product.price > 100
        ))
    );

    return (
        <Container className="mt-4" style={{ backgroundColor: "#f0f8ff", padding: "20px", borderRadius: "12px" }}>
            <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#005f99" }}>🛍️ Product Listings</h1>

            {/* 🔎 Search Bar */}
            <Form.Control 
                type="text" 
                placeholder="Search by product name..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
                style={{ border: "2px solid #005f99", borderRadius: "8px", padding: "10px" }}
            />

            {/* 🌍 Filter by Category */}
            <Form.Select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mb-3"
                style={{ border: "2px solid #005f99", borderRadius: "8px", padding: "10px" }}
            >
                <option value="">All Categories</option>
                {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                ))}
            </Form.Select>

            {/* 💲 Filter by Price Range */}
            <Form.Select 
                value={selectedPriceRange} 
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="mb-3"
                style={{ border: "2px solid #005f99", borderRadius: "8px", padding: "10px" }}
            >
                <option value="">All Price Ranges</option>
                <option value="low">Below $50</option>
                <option value="medium">$50 - $100</option>
                <option value="high">Above $100</option>
            </Form.Select>

            <Row className="justify-content-center">
                {filteredProducts.map((product) => (
                    <Col key={product.id} sm={6} md={4} lg={3}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <Card 
                                className="mb-4 shadow-sm"
                                style={{
                                    backgroundColor: "#ffffff",
                                    border: "2px solid #d9d9d9",
                                    transition: "0.3s",
                                    borderRadius: "12px"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e6f7ff"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                            >
                                <Card.Img 
                                    variant="top" 
                                    src={product.image} 
                                    alt={product.title} 
                                    style={{ height: '180px', objectFit: 'contain', padding: '10px', borderBottom: "2px solid #d9d9d9" }} 
                                />
                                <Card.Body>
                                    <Card.Title className="text-truncate" style={{ fontSize: '16px', fontWeight: 'bold', color: "#005f99" }}>{product.title}</Card.Title>
                                    <Card.Text style={{ fontSize: "14px", color: "#333" }}>
                                        <strong>Price:</strong> <span style={{ color: "#008080", fontWeight: "bold" }}>${product.price}</span> <br />
                                        <strong>Category:</strong> <span style={{ color: "#666", fontStyle: "italic" }}>{product.category}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
