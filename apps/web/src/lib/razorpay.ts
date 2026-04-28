declare global {
  interface Window {
    Razorpay?: any
  }
}

export async function loadRazorpayCheckout() {
  if (window.Razorpay) return window.Razorpay
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
  if (!window.Razorpay) throw new Error('Razorpay not available')
  return window.Razorpay
}

