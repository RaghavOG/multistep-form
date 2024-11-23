/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import TeamCard from "@/components/TeamCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Stats {
  totalTeams: number;
  totalParticipants: number;
}

interface Team {
  _id: string;
  team_id: string;
  team_name: string;
  theme: string;
  members: Array<{
    name: string;
    contact: string;
    email: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push("/admin/login");
      } else {
        throw new Error(data.error || "Logout failed.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) {
        throw new Error("Failed to fetch statistics");
      }
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();

    async function fetchTeams() {
      setLoading(true);
      try {
        const response = await fetch(`/api/teams?search=${search}`);
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="text-gray-100 hover:text-gray-300 font-medium">
                Home
              </Link>
              <Link href="/sponsors" className="text-gray-100 hover:text-gray-300 font-medium">
                Sponsors
              </Link>
              <Link href="/prizes" className="text-gray-100 hover:text-gray-300 font-medium">
                Prizes
              </Link>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Card */}
          <Card className="shadow-xl bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-100 font-bold">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="flex justify-around text-gray-100">
                  <div>
                    <p className="text-xl font-medium">Total Teams</p>
                    <p className="text-3xl font-bold">{stats.totalTeams}</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium">Total Participants</p>
                    <p className="text-3xl font-bold">{stats.totalParticipants}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search and Team Cards */}
          <Card className="shadow-2xl bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-center text-gray-100">
                Admin Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <motion.div
                className="max-w-xl mx-auto mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SearchBar onSearch={setSearch} />
              </motion.div>

              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-400">
                    No teams found matching your search
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teams.map((team) => (
                    <TeamCard key={team.team_id} team={team} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
