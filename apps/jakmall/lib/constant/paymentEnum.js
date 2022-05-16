import thousandSeparator from 'lib/formatter/thousandSeparator'

export default [
  { value: 0, label: 'e-Wallet', price: 1_500_000, get formattedPrice() { return thousandSeparator(this.price) } },
  { value: 1, label: 'Bank Transfer', price: null },
  { value: 2, label: 'Virtual Account', price: null },
]