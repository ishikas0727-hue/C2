import React, { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useD1Auth } from "../context/D1AuthContext";
import "./D1Pricing.css";

function Pricing({ goTo }) {
  const { user, plan, refreshProfile } = useD1Auth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "" });

  const upgrade = () => {
    setMessage("");
    if (!user) {
      setMessage("Please log in to upgrade your plan.");
      return;
    }
    if (plan === "paid") {
      setMessage("You are already on the Paid plan.");
      return;
    }
    setOpen(true);
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const card = form.card.replace(/\s/g, "");
    if (!form.name.trim() || !/^\d{16}$/.test(card) || !/^\d{2}\/\d{2}$/.test(form.expiry) || !/^\d{3,4}$/.test(form.cvv)) {
      setMessage("Enter a valid name, 16-digit card number, MM/YY expiry and 3–4 digit CVV.");
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        plan: "paid",
        upgradedAt: serverTimestamp()
      }, { merge: true });
      await refreshProfile();
      setOpen(false);
      setForm({ name: "", card: "", expiry: "", cvv: "" });
      setMessage("Upgrade successful! You are now on the Paid plan.");
    } catch (error) {
      setMessage("Upgrade could not be saved. Check your Firestore rules.");
    }
  };

  return (
    <main className="d1-pricing">
      <section className="d1-heading">
        <p className="d1-kicker">DEV@Deakin</p>
        <h1>Pricing</h1>
        <p>Choose the plan that suits your DEV@Deakin experience.</p>
        <div className="d1-status">Current plan: <strong>{plan === "paid" ? "Paid" : "Free"}</strong></div>
      </section>
      <section className="d1-plans">
        <article className="d1-card">
          <h2>Free</h2><p className="d1-price">$0</p>
          <ul><li>Browse community posts</li><li>Basic profile</li><li>Standard image uploads</li><li>Limited posts per month</li></ul>
          <button className="d1-secondary" disabled={plan === "free"}>{plan === "free" ? "Current Plan" : "Free Plan"}</button>
        </article>
        <article className="d1-card d1-featured">
          <span className="d1-badge">Recommended</span>
          <h2>Paid</h2><p className="d1-price">$9.99 <span>/ month</span></p>
          <ul><li>Access to all posts</li><li>Increased posts per month</li><li>Larger image upload limit</li><li>Enhanced profile features</li><li>Paid member status</li></ul>
          <button className="d1-primary" onClick={upgrade}>{plan === "paid" ? "Already Paid" : "Upgrade Plan"}</button>
        </article>
      </section>
      {message && <p className="d1-message">{message}</p>}
      <button className="back-link" onClick={() => goTo("home")}>← Back to Home</button>
      {open && <div className="d1-overlay"><div className="d1-modal">
        <button className="d1-close" onClick={() => setOpen(false)}>×</button>
        <h2>Upgrade to Paid</h2><p>Demo payment form. Card details are validated and are not stored in Firestore.</p>
        <form onSubmit={submit}>
          <input name="name" placeholder="Name on card" value={form.name} onChange={change} required />
          <input name="card" placeholder="Card number (16 digits)" value={form.card} onChange={change} required />
          <div className="d1-row"><input name="expiry" placeholder="MM/YY" value={form.expiry} onChange={change} required /><input name="cvv" placeholder="CVV" value={form.cvv} onChange={change} required /></div>
          <button className="d1-primary" type="submit">Confirm Upgrade</button>
        </form>
      </div></div>}
    </main>
  );
}
export default Pricing;
