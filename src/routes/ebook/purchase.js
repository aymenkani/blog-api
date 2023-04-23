const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const express = require("express");
const Ebook = require("../../models/ebook");
const BadRequestError = require("../../common/errors/bad-request-error");
const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_KEY);

const route = express.Router();

route.post("/purchase/:ebookId", async (req, res, next) => {
  const { stripeToken } = req.body;

  try {
    const ebook = await Ebook.findById(req.params.ebookId);
    if (!ebook) throw new BadRequestError("Document not found");

    let customer_id;

    if (!req.currentUser.customer_id) {
      if (!stripeToken) throw new BadRequestError("stripe token is required!");

      const customer = await stripe.customers.create({
        email: req.currentUser.email,
        source: stripeToken,
      });

      customer_id = customer.id;

      // save customer id
      const auth_token = jwt.sign(
        {
          email: req.currentUser.email,
          userId: req.currentUser.userId,
          customer_id: customer.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
      );

      req.session = { token: auth_token };
    } else {
      customer_id = req.currentUser.customer_id;
    }

    // create stripe charge for ebook
    await stripe.charges.create({
      amount: ebook.price * 100,
      currency: "usd",
      customer: customer_id,
    });

    // Generate temporary access token with short expiry time
    const token = jwt.sign(
      { userId: req.currentUser.userId, ebookId: req.params.ebookId },
      process.env.JWT_SECRET,
      { expiresIn: "5 minutes" }
    );

    //generate unique URL with access token
    const url = `http://localhost:3000/ebook/download/${token}`;

    const msg = {
      to: req.currentUser.email,
      from: "YOUR_REAL_EMAIL",
      subject: "Thank you from your purchase!",
      html: `
                <p>Thank you for purchasing ${ebook.title}. 
                    You can download the ebook from the following URL:
                </p>
                <p><a href="${url}">${url}</a></p>
                <p>Enjoy you reading!</p>
            `,
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "Download link has been sent to your email address",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = route;
