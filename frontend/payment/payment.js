
const razorpayKey = 'rzp_test_i99EOMZqK9w3qF';


document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const token = localStorage.getItem("access_token")

    const options = {
        key: razorpayKey,
        amount: amount * 100, // Amount in paise (100 paise = 1 INR)
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Payment for a product or service',
        order_id: 'YOUR_ORDER_ID', // Replace with the actual order ID
    };

    axios
        .post('http://localhost:8800/payment/createOrder', options,
        {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the JWT token in the "Authorization" header
                'Content-Type': 'application/json',
            },
        }    
        ) // Send a POST request to your server to create an order
        .then(function (response) {
            const orderData = response.data;

            const rzp = new Razorpay(options);
            rzp.on('payment.success', function (response) {
                // Handle the payment success and send data to your server
                axios
                    .post('http://localhost:8800/payment/paymentSuccess', response,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include the JWT token in the "Authorization" header
                            'Content-Type': 'application/json',
                        },
                    }    
                    ) // Send payment success data to your server
                    .then(function (result) {
                        console.log(result.data);
                        // Redirect or show a success message to the user
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            });
            rzp.open();
        })
        .catch(function (error) {
            console.error(error);
        });
});
