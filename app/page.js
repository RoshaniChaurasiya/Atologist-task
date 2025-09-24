"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import logo from "./Images/logo.jpg";
import google from "./Images/google.jpg";
import signup from "./Images/signup-image.jpg";
import eye from "./Images/eye.jpg";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    terms: false,
    privacy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.terms) newErrors.terms = "You must agree to Terms";
    if (!formData.privacy) newErrors.privacy = "You must agree to Privacy Policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    setLoading(true);
    setSuccessMsg("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          encryptpassword: formData.password,
          mobile: formData.mobile,
          dob: formData.dob,
        }),
      });



      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Signup successful!");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          password: "",
          dob: "",
          terms: false,
          privacy: false,
        });
      } else {
        setErrors({ api: data.message || "Signup failed" });
      }
    } catch (error) {
      setErrors({ api: "Network error, please try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LEFT BOX */}
      <div className={styles.leftBox}>
        {/* NAV */}
        <div className={styles.nav}>
          <div className={styles.logo}>
            <Image src={logo} alt="Logo" width={120} height={40} />
          </div>
          <div className={styles.navRight}>
            <p>
              Already have an account?{" "}
              <a href="#" className={styles.signIn}>
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* FORM BOX */}
        <div className={styles.formBox}>
          <h1 className={styles.heading}>Welcome to Atologist Infotech</h1>
          <p className={styles.subHeading}>Create your account</p>

          <div className={styles.googleLogo}>
            <Image src={google} alt="Google Logo" width={40} height={40} />
          </div>

          <p className={styles.or}>
            <strong>OR</strong>
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="Enter your first name"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                {errors.firstname && (
                  <span style={{ color: "red" }}>{errors.firstname}</span>
                )}
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter your last name"
                  value={formData.lastname}
                  onChange={handleChange}
                />
                {errors.lastname && (
                  <span style={{ color: "red" }}>{errors.lastname}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span style={{ color: "red" }}>{errors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Mobile</label>
              <input
                type="tel"                     // numeric keypad on mobile
                name="mobile"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={(e) => {
                  // allow only numbers
                  const value = e.target.value.replace(/\D/, "");
                  setFormData({ ...formData, mobile: value });
                }}
                maxLength={10}                 // max 10 digits
              />
              {errors.mobile && (
                <span style={{ color: "red" }}>{errors.mobile}</span>
              )}
            </div>


            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Image
                  src={eye}
                  alt="Show password"
                  width={20}
                  height={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)} // toggle
                />
              </div>

              {errors.password && (
                <span style={{ color: "red" }}>{errors.password}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              {errors.dob && <span style={{ color: "red" }}>{errors.dob}</span>}
            </div>

            {/* Terms checkboxes */}
            <div className={styles.checkboxGroup}>
              <p>I agree to</p>
              <div className={styles.checkboxRow}>
                <label>
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                  />{" "}
                  Terms of Service
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleChange}
                  />{" "}
                  Privacy Policy
                </label>
              </div>
              {errors.terms && <span style={{ color: "red" }}>{errors.terms}</span>}
              {errors.privacy && (
                <span style={{ color: "red" }}>{errors.privacy}</span>
              )}
            </div>

            {/* API error */}
            {errors.api && <span style={{ color: "red" }}>{errors.api}</span>}

            {/* Submit button */}
            <button type="submit" className={styles.submitBtn}>
              {loading ? "Submitting..." : "Create Account"}
            </button>

            {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
          </form>
        </div>
      </div>

      {/* RIGHT BOX */}
      <div className={styles.rightBox}>
        <Image src={signup} alt="Signup Illustration" fill style={{ objectFit: "cover" }} />
      </div>
    </div>
  );
}
