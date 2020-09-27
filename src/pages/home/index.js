import React from "react";

import { accountService, alertService } from "_services";

function Home() {
  const user = accountService.userValue;
  const className = user.botStatus === "On" ? "btn-success" : "btn-danger";

  function switchBotStatus() {
    const params = {
      botStatus: user.botStatus === "On" ? "Off" : "On",
    };

    accountService
      .update(user.id, params)
      .then(() => {
        alertService.success("Bot Status has been updated", {
          keepAfterRouteChange: true,
        });
      })
      .catch((error) => {
        alertService.error(error);
      });
  }

  return (
    <div className="p-5">
      <div className="container">
        <h1>Hi {user.firstName}!</h1>
        <p>This is your bitskins bot dashboard</p>
        <br />
        <h4>
          Bot Status:{" "}
          <span className={"btn btn-sm " + className} onClick={switchBotStatus}>
            {user.botStatus}
          </span>
        </h4>
      </div>
    </div>
  );
}

export { Home };
