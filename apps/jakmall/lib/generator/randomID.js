// let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export default function (length = 5) {
  let characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let result = ''
  // let length = 10 // Customize the length here.
  for (let i = length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]
  return result
}