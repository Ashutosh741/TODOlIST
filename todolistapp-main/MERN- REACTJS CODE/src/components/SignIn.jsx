import React, { useRef, useEffect } from "react";
import "./SignIn.css";

const SignIn = (props) => {
  const userNameRef = useRef();
  const userPassword = useRef();

  // const user = { id: "abcd", pass: "1234" };
  //
  // Check if Already signed IN //
  useEffect(() => {
    if (localStorage.getItem("todoJWTtoken")) {
      props.setPage("todo");
    }
  }, []);

  const handleSignUpClick = () => props.setPage("signup");

  const handleLogIn = () => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userNameRef.current.value,
        password: userPassword.current.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "true") {
          var token = data.token;
          localStorage.setItem("todoJWTtoken", token); // we are storing token in localstorage.. but please don't do that when building commercial apps..this is just to teach basic concepts
          props.setPage("todo");
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div id="sign-in">
      <header>
        <h1>Algrow Learning</h1>
      </header>

      <main>
        <h2>Sign In.</h2>
        <section>
          <input
            ref={userNameRef}
            id="user-name"
            type="text"
            placeholder="User Name"
          />
          <br />
          <input
            ref={userPassword}
            id="password"
            type="password"
            placeholder="Password"
          />
          <br />
          <button id="sign-in-btn" onClick={handleLogIn}>
            Login
          </button>
        </section>
        <p>
          Don't have an account?
          <span className="link" onClick={handleSignUpClick}>
            Sign Up
          </span>
        </p>
      </main>
    </div>
  );
};

export default SignIn;
