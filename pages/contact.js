import Layout from "../components/Layout";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" }); // Reset form
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 sec
    }
  };

  return (
    <Layout>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Contact Us</h1>
        <p style={subtitleStyle}>We'd love to hear from you! Please fill out the form below.</p>

        <form style={formStyle} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={inputStyle}
          />
          {errors.name && <p style={errorStyle}>{errors.name}</p>}

          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle}
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}

          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={textareaStyle}
          />
          {errors.message && <p style={errorStyle}>{errors.message}</p>}

          <button type="submit" style={buttonStyle}>Send Message</button>
        </form>

        {success && <p style={successStyle}>Your message has been sent successfully!</p>}
      </div>
    </Layout>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "80vh",
  textAlign: "center",
  padding: "20px",
};

const titleStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#333",
};

const subtitleStyle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "10px",
  width: "100%",
};

const textareaStyle = {
  padding: "10px",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginBottom: "10px",
  width: "100%",
  height: "100px",
  resize: "none",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "1rem",
  color: "#fff",
  backgroundColor: "#007bff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const errorStyle = {
  color: "red",
  fontSize: "0.9rem",
  marginBottom: "10px",
};

const successStyle = {
  color: "green",
  fontSize: "1rem",
  marginTop: "10px",
};

