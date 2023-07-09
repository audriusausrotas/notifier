export function verifications(data) {
  const { email, pass, pass2 } = data;

  if (email && !email.includes("@"))
    return { message: "Wrong email", ok: false };

  if (pass2 && pass !== pass2)
    return { message: "Passwords must match", ok: false };

  if (pass && pass.length < 6)
    return { message: "Password too short", ok: false };

  if (pass && pass.length > 20)
    return { message: "Password too long", ok: false };

  if (pass) {
    let numberCheck = false;
    for (const item of pass) if (!isNaN(item)) numberCheck = true;

    if (!numberCheck)
      return {
        message: "Passwords needs number",
        ok: false,
      };
  }

  return { ok: true };
}
