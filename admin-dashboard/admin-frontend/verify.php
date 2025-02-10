<?php
session_start();
include 'db.php'; // Include database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $otp = $_POST['otp'];

    // Verify OTP
    $query = "SELECT * FROM users WHERE email = ? AND otp_code = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$email, $otp]);

    if ($stmt->rowCount() > 0) {
        // Update user as verified
        $query = "UPDATE users SET is_verified = 1, otp_code = NULL WHERE email = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$email]);

        $message = "Registration successful! Please proceed to the Sign In page to complete your login.";
        $messageClass = "success-message";
    } else {
        $message = "Invalid OTP!";
        $messageClass = "error-message"; 
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
        }

        .message {
            padding: 20px;
            border-radius: 5px;
            text-align: center;
            width: 80%;
            max-width: 400px;
        }

        .success-message {
            background-color: #4CAF50;
            color: white;
            border: 1px solid #45a049;
        }

        .error-message {
            background-color: #f44336;
            color: white;
            border: 1px solid #e53935;
        }
    </style>
</head>
<body>

    <div class="message <?php echo isset($messageClass) ? $messageClass : ''; ?>">
        <?php echo isset($message) ? $message : ''; ?>
    </div>

</body>
</html>