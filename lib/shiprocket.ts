export async function getShiprocketToken(): Promise<string> {
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Shiprocket auth failed: ${data.message || 'Unknown error'}`);
  }
  return data.token;
}

export async function createShiprocketOrder(order: any) {
  try {
    const token = await getShiprocketToken();
    
    // Format date to YYYY-MM-DD HH:mm
    const dateObj = new Date();
    const orderDate = dateObj.toISOString().slice(0, 16).replace('T', ' ');

    // Extract first and last name safely
    const nameParts = (order.customer_name || 'Customer').split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

    const payload = {
      order_id: order.order_number,
      order_date: orderDate,
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'home',
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pincode,
      billing_state: order.state,
      billing_country: 'India',
      billing_email: order.customer_email || 'info@sanjpriya.com',
      billing_phone: order.customer_phone,
      shipping_is_billing: true,
      order_items: order.items.map((item: any) => ({
        name: item.name,
        sku: item.id.toString(),
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order.subtotal,
      // Default dummy dimensions/weight for clothes since we don't track them yet
      length: 15,
      breadth: 15,
      height: 5,
      weight: 0.5,
    };

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/ad-hoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Shiprocket order creation failed:', data);
      throw new Error(`Failed to push to Shiprocket: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('Shiprocket Integration Error:', error);
    // We don't want to throw and crash the main checkout flow if Shiprocket is down, 
    // so we just log the error and allow the order to be saved in our DB.
    return null; 
  }
}
