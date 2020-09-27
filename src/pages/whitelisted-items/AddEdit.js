import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { whitelistedItemsService, alertService } from "_services";

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;

  const initialValues = {
    name: "",
    image: "",
    maxQuantity: 3,
    priceMultiplier: 0.5,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    maxQuantity: Yup.number().integer(),
    priceMultiplier: Yup.number().positive(),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (isAddMode) {
      createItem(fields, setSubmitting);
    } else {
      updateItem(id, fields, setSubmitting);
    }
  }

  function createItem(fields, setSubmitting) {
    whitelistedItemsService
      .create(fields)
      .then(() => {
        alertService.success("Item added successfully", {
          keepAfterRouteChange: true,
        });
        history.push(".");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateItem(id, fields, setSubmitting) {
    whitelistedItemsService
      .update(id, fields)
      .then(() => {
        alertService.success("Update successful", {
          keepAfterRouteChange: true,
        });
        history.push("..");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          if (!isAddMode) {
            // get user and set form fields
            whitelistedItemsService.getById(id).then((user) => {
              const fields = [
                "name",
                "image",
                "maxQuantity",
                "priceMultiplier",
              ];
              fields.forEach((field) =>
                setFieldValue(field, user[field], false)
              );
            });
          }
        }, [setFieldValue]);

        return (
          <Form>
            <h1>{isAddMode ? "Add Item" : "Edit Item"}</h1>
            <div className="form-row">
              <div className="form-group col-6">
                <label>Item Name</label>
                <Field
                  name="name"
                  type="text"
                  className={
                    "form-control" +
                    (errors.name && touched.name ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label>
                  Max Quantity (Set it to 0 if you want unlimited quantity)
                </label>
                <Field
                  name="maxQuantity"
                  type="number"
                  className={
                    "form-control" +
                    (errors.maxQuantity && touched.maxQuantity
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="maxQuantity"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label>Price Multiplier</label>
                <Field
                  name="priceMultiplier"
                  type="number"
                  className={
                    "form-control" +
                    (errors.priceMultiplier && touched.priceMultiplier
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="priceMultiplier"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Save
              </button>
              <Link to={isAddMode ? "." : ".."} className="btn btn-link">
                Cancel
              </Link>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export { AddEdit };
