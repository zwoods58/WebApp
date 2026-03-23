import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sanitizeObject } from '@/lib/validation/sanitizer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.operations || !Array.isArray(body.operations)) {
      return NextResponse.json(
        { error: 'Invalid request: operations array required' },
        { status: 400 }
      );
    }

    // Sanitize all operation data
    const operations = body.operations.map((op: any) => ({
      ...op,
      data: op.data ? sanitizeObject(op.data) : undefined
    }));

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const results = [];
    const errors = [];
    
    for (const op of operations) {
      try {
        let result;
        
        switch (op.table) {
          case 'transactions':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('transactions')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('transactions')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'inventory':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('inventory')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('inventory')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('inventory')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'credit':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('credit')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('credit')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('credit')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'expenses':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('expenses')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('expenses')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'services':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('services')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('services')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'appointments':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('appointments')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('appointments')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'targets':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('targets')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('targets')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('targets')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
            
          case 'beehive':
            if (op.type === 'CREATE') {
              const { data, error } = await supabase
                .from('beehive')
                .insert(op.data)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'UPDATE') {
              const { data, error } = await supabase
                .from('beehive')
                .update(op.data)
                .eq('id', op.entityId)
                .select()
                .single();
              
              if (error) throw error;
              result = data;
            } else if (op.type === 'DELETE') {
              const { error } = await supabase
                .from('beehive')
                .delete()
                .eq('id', op.entityId);
              
              if (error) throw error;
              result = { deleted: true };
            }
            break;
        }
        
        results.push({
          operationId: op.id,
          success: true,
          data: result
        });
        
      } catch (error: unknown) {
        errors.push({
          operationId: op.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      processed: results.length,
      results,
      errors
    });
    
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
