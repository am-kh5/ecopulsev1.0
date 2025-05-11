import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, ShieldCheck, Zap } from "lucide-react";

const leaderboardData = [
  { rank: 1, company: "GreenLeaf Solutions", points: 5200, avatar: "https://picsum.photos/40/40?random=10", dataAiHint: "company logo", badges: ["Top Reducer", "Energy Saver"] },
  { rank: 2, company: "Eco Innovators Inc.", points: 4850, avatar: "https://picsum.photos/40/40?random=11", dataAiHint: "company logo", badges: ["Water Wise"] },
  { rank: 3, company: "Sustainable Futures Ltd.", points: 4500, avatar: "https://picsum.photos/40/40?random=12", dataAiHint: "company logo", badges: ["Waste Warrior"] },
  { rank: 4, company: "Planet Protectors Co.", points: 4200, avatar: "https://picsum.photos/40/40?random=13", dataAiHint: "company logo", badges: [] },
  { rank: 5, company: "Renewable Resources Group", points: 3900, avatar: "https://picsum.photos/40/40?random=14", dataAiHint: "company logo", badges: ["Energy Saver"] },
  { rank: 6, company: "TerraCare Systems", points: 3500, avatar: "https://picsum.photos/40/40?random=15", dataAiHint: "company logo", badges: [] },
  { rank: 7, company: "AquaSavers", points: 3200, avatar: "https://picsum.photos/40/40?random=16", dataAiHint: "company logo", badges: ["Water Wise"] },
  { rank: 8, company: "WasteNot Enterprises", points: 2900, avatar: "https://picsum.photos/40/40?random=17", dataAiHint: "company logo", badges: ["Waste Warrior", "Top Reducer"] },
  { rank: 9, company: "SolarFlare Energy", points: 2600, avatar: "https://picsum.photos/40/40?random=18", dataAiHint: "company logo", badges: [] },
  { rank: 10, company: "BioSphere Dynamics", points: 2300, avatar: "https://picsum.photos/40/40?random=19", dataAiHint: "company logo", badges: [] },
];

const badgeColors: { [key: string]: string } = {
  "Top Reducer": "bg-green-500 text-white",
  "Energy Saver": "bg-yellow-500 text-black",
  "Water Wise": "bg-blue-500 text-white",
  "Waste Warrior": "bg-purple-500 text-white",
};


export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent" />
            EcoTrack Leaderboard
          </CardTitle>
          <CardDescription>
            See how companies rank based on their environmental impact reduction efforts. Earn points for sustainable practices!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-center">Badges</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank} className="hover:bg-secondary/50">
                  <TableCell className="font-medium text-center text-lg">
                    {entry.rank <= 3 ? (
                      <span className={
                        entry.rank === 1 ? "text-yellow-500" :
                        entry.rank === 2 ? "text-gray-400" :
                        "text-orange-400" 
                      }>{entry.rank}</span>
                    ) : entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={entry.avatar} alt={entry.company} data-ai-hint={entry.dataAiHint} />
                        <AvatarFallback>{entry.company.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{entry.company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">{entry.points.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {entry.badges.length > 0 ? entry.badges.map(badge => (
                        <Badge key={badge} variant="outline" className={`text-xs ${badgeColors[badge] || 'border-muted-foreground text-muted-foreground'}`}>
                          {badge}
                        </Badge>
                      )) : <span className="text-xs text-muted-foreground">-</span>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            How Points Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>Points are awarded based on various factors, including:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Percentage reduction in carbon footprint month-over-month.</li>
            <li>Achieving specific energy saving milestones.</li>
            <li>Implementing water conservation initiatives.</li>
            <li>Participation in EcoTrack challenges and programs.</li>
            <li>Consistent data reporting and engagement.</li>
          </ul>
          <p>Special badges are awarded for outstanding achievements in specific categories!</p>
        </CardContent>
      </Card>
    </div>
  );
}
