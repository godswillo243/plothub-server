interface VerificationEmailTemplateProps {
  username: string;
  otp: string;
}

export function verificationEmailTemplate({
  username,
  otp,
}: VerificationEmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Verify your PlotHub account</title>
</head>

<body style="margin:0;padding:40px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#1f2937;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px;border-radius:16px;">

<tr>
<td>

<h1 style="margin-bottom:16px;">Welcome to PlotHub 📚</h1>

<p>Hi <strong>${username}</strong>,</p>

<p>
Thanks for creating your PlotHub account.
Use the verification code below to verify your email address.
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
This code will expire in <strong>10 minutes</strong>.
</p>

<p>
Never share this code with anyone.
PlotHub staff will never ask for your verification code.
</p>

<hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

<p style="font-size:13px;color:#6b7280;">
If you didn't create a PlotHub account, you can safely ignore this email.
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
