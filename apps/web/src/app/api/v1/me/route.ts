import { auth, currentUser } from '@clerk/nextjs/server';
import { success, unauthorized } from '@/lib/api-utils';

/**
 * GET /v1/me
 * Returns the composite bootstrap payload: user, profile, preferences, privacy.
 * Used by the app shell on initial load.
 */
export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return unauthorized();
  }

  const user = await currentUser();
  if (!user) {
    return unauthorized('User not found');
  }

  const metadata = user.unsafeMetadata ?? {};
  const profile = metadata.profile as ProfileData | undefined;
  const preferences = metadata.preferences as PreferencesData | undefined;
  const privacy = metadata.privacy as PrivacyData | undefined;

  return success({
    user: {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? '',
      status: 'active',
    },
    profile: profile ?? {
      name: user.fullName ?? user.firstName ?? '',
      headline: '',
      bio: '',
      role: '',
      company: '',
      years_exp: null,
      city: 'Toronto',
      neighborhood: '',
      profile_score: 0,
    },
    preferences: preferences ?? {
      goals: [],
      industries: [],
      meet_intents: [],
      availability: null,
      radius_km: 10,
    },
    privacy: privacy ?? {
      discoverability_preset: 'balanced',
      allow_intro_requests: true,
    },
  });
}

// Type definitions for the metadata shapes
interface ProfileData {
  name: string;
  headline: string;
  bio: string;
  role: string;
  company: string;
  years_exp: number | null;
  city: string;
  neighborhood: string;
  profile_score: number;
}

interface PreferencesData {
  goals: string[];
  industries: string[];
  meet_intents: string[];
  availability: Record<string, unknown> | null;
  radius_km: number;
}

interface PrivacyData {
  discoverability_preset: string;
  allow_intro_requests: boolean;
}