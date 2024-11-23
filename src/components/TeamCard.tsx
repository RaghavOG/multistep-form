/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bookmark } from 'lucide-react';
import Link from "next/link";

// interface Team {
//   _id: string;
//   team_id: string;
//   team_name: string;
//   theme: string;
//   members: Array<{
//     name: string;
//     contact: string;
//     email: string;
//   }>;
// }

export default function TeamCard({ team }: { team: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">
            {team.team_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4 text-white" />
            <span className="text-sm text-gray-300">Theme:</span>
            <Badge variant="secondary" className="bg-primary/20 text-white text-md hover:bg-primary/30">
              {team.theme}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
          <Bookmark className="h-4 w-4 text-white" />
            <span className="text-sm text-gray-300">Team ID:</span>
            <Badge variant="outline" className="font-mono bg-gray-700 text-white text-lg">
              {team.team_id}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-white" />
            <span className="text-sm text-gray-300">Members:</span>
            <span className="font-semibold text-gray-100">{team.num_teammates}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/admin/dashboard/team/${team.team_id}`}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

