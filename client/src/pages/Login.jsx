import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const initialFormData = {
  email: "",
  password: "",
};

function Login() {
  const { login } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      return "Email address is required.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Password is required.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to sign in. Please check your credentials."
        );
      }

      const token = data.token;

      if (!token) {
        throw new Error(
          "Login was successful, but the authentication token was not received."
        );
      }

      login(token);

      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section aria-labelledby="login-title">
        <header>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to continue to Curate.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMessage && (
            <div role="alert" aria-live="polite">
              {errorMessage}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;