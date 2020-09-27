import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { whitelistedItemsService } from "_services";

function List({ match }) {
  const { path } = match;
  const [items, setItems] = useState(null);

  useEffect(() => {
    whitelistedItemsService.getAll().then((x) => setItems(x));
  }, []);

  function deleteItem(id) {
    setItems(
      items.map((x) => {
        if (x.id === id) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    whitelistedItemsService.delete(id).then(() => {
      setItems((items) => items.filter((x) => x.id !== id));
    });
  }

  return (
    <div>
      <h1>Whitelisted Items</h1>
      <p>All items that you want to be bought by bitskins bot:</p>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">
        Add Item
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Name</th>
            <th style={{ width: "20%" }}>Price Multiplier</th>
            <th style={{ width: "20%" }}>Max Quantity</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.priceMultiplier}</td>
                <td>
                  {item.maxQuantity !== 0 ? item.maxQuantity : "unlimited"}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link
                    to={`${path}/edit/${item.id}`}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn btn-sm btn-danger"
                    disabled={item.isDeleting}
                  >
                    {item.isDeleting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          {!items && (
            <tr>
              <td colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { List };
