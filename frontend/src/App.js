import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";
import TaglineSection from "./TaglineSection";
import Analytics from "./Analytics";

const api = axios.create({
  baseURL: "http://localhost:8000",
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

  const [deletedProduct, setDeletedProduct] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Fetch products
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
    const run = async () => {
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
    run();
  }, []);

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let filtered = products;
  
    if (q) {
      filtered = products.filter((p) => {
        const idStr = String(p.id);
        const nameStr = p.name?.toLowerCase() || "";
        const descStr = p.description?.toLowerCase() || "";
  
        return idStr === q || nameStr.includes(q) || descStr.includes(q);
      });
    }
  
    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
  
      if (["id", "price", "quantity"].includes(sortField)) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
  
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, filter, sortField, sortDirection]);
  

  // Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", price: "", quantity: "" });
    setEditId(null);
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = {
        ...form,
        id: Number(form.id),
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      if (editId) {
        await api.put(`/products/${editId}`, data);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products/", data);
        setMessage("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Operation failed");
    }

    setLoading(false);
  };

  // Edit product
  const handleEdit = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
    });
    setEditId(p.id);
    setMessage("");
  };

  // Undo Delete
  const handleDelete = (id) => {
    const product = products.find((p) => p.id === id);
    setDeletedProduct(product);
    setMessage(`Deleted "${product.name}". Undo?`);

    const timer = setTimeout(async () => {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch {
        setError("Delete failed");
      }
      setDeletedProduct(null);
    }, 5000);

    setUndoTimer(timer);
  };

  // Export CSV
  const exportCSV = () => {
    if (products.length === 0) {
      alert("No products to export");
      return;
    }

    const header = "ID,Name,Description,Price,Quantity\n";
    const rows = products
      .map((p) => `${p.id},${p.name},${p.description},${p.price},${p.quantity}`)
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  const currency = (n) =>
    typeof n === "number" ? n.toFixed(2) : Number(n || 0).toFixed(2);

  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">📦</span>
          <h1>Tracify Pro</h1>
          <h3 className="tagline">- Organized business starts here</h3>
        </div>

        <div className="top-actions">
          <button className="btn btn-light" onClick={fetchProducts} disabled={loading}>
            Refresh
          </button>

          <button className="btn btn-light" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </header>

      <div className="container">
        <div className="stats">
          <div className="chip">Total: {products.length}</div>

          <div className="search">
            <input
              type="text"
              placeholder="Search by id, name or description..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="content-grid">
          {/* FORM CARD */}
          <div className="card form-card">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>

            <form onSubmit={handleSubmit} className="product-form">
              <input
                type="number"
                name="id"
                placeholder="ID"
                value={form.id}
                onChange={handleChange}
                required
                disabled={!!editId}
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />

              <div className="form-actions">
                <button className="btn" type="submit" disabled={loading}>
                  {editId ? "Update" : "Add"}
                </button>

                {editId && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      resetForm();
                      setMessage("");
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            {deletedProduct && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  clearTimeout(undoTimer);
                  setDeletedProduct(null);
                  setMessage("Delete undone");
                }}
              >
                Undo
              </button>
            )}
          </div>

          {/* TAGLINE SECTION */}
          <TaglineSection />

          {/* ANALYTICS */}
          <Analytics products={products} />

          {/* PRODUCT LIST */}
          <div className="card list-card">
            <h2>Products</h2>
            {loading ? (
              <div className="loader">Loading...</div>
            ) : (
              <div className="scroll-x">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th
                        className={`sortable ${sortField === "id" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("id")}
                      >
                        ID
                      </th>
                      <th
                        className={`sortable ${sortField === "name" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("name")}
                      >
                        Name
                      </th>
                      <th>Description</th>
                      <th
                        className={`sortable ${sortField === "price" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("price")}
                      >
                        Price
                      </th>
                      <th
                        className={`sortable ${sortField === "quantity" ? `sort-${sortDirection}` : ""}`}
                        onClick={() => handleSort("quantity")}
                      >
                        Quantity
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td className="name-cell">{p.name}</td>
                        <td className="desc-cell" title={p.description}>
                          {p.description}
                        </td>
                        <td className="price-cell">
  {Number(p.price).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  })}
</td>

                        <td>
                          <span className="qty-badge">{p.quantity}</span>
                        </td>
                        <td>
                          <div className="row-actions">
                            <button className="btn btn-edit" onClick={() => handleEdit(p)}>
                              Edit
                            </button>
                            <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="empty">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
