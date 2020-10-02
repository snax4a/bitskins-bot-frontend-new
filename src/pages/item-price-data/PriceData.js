import React from "react";

function PriceData(props) {
  const { item } = props;
  if (!item || item == null) return null;
  return (
    <>
      <div className="row my-4 price-data mx-0">
        <div className="col text-center">
          Our saved price: <b>${item.price}</b>
        </div>
      </div>
    </>
  );
}

export { PriceData };
