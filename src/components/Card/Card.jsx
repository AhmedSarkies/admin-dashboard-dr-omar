import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      style={{ background: item.color, cursor: "pointer", color: "#fff" }}
      onClick={() => navigate(`/dr-omar${item.path}`)}
    >
      <div className="card-info">
        <h6 className="title text-center">{item.title}</h6>
        <h1 className="count text-center">{item.count}</h1>
      </div>
      <h3 className="icon text-center">{item.icon}</h3>
    </div>
  );
};

export default Card;
