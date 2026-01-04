import Subscription from '../models/Subscription.js';
import fetch from 'node-fetch';

// Step 1: Create PayChangu Inline Checkout
export const createSubscriptionPayment = async (req, res) => {
  try {
    const amount = 5000; // MWK monthly subscription
    const payload = {
      amount,
      currency: "MWK",
      provider: "mobile_money",
      customer: {
        name: req.user.fullName,
        email: req.user.email,
        phone: req.user.phoneNumber
      },
      callback_url: `${process.env.BACKEND_URL}/api/subscription/verify`
    };

    const response = await fetch("https://api.paychangu.com/v1/checkout/inline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PAYCHANGU_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!data.checkout_url) return res.status(500).json({ message: "Failed to create checkout" });

    return res.status(200).json({ checkoutUrl: data.checkout_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 2: Verify Payment
export const verifySubscription = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const response = await fetch(`https://api.paychangu.com/v1/transaction/${transactionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.PAYCHANGU_API_KEY}`
      }
    });

    const data = await response.json();
    if (data.status !== "successful") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Activate Subscription
    const startedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const subscription = await Subscription.findOneAndUpdate(
      { workerId: req.user._id },
      { isActive: true, startedAt, expiresAt, transactionId },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Subscription activated", subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 3: Get Subscription Status

export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ workerId: req.user._id, isActive: true });

    if (!subscription || new Date() > subscription.expiresAt) {
      return res.status(200).json({ isActive: false });
    }

    return res.status(200).json({
      isActive: true,
      startedAt: subscription.startedAt,
      expiresAt: subscription.expiresAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

