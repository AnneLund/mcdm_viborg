const { randomBytes } = await import('node:crypto');
console.log(randomBytes(32).toString('hex'))