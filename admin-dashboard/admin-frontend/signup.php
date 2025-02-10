<?php
session_start();
include 'db.php'; // Include database connection
require 'vendor/autoload.php'; // PHPMailer

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password
    $otp = rand(100000, 999999); // Generate 6-digit OTP

    // Check for duplicate email or phone
    $query = "SELECT * FROM users WHERE email = ? OR phone = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$email, $phone]);

    if ($stmt->rowCount() > 0) {
        echo "Email or phone number is already in use.";
        exit;
    }

    // Insert user with OTP
    $query = "INSERT INTO users (name, email, phone, password, otp_code) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$name, $email, $phone, $password, $otp]);

    // Send OTP (email example, can also use SMS API)
    sendEmailOTP($email, $otp);

    header("Location: verify.html");
    exit;
}

// Function to send OTP email
function sendEmailOTP($email, $otp) {
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Your SMTP server
        $mail->SMTPAuth = true;
        $mail->Username = 'dragontargaryon@gmail.com'; // Your email
        $mail->Password = 'msetdplzqhhxbgqn'; // Email password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('dragontargaryon@gmail.com', 'E-commerce');
        $mail->addAddress($email);

        $mail->Subject = 'Your OTP Code';
        $mail->Body = "Your OTP is: $otp";

        $mail->send();
        echo "OTP sent!";
    } catch (Exception $e) {
        echo "OTP could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
