import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Create Supabase client for organization database
const supabaseOrg = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public'
    }
  }
);

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie or header
    const token = req.cookies.get('furfield_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Decode token (don't verify since HMS trusts auth service)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long-for-hs256') as any;
    
    console.log('🔍 Fetching subscriptions for:', {
      userId: decoded.userId,
      entityPlatformId: decoded.entityPlatformId,
      userPlatformId: decoded.userPlatformId
    });

    if (!decoded.entityPlatformId) {
      return NextResponse.json(
        { 
          success: true, 
          data: { 
            subscribedModules: [],
            entity: null,
            message: 'No entity assigned to user'
          }
        }
      );
    }

    // Fetch entity with subscribed modules
    const { data: entityData, error: entityError } = await supabaseOrg
      .from('hospital_master')
      .select('entity_platform_id, entity_name, subscribed_modules, subscription_status, subscription_end_date, address, city, state, country, logo_storage')
      .eq('entity_platform_id', decoded.entityPlatformId)
      .single();

    if (entityError) {
      console.error('Error fetching entity:', entityError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch entity data' },
        { status: 500 }
      );
    }

    if (!entityData) {
      return NextResponse.json(
        { success: false, error: 'Entity not found' },
        { status: 404 }
      );
    }

    // Check subscription status
    const isActive = entityData.subscription_status === 'active';
    const hasValidSubscription = entityData.subscription_end_date && 
                                  new Date(entityData.subscription_end_date) > new Date();

    console.log('✅ Subscription data:', {
      entity: entityData.entity_name,
      modulesCount: entityData.subscribed_modules?.length || 0,
      isActive,
      hasValidSubscription
    });

    // Format location string
    const locationParts = [entityData.city, entityData.state, entityData.country].filter(Boolean);
    const entityLocation = locationParts.length > 0 ? locationParts.join(', ') : undefined;

    return NextResponse.json({
      success: true,
      data: {
        entity: {
          entityPlatformId: entityData.entity_platform_id,
          entityName: entityData.entity_name,
          entityLocation: entityLocation,
          address: entityData.address,
          city: entityData.city,
          state: entityData.state,
          country: entityData.country,
          logoStorage: entityData.logo_storage,
          subscriptionStatus: entityData.subscription_status,
          subscriptionEndDate: entityData.subscription_end_date,
          isActive: isActive && hasValidSubscription
        },
        subscribedModules: entityData.subscribed_modules || [],
      }
    });

  } catch (error: any) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
