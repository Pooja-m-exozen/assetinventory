# Excalidraw Drawing Instructions
## Step-by-Step Guide to Create Architecture Diagrams

---

## DIAGRAM 1: System Architecture Overview

### Steps:
1. **Create Client Layer Box** (Top)
   - Draw rectangle
   - Label: "CLIENT LAYER"
   - Add boxes inside: Customer App, Restaurant App, Delivery App, Web App

2. **Create API Gateway Box** (Below Client)
   - Draw rectangle
   - Label: "API GATEWAY"
   - Add text: "Load Balancing, Auth, Rate Limiting"

3. **Create Microservices Boxes** (Below Gateway)
   - Draw 3x3 grid of rectangles
   - Labels: User Service, Order Service, Restaurant Service, Payment Service, Delivery Service, Notification Service, Search Service, Analytics Service, Inventory Service

4. **Create Message Queue Box** (Below Services)
   - Draw rectangle
   - Label: "MESSAGE QUEUE (Kafka)"

5. **Create Data Layer Box** (Bottom)
   - Draw rectangle
   - Label: "DATA LAYER"
   - Add boxes: PostgreSQL, Redis, Elasticsearch, S3

6. **Add Arrows**
   - Down arrows between layers
   - Use different colors for different flows

---

## DIAGRAM 2: Order Placement Flow

### Steps:
1. **Start with "START" box** (Top)
2. **Add boxes in sequence**:
   - Customer Opens App
   - Browse Restaurants
   - Select Restaurant
   - View Menu & Add Items
   - Review Cart
   - Enter Delivery Address
   - Select Payment Method
   - Place Order
   - Process Payment
   - Create Order Record
   - Notify Restaurant
   - Send Confirmation
   - END

3. **Add Decision Diamonds**:
   - After "Process Payment": Success/Failed branches
   - Failed → Show Error → END

4. **Use Flowchart Shapes**:
   - Rectangles for processes
   - Diamonds for decisions
   - Arrows for flow direction

---

## DIAGRAM 3: Order Fulfillment Flow

### Steps:
1. **Start with "Order Created"**
2. **Add sequence**:
   - Restaurant Receives Notification
   - Decision: Accept/Reject
   - If Reject → Cancel Order → Refund → END
   - If Accept → Update Status: ACCEPTED
   - Start Preparing Order
   - Update Status: PREPARING
   - Order Ready → Update Status: READY
   - Find Delivery Partner
   - Decision: Found/Not Found
   - If Not Found → Wait & Retry
   - If Found → Assign Delivery Partner
   - Update Status: ASSIGNED
   - Delivery Partner Picks Up
   - Update Status: PICKED
   - Start Real-time Tracking
   - Update Status: OUT_FOR_DELIVERY
   - Order Delivered
   - Update Status: DELIVERED
   - Complete Payment (if COD)
   - Request Rating & Review
   - END

---

## DIAGRAM 4: Payment Processing Flow

### Steps:
1. **Start with "Payment Request"**
2. **Add validation**:
   - Validate Payment Details
   - Decision: Valid/Invalid
3. **Add payment method branches**:
   - Credit/Debit → Process via Gateway
   - UPI → Process via Gateway
   - COD → Defer Payment → Success
   - Wallet → Check Balance → Deduct → Success
4. **Add gateway processing**:
   - Payment Gateway
   - Decision: Success/Failed
   - If Failed → Retry Logic → Max Retries? → Circuit Breaker → Fallback
5. **End with**: Update Transaction → Notify Services → Payment Success

---

## DIAGRAM 5: Delivery Partner Assignment

### Steps:
1. **Start with "Order Ready for Delivery"**
2. **Add steps**:
   - Get Restaurant Location
   - Query Available Delivery Partners
   - Decision: Found/Not Found
   - If Not Found → Wait 30s → Retry
   - Calculate Distance for Each Partner
   - Filter by Status, Load, Rating
   - Rank Partners by Priority
   - Select Top Partner
   - Send Assignment Request
   - Decision: Accept/Reject/Timeout
   - If Reject/Timeout → Select Next → Retry
   - If Accept → Assign Order
   - Update Order Status
   - Notify Customer & Restaurant
   - END

---

## DIAGRAM 6: Real-time Tracking Flow

### Steps:
1. **Start with "Delivery Partner App"**
2. **Add loop**:
   - GPS Location Update (Every 5s)
   - WebSocket Server
   - Store Location (Redis)
   - Broadcast to Customer
   - Customer App Updates Map
   - Analytics Service (Store History)
   - Calculate ETA
   - Update Customer with ETA
   - Loop until Delivered

---

## COLOR SCHEME RECOMMENDATION

- **Client Layer**: Light Blue (#E3F2FD)
- **API Gateway**: Light Green (#E8F5E9)
- **Microservices**: Light Orange (#FFF3E0)
- **Data Layer**: Light Purple (#F3E5F5)
- **Message Queue**: Light Yellow (#FFFDE7)
- **Success Paths**: Green arrows
- **Error Paths**: Red arrows
- **Decision Points**: Yellow diamonds

---

## TIPS FOR EXCALIDRAW

1. **Use Grid**: Enable grid for alignment
2. **Group Elements**: Group related components
3. **Add Labels**: Clear labels on all components
4. **Use Consistent Spacing**: Maintain uniform spacing
5. **Add Legends**: Explain symbols and colors
6. **Export Settings**: 
   - Export as PDF
   - High resolution (300 DPI)
   - Include background

---

## QUICK REFERENCE: Shapes

- **Rectangle**: Process/Service
- **Diamond**: Decision point
- **Circle**: Start/End
- **Parallelogram**: Input/Output
- **Arrow**: Flow direction

---

## FINAL CHECKLIST

- [ ] All components labeled
- [ ] Arrows show correct flow direction
- [ ] Decision points have Yes/No branches
- [ ] Colors are consistent
- [ ] Spacing is uniform
- [ ] Legend is included
- [ ] Export as PDF

