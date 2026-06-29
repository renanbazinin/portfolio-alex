import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash-password -- "yourPassword"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const encoded = Buffer.from(hash, "utf8").toString("base64");
console.log("\nAdd this to your environment as ADMIN_PASSWORD_HASH:\n");
console.log(encoded);
console.log();
