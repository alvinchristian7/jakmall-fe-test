export default function thousandSeparator(num) {
  if(num == null) return null
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}