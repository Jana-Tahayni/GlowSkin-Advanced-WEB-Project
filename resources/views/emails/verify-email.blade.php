<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email – GlowSkin</title>
  <style>
    body  { margin:0; padding:0; background:#FAF0EB; font-family:'Helvetica Neue',Arial,sans-serif; }
    .wrap { max-width:560px; margin:40px auto; background:#fff; border-radius:18px;
            overflow:hidden; box-shadow:0 4px 32px rgba(139,77,58,.10); }
    .hero { background:linear-gradient(135deg,#E8B4A8 0%,#C8896E 100%);
            padding:40px 32px 32px; text-align:center; }
    .hero h1 { margin:0; color:#fff; font-size:28px; font-weight:600; letter-spacing:3px;
               text-transform:uppercase; }
    .hero p  { margin:6px 0 0; color:rgba(255,255,255,.80); font-size:12px; letter-spacing:1.5px; }
    .body    { padding:36px 36px 28px; }
    .body h2 { color:#8B4D3A; font-size:22px; margin:0 0 12px; }
    .body p  { color:#555; font-size:15px; line-height:1.7; margin:0 0 20px; }
    .btn-wrap{ text-align:center; margin:28px 0; }
    .btn     { display:inline-block; padding:14px 36px;
               background:linear-gradient(135deg,#C8896E,#8B4D3A);
               color:#fff !important; text-decoration:none;
               border-radius:11px; font-size:14px; font-weight:600;
               letter-spacing:1px; }
    .note    { color:#9C7B72; font-size:12px; line-height:1.7; }
    .footer  { background:#F2EAE4; padding:18px 36px; text-align:center;
               color:#9C7B72; font-size:11px; letter-spacing:.5px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <h1>GlowSkin</h1>
      <p>Radiant skin, naturally</p>
    </div>
    <div class="body">
      <h2>Hi {{ $firstName }}, verify your email ✨</h2>
      <p>
        Thanks for joining GlowSkin! Click the button below to verify your email
        address and activate your account. This link is valid for <strong>15 minutes</strong>.
      </p>
      <div class="btn-wrap">
        <a href="{{ $verificationUrl }}" class="btn">Verify My Email</a>
      </div>
      <p class="note">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="{{ $verificationUrl }}" style="color:#C8896E;word-break:break-all;">
          {{ $verificationUrl }}
        </a>
      </p>
      <p class="note" style="margin-top:20px;">
        Didn't create an account? You can safely ignore this email.
      </p>
    </div>
    <div class="footer">© {{ date('Y') }} GlowSkin · All rights reserved</div>
  </div>
</body>
</html>