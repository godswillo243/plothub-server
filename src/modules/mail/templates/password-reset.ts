interface PasswordResetEmailTemplateProps {
  username: string;
  otp: string;
}

export function passwordResetEmailTemplate({
  username,
  otp,
}: PasswordResetEmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Reset your PlotHub password</title>
</head>

<body style="margin:0;padding:40px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#1f2937;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px;border-radius:16px;">

<tr>
<td>

<h1 style="margin-bottom:16px;">Reset Your Password</h1>

<p>Hi <strong>${username}</strong>,</p>

<p>
We received a request to reset your PlotHub password.
Use the verification code below to continue.
</p>

<div
style="
margin:32px 0;
padding:20px;
background:#f3f4f6;
border-radius:12px;
text-align:center;
font-size:32px;
font-weight:bold;
letter-spacing:8px;
font-family:monospace;
"
>
${otp}
</div>

<p>
This code expires in <strong>10 minutes</strong>.
</p>

<p>
If you didn't request a password reset, simply ignore this email.
</p>

<hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

<p style="font-size:13px;color:#6b7280;">
Never share this code with anyone.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}
