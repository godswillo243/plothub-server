interface VerifiedEmailTemplateProps {
  username: string;
}

export function verifiedEmailTemplate({ username }: VerifiedEmailTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>PlotHub account verification</title>
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
Your account is now verified.
</p>

<hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

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
