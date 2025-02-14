import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/hooks/useRealtimeData";
import { Profile as ProfileType, BasicInformation } from "@/types/database";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuth();
  const { data: profiles, loading: profileLoading, error: profileError } = 
    useRealtimeSubscription<ProfileType>('profiles', user?.id || '', 'id');
  const { data: basicInfo, loading: basicInfoLoading, error: basicInfoError } = 
    useRealtimeSubscription<BasicInformation>('basic_information', user?.id || '');

  const profile = profiles?.[0];
  const info = basicInfo?.[0];

  const isLoading = profileLoading || basicInfoLoading;
  const error = profileError || basicInfoError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Full Name</dt>
                <dd className="text-sm">{profile?.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">{profile?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                <dd className="text-sm">{profile?.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Member Since</dt>
                <dd className="text-sm">
                  {profile?.created_at ? format(new Date(profile.created_at), 'PPP') : '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
                <dd className="text-sm">
                  {info?.date_of_birth ? format(new Date(info.date_of_birth), 'PPP') : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Gender</dt>
                <dd className="text-sm">{info?.gender || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Blood Type</dt>
                <dd className="text-sm">{info?.blood_type || '-'}</dd>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Height</dt>
                  <dd className="text-sm">{info?.height ? `${info.height} cm` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Weight</dt>
                  <dd className="text-sm">{info?.weight ? `${info.weight} kg` : '-'}</dd>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Emergency Contact</dt>
                <dd className="text-sm">
                  {info?.emergency_contact ? (
                    <>
                      {info.emergency_contact.name} ({info.emergency_contact.relationship})
                      <br />
                      {info.emergency_contact.phone}
                    </>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 