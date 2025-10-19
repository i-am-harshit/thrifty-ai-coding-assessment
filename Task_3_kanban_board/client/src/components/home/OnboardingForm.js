import { useState } from "react";
import "./styles.scss";
import Wrapper from "../common/Wrapper/Wrapper";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function OnboardingForm({ onSignup, onSignin }) {
  const [showForm, setShowForm] = useState(true);
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [isSignInActive, setIsSignInActive] = useState(false);

  const showSignUpHandler = () => {
    setShowForm(true);
    setIsSignUpActive(true);
    setIsSignInActive(false);
  };

  const showSignInHandler = () => {
    setShowForm(false);
    setIsSignInActive(true);
    setIsSignUpActive(false);
  };

  return (
    <div className="form-wrapper">
      <Wrapper width="100%" justify="space-around">
        <h3
          className={`action-title${isSignUpActive ? " active" : ""}`}
          onClick={showSignUpHandler}
        >
          Sign Up
        </h3>
        <h3
          className={`action-title${isSignInActive ? " active" : ""}`}
          onClick={showSignInHandler}
        >
          Sign In
        </h3>
      </Wrapper>
      <Wrapper width="100%" padding="2em 0 1em 0" justify="center">
        {!showForm && <SignInForm onSignin={onSignin} />}
        {showForm && <SignUpForm onSignup={onSignup} />}
      </Wrapper>
    </div>
  );
}
