"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"
import { useEmployerProfileStore } from "@/store/employerStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Globe,
  Calendar,
  Building2,
  Users,
  Link2,
  Twitter,
  Linkedin,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const EmployerProfile = () => {
  const router = useRouter()
  const { user, hasHydrated } = useAuthStore()
  const { employerProfile, fetchEmployerProfile, loading } = useEmployerProfileStore()

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!hasHydrated) return; // Wait until Zustand is ready
    
    if (!user) {
      router.replace("/login");
      return;
    }

    // Check if user is an employer
    if (user.role !== "employer") {
      router.replace("/dashboard");
      return;
    }

    // Fetch employer profile only if user is authenticated and is an employer
    fetchEmployerProfile();
  }, [user, hasHydrated, router, fetchEmployerProfile]);

  // Show loading while checking authentication
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render anything if user is not authenticated or not an employer
  if (!user || user.role !== "employer") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!employerProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold">No Employer Profile Found</p>
              <Link href={'/employer/profile/create-profile'}>
                <Button>Create Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const {
    user: profileUser,
    companyName,
    companySize,
    contactPhone,
    description,
    founded,
    industry,
    location,
    socialLinks
  } = employerProfile

  const getInitials = (name?: string) => {
    return name
      ?.split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase() || "CO"
  }

  const formatDate = (year: string | number) => {
    if (!year) return ""
    return new Date(String(year)).getFullYear().toString()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileUser?.avatar} alt={companyName} />
              <AvatarFallback className="text-2xl">
                {getInitials(companyName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-3xl font-bold">{companyName}</h1>
                {industry && <p className="text-xl text-muted-foreground">{industry}</p>}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profileUser?.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{profileUser.email}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                )}
                {contactPhone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{contactPhone}</span>
                  </div>
                )}
                {founded && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Founded {formatDate(founded)}</span>
                  </div>
                )}
                {companySize && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{companySize} employees</span>
                  </div>
                )}
              </div>
              
              {description && (
                <p className="text-muted-foreground mt-4 max-w-2xl">{description}</p>
              )}
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks?.website && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.linkedin && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.twitter && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Company Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Company */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                About the Company
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {description && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {industry && (
                  <div>
                    <p className="text-sm font-medium">Industry</p>
                    <p className="text-lg font-semibold">{industry}</p>
                  </div>
                )}
                
                {companySize && (
                  <div>
                    <p className="text-sm font-medium">Company Size</p>
                    <p className="text-lg font-semibold">{companySize}</p>
                  </div>
                )}
                
                {founded && (
                  <div>
                    <p className="text-sm font-medium">Founded</p>
                    <p className="text-lg font-semibold">{formatDate(founded)}</p>
                  </div>
                )}
                
                {location && (
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-lg font-semibold">{location}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact and Social */}
        <div className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileUser?.email && (
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-lg font-semibold">{profileUser.email}</p>
                </div>
              )}
              
              {contactPhone && (
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-lg font-semibold">{contactPhone}</p>
                </div>
              )}
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2">Primary Contact</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profileUser?.avatar} alt={profileUser?.name} />
                    <AvatarFallback>
                      {getInitials(profileUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profileUser?.name}</p>
                    <p className="text-sm text-muted-foreground">Company Representative</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          {socialLinks && (socialLinks.website || socialLinks.linkedin || socialLinks.twitter) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {socialLinks.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      Company Website
                    </a>
                  </div>
                )}
                {socialLinks.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {socialLinks.twitter && (
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      Twitter Profile
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployerProfile