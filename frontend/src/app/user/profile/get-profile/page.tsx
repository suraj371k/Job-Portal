"use client";

import { useUserProfileStore } from "@/store/userStore";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  FileText,
  Github,
  Linkedin,
  Globe,
  Calendar,
  DollarSign,
  User,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserProfilePage = () => {
  const { userProfile, loading,  fetchUserProfile } = useUserProfileStore();


  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

 

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold">No Profile Found</p>
              <Link href={'/user/profile/create-profile'}>
              <Button>Create Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    user,
    title,
    bio,
    location,
    phone,
    skills,
    experience,
    education,
    resume,
    jobPreferences,
    socialLinks,
    createdAt,
    updatedAt,
  } = userProfile;

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase() || "UN";
  };

  const router = useRouter();

  if(!user){
       router.push("/login")
  }

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string | number | Date, endDate: string | number | Date | undefined, current: boolean) => {
    const start = formatDate(startDate);
    const end = current ? "Present" : endDate ? formatDate(endDate) : "N/A";
    return `${start} - ${end}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                {title && <p className="text-xl text-muted-foreground">{title}</p>}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user?.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
              
              {bio && (
                <p className="text-muted-foreground mt-4 max-w-2xl">{bio}</p>
              )}
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks?.linkedin && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.github && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.portfolio && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {resume && (
                <Button variant="outline" size="icon" asChild>
                  <a href={resume} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-fit">
                    Skills
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={`${exp.company}-${index}`} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h3 className="font-semibold text-lg">{exp.position}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    )}
                    {index < experience.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={`${edu.institution}-${index}`} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h3 className="font-semibold text-lg">{edu.degree} in {edu.field}</h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                      </div>
                    </div>
                    {index < education.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Job Preferences */}
          {jobPreferences && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Job Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobPreferences.jobType && jobPreferences.jobType.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Job Type</p>
                    <div className="flex flex-wrap gap-1">
                      {jobPreferences.jobType.map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {jobPreferences.expectedSalary && (
                  <div>
                    <p className="text-sm font-medium">Expected Salary</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${jobPreferences.expectedSalary.toLocaleString()}
                    </p>
                  </div>
                )}
                
                {jobPreferences.preferredLocations && jobPreferences.preferredLocations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Preferred Locations</p>
                    <div className="flex flex-wrap gap-1">
                      {jobPreferences.preferredLocations.map((location, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {jobPreferences.remotePreference && (
                  <div>
                    <p className="text-sm font-medium">Remote Preference</p>
                    <Badge variant={jobPreferences.remotePreference === 'remote' ? 'default' : 'secondary'}>
                      {jobPreferences.remotePreference.charAt(0).toUpperCase() + jobPreferences.remotePreference.slice(1)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Profile Meta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">{formatDate(createdAt)}</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">{formatDate(updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;