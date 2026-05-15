<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .header { background: #f9f9f9; padding: 20px; text-align: center; }
        .details { margin-top: 20px; width: 100%; border-collapse: collapse; }
        .details td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; color: #d4a373; font-size: 20px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <h1>GlowSkin Invoice</h1>
            <p>Transaction ID: {{ $payment->stripe_id }}</p>
        </div>
        <table class="details">
            <tr><td>Customer Email:</td><td>{{ $user_email }}</td></tr>
            <tr><td>Date:</td><td>{{ $payment->paid_at }}</td></tr>
            <tr><td>Product:</td><td>GlowSkin Service</td></tr>
            <tr class="total"><td>Total Amount:</td><td>${{ $payment->amount }}</td></tr>
        </table>
        <p style="text-align: center; margin-top: 50px;">Thank you for your purchase!</p>
    </div>
</body>
</html>