export const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64')
}
