import React from "react";

const Option = ({ className, text = "All Tasks", img }) => {
  return (
    <div className={"option " + className}>
      <img src={`./images/ic${img}Tasks.svg`} alt="All Tasks" />
      <h3>{text}</h3>
    </div>
  );
};

export default Option;
