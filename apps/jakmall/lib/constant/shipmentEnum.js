import thousandSeparator from 'lib/formatter/thousandSeparator'

export default [
  { value: "0", label: 'GO-SEND', price: 15_000, estimation: 'today' },
  { value: "1", label: 'JNE', price: 9_000, estimation: '2 days' },
  { value: "2", label: 'Personal Courier', price: 29_000, estimation: '1 day' },
].map(obj => ({...obj, get formattedPrice() { return thousandSeparator(obj.price) }}))