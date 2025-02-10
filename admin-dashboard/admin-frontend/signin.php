<?php
session_start();
include 'db.php'; // Include database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Check credentials
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        if ($user['is_verified'] == 0) {
            echo "Your account is not verified. Please verify your email and phone.";
        } else {
            $_SESSION['user_id'] = $user['user_id']; // Set session
            echo "Welcome, " . $user['name'] . "!";
        }
    } else {
        echo "Invalid email or password.";
    }
}
?>

