import React, { useEffect, useState } from "react";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Todo from "./components/Todo";

function App() {
  // we are not using react-router in this particular app.
  // So that students with basic understanding of React Hooks (like useState, useEffect and useRef can follow..)

  // So instead of using react routing , we are using conditional rendering (by using useState hook)

  const [page, setPage] = useState("signin");
  const [component, setComponent] = useState();

  useEffect(() => {
    if (page === "signin") setComponent(<SignIn setPage={setPage} />);
    // We are passing setPage function as a prop...
    else if (page === "signup") setComponent(<SignUp setPage={setPage} />);
    else if (page === "todo") setComponent(<Todo setPage={setPage} />);
  }, [page]);

  return component;
}

export default App;
