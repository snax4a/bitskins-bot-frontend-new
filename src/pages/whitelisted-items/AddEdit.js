import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { whitelistedItemsService, alertService } from "_services";

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  const [isFetching, setFetching] = useState(false);
  const [fetchingWiki, setFetchingWiki] = useState(false);
  const [shouldConfirm, setshouldConfirm] = useState(false);
  const [whitelistedItem, setWhitelistedItem] = useState({});
  const [isConfirming, setConfirming] = useState(false);

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
    setFetchingWiki(true);

    const searchName = prepareSearchName(fields.name);

    whitelistedItemsService
      .getWikiData(searchName)
      .then((res) => {
        setFetchingWiki(false);
        const responseSkins = res.data.search_ten.skins;
        const wikiItem = findItem(responseSkins, fields.name);

        if (wikiItem === null) {
          return alertService.error("Item not found on wiki.cs.money", { autoClose: false });
        }

        let item = fields;
        item.image = wikiItem.image;
        item.slug = wikiItem._id;

        setWhitelistedItem(item);
        setshouldConfirm(true);
      })
      .catch((error) => {
        setFetchingWiki(false);
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function onConfirm() {
    setConfirming(true);

    if (isAddMode) {
      createItem(whitelistedItem);
    } else {
      updateItem(id, whitelistedItem);
    }
  }

  function removeWearValue(itemName) {
    return itemName.replace(/\s{1}\((.+)\)/, "");
  }

  function prepareSearchName(itemName) {
    return removeWearValue(itemName).replace("|", "");
  }

  function findItem(items, itemName) {
    const nameWithoutWearValue = removeWearValue(itemName);
    let foundItem = null

    items.forEach(item => {
      if (removeWearValue(item.name) === nameWithoutWearValue) {
        foundItem = item;
        return true;
      }
    });

    return foundItem;
  }

  function createItem(fields) {
    whitelistedItemsService
      .create(fields)
      .then(() => {
        alertService.success("Item added successfully", {
          keepAfterRouteChange: true,
        });
        history.push(".");
      })
      .catch((error) => {
        setConfirming(false);
        alertService.error(error);
      });
  }

  function updateItem(id, fields) {
    whitelistedItemsService
      .update(id, fields)
      .then(() => {
        alertService.success("Update successful", {
          keepAfterRouteChange: true,
        });
        history.push("..");
      })
      .catch((error) => {
        setConfirming(false);
        alertService.error(error);
      });
  }

  function Loader() {
    return <span className="spinner-border spinner-border-sm mr-1"></span>;
  }

  return (
    <div className="row">
      <div className="col-6">
        <div className="item-placeholder">
          {fetchingWiki || isFetching ? (
            <Loader />
          ) : (
            <img src={whitelistedItem.image} alt="preview" />
          )}
          {shouldConfirm && (
            <button
              className="btn btn-warning btn-block"
              onClick={onConfirm}
              disabled={isConfirming}
            >
              {isConfirming && <Loader />}
              Confirm and Save
            </button>
          )}
        </div>
      </div>

      <div className="col-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (!isAddMode) {
                setFetching(true);
                // get user and set form fields
                whitelistedItemsService.getById(id).then((item) => {
                  const fields = ["name", "maxQuantity", "priceMultiplier"];
                  fields.forEach((field) =>
                    setFieldValue(field, item[field], false)
                  );
                  setWhitelistedItem(item);
                  setFetching(false);
                });
              }
            }, [setFieldValue]);

            if (isFetching) {
              return <Loader />;
            } else {
              return (
                <Form>
                  <h1>{isAddMode ? "Add Item" : "Edit Item"}</h1>
                  <div className="form-row">
                    <div className="form-group col">
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
                    <div className="form-group col">
                      <label>
                        Max Quantity (Set it to 0 if you want unlimited
                        quantity)
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
                    <div className="form-group col">
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
                      {isSubmitting && <Loader />}
                      Save
                    </button>
                    <Link to={isAddMode ? "." : ".."} className="btn btn-link">
                      Cancel
                    </Link>
                  </div>
                </Form>
              );
            }
          }}
        </Formik>
      </div>
    </div>
  );
}

export { AddEdit };
