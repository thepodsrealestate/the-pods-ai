# WHATSAPP WEBHOOK PROTOCOL SPECIFICATION

## Overview
This document specifies the exact JSON payload schemas, validation rules, idempotency handlers, and database contracts for inbound WhatsApp events received from ManyChat or custom Make.com webhook triggers.

## Inbound Message Schema (ManyChat External Request / Make Webhook)

```json
{
  "event_id": "evt_mc_9876543210",
  "event_type": "inbound_message",
  "timestamp": "2026-08-12T17:40:00Z",
  "phone": "+971501234567",
  "external_contact_id": "mc_user_12345",
  "sender_name": "John Doe",
  "message_id": "wamid.HBgLMTk3MTUwMTIzNDU2Nw==",
  "payload": {
    "text": "Hi, I am looking for a 1 bedroom apartment in Dubai under 1.5M AED",
    "media_url": null,
    "media_type": "text"
  },
  "attribution": {
    "source": "META_ADS",
    "campaign": "Sobha_Hartland_II_Lead_Gen",
    "ad_id": "ad_998877",
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "dubai_luxury_investors"
  }
}
```

## Idempotency Rules
1. Every incoming webhook MUST contain an `event_id` or `message_id`.
2. The ingestion endpoint checks the `WebhookEvent` table in PostgreSQL before processing.
3. If `event_id` already exists: return `200 OK` immediately with `{ "status": "duplicate_ignored" }`.
4. If new: insert into `WebhookEvent` and proceed to Lead & Message creation.

## Fast ACK Policy
The webhook endpoint MUST acknowledge receipt with HTTP 200 OK within 500ms. AI reasoning, Google Calendar lookups, and outbound responses are processed asynchronously or via non-blocking queue execution.
