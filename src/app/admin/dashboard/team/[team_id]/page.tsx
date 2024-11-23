"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mail, Phone, FileText, Archive, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Member {
  _id: string;
  name: string;
  email: string;
  contact: string;
}

interface Team {
  _id: string;
  team_id: string;
  team_name: string;
  theme: string;
  members: Member[];
  abstract_submission?: string;
  project_submission?: string;
}

export default function TeamDetails() {
  const params = useParams();
  const team_id = params.team_id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function handleDeleteTeam() {
    const confirmDelete = confirm("Are you sure you want to delete this team?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/teams/${team_id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete team");
      }

      alert("Team successfully deleted");
      window.location.href = "/admin/dashboard"; // Redirect to the teams list after deletion
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete team");
    }
  }

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch(`/api/teams/${team_id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch team details");
        }

        setTeam(data);
      } catch (error) {
        console.error("Failed to fetch team details", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (team_id) fetchTeam();
  }, [team_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="p-8 rounded-lg bg-gray-800 shadow-xl">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-300 text-center">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-2xl mx-auto mt-8">
        <Alert variant="destructive" className="shadow-xl bg-red-900 border-red-700">
          <AlertDescription className="text-center py-2 text-red-100">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-2xl bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
          <CardTitle className="text-4xl font-bold text-gray-100">{team.team_name}</CardTitle>
          <div className="text-gray-300 space-y-2 mt-3">
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-400">Team ID:</span>
              <Badge variant="outline" className="font-mono bg-gray-700 text-white text-lg">
                {team.team_id}
              </Badge>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium text-gray-400">Theme:</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 text-white text-lg">
                {team.theme}
              </Badge>
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-10 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
              <span>Team Members</span>
              <Badge variant="secondary" className="text-sm bg-primary/20 text-primary">
                {team.members.length}
              </Badge>
            </h2>
            <ScrollArea className="h-[300px] rounded-md border border-gray-700">
              <ul className="grid gap-3 p-4">
                {team.members.map((member) => (
                  <motion.li
                    key={member._id}
                    className="p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-medium text-gray-100">{member.name}</span>
                      <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-primary" />
                          {member.email}
                        </span>
                        {member.contact && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-primary" />
                            {member.contact}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </ScrollArea>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">Submissions</h2>
            <div className="grid gap-4">
              {team.abstract_submission && (
                <motion.a
                  href={team.abstract_submission}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-blue-900/30 rounded-lg hover:bg-blue-800/40 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="h-6 w-6 text-blue-400" />
                  <span className="font-medium text-blue-300 group-hover:underline">
                    Abstract Submission (PDF)
                  </span>
                </motion.a>
              )}
              {team.project_submission && (
                <motion.a
                  href={team.project_submission}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-900/30 rounded-lg hover:bg-green-800/40 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Archive className="h-6 w-6 text-green-400" />
                  <span className="font-medium text-green-300 group-hover:underline">
                    Project Submission (ZIP)
                  </span>
                </motion.a>
              )}
              {!team.abstract_submission && !team.project_submission && (
                <p className="text-center text-gray-400 py-4 bg-gray-700/50 rounded-lg">
                  No submissions yet
                </p>
              )}
            </div>
          </motion.div>

          {/* Delete Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2 py-3"
              onClick={handleDeleteTeam}
            >
              <Trash2 className="h-5 w-5" />
              Delete Team
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
