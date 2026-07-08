import { auth, currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { success, unauthorized, validationError } from '@/lib/api-utils';

const VALID_PRESETS = ['open', 'balanced', 'private'] as const;

/**
 * PUT /v1/me/privacy
 * Updates the user's discoverability and privacy settings.
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

  if (!body.discoverability_preset || !VALID_PRESETS.includes(body.discoverability_preset as typeof VALID_PRESETS[number])) {
    errors.push({ field: 'discoverability_preset', reason: `Must be one of: ${VALID_PRESETS.join(', ')}` });
  }
  if (body.allow_intro_requests === undefined || typeof body.allow_intro_requests !== 'boolean') {
    errors.push({ field: 'allow_intro_requests', reason: 'Must be a boolean' });
  }

  if (errors.length > 0) {
    return validationError(errors);
  }

  const privacy = {
    discoverability_preset: body.discoverability_preset as string,
    allow_intro_requests: body.allow_intro_requests as boolean,
  };

  // Persist to Clerk metadata
  const metadata = { ...(user.unsafeMetadata ?? {}), privacy };
  const client = await clerkClient();
  await client.users.updateUser(user.id, { unsafeMetadata: metadata });

  return success({ privacy });
}