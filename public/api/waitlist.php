<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Method not allowed']);
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email) {
    echo json_encode(['error' => 'Invalid email']);
    http_response_code(400);
    exit;
}

$date = date('Y-m-d H:i:s');

// Save to a local CSV as backup
$logFile = __DIR__ . '/../waitlist-data/waitlist.csv';
$logDir = dirname($logFile);
if (!is_dir($logDir)) mkdir($logDir, 0755, true);
file_put_contents($logFile, "$email,$date\n", FILE_APPEND | LOCK_EX);

// Branded email to the subscriber
$subscriberSubject = "You're on the list! 🍒 CHERRI PICK is coming";
$subscriberBody = '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFFBF7;font-family:Poppins,Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;padding:40px 24px;">

<div style="text-align:center;margin-bottom:32px;">
<img src="https://cherri.group/cherri-full-logo.png" alt="CHERRI" style="height:60px;" />
</div>

<div style="background:#fff;border-radius:20px;padding:32px;border:1px solid #f3f3f3;">

<h1 style="font-size:24px;color:#1F2937;margin:0 0 8px;text-align:center;">
You\'re in! 🍒
</h1>

<p style="color:#6B7280;font-size:15px;line-height:1.6;text-align:center;margin:0 0 24px;">
Thanks for joining the CHERRI PICK waitlist. You\'re one of the first to believe in a different way to learn math.
</p>

<div style="background:#FFF5F5;border-radius:12px;padding:20px;margin-bottom:24px;">
<p style="color:#FF0000;font-size:14px;font-weight:600;margin:0 0 8px;text-align:center;">
What is CHERRI PICK?
</p>
<p style="color:#4B5563;font-size:13px;line-height:1.6;margin:0;text-align:center;">
A math learning app where YOUR child picks how they want to learn. 6 methods from around the world. Their brain, their choice.
</p>
</div>

<p style="color:#6B7280;font-size:14px;line-height:1.6;text-align:center;margin:0 0 16px;">
We\'ll reach out soon with early access. In the meantime, your child can try the prototype:
</p>

<div style="text-align:center;margin-bottom:24px;">
<a href="https://pick.cherri.group" style="background:#FF0000;color:#fff;text-decoration:none;padding:12px 32px;border-radius:50px;font-weight:700;font-size:14px;display:inline-block;">
Try the Prototype
</a>
</div>

<p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
Sit with your child and let them drive. Make it feel like play, not homework.
</p>

</div>

<div style="text-align:center;margin-top:32px;">
<p style="color:#9CA3AF;font-size:11px;margin:0 0 4px;">
She spoke. He listened. He started building.
</p>
<p style="color:#9CA3AF;font-size:11px;margin:0;">
Built with 🍒 in Bengaluru | CHERRI GROUP
</p>
</div>

</div>
</body>
</html>';

$subscriberHeaders = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: CHERRI PICK <noreply@cherri.group>',
    'Reply-To: daydream@cherri.group',
];

$sent1 = mail($email, $subscriberSubject, $subscriberBody, implode("\r\n", $subscriberHeaders));

// Notification to Raj
$notifySubject = "New CHERRI PICK Waitlist Signup: $email";
$notifyBody = "
New waitlist signup for CHERRI PICK:

Email: $email
Date: $date
Source: pick.cherri.group

Total signups: " . count(file($logFile)) . "
";

$notifyHeaders = [
    'From: CHERRI PICK <noreply@cherri.group>',
    'Reply-To: daydream@cherri.group',
];

$sent2 = mail('rajesh.b@vseek.in', $notifySubject, $notifyBody, implode("\r\n", $notifyHeaders));

// Send Raj a copy of the branded email the subscriber received
$copySubject = "Copy: Branded email sent to $email";
$copyHeaders = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: CHERRI PICK <noreply@cherri.group>',
    'Reply-To: daydream@cherri.group',
];
mail('rajesh.b@vseek.in', $copySubject, $subscriberBody, implode("\r\n", $copyHeaders));

echo json_encode([
    'success' => true,
    'message' => 'You\'re on the list!'
]);
