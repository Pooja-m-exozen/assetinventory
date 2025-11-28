# Food Delivery System - Flowchart Diagrams
## For Excalidraw / Interview Preparation

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                       │
├─────────────────────────────────────────────────────────────┤
│  [Customer App]  [Restaurant App]  [Delivery App]  [Web App] │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  • Load Balancing  • Auth  • Rate Limiting  • Routing│ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   User       │   │   Order      │   │  Restaurant  │
│   Service    │   │   Service    │   │  Service     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Payment    │   │   Delivery   │   │ Notification│
│   Service    │   │   Service    │   │  Service     │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MESSAGE QUEUE (Kafka)                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  [PostgreSQL]  [Redis Cache]  [Elasticsearch]  [S3 Storage] │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. ORDER PLACEMENT FLOW

```
START
  │
  ▼
┌─────────────────┐
│ Customer Opens  │
│     App         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Browse          │
│ Restaurants     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select          │
│ Restaurant      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ View Menu &     │
│ Add Items       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Review Cart     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Enter Delivery  │
│ Address         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select Payment  │
│ Method          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Place Order     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Process Payment │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Success]  [Failed]
    │         │
    │         └──► [Show Error] ──► END
    │
    ▼
┌─────────────────┐
│ Create Order    │
│ Record          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notify          │
│ Restaurant      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send            │
│ Confirmation    │
│ to Customer     │
└────────┬────────┘
         │
         ▼
END
```

---

## 3. ORDER FULFILLMENT FLOW

```
Order Created
    │
    ▼
┌─────────────────┐
│ Restaurant      │
│ Receives        │
│ Notification    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Accept]  [Reject]
    │         │
    │         └──► [Cancel Order] ──► [Refund] ──► END
    │
    ▼
┌─────────────────┐
│ Update Status:  │
│ ACCEPTED        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Start Preparing │
│ Order           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Status:  │
│ PREPARING       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Order Ready     │
│ Update Status:  │
│ READY           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Find Delivery   │
│ Partner         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Found]   [Not Found]
    │         │
    │         └──► [Wait & Retry]
    │
    ▼
┌─────────────────┐
│ Assign Delivery │
│ Partner         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Status:  │
│ ASSIGNED        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Delivery Partner│
│ Picks Up Order  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Status:  │
│ PICKED          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Start Real-time │
│ Tracking        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Status:  │
│ OUT_FOR_DELIVERY│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Order Delivered │
│ Update Status:  │
│ DELIVERED       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Complete Payment│
│ (if COD)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Request Rating  │
│ & Review        │
└────────┬────────┘
         │
         ▼
END
```

---

## 4. PAYMENT PROCESSING FLOW

```
Payment Request
    │
    ▼
┌─────────────────┐
│ Validate        │
│ Payment Details │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Valid]   [Invalid]
    │         │
    │         └──► [Return Error] ──► END
    │
    ▼
┌─────────────────┐
│ Check Payment   │
│ Method          │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    │         │            │
    ▼         ▼            ▼
[Credit/Debit] [UPI]  [COD/Wallet]
    │         │            │
    │         │            ├─► [COD] ──► [Defer] ──► [Success]
    │         │            │
    │         │            └─► [Wallet] ──► [Check Balance]
    │         │                              │
    │         │                         ┌────┴────┐
    │         │                         │         │
    │         │                         ▼         ▼
    │         │                    [Sufficient] [Insufficient]
    │         │                         │         │
    │         │                         │         └──► [Error]
    │         │                         │
    │         │                         ▼
    │         │                    [Deduct] ──► [Success]
    │         │
    │         └──► [Process via Gateway]
    │
    └──► [Process via Gateway]
              │
              ▼
┌─────────────────┐
│ Payment Gateway │
│ (Razorpay/Stripe)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Success]  [Failed]
    │         │
    │         ├─► [Retry?]
    │         │     │
    │         │  ┌──┴──┐
    │         │  │     │
    │         │  ▼     ▼
    │         │[Yes] [No]
    │         │  │     │
    │         │  │     └──► [Payment Failed] ──► END
    │         │  │
    │         │  └──► [Retry Payment]
    │         │
    │         └──► [Payment Failed] ──► END
    │
    ▼
┌─────────────────┐
│ Update          │
│ Transaction     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notify Services │
└────────┬────────┘
         │
         ▼
[Payment Success] ──► END
```

---

## 5. DELIVERY PARTNER ASSIGNMENT FLOW

```
Order Ready for Delivery
    │
    ▼
┌─────────────────┐
│ Get Restaurant  │
│ Location        │
│ (Lat, Lng)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Query Available │
│ Delivery        │
│ Partners        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Found]   [Not Found]
    │         │
    │         └──► [Wait 30s] ──► [Retry Query]
    │
    ▼
┌─────────────────┐
│ Calculate       │
│ Distance for    │
│ Each Partner    │
│ (Haversine)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Filter by:      │
│ • Status: ONLINE│
│ • Current Load  │
│ • Rating        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Rank Partners   │
│ by Priority:    │
│ 1. Distance     │
│ 2. Rating       │
│ 3. Availability │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Select Top      │
│ Partner         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Send Assignment │
│ Request         │
│ (Push Notification)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Accept]  [Reject/Timeout]
    │         │
    │         └──► [Select Next] ──► [Send Request]
    │
    ▼
┌─────────────────┐
│ Assign Order    │
│ to Partner      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Order    │
│ Status: ASSIGNED│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notify Customer │
│ & Restaurant    │
└────────┬────────┘
         │
         ▼
[Assignment Complete] ──► END
```

---

## 6. REAL-TIME TRACKING FLOW

```
Delivery Partner App
    │
    ▼
┌─────────────────┐
│ GPS Location    │
│ Update (Every 5s)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ WebSocket       │
│ Server          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Store   │ │ Broadcast│
│ Location│ │ to       │
│ (Redis) │ │ Customer │
└─────────┘ └─────────┘
    │         │
    │         ▼
    │    ┌─────────┐
    │    │ Customer│
    │    │ App     │
    │    │ Updates │
    │    │ Map     │
    │    └─────────┘
    │
    ▼
┌─────────────────┐
│ Analytics       │
│ Service         │
│ (Store History) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Calculate       │
│ ETA             │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Customer │
│ with ETA        │
└────────┬────────┘
         │
         ▼
[Continue Tracking] ──► [Loop until Delivered]
```

---

## 7. MICROSERVICES COMMUNICATION FLOW

```
Client Request
    │
    ▼
┌─────────────────┐
│ API Gateway     │
│ • Auth          │
│ • Rate Limit    │
│ • Route         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service A       │
│ (Order Service) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ Sync    │ │ Async   │
│ HTTP    │ │ Kafka   │
│ Call    │ │ Event   │
└─────────┘ └─────────┘
    │         │
    │         ▼
    │    ┌─────────┐
    │    │ Service │
    │    │ B       │
    │    │ (Payment)│
    │    └─────────┘
    │
    ▼
┌─────────────────┐
│ Service C       │
│ (Notification)  │
│ (via Kafka)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ External        │
│ Services        │
│ (FCM, SMS, Email)│
└────────┬────────┘
         │
         ▼
[Response to Client]
```

---

## 8. DATABASE SCALING STRATEGY

```
Application Request
    │
    ▼
┌─────────────────┐
│ Check Cache     │
│ (Redis)         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Cache Hit] [Cache Miss]
    │         │
    │         ▼
    │    ┌─────────────────┐
    │    │ Route to        │
    │    │ Read Replica    │
    │    │ (if Read)       │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ Primary DB       │
    │    │ (if Write)       │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ Update Cache    │
    │    └────────┬────────┘
    │             │
    └─────────────┘
         │
         ▼
[Return Response]
```

---

## 9. ERROR HANDLING & RETRY FLOW

```
Service Request
    │
    ▼
┌─────────────────┐
│ Execute Request │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Success]  [Error]
    │         │
    │         ▼
    │    ┌─────────────────┐
    │    │ Check Error Type│
    │    └────────┬────────┘
    │             │
    │    ┌─────────┴─────────┐
    │    │                   │
    │    ▼                   ▼
    │[Retryable]        [Non-Retryable]
    │    │                   │
    │    │                   └──► [Return Error]
    │    │
    │    ▼
    │┌─────────────────┐
    ││ Retry with      │
    ││ Exponential     │
    ││ Backoff         │
    │└────────┬────────┘
    │         │
    │    ┌────┴────┐
    │    │         │
    │    ▼         ▼
    │[Success]  [Max Retries]
    │    │         │
    │    │         └──► [Circuit Breaker]
    │    │                  │
    │    │                  ▼
    │    │             [Fallback]
    │    │                  │
    │    └──────────────────┘
    │
    ▼
[Return Response]
```

---

## 10. DEPLOYMENT PIPELINE FLOW

```
Developer
    │
    ▼
┌─────────────────┐
│ Commit Code     │
│ to Git          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CI/CD Pipeline  │
│ Triggered       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Run Tests       │
│ (Unit, Integration)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Pass]    [Fail]
    │         │
    │         └──► [Notify Developer] ──► END
    │
    ▼
┌─────────────────┐
│ Build Docker    │
│ Image           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Push to         │
│ Container       │
│ Registry        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy to       │
│ Staging         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Run E2E Tests   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Pass]    [Fail]
    │         │
    │         └──► [Rollback] ──► END
    │
    ▼
┌─────────────────┐
│ Deploy to       │
│ Production      │
│ (Blue-Green)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Health Check    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
[Healthy] [Unhealthy]
    │         │
    │         └──► [Rollback] ──► END
    │
    ▼
┌─────────────────┐
│ Switch Traffic  │
│ to New Version  │
└────────┬────────┘
         │
         ▼
[Deployment Complete] ──► END
```

---

## KEY COMPONENTS SUMMARY

### Frontend Layer
- Mobile Apps (iOS/Android)
- Web Application
- Restaurant Portal
- Delivery Partner App
- Admin Dashboard

### API Layer
- API Gateway (Kong/AWS API Gateway)
- Load Balancer
- Rate Limiting
- Authentication Service

### Microservices
1. **User Service**: Authentication, profiles
2. **Restaurant Service**: Restaurant & menu management
3. **Order Service**: Order lifecycle management
4. **Payment Service**: Payment processing
5. **Delivery Service**: Delivery assignment & tracking
6. **Notification Service**: Push, SMS, Email
7. **Search Service**: Restaurant & menu search
8. **Analytics Service**: Business intelligence

### Data Layer
- **PostgreSQL**: Primary database (with read replicas)
- **Redis**: Caching & session management
- **Elasticsearch**: Search functionality
- **Kafka**: Message queue & event streaming
- **S3/MinIO**: Object storage (images, documents)

### Infrastructure
- **Kubernetes**: Container orchestration
- **Docker**: Containerization
- **Cloud**: AWS/GCP/Azure
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

---

## SCALABILITY FEATURES

1. **Horizontal Scaling**: Stateless services, auto-scaling
2. **Database Scaling**: Read replicas, sharding, caching
3. **CDN**: Global content delivery
4. **Load Balancing**: Distribute traffic
5. **Message Queue**: Async processing, event-driven
6. **Caching**: Multi-layer caching strategy

---

## RELIABILITY FEATURES

1. **Fault Tolerance**: Circuit breakers, retries
2. **High Availability**: Multi-AZ deployment
3. **Disaster Recovery**: Backups, replication
4. **Health Checks**: Automatic recovery
5. **Monitoring**: Real-time alerts

---

## SECURITY FEATURES

1. **Authentication**: JWT tokens, OAuth 2.0
2. **Encryption**: TLS/SSL, database encryption
3. **API Security**: Rate limiting, input validation
4. **Compliance**: PCI DSS for payments

---

## INTERVIEW TALKING POINTS

### When asked about scalability:
- "We use horizontal scaling with stateless microservices"
- "Database scaling through read replicas and sharding"
- "Multi-layer caching (Redis, CDN) to reduce database load"
- "Message queues for async processing and event-driven architecture"

### When asked about reliability:
- "99.99% uptime through multi-AZ deployment"
- "Circuit breakers prevent cascading failures"
- "Automatic failover and health checks"
- "Comprehensive monitoring and alerting"

### When asked about performance:
- "Sub-200ms API response times through caching"
- "CDN for static content delivery"
- "Database query optimization and indexing"
- "Load balancing for efficient traffic distribution"

### When asked about microservices:
- "Independent deployment and scaling"
- "Technology diversity - best tool for each service"
- "Fault isolation - failure in one doesn't affect others"
- "Team autonomy and faster development"

---

## NOTES FOR EXCALIDRAW

1. Use different colors for different layers:
   - Client Layer: Blue
   - API Gateway: Green
   - Microservices: Orange
   - Data Layer: Purple
   - Infrastructure: Gray

2. Use arrows to show data flow direction

3. Add labels for each component

4. Group related components together

5. Use dashed lines for async communication (Kafka)

6. Use solid lines for sync communication (HTTP)

7. Add legends for different line types

