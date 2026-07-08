import { auth, currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { success, unauthorized, validationError } from '@/lib/api-utils';

/**
 * PUT /v1/me/preferences
 * Updates the user's matching preferences (goals, industries, intents, availability, radius).
 */
export async function PUT(request: Request) {
  const session = await auth();
  if (!session.userId) {
    return unauthorized();
  }

  const user = await currentUser();
  if (!user) {
    return unauthorized('User not found');
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return validationError([{ field: 'body', reason: 'Invalid JSON' }]);
  }

  // Validate required fields
  const errors: Array<{ field: string; reason: string }> = [];

  if (!body.goals || !Array.isArray(body.goals) || body.goals.length === 0) {
    errors.push({ field: 'goals', reason: 'At least one goal is required' });
  }
  if (!body.industries || !Array.isArray(body.industries) || body.industries.length === 0) {
    errors.push({ field: 'industries', reason: 'At least one industry is required' });
  }
  if (body.radius_km !== undefined && body.radius_km !== null) {
    const radius = Number(body.radius_km);
    if (isNaN(radius) || radius < 1 || radius > 50) {
      errors.push({ field: 'radius_km', reason: 'Must be between 1 and 50' });
    }
  } else {
    errors.push({ field: 'radius_km', reason: 'Radius is required' });
  }

  if (errors.length > 0) {
    return validationError(errors);
  }

  const preferences = {
    goals: body.goals as string[],
    industries: body.industries as string[],
    meet_intents: (body.meet_intents as string[]) ?? [],
    availability: (body.availability as Record<string, unknown>) ?? null,
    radius_km: Number(body.radius_km),
  };

  // Persist to Clerk metadata
  const metadata = { ...(user.unsafeMetadata ?? {}), preferences };
  const client = await clerkClient();
  await client.users.updateUser(user.id, { unsafeMetadata: metadata });

  return success({ preferences });
}