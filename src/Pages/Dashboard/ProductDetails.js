import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ name: "", comment: "", rating: 1 });

    useEffect(() => {
        axios.get(`https://fakestoreapi.com/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch((error) => console.error("Error fetching product:", error));
    }, [id]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        setReviews([...reviews, newReview]);
        setNewReview({ name: "", comment: "", rating: 1 }); // Reset form
    };

    if (!product) return <p>Loading...</p>;

    return (
        <Container className="mt-4" style={{ padding: "20px", borderRadius: "12px" }}>
            {/* Product Details Section */}
            <Card className="p-4 shadow-lg border-0"
                style={{ 
                    borderRadius: "12px", 
                    background: "linear-gradient(to bottom, #DDF3FF, #F5F5F5)",

                    color: "#333" 
                }}
            >
                <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.title} 
                    style={{ width: "320px", objectFit: "contain", margin: "auto", padding: "15px", borderRadius: "10px" }} 
                />
                <Card.Body>
                    <Card.Title className="text-center" style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{product.title}</Card.Title>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item style={{ fontSize: "18px", fontWeight: "bold", color: "#005f99", backgroundColor: "#cceeff" }}>💰 Price: ${product.price}</ListGroup.Item>
                        <ListGroup.Item style={{ fontSize: "16px", color: "#004466", backgroundColor: "#e6f7ff" }}>📦 Category: {product.category}</ListGroup.Item>
                        <ListGroup.Item style={{ fontSize: "14px", color: "#333", lineHeight: "1.6", backgroundColor: "#f0f8ff" }}>📝 {product.description}</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>

            {/* Reviews Section */}
            <h3 className="mt-5 text-center" style={{ color: "#005f99", fontWeight: "bold" }}>📝 Customer Reviews</h3>
            <Card className="p-3 shadow-sm border-0"
                style={{ borderRadius: "10px", backgroundColor: "#cceeff" }}
            >
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <Card className="mb-3 p-3 shadow-sm border-0" key={index}
                            style={{ borderRadius: "10px", backgroundColor: "#f0f8ff" }}
                        >
                            <Card.Text style={{ fontSize: "16px", fontWeight: "bold", color: "#007bff" }}>{review.name} ({review.rating} ⭐)</Card.Text>
                            <Card.Text style={{ fontSize: "14px", color: "#555", lineHeight: "1.5" }}>{review.comment}</Card.Text>
                        </Card>
                    ))
                ) : (
                    <p style={{ color: "#666", fontSize: "16px" }}>No reviews yet. Be the first to write one!</p>
                )}
            </Card>

            {/* Add Review Form */}
            <Card className="mt-4 p-3 shadow-sm border-0"
                style={{ borderRadius: "10px", backgroundColor: "#e6f7ff" }}
            >
                <h4 className="text-center" style={{ fontWeight: "bold", color: "#005f99" }}>✨ Leave a Review</h4>
                <Form onSubmit={handleReviewSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#004466" }}>Name:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={newReview.name} 
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} 
                            required
                            style={{ borderRadius: "8px", padding: "8px", borderColor: "#007bff" }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#004466" }}>Comment:</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={newReview.comment} 
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} 
                            required
                            style={{ borderRadius: "8px", padding: "8px", borderColor: "#007bff" }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#004466" }}>Rating:</Form.Label>
                        <Form.Select 
                            value={newReview.rating} 
                            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                            style={{ borderRadius: "8px", padding: "8px", borderColor: "#007bff" }}
                        >
                            <option value="1">⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" variant="primary"
                        style={{ 
                            borderRadius: "8px", 
                            padding: "10px 15px", 
                            backgroundColor: "#007bff", 
                            borderColor: "#005f99" 
                        }}
                    >
                        Submit Review
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}
