
"use client";

import type React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trophy, ShieldCheck, Zap, Droplets, Recycle, Leaf, Award, Star, TrendingUp, TrendingDown, Lightbulb, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  company: string;
  points: number;
  avatar: string;
  dataAiHint: string;
  avatarFallback: string;
  badges: { name: string; icon: React.ElementType; color: string; textColor: string; borderColor?: string }[];
  lastMonthChange: number;
  improvementHighlights?: string[];
}

// Assume this is the currently logged-in user's company
const currentUserCompany = "EcoCorp Inc.";

const leaderboardData: LeaderboardEntry[] = [
  { 
    rank: 1, 
    company: "GreenLeaf Solutions", 
    points: 5200, 
    avatar: "https://picsum.photos/40/40?random=10", 
    dataAiHint: "modern logo",
    avatarFallback: "GS",
    badges: [
        { name: "Eco-Champion", icon: Trophy, color: "bg-yellow-400", textColor: "text-yellow-900", borderColor: "border-yellow-500" },
        { name: "Top Reducer", icon: Leaf, color: "bg-green-500", textColor: "text-green-50" },
    ],
    lastMonthChange: 350,
    improvementHighlights: [
      "Upgraded to energy-efficient LED lighting across all facilities.",
      "Implemented a carpooling program for employees, reducing travel emissions by 10%.",
      "Partnered with local suppliers to shorten supply chain distances.",
      "Achieved 90% waste diversion from landfills through enhanced recycling and composting."
    ]
  },
  { 
    rank: 2, 
    company: "Eco Innovators Inc.", 
    points: 4850, 
    avatar: "https://picsum.photos/40/40?random=11", 
    dataAiHint: "tech logo",
    avatarFallback: "EI",
    badges: [
        { name: "Water Wise", icon: Droplets, color: "bg-blue-500", textColor: "text-blue-50" },
        { name: "Sustained Effort", icon: Star, color: "bg-indigo-500", textColor: "text-indigo-50" },
    ],
    lastMonthChange: 200,
    improvementHighlights: [
      "Invested in a state-of-the-art water recycling system, cutting water usage by 25%.",
      "Transitioned 50% of their vehicle fleet to electric vehicles.",
      "Launched an employee education program on sustainable practices at work and home."
    ]
  },
  { 
    rank: 3, 
    company: "Sustainable Futures Ltd.", 
    points: 4500, 
    avatar: "https://picsum.photos/40/40?random=12", 
    dataAiHint: "corporate logo",
    avatarFallback: "SF",
    badges: [
        { name: "Waste Warrior", icon: Recycle, color: "bg-purple-500", textColor: "text-purple-50" }
    ],
    lastMonthChange: 150,
    improvementHighlights: [
      "Redesigned product packaging to use 100% recycled materials and reduce overall material use by 30%.",
      "Installed smart thermostats and building management systems to optimize energy consumption.",
      "Increased renewable energy sourcing to 60% of total consumption."
    ]
  },
  { 
    rank: 4, 
    company: currentUserCompany, // Changed to EcoCorp Inc. for highlighting
    points: 4200, 
    avatar: "https://picsum.photos/40/40?random=13", 
    dataAiHint: "shield logo",
    avatarFallback: "EC", // Updated fallback
    badges: [
        { name: "Energy Saver", icon: Zap, color: "bg-orange-500", textColor: "text-orange-50" }
    ],
    lastMonthChange: 50,
  },
  { 
    rank: 5, 
    company: "Renewable Resources Group", 
    points: 3900, 
    avatar: "https://picsum.photos/40/40?random=14", 
    dataAiHint: "nature logo",
    avatarFallback: "RR",
    badges: [],
    lastMonthChange: -20, 
  },
  { 
    rank: 6, 
    company: "TerraCare Systems", 
    points: 3500, 
    avatar: "https://picsum.photos/40/40?random=15", 
    dataAiHint: "earth logo",
    avatarFallback: "TS",
    badges: [
        { name: "Consistent Reporter", icon: Award, color: "bg-teal-500", textColor: "text-teal-50" }
    ],
    lastMonthChange: 100,
  },
  { 
    rank: 7, 
    company: "AquaSavers", 
    points: 3200, 
    avatar: "https://picsum.photos/40/40?random=16", 
    dataAiHint: "water logo",
    avatarFallback: "AS",
    badges: [
      { name: "Water Wise", icon: Droplets, color: "bg-blue-500", textColor: "text-blue-50" },
    ],
    lastMonthChange: 80,
  },
  { 
    rank: 8, 
    company: "WasteNot Enterprises", 
    points: 2900, 
    avatar: "https://picsum.photos/40/40?random=17", 
    dataAiHint: "recycle logo",
    avatarFallback: "WN",
    badges: [
        { name: "Waste Warrior", icon: Recycle, color: "bg-purple-500", textColor: "text-purple-50" },
        { name: "Top Reducer", icon: Leaf, color: "bg-green-500", textColor: "text-green-50" },
    ],
    lastMonthChange: 120,
  },
  { 
    rank: 9, 
    company: "SolarFlare Energy", 
    points: 2600, 
    avatar: "https://picsum.photos/40/40?random=18", 
    dataAiHint: "sun logo",
    avatarFallback: "SE",
    badges: [
      { name: "Energy Saver", icon: Zap, color: "bg-orange-500", textColor: "text-orange-50" }
    ],
    lastMonthChange: 40,
  },
  { 
    rank: 10, 
    company: "BioSphere Dynamics", 
    points: 2300, 
    avatar: "https://picsum.photos/40/40?random=19", 
    dataAiHint: "globe logo",
    avatarFallback: "BD",
    badges: [],
    lastMonthChange: 0,
  },
];


export default function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary to-primary/80 p-6">
          <div className="flex items-center gap-4">
            <Trophy className="h-12 w-12 text-yellow-300" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary-foreground">
                EcoPulse Leaderboard
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-sm">
                Climb the ranks! See who's leading the charge in sustainability. Your efforts make a difference.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px] text-center font-semibold text-foreground">Rank</TableHead>
                <TableHead className="font-semibold text-foreground">Company</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Points</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Achievements</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Monthly Progress</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Eco-Insights</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow 
                  key={entry.rank} 
                  className={cn(
                    "hover:bg-secondary/60 transition-colors duration-150",
                    entry.company === currentUserCompany && "bg-accent/10 border-l-4 border-accent shadow-md hover:bg-accent/20"
                  )}
                >
                  <TableCell className="font-bold text-center text-lg">
                    {entry.rank === 1 && <span className="text-yellow-500 flex items-center justify-center gap-1"><Trophy className="h-5 w-5" />{entry.rank}</span>}
                    {entry.rank === 2 && <span className="text-gray-400 flex items-center justify-center gap-1"><Award className="h-5 w-5" />{entry.rank}</span>}
                    {entry.rank === 3 && <span className="text-orange-400 flex items-center justify-center gap-1"><Star className="h-5 w-5" />{entry.rank}</span>}
                    {entry.rank > 3 && <span className="text-muted-foreground">{entry.rank}</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/30 shadow-sm">
                        <AvatarImage src={entry.avatar} alt={entry.company} data-ai-hint={entry.dataAiHint} />
                        <AvatarFallback className="font-semibold bg-primary/10 text-primary">{entry.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <span className={cn("font-medium text-foreground hover:text-primary transition-colors cursor-pointer", entry.company === currentUserCompany && "text-accent font-semibold")}>{entry.company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-lg text-primary">{entry.points.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[200px] mx-auto">
                      {entry.badges.length > 0 ? entry.badges.map(badge => (
                        <Badge 
                          key={badge.name} 
                          variant="outline" 
                          className={`py-1 px-2.5 text-xs border ${badge.color} ${badge.textColor} ${badge.borderColor || 'border-transparent'} shadow-sm flex items-center gap-1`}
                          title={badge.name}
                        >
                          <badge.icon className="h-3.5 w-3.5" /> 
                          {badge.name}
                        </Badge>
                      )) : <span className="text-xs text-muted-foreground">-</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                     <div className={`flex items-center justify-center gap-1 text-xs font-medium ${entry.lastMonthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {entry.lastMonthChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                       {entry.lastMonthChange >= 0 ? '+' : ''}{entry.lastMonthChange.toLocaleString()}
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {entry.rank <= 3 && entry.improvementHighlights && entry.improvementHighlights.length > 0 ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs h-8 bg-background hover:bg-muted">
                            <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-yellow-500" />
                            Insights
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 shadow-xl border-primary/50">
                          <div className="grid gap-4">
                            <div className="space-y-1">
                              <h4 className="font-semibold leading-none text-primary flex items-center">
                                <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                                Key Improvements by {entry.company}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Learn from their successful strategies:
                              </p>
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground">
                              {entry.improvementHighlights.map((highlight, index) => (
                                <li key={index}>{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-7 w-7 text-primary" />
            Unlock Achievements & Climb the Ranks!
          </CardTitle>
          <CardDescription className="text-sm">
            Your dedication to sustainability doesn't go unnoticed. Earn points and prestigious badges. 
            <span className="text-primary font-medium"> Learn from top performers by checking their "Eco-Insights"!</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">How Points Are Awarded:</h3>
            <ul className="list-disc list-inside space-y-1.5 pl-4 text-sm">
              <li><strong className="text-primary">Significant Reductions:</strong> Major drops in carbon footprint, energy, or water usage.</li>
              <li><strong className="text-primary">Milestone Achievements:</strong> Reaching specific targets (e.g., 50% renewable energy).</li>
              <li><strong className="text-primary">Consistent Improvement:</strong> Steady progress over several months.</li>
              <li><strong className="text-primary">Eco-Challenge Participation:</strong> Completing platform challenges and initiatives.</li>
              <li><strong className="text-primary">Data Diligence:</strong> Regular and accurate data reporting.</li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold text-foreground mb-2">Badge Showcase:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                    { name: "Eco-Champion", icon: Trophy, color: "bg-yellow-400", textColor: "text-yellow-900", desc: "Top of the leaderboard!" },
                    { name: "Top Reducer", icon: Leaf, color: "bg-green-500", textColor: "text-green-50", desc: "Leading in CO2 reduction." },
                    { name: "Energy Saver", icon: Zap, color: "bg-orange-500", textColor: "text-orange-50", desc: "Excellence in energy efficiency." },
                    { name: "Water Wise", icon: Droplets, color: "bg-blue-500", textColor: "text-blue-50", desc: "Master of water conservation." },
                    { name: "Waste Warrior", icon: Recycle, color: "bg-purple-500", textColor: "text-purple-50", desc: "Champion of recycling efforts." },
                    { name: "Sustained Effort", icon: Star, color: "bg-indigo-500", textColor: "text-indigo-50", desc: "Consistent positive impact." },
                ].map(badge => (
                    <div key={badge.name} className={`p-3 rounded-lg shadow-md flex items-start gap-2 ${badge.color} ${badge.textColor}`}>
                        <badge.icon className="h-5 w-5 mt-0.5 shrink-0" />
                        <div>
                            <span className="font-semibold">{badge.name}</span>
                            <p className="text-xs opacity-80">{badge.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
          <p className="text-center font-medium text-primary pt-4 border-t border-dashed">
            Keep pushing for a greener future – every action counts towards a better ranking and a healthier planet!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


    