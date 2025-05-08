import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#493628] mb-4">Welcome to Campus Hub</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Your centralized platform for university events, activities, and community engagement.
        </p>
        <Link href="/events">
          <Button className="bg-[#a89c29] hover:bg-[#a89c29]/90 text-white text-lg px-6 py-3 rounded-md">
            Browse Events
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-[#a89c29]">Discover Events</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Find and attend campus events that match your interests, from academic lectures to social gatherings.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-[#a89c29]">Create Events</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Organize and promote your own events to the campus community with our easy-to-use tools.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-[#a89c29]">Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Meet like-minded people and build your network through shared interests and activities.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-[#493628] mb-6">Upcoming Featured Events</h2>
        <Link href="/events">
          <Button variant="outline" className="border-[#a89c29] text-[#a89c29] hover:bg-[#a89c29] hover:text-white">
            View All Events
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
