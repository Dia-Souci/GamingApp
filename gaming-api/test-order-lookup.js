const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gaming-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Order schema (simplified)
const orderSchema = new mongoose.Schema({
  orderNumber: String,
  status: String,
  paymentStatus: String,
  customer: {
    email: String,
    fullName: String,
  },
  items: Array,
  totalAmount: Number,
  createdAt: Date,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

async function testOrderLookup() {
  try {
    console.log('Connected to MongoDB');
    
    // Test the specific order number from the checkout
    const orderNumber = 'ORD-202508-000010';
    
    console.log(`Looking for order: ${orderNumber}`);
    
    const order = await Order.findOne({ orderNumber });
    
    if (order) {
      console.log('✅ Order found!');
      console.log('Order details:', {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        customerEmail: order.customer?.email,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      });
    } else {
      console.log('❌ Order not found');
      
      // List all orders to see what's in the database
      console.log('\n--- All orders in database ---');
      const allOrders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
      
      if (allOrders.length === 0) {
        console.log('No orders found in database');
      } else {
        allOrders.forEach((ord, index) => {
          console.log(`${index + 1}. ${ord.orderNumber} - ${ord.status} - ${ord.customer?.email}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testOrderLookup();
