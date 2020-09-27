import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import { List } from "./List";
import { bitskinsService, alertService } from "_services";
import { PriceData } from "./PriceData";

function ItemPriceData() {
  const [externalData, setExternalData] = useState(null);
  const [bitskinsData, setBitskinsData] = useState(null);
  const [bitskinsLoading, setBitskinsLoading] = useState(false);

  const initialValues = {
    itemName: "",
  };

  const validationSchema = Yup.object().shape({
    itemName: Yup.string().required(),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    getExternalPrice(fields.itemName, setSubmitting);
    getBitskinsSales(fields.itemName, setSubmitting);
  }

  function getExternalPrice(itemName, setSubmitting) {
    bitskinsService
      .getExternalPrice(itemName)
      .then((data) => {
        setExternalData(data);
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function getBitskinsSales(itemName, setSubmitting) {
    setBitskinsLoading(true);
    bitskinsService
      .getRecentSalesInfo(itemName)
      .then((data) => {
        setBitskinsData(data);
        setBitskinsLoading(false);
      })
      .catch((error) => {
        setBitskinsLoading(false);
        alertService.error(error);
      });
  }

  return (
    <div className="p-5">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Check item price data</h1>
          </div>
          <div className="col">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched, isSubmitting }) => {
                return (
                  <Form>
                    <div className="input-group">
                      <Field
                        name="itemName"
                        type="text"
                        placeholder="Item Name"
                        className={
                          "form-control" +
                          (errors.itemName && touched.itemName
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-outline-secondary"
                        >
                          {isSubmitting && (
                            <span className="spinner-border spinner-border-sm mr-1"></span>
                          )}
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>

        <PriceData data={externalData} />
        <List data={bitskinsData} loading={bitskinsLoading} />
      </div>
    </div>
  );
}

export { ItemPriceData };
