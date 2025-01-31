import { MongoClient } from "mongodb";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  const { query } = context;
  const { shop } = query;

  if (!shop) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const database = client.db("shopifyapp");
    const sessions = database.collection("sessions");

    // Fetch session data from MongoDB
    const session = await sessions.findOne({ shop });
    if (!session) {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    return {
      props: { shop, accessToken: session.accessToken },
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      redirect: { destination: "/", permanent: false },
    };
  } finally {
    await client.close();
  }
}

export default function ProductsPage({ shop, accessToken }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/product`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div style={{ textAlign: "center" }}>Loading products...</div>;
  if (error)
    return (
      <div style={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Products for {shop}</h1>
        <div style={styles.gridContainer}>
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item?.id} style={styles.card}>
                {item?.image && (
                  <img
                    src={item.image.src}
                    alt={item.image.alt || item.title}
                    style={styles.image}
                  />
                )}
                <div style={styles.cardContent}>
                  <h2 style={styles.title}>{item?.title}</h2>
                  <p style={styles.info}><strong>ID:</strong> {item?.id}</p>
                  <p style={styles.info}><strong>Type:</strong> {item?.product_type}</p>
                  <p style={styles.info}><strong>Vendor:</strong> {item?.vendor}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", fontSize: "1.1rem" }}>No products found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Styles
const styles = {
  errorContainer: { textAlign: "center", fontSize: "1.2rem", padding: "20px", color: "red" },
  container: { maxWidth: "1200px", margin: "auto", padding: "20px" },
  pageTitle: { textAlign: "center", fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "20px" },
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "hidden", transition: "transform 0.2s ease-in-out" },
  image: { width: "100%", height: "200px", objectFit: "cover" },
  cardContent: { padding: "15px" },
  title: { fontSize: "1.3rem", fontWeight: "bold", color: "#333", marginBottom: "5px" },
  info: { fontSize: "0.9rem", color: "#555", margin: "3px 0" },
};



// import { MongoClient } from "mongodb"; 
// import Cookies from "cookies";
// import Layout from "../components/Layout";
// import { useEffect, useState } from "react";

// export async function getServerSideProps(context) {
//   const { req, res } = context;
//   const cookies = new Cookies(req, res);
//   const shopData = cookies.get("shopify-app");

//   if (!shopData) {
//     return {
//       redirect: { destination: "/", permanent: false },
//     };
//   }

//   const { shop, installed } = JSON.parse(shopData);
//   if (!installed) {
//     return {
//       redirect: { destination: "/", permanent: false },
//     };
//   }

//   const client = new MongoClient(process.env.MONGO_URI);
  
//   try {
//     await client.connect();
//     const database = client.db("shopifyapp");
//     const sessions = database.collection("sessions");
//     const session = await sessions.findOne({ shop });

//     if (!session) {
//       return {
//         redirect: { destination: "/", permanent: false },
//       };
//     }

//     return {
//       props: { shop, accessToken: session.accessToken },
//     };
//   } catch (error) {
//     console.error("Database error:", error);
//     return {
//       redirect: { destination: "/", permanent: false },
//     };
//   } finally {
//     await client.close();
//   }
// }

// export default function ProductsPage({ shop, accessToken }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         let res = await fetch(`/api/product`);
//         if (!res.ok) throw new Error("Failed to fetch products");
//         let data = await res.json();
//         setProducts(data.data);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getData();
//   }, []);

//   if (loading) return <div style={{ textAlign: "center" }}>Loading products...</div>;
//   if (error)
//     return (
//       <div style={styles.errorContainer}>
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <Layout>
//       <div style={styles.container}>
//         <h1 style={styles.pageTitle}>Products for {shop}</h1>

//         <div style={styles.gridContainer}>
//           {products.length > 0 ? (
//             products.map((item) => (
//               <div key={item?.id} style={styles.card}>
//                 {item?.image && (
//                   <img
//                     src={item.image.src}
//                     alt={item.image.alt || item.title}
//                     style={styles.image}
//                   />
//                 )}
//                 <div style={styles.cardContent}>
//                   <h2 style={styles.title}>{item?.title}</h2>
//                   <p style={styles.info}><strong>ID:</strong> {item?.id}</p>
//                   <p style={styles.info}><strong>Type:</strong> {item?.product_type}</p>
//                   <p style={styles.info}><strong>Vendor:</strong> {item?.vendor}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p style={{ textAlign: "center", fontSize: "1.1rem" }}>No products found.</p>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }

// // Styles
// const styles = {
//   errorContainer: { textAlign: "center", fontSize: "1.2rem", padding: "20px", color: "red" },
//   container: { maxWidth: "1200px", margin: "auto", padding: "20px" },
//   pageTitle: { textAlign: "center", fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "20px" },
//   gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
//   card: { backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "hidden", transition: "transform 0.2s ease-in-out" },
//   image: { width: "100%", height: "200px", objectFit: "cover" },
//   cardContent: { padding: "15px" },
//   title: { fontSize: "1.3rem", fontWeight: "bold", color: "#333", marginBottom: "5px" },
//   info: { fontSize: "0.9rem", color: "#555", margin: "3px 0" },
// };
