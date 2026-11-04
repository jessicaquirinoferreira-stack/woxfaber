# Security Specification — WOX FABER Real-Time Firestore

## 1. Data Invariants
1. **Product Integrity**: Every product document in `/products/{productId}` must have a valid alphanumeric/hyphen ID (`^[a-zA-Z0-9_\-]+$`, max 128 chars), strict allowed keys, bounded strings, and bounded arrays (`images.size() <= 20`, `videos.size() <= 10`, `highlights.size() <= 15`, `applications.size() <= 10`).
2. **Lead Integrity**: Every lead document in `/leads/{leadId}` must have a valid ID (`^[a-zA-Z0-9_\-]+$`), valid status enum (`novo`, `em_atendimento`, `proposta_enviada`, `fechado`), bounded `name` (2..160 chars), bounded `email` (3..200 chars), and bounded `message` (<= 3000 chars).
3. **SiteConfig Integrity**: The `/site_config/{configId}` document must only use valid ID `main` (or matching regex) and strictly bounded strings (`heroTitle`, `heroSubtitle`, `contactEmail`, etc.).
4. **No Shadow Fields**: All `create` and `update` operations across `/products`, `/leads`, and `/site_config` must strictly enforce `keys().hasOnly(...)` and `affectedKeys().hasOnly(...)` to block arbitrary field injection.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on Product**: `{ ...validProduct, isHacked: true }` -> Rejected by `hasOnly`.
2. **Oversized Product Name (Denial of Wallet)**: `{ ...validProduct, name: "A".repeat(5000) }` -> Rejected by `data.name.size() <= 160`.
3. **Invalid Product Category Enum**: `{ ...validProduct, category: "hacked-cat" }` -> Rejected by category enum check.
4. **Unbounded Images Array**: `{ ...validProduct, images: new Array(50).fill("https://...") }` -> Rejected by `data.images.size() <= 20`.
5. **Unbounded Videos Array**: `{ ...validProduct, videos: new Array(25).fill("https://...") }` -> Rejected by `data.videos.size() <= 10`.
6. **Non-String Element in Images Array**: `{ ...validProduct, images: [12345] }` -> Rejected by `data.images[0] is string`.
7. **ID Poisoning on Product Path**: Path `/products/invalid$id!@#` -> Rejected by `isValidId(productId)`.
8. **Shadow Field on Lead Creation**: `{ ...validLead, adminOverride: true }` -> Rejected by `hasOnly`.
9. **Invalid Lead Status Enum**: `{ ...validLead, status: "hacked_status" }` -> Rejected by `status in ['novo', 'em_atendimento', 'proposta_enviada', 'fechado']`.
10. **Lead Immutable Field Tampering on Update**: Updating `createdAt` or `id` on an existing Lead -> Rejected by `incoming().createdAt == existing().createdAt && incoming().id == existing().id`.
11. **Oversized Lead Message**: `{ ...validLead, message: "X".repeat(10000) }` -> Rejected by `data.message.size() <= 3000`.
12. **SiteConfig Type Poisoning**: `{ ...validConfig, showAnnouncement: "yes" }` -> Rejected by `data.showAnnouncement is bool`.
