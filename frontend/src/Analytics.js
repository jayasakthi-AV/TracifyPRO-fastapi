import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Analytics({ products }) {
  if (!products.length) return <div className="empty">No data yet</div>;

  const priceData = products.map((p) => ({
    name: p.name,
    price: Number(p.price),
  }));

  const qtyData = products.map((p) => ({
    name: p.name,
    quantity: Number(p.quantity),
  }));

  return (
    <div className="card analytics-card">
      <h2>📊 Analytics</h2>

      {/* PRICE CHART */}
      <h3>Price Distribution</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#a855f7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* QUANTITY CHART */}
      <h3>Quantity Distribution</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={qtyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
