module.exports=[14142,a=>{"use strict";let b=(0,a.i(53509).default)("message-square",[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]]);a.s(["MessageSquare",()=>b],14142)},9674,a=>{"use strict";let b=(0,a.i(53509).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);a.s(["Check",()=>b],9674)},80416,a=>{"use strict";var b=a.i(44783),c=a.i(28855),d=a.i(87886),e=a.i(44931),f=a.i(15192),g=a.i(67657),h=a.i(9674),i=a.i(5988),j=a.i(57070),k=a.i(44393),l=a.i(66948);function m({isOpen:a,onClose:m,transaction:n,businessName:o,country:p,customerPhone:q}){let r,s,t,u,v,{t:w}=(0,j.useLanguage)(),[x,y]=(0,c.useState)(!1),z=(s=(r=new Date(n.transaction_date)).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),t=r.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),u=`📄 RECEIPT
━━━━━━━━━━━━━━━━━━━━

${o}
${s}
${t}

`,n.customer_name?u+=`Customer: ${n.customer_name}
━━━━━━━━━━━━━━━━━━━━

`:u+=`━━━━━━━━━━━━━━━━━━━━

`,(v=n.metadata?.inventory_items)&&v.length>0?(v.forEach(a=>{u+=`${a.name}
  ${a.quantity} x ${(0,k.formatCurrency)(a.unit_price,p)} = ${(0,k.formatCurrency)(a.total_price,p)}

`}),u+=`━━━━━━━━━━━━━━━━━━━━
`,n.metadata?.subtotal!==void 0&&(u+=`Subtotal: ${(0,k.formatCurrency)(n.metadata.subtotal,p)}
`),n.metadata?.tax!==void 0&&n.metadata.tax>0&&(u+=`Tax: ${(0,k.formatCurrency)(n.metadata.tax,p)}
`),u+=`TOTAL: ${(0,k.formatCurrency)(n.metadata?.total||n.amount,p)}
`):n.description?u+=`${n.description}
${(0,k.formatCurrency)(n.amount,p)}

━━━━━━━━━━━━━━━━━━━━
TOTAL: ${(0,k.formatCurrency)(n.amount,p)}
`:u+=`Payment Received
${(0,k.formatCurrency)(n.amount,p)}

━━━━━━━━━━━━━━━━━━━━
TOTAL: ${(0,k.formatCurrency)(n.amount,p)}
`,n.payment_method&&(u+=`Payment: ${n.payment_method}
`),u+=`━━━━━━━━━━━━━━━━━━━━

Thank you for your business!
Powered by Beezee 🐝`),A=async()=>{try{await navigator.clipboard.writeText(z),y(!0),setTimeout(()=>y(!1),2e3)}catch(a){console.error("Failed to copy:",a)}};return a?(0,b.jsx)(e.AnimatePresence,{children:(0,b.jsxs)("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[(0,b.jsx)(d.motion.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:m,className:"absolute inset-0 bg-black/60 backdrop-blur-sm"}),(0,b.jsxs)(d.motion.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},className:"relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-gray-200",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center",children:(0,b.jsx)(i.FileText,{size:20,className:"text-blue-600"})}),(0,b.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:w("receipt.title","Receipt")})]}),(0,b.jsx)("button",{onClick:m,className:"p-2 rounded-lg hover:bg-gray-100 transition-colors",children:(0,b.jsx)(f.X,{size:20,className:"text-gray-500"})})]}),(0,b.jsx)("div",{className:"p-6 overflow-y-auto max-h-[calc(90vh-200px)]",children:(0,b.jsx)("div",{className:"bg-gray-50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap border border-gray-200",children:z})}),(0,b.jsxs)("div",{className:"p-6 border-t border-gray-200 bg-gray-50 space-y-3",children:[(0,b.jsx)("button",{onClick:A,className:"w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 bg-white rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors",children:x?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(h.Check,{size:18,className:"text-green-600"}),(0,b.jsx)("span",{className:"text-green-600",children:w("receipt.copied","Copied!")})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(g.Copy,{size:18}),(0,b.jsx)("span",{children:w("receipt.copy","Copy to Clipboard")})]})}),(0,b.jsx)(l.default,{message:z,phoneNumber:q,buttonText:w("receipt.share_whatsapp","Share via WhatsApp"),buttonClassName:"w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"})]})]})]})}):null}a.s(["default",()=>m])}];

//# sourceMappingURL=Downloads_WebApp_WebApp-main_modern-website_50e04bdd._.js.map