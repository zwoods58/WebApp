# Lead Processing Workflow (n8n)

## 📝 Overview
Automatically process new leads: score, assign to sales rep, send welcome email, and create follow-up task.

## 🔄 Code Equivalent
- **File**: `src/lib/automation/lead-management.ts`
- **Function**: `processNewLead(leadId: string)`

## 🎯 n8n Workflow Design

```
┌─────────────────────────────────────┐
│  1. Webhook Trigger                 │
│     Endpoint: /webhook/new-lead     │
│     Method: POST                    │
│     Data: { leadId: "..." }         │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  2. HTTP Request                    │
│     GET /api/leads/{{leadId}}       │
│     Fetch lead details              │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  3. Function: Calculate Score       │
│     Code:                           │
│       let score = 0                 │
│       if (email) score += 15        │
│       if (phone) score += 15        │
│       if (company) score += 10      │
│       if (industry == 'Tech') +20   │
│       return score                  │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  4. HTTP Request                    │
│     PATCH /api/leads/{{leadId}}     │
│     Body: { score: {{score}} }      │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  5. HTTP Request                    │
│     GET /api/users?role=SALES       │
│     Fetch available sales reps      │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  6. Function: Round Robin Assign    │
│     Pick next sales rep             │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  7. HTTP Request                    │
│     PATCH /api/leads/{{leadId}}     │
│     Body: { userId: {{repId}} }     │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  8. Gmail/SendGrid Node             │
│     To: {{lead.email}}              │
│     Subject: Welcome to AtarWebb!   │
│     Template: welcome.html          │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  9. HTTP Request                    │
│     POST /api/tasks                 │
│     Create follow-up task           │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│  10. Slack Node                     │
│      Post: New lead assigned        │
│      Message: {{rep.name}} → ...    │
└─────────────────────────────────────┘
```

## 🛠️ n8n Node Configuration

### Node 1: Webhook
- **Type**: Webhook
- **Method**: POST
- **Path**: new-lead
- **Response**: Return success

### Node 2: HTTP Request (Get Lead)
- **Type**: HTTP Request
- **Method**: GET
- **URL**: `http://localhost:3000/api/leads/{{$json["leadId"]}}`

### Node 3: Function (Score Calculation)
- **Type**: Function
- **Code**:
\`\`\`javascript
const lead = items[0].json;
let score = 0;

if (lead.email) score += 15;
if (lead.phone) score += 15;
if (lead.company) score += 10;
if (lead.title) score += 5;

const highValue = ['Technology', 'Finance', 'Healthcare'];
if (lead.industry && highValue.includes(lead.industry)) {
  score += 20;
}

return [{ json: { ...lead, score } }];
\`\`\`

### Node 4: HTTP Request (Update Score)
- **Type**: HTTP Request
- **Method**: PATCH
- **URL**: `http://localhost:3000/api/leads/{{$json["id"]}}`
- **Body**: `{ "score": {{$json["score"]}} }`

### Node 8: Gmail/SendGrid
- **Type**: Gmail or SendGrid
- **Operation**: Send Email
- **To**: `{{$json["email"]}}`
- **Subject**: "Welcome to AtarWebb!"
- **HTML**: [Use template]

### Node 10: Slack
- **Type**: Slack
- **Operation**: Post Message
- **Channel**: #sales
- **Text**: `🎯 New lead: {{$json["firstName"]}} assigned to {{$json["salesRep"]}}`

## 📋 Testing

1. Import this workflow to n8n
2. Activate the workflow
3. Test webhook:
\`\`\`bash
curl -X POST http://localhost:5678/webhook/new-lead \\
  -H "Content-Type: application/json" \\
  -d '{"leadId": "test-123"}'
\`\`\`

## 🔗 Integration

Update your lead import to trigger this workflow:

\`\`\`typescript
// After creating lead
await fetch('http://localhost:5678/webhook/new-lead', {
  method: 'POST',
  body: JSON.stringify({ leadId: newLead.id })
})
\`\`\`

