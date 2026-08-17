import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const initialFormData = {
  email: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const { login } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!email) {
      return "Email address is required.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (!password) {
      return "Password is required.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
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
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
          data.message || "Unable to create your account. Please try again."
        );
      }

      setSuccessMessage(
        "Your account has been created successfully. You can now sign in."
      );

      /*
       * If the backend returns a JWT immediately after registration,
       * store it through AuthContext.
       *
       * If registration only creates the account, the user can
       * continue to the Login page instead.
       */
      if (data.token) {
        login(data.token);
      }

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
      <section aria-labelledby="register-title">
        <header>
          <h1 id="register-title">Create your account</h1>
          <p>Join Curate and start managing your samples.</p>
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
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={isSubmitting}
              required
              minLength={6}
            />
          </div>

          {errorMessage && (
            <div role="alert" aria-live="polite">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div role="status" aria-live="polite">
              {successMessage}
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Register;