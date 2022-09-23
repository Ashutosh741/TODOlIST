import React, { useRef } from "react";
import "./SignUp.css";

const SignUp = (props) => {
  const nameRef = useRef();
  const userNameRef = useRef();
  const userPasswordRef = useRef();
  //
  const handleSignInClick = () => props.setPage("signin");

  const handleRegister = () => {
    // CHECK to signIN
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userNameRef.current.value,
        password: userPasswordRef.current.value,
        name: nameRef.current.value,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.status == "true") {
          alert("User Registered.\nPlease sign in.");
          setTimeout(function () {
            props.setPage("signin");
          }, 1000);
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div id="sign-up">
      <header>
        <h1>Algrow Learning</h1>
      </header>

      <main>
        <h2>Sign Up.</h2>
        <section>
          <input ref={nameRef} type="text" class="name" placeholder="Name" />
          <br />
          <input
            ref={userNameRef}
            type="text"
            className="user-name"
            placeholder="User Name"
          />
          <br />
          <input
            ref={userPasswordRef}
            type="password"
            className="password"
            placeholder="Password"
          />
          <br />

          <button id="btn-register" onClick={handleRegister}>
            Register
          </button>
        </section>
        <p>
          Already have an account?
          <span className="link" onClick={handleSignInClick}>
            Sign In
          </span>
        </p>
      </main>
    </div>
  );
};

export default SignUp;
