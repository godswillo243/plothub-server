interface PasswordResetSuccessEmailTemplateProps {
  username: string;
}

export function passwordResetSuccessEmailTemplate({
  username,
}: PasswordResetSuccessEmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<title>Password changed successfully</title>
</head>

<body style="margin:0;padding:40px 16px;background:#f8fafc;font-family:Arial,sans-serif;color:#1f2937;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;padding:40px;border-radius:16px;">

<tr>
<td>

<h1>
Password Changed Successfully
</h1>

<p>
Hi <strong>${username}</strong>,
</p>

<p>
Your PlotHub password has been changed successfully.
</p>

<p>
You can now sign in using your new password.
</p>

<div style="
background:#ecfdf5;
padding:16px;
border-radius:12px;
margin:24px 0;
color:#065f46;
">
Your account security has been updated.
</div>


<p>
If you did not make this change, please contact support immediately.
</p>


<hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

<p style="font-size:13px;color:#6b7280;">
Thanks for using PlotHub.
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
