import React from "react";

function PriceData(props) {
  const { data } = props;
  if (!data || data == null) return null;
  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <h4 className="mb-1">External price data:</h4>
        </div>
      </div>
      <div className="row mb-4 price-data mx-0">
        <div className="col-3">
          Average Price: <b>${data.average_price}</b>
        </div>
        <div className="col-3">
          Median Price: <b>${data.median_price}</b>
        </div>
        <div className="col-3">
          Standard Deviation: <b>{data.standard_deviation}</b>
        </div>
        <div className="col-3">
          Amount Sold: <b>{data.amount_sold}</b>
        </div>
        <div className="col-3">
          Highest Price: <b>${data.highest_price}</b>
        </div>
        <div className="col-3">
          Lowest Price: <b>${data.lowest_price}</b>
        </div>
        <div className="col-3">
          Time: <b>{data.time} days</b>
        </div>
        <div className="col-3">
          Currency: <b>{data.currency}</b>
        </div>
      </div>
    </>
  );
}

export { PriceData };
