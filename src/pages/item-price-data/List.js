import React from "react";
import Moment from "react-moment";

function List(props) {
  const { data, loading } = props;
  return (
    <div className="mt-4">
      <h4>Recent bitskins sales:</h4>
      <table className="table table-striped mt-2">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Name</th>
            <th style={{ width: "20%" }}>Wear Value</th>
            <th style={{ width: "20%" }}>Price</th>
            <th style={{ width: "20%" }}>Sold At</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => (
              <tr key={`${index}_${item.sold_at}`}>
                <td>{item.market_hash_name}</td>
                <td>{item.wear_value}</td>
                <td>${item.price}</td>
                <td>
                  <Moment unix format="DD-MM-YYYY HH:mm">
                    {item.sold_at}
                  </Moment>
                </td>
              </tr>
            ))}
          {!data && loading && (
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
