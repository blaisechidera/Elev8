import { auth, currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { success, unauthorized, validationError } from '@/lib/api-utils';

/**
 * PUT /v1/me/profile
 * Updates the user's professional profile.
 * Stored in Clerk unsafeMetadata for MVP (migrate to Postgres later).
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
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push({ field: 'name', reason: 'Name is required' });
  }
  if (!body.role || typeof body.role !== 'string' || body.role.trim().length === 0) {
    errors.push({ field: 'role', reason: 'Role is required' });
  }
  if (body.years_exp !== undefined && body.years_exp !== null) {
    const years = Number(body.years_exp);
    if (isNaN(years) || years < 0 || years > 50) {
      errors.push({ field: 'years_exp', reason: 'Must be between 0 and 50' });
    }
  }

  if (errors.length > 0) {
    return validationError(errors);
  }

  // Compute profile score based on completeness
  let profileScore = 0;
  const fields = ['name', 'headline', 'bio', 'role', 'company', 'neighborhood'];
  for (const field of fields) {
    if (body[field] && typeof body[field] === 'string' && (body[field] as string).trim().length > 0) {
      profileScore += 16; // 6 fields × 16.67 ≈ 100
    }
  }
  profileScore = Math.min(100, Math.round(profileScore));

  // Build profile payload
  const profile = {
    name: (body.name as string).trim(),
    headline: (body.headline as string)?.trim() ?? '',
    bio: (body.bio as string)?.trim() ?? '',
    role: (body.role as string).trim(),
    company: (body.company as string)?.trim() ?? '',
    years_exp: body.years_exp !== undefined ? Number(body.years_exp) : null,
    city: (body.city as string)?.trim() ?? 'Toronto',
    neighborhood: (body.neighborhood as string)?.trim() ?? '',
    profile_score: profileScore,
  };

  // Persist to Clerk metadata
  const metadata = { ...(user.unsafeMetadata ?? {}), profile };
  const client = await clerkClient();
  await client.users.updateUser(user.id, { unsafeMetadata: metadata });

  return success({ profile, profile_score: profileScore });
}