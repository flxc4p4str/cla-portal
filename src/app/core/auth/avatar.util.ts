function rotateLeft(value: number, bits: number): number {
  return (value << bits) | (value >>> (32 - bits));
}

function addUnsigned(x: number, y: number): number {
  const x4 = x & 0x40000000;
  const y4 = y & 0x40000000;
  const x8 = x & 0x80000000;
  const y8 = y & 0x80000000;
  const result = (x & 0x3fffffff) + (y & 0x3fffffff);

  if (x4 & y4) {
    return result ^ 0x80000000 ^ x8 ^ y8;
  }

  if (x4 | y4) {
    return (result & 0x40000000) ? result ^ 0xc0000000 ^ x8 ^ y8 : result ^ 0x40000000 ^ x8 ^ y8;
  }

  return result ^ x8 ^ y8;
}

function md5Common(a: number, b: number, c: number, d: number, x: number, s: number, ac: number, operator: number): number {
  return addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, operator), addUnsigned(x, ac)), s), b);
}

function md5F(x: number, y: number, z: number): number {
  return (x & y) | (~x & z);
}

function md5G(x: number, y: number, z: number): number {
  return (x & z) | (y & ~z);
}

function md5H(x: number, y: number, z: number): number {
  return x ^ y ^ z;
}

function md5I(x: number, y: number, z: number): number {
  return y ^ (x | ~z);
}

function convertToWordArray(value: string): number[] {
  const wordArray: number[] = [];
  const messageLength = value.length;
  const numberOfWords = (((messageLength + 8) - ((messageLength + 8) % 64)) / 64 + 1) * 16;

  for (let index = 0; index < numberOfWords; index += 1) {
    wordArray[index] = 0;
  }

  let byteIndex = 0;
  let wordIndex = 0;
  while (byteIndex < messageLength) {
    wordIndex = (byteIndex - (byteIndex % 4)) / 4;
    wordArray[wordIndex] |= value.charCodeAt(byteIndex) << ((byteIndex % 4) * 8);
    byteIndex += 1;
  }

  wordIndex = (byteIndex - (byteIndex % 4)) / 4;
  wordArray[wordIndex] |= 0x80 << ((byteIndex % 4) * 8);
  wordArray[numberOfWords - 2] = messageLength << 3;
  wordArray[numberOfWords - 1] = messageLength >>> 29;

  return wordArray;
}

function wordToHex(value: number): string {
  let output = '';
  for (let index = 0; index <= 3; index += 1) {
    output += (`0${((value >>> (index * 8)) & 255).toString(16)}`).slice(-2);
  }
  return output;
}

function utf8Encode(value: string): string {
  return unescape(encodeURIComponent(value));
}

function md5(value: string): string {
  const wordArray = convertToWordArray(utf8Encode(value));
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let index = 0; index < wordArray.length; index += 16) {
    const originalA = a;
    const originalB = b;
    const originalC = c;
    const originalD = d;

    a = md5Common(a, b, c, d, wordArray[index + 0], 7, 0xd76aa478, md5F(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 1], 12, 0xe8c7b756, md5F(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 2], 17, 0x242070db, md5F(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 3], 22, 0xc1bdceee, md5F(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 4], 7, 0xf57c0faf, md5F(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 5], 12, 0x4787c62a, md5F(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 6], 17, 0xa8304613, md5F(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 7], 22, 0xfd469501, md5F(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 8], 7, 0x698098d8, md5F(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 9], 12, 0x8b44f7af, md5F(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 10], 17, 0xffff5bb1, md5F(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 11], 22, 0x895cd7be, md5F(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 12], 7, 0x6b901122, md5F(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 13], 12, 0xfd987193, md5F(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 14], 17, 0xa679438e, md5F(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 15], 22, 0x49b40821, md5F(c, d, a));

    a = md5Common(a, b, c, d, wordArray[index + 1], 5, 0xf61e2562, md5G(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 6], 9, 0xc040b340, md5G(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 11], 14, 0x265e5a51, md5G(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 0], 20, 0xe9b6c7aa, md5G(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 5], 5, 0xd62f105d, md5G(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 10], 9, 0x02441453, md5G(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 15], 14, 0xd8a1e681, md5G(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 4], 20, 0xe7d3fbc8, md5G(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 9], 5, 0x21e1cde6, md5G(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 14], 9, 0xc33707d6, md5G(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 3], 14, 0xf4d50d87, md5G(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 8], 20, 0x455a14ed, md5G(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 13], 5, 0xa9e3e905, md5G(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 2], 9, 0xfcefa3f8, md5G(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 7], 14, 0x676f02d9, md5G(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 12], 20, 0x8d2a4c8a, md5G(c, d, a));

    a = md5Common(a, b, c, d, wordArray[index + 5], 4, 0xfffa3942, md5H(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 8], 11, 0x8771f681, md5H(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 11], 16, 0x6d9d6122, md5H(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 14], 23, 0xfde5380c, md5H(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 1], 4, 0xa4beea44, md5H(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 4], 11, 0x4bdecfa9, md5H(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 7], 16, 0xf6bb4b60, md5H(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 10], 23, 0xbebfbc70, md5H(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 13], 4, 0x289b7ec6, md5H(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 0], 11, 0xeaa127fa, md5H(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 3], 16, 0xd4ef3085, md5H(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 6], 23, 0x04881d05, md5H(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 9], 4, 0xd9d4d039, md5H(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 12], 11, 0xe6db99e5, md5H(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 15], 16, 0x1fa27cf8, md5H(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 2], 23, 0xc4ac5665, md5H(c, d, a));

    a = md5Common(a, b, c, d, wordArray[index + 0], 6, 0xf4292244, md5I(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 7], 10, 0x432aff97, md5I(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 14], 15, 0xab9423a7, md5I(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 5], 21, 0xfc93a039, md5I(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 12], 6, 0x655b59c3, md5I(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 3], 10, 0x8f0ccc92, md5I(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 10], 15, 0xffeff47d, md5I(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 1], 21, 0x85845dd1, md5I(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 8], 6, 0x6fa87e4f, md5I(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 15], 10, 0xfe2ce6e0, md5I(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 6], 15, 0xa3014314, md5I(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 13], 21, 0x4e0811a1, md5I(c, d, a));
    a = md5Common(a, b, c, d, wordArray[index + 4], 6, 0xf7537e82, md5I(b, c, d));
    d = md5Common(d, a, b, c, wordArray[index + 11], 10, 0xbd3af235, md5I(a, b, c));
    c = md5Common(c, d, a, b, wordArray[index + 2], 15, 0x2ad7d2bb, md5I(d, a, b));
    b = md5Common(b, c, d, a, wordArray[index + 9], 21, 0xeb86d391, md5I(c, d, a));

    a = addUnsigned(a, originalA);
    b = addUnsigned(b, originalB);
    c = addUnsigned(c, originalC);
    d = addUnsigned(d, originalD);
  }

  return `${wordToHex(a)}${wordToHex(b)}${wordToHex(c)}${wordToHex(d)}`;
}

export function buildGravatarUrl(email: string, size = 128): string {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return '';
  }

  return `https://www.gravatar.com/avatar/${md5(normalizedEmail)}?d=404&s=${size}`;
}
