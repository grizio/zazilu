db.createCollection("user")
db.user.insert({
  email: "admin@admin.test",
  // "password"
  password: "$2b$12$BEgv6KJbbYsqFiiBFpbn1.DzldNCfAXLitK.oU5b46RkTcE1ULbw.",
  role: "admin",
})