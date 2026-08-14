# THE PODS REAL ESTATE — SYSTEM ARCHITECTURE DOCUMENT

## Architecture Specifications

- **Database:** Supabase PostgreSQL System-of-Record (Transaction Pooler + Direct Connection)
- **ORM:** Prisma Client with 14 normalized models
- **Frontend Framework:** Next.js 14+ App Router
- **Type Safety:** Strict TypeScript enabled
- **Authentication:** NextAuth / Custom Session Token RBAC (ADMIN, SALES, VIEWER)

## Prisma Database Models

1. `User` - Dashboard users & role management
2. `Lead` - Primary lead record with E.164 phone normalization
3. `LeadAttribution` - Multi-channel UTM & Ad attribution tracking
4. `Conversation` - Active WhatsApp conversation threads
5. `Message` - Individual message records with sender type & latency metrics
6. `PropertyProject` - Off-plan property catalog (Danube, Sobha, Binghatti)
7. `PropertyDocument` - Verified PDF brochures and layout specs
8. `PropertyFact` - Atomic property facts for RAG AI retrieval
9. `Booking` - Google Calendar event bookings at The Pods Bluewaters
10. `Voucher` - Cryptographically unique AED 20,000 fine dining codes (`POD-VIP-XXXXX`)
11. `Handoff` - Human agent takeover requests & alerts
12. `WebhookEvent` - Idempotency log table for external webhooks
13. `AuditLog` - Operational security & system audit trail
14. `SystemEvent` - Real-time system monitoring logs
