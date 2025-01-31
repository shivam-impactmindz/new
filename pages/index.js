import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../components/Layout';
import Cookies from 'js-cookie';

export default function IndexPage() {
  const [shop, setShop] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const shopData = Cookies.get("shopify-app");
    if (shopData) {
      const { installed } = JSON.parse(shopData);
      if (installed) {
        router.push("/products");
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleInstall = async () => {
    if (!shop.trim()) {
      setError("Please enter your Shopify store name.");
      return;
    }
    setError("");
    window.location.href = `/api/auth?shop=${shop.trim()}`;
  };

  if (loading) return null; // Hide page while checking installation status

  return (
    <Layout>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Install Your Shopify App</h1>
        <p style={subtitleStyle}>
          Enter your Shopify store name below to install the app.
        </p>

        <div style={inputContainer}>
          <input
            type="text"
            placeholder="your-store-name.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleInstall} style={buttonStyle}>
            Install App
          </button>
        </div>

        {error && <p style={errorStyle}>{error}</p>}
      </div>
    </Layout>
  );
}
// Styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
  textAlign: "center",
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

const inputContainer = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "5px",
  width: "300px",
};

const buttonStyle = {
  padding: "10px 15px",
  fontSize: "1rem",
  color: "#fff",
  backgroundColor: "#007bff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const errorStyle = {
  color: "red",
  marginTop: "10px",
};
















// import Layout from '../components/Layout';
// import { useState } from "react";
// export default function IndexPage() {
//   const [shop, setShop] = useState("");
//   const [error, setError] = useState("");

//   const handleInstall = async () => {
//     if (!shop.trim()) {
//       setError("Please enter your Shopify store name.");
//       return;
//     }
//     setError("");
//     window.location.href = `/api/auth?shop=${shop.trim()}`;
//   };
//   return (
//     <Layout>
//       <div style={containerStyle}>
//         <h1 style={titleStyle}>Install Your Shopify App</h1>
//         <p style={subtitleStyle}>
//           Enter your Shopify store name below to install the app.
//         </p>

//         <div style={inputContainer}>
//           <input
//             type="text"
//             placeholder="your-store-name.myshopify.com"
//             value={shop}
//             onChange={(e) => setShop(e.target.value)}
//             style={inputStyle}
//           />
//           <button onClick={handleInstall} style={buttonStyle}>
//             Install App
//           </button>
//         </div>

//         {error && <p style={errorStyle}>{error}</p>}
//       </div>
//     </Layout>
//   );
// }
// // Styles
// const containerStyle = {
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "80vh",
//   textAlign: "center",
// };

// const titleStyle = {
//   fontSize: "2rem",
//   fontWeight: "bold",
//   color: "#333",
// };

// const subtitleStyle = {
//   fontSize: "1rem",
//   color: "#555",
//   marginBottom: "20px",
// };

// const inputContainer = {
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
// };

// const inputStyle = {
//   padding: "10px",
//   fontSize: "1rem",
//   border: "1px solid #ccc",
//   borderRadius: "5px",
//   width: "300px",
// };

// const buttonStyle = {
//   padding: "10px 15px",
//   fontSize: "1rem",
//   color: "#fff",
//   backgroundColor: "#007bff",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
// };

// const errorStyle = {
//   color: "red",
//   marginTop: "10px",
// };

