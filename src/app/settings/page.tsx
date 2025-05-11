import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your personal and company information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="user avatar"/>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="Eco Innovators Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Sustainability Manager" />
            </div>
          </div>
          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications from EcoPulse.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive important updates and alerts via email.
              </span>
            </Label>
            <Switch id="emailNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="weeklySummary" className="flex flex-col space-y-1">
              <span>Weekly Summary Reports</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get a summary of your environmental impact report every week.
              </span>
            </Label>
            <Switch id="weeklySummary" />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="leaderboardUpdates" className="flex flex-col space-y-1">
              <span>Leaderboard Updates</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Be notified of significant changes in your leaderboard ranking.
              </span>
            </Label>
            <Switch id="leaderboardUpdates" defaultChecked />
          </div>
          <Button>Save Notifications</Button>
        </CardContent>
      </Card>

       <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button variant="outline">Change Password</Button>
           <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg bg-destructive/10 border-destructive/50">
            <Label htmlFor="deleteAccount" className="flex flex-col space-y-1 text-destructive">
              <span>Delete Account</span>
              <span className="font-normal leading-snug text-destructive/80">
                Permanently delete your account and all associated data. This action cannot be undone.
              </span>
            </Label>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
