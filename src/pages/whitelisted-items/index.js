import React from "react";
import { Route, Switch } from "react-router-dom";

import { List } from "./List";
import { AddEdit } from "./AddEdit";

function WhitelistedItems({ match }) {
  const { path } = match;

  return (
    <div className="p-5">
      <div className="container">
        <Switch>
          <Route exact path={path} component={List} />
          <Route path={`${path}/add`} component={AddEdit} />
          <Route path={`${path}/edit/:id`} component={AddEdit} />
        </Switch>
      </div>
    </div>
  );
}

export { WhitelistedItems };
