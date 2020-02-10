import React, { useState, useEffect } from "react";

export const CustomEventComponent = event => {
  console.log(event);
  return (
    <span>
      {" "}
      <strong> {event.title} </strong>{" "}
    </span>
  );
};
