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
  if (!products.length) return <div>No data yet</div>;

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

      <h3>Price Distribution</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Quantity Distribution</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={qtyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
