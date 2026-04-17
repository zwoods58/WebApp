// src/services/creditService.ts
import { db } from '@/lib/database';
import { supabase } from '@/lib/supabase';

export interface CreditRecord {
  id: string;
  customer_name: string;
  amount: number;
  paid_amount: number;
  status: 'outstanding' | 'partial' | 'paid';
  due_date?: string; // ✅ Made optional to match StoredCredit
  date_given?: string; // ✅ Made optional to match StoredCredit
  business_id: string;
}

/**
 * Find existing credit by customer name
 * Checks IndexedDB first (offline), then Supabase (online)
 */
export async function findCreditByCustomer(
  customerName: string,
  businessId: string
): Promise<CreditRecord | null> {
  // Clean up customer name (trim and normalize)
  const cleanName = customerName.trim();
  
  console.log(`🔍 [CreditService] Looking for customer: "${cleanName}" in business: ${businessId}`);
  
  // 1. Check IndexedDB first (offline)
  const cachedCredit = await db.credit
    .where('customer_name')
    .equals(cleanName)
    .and(c => c.business_id === businessId)
    .first();
  
  if (cachedCredit) {
    console.log(`📦 [CreditService] Found in IndexedDB: ${cleanName}, amount: ${cachedCredit.amount}, paid: ${cachedCredit.paid_amount}`);
    return cachedCredit;
  }
  
  // 2. If online, check Supabase
  if (navigator.onLine) {
    console.log(`🌐 [CreditService] Checking Supabase for: ${cleanName}`);
    const { data, error } = await supabase
      .from('credit')
      .select('*')
      .eq('customer_name', cleanName)
      .eq('business_id', businessId)
      .maybeSingle();
    
    if (data && !error) {
      console.log(`✅ [CreditService] Found in Supabase: ${cleanName}`);
      // Cache to IndexedDB for offline use
      await db.credit.put({ ...data, syncStatus: 'synced' });
      return data;
    }
  }
  
  console.log(`🆕 [CreditService] No existing credit found for: ${cleanName}`);
  return null;
}

/**
 * Add amount to existing customer's credit (accumulates)
 */
export async function addToExistingCredit(
  creditId: string,
  amountToAdd: number
): Promise<void> {
  console.log(`📈 [CreditService] Adding ${amountToAdd} to credit: ${creditId}`);
  
  const existing = await db.credit.get(creditId);
  if (!existing) {
    throw new Error(`Credit record not found: ${creditId}`);
  }
  
  const newTotalAmount = existing.amount + amountToAdd;
  const newStatus = newTotalAmount > (existing.paid_amount || 0) ? 'outstanding' : 'paid';
  
  console.log(`📊 [CreditService] Credit update: ${existing.amount} → ${newTotalAmount}, paid: ${existing.paid_amount}, status: ${newStatus}`);
  
  // Update IndexedDB
  await db.credit.update(creditId, {
    amount: newTotalAmount,
    status: newStatus,
  });
  
  // Sync to Supabase if online
  if (navigator.onLine) {
    console.log(`☁️ [CreditService] Syncing to Supabase`);
    const { error } = await supabase
      .from('credit')
      .update({
        amount: newTotalAmount,
        status: newStatus,
      })
      .eq('id', creditId);
    
    if (error) {
      console.warn(`⚠️ [CreditService] Failed to sync to Supabase:`, error);
    } else {
      // Update sync status in IndexedDB
      await db.credit.update(creditId, { syncStatus: 'synced' });
    }
  }
}

/**
 * Create new credit record
 */
export async function createNewCredit(
  customerName: string,
  amount: number,
  dueDate: string | undefined,
  businessId: string
): Promise<CreditRecord> {
  const cleanName = customerName.trim();
  const calculatedDueDate = dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`✨ [CreditService] Creating new credit for: ${cleanName}, amount: ${amount}, due: ${calculatedDueDate}`);
  
  const newCredit = {
    id: crypto.randomUUID(),
    customer_name: cleanName,
    amount: amount,
    paid_amount: 0,
    status: 'outstanding' as const,
    date_given: today,
    due_date: calculatedDueDate,
    business_id: businessId,
    syncStatus: 'pending' as const,
  };
  
  // Save to IndexedDB
  await db.credit.add(newCredit);
  
  // Sync to Supabase if online
  if (navigator.onLine) {
    console.log(`☁️ [CreditService] Syncing new credit to Supabase`);
    const { error } = await supabase
      .from('credit')
      .insert({
        id: newCredit.id,
        customer_name: newCredit.customer_name,
        amount: newCredit.amount,
        paid_amount: newCredit.paid_amount,
        status: newCredit.status,
        date_given: newCredit.date_given,
        due_date: newCredit.due_date,
        business_id: newCredit.business_id,
      });
    
    if (error) {
      console.warn(`⚠️ [CreditService] Failed to sync to Supabase:`, error);
    } else {
      await db.credit.update(newCredit.id, { syncStatus: 'synced' });
      console.log(`✅ [CreditService] New credit synced to Supabase, ID: ${newCredit.id}`);
    }
  }
  
  return newCredit;
}

/**
 * Main function: Handle credit from transaction
 */
export async function handleCreditTransaction(
  customerName: string,
  amount: number,
  dueDate: string | undefined,
  businessId: string
): Promise<{ credit: CreditRecord; wasExisting: boolean }> {
  console.log(`🚀 [CreditService] Processing credit transaction for: ${customerName}, amount: ${amount}`);
  
  // Find existing credit record
  const existingCredit = await findCreditByCustomer(customerName, businessId);
  
  if (existingCredit) {
    // Add to existing balance (accumulates)
    await addToExistingCredit(existingCredit.id, amount);
    // Refresh the credit record to get updated amount
    const updatedCredit = await db.credit.get(existingCredit.id);
    return { credit: updatedCredit!, wasExisting: true };
  } else {
    // Create new credit record
    const newCredit = await createNewCredit(customerName, amount, dueDate, businessId);
    return { credit: newCredit, wasExisting: false };
  }
}
