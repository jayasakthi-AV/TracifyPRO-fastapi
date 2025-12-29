import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";
import TaglineSection from "./TaglineSection";
import Analytics from "./Analytics";

const api = axios.create({
  baseURL: "https://tracifypro-fastapi-uyy1.onrender.com",
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  /* ---------------- Fetch Products ---------------- */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
      setError("");
    } catch {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- Sorting + Filtering ---------------- */
  const filteredProducts = useMemo(() => {
    const q = filter.toLowerCase().trim();
    let list = products;

    if (q) {
      list = products.filter(
        (p) =>
          String(p.id) === q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      let x = a[sortField];
      let y = b[sortField];
      if (["id", "price", "quantity"].includes(sortField)) {
        x = Number(x);
        y = Number(y);
      }
      return sortDirection === "asc" ? x - y : y - x;
    });
  }, [products, filter, sortField, sortDirection]);

  /* ---------------- Form ---------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", price: "", quantity: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        id: Number(form.id),
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products/", payload);
        setMessage("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch {
      setError("Operation failed");
    }
    setLoading(false);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">📦</span>
          <div>
            <h1>Tracify Pro</h1>
            <h3 className="tagline">Organized business starts here</h3>
          </div>
        </div>

        <div className="top-actions">
          <button className="btn btn-light" onClick={fetchProducts}>
            Refresh
          </button>
          <button className="btn btn-light">Export CSV</button>
        </div>
      </header>

      <div className="container">
        <div className="stats">
          <div className="chip">Total: {products.length}</div>
          <input
            className="search-input"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="content-grid">
          {/* FORM */}
          <div className="card">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>
            <form className="product-form" onSubmit={handleSubmit}>
              {["id", "name", "description", "price", "quantity"].map((f) => (
                <input
                  key={f}
                  name={f}
                  placeholder={f.toUpperCase()}
                  value={form[f]}
                  onChange={handleChange}
                  disabled={editId && f === "id"}
                  required
                />
              ))}
              <button className="btn">Save</button>
            </form>
            {message && <p className="success-msg">{message}</p>}
            {error && <p className="error-msg">{error}</p>}
          </div>

          <TaglineSection />
          <Analytics products={products} />

          {/* TABLE */}
          <div className="card">
            <h2>Products</h2>
            <div className="table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td data-label="ID">{p.id}</td>
                      <td data-label="Name">{p.name}</td>
                      <td data-label="Description">{p.description}</td>
                      <td data-label="Price">₹{p.price}</td>
                      <td data-label="Qty">{p.quantity}</td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          <button
                            className="btn btn-edit"
                            onClick={() => {
                              setForm(p);
                              setEditId(p.id);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
