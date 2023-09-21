import Razorpay from 'razorpay'

const razorpay = new Razorpay({
    key_id: "rzp_test_i99EOMZqK9w3qF",
    key_secret: "2eh2MnYfbBqOsUrA9Y3VClXk",
})

// create order payment
export const createOrder = async (req,res) => {
    const options = {
        amount: 1000, // Amount in paise (100 paise = 1 INR)
        currency: "INR",
        receipt: "order_receipt_1",
    };
    
    try {
        const order = await razorpay.orders.create(options);
    
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Unable to create order" });
    }

}

// check status of payment
export const paymentStatus = (req,res) => {
    const { payment_id, order_id, signature } = req.body;

    const isValidSignature = razorpay.webhooks.verifyPaymentSignature(
        JSON.stringify(req.body),
        signature
    );

    if (isValidSignature) {
    
    // You can update your database or perform other actions here
        res.status(200).send("Payment successful");
    } else {
        res.status(400).send("Invalid signature");
    }
}
