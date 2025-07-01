"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Briefcase,
  User,
  Settings,
  LogOut,
  Menu,
  Building2,
  Plus,
  FileText,
  Users,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string | undefined) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userNavItems = [
    { label: "Find Jobs", icon: Briefcase, href: "/user/job/get-job" },
    { label: "Applications", icon: FileText, href: "/user/application" },
  ];

  const employerNavItems = [
    { label: "Post Job", icon: Plus, href: "/employer/job/create-job" },
    { label: "My Jobs", icon: Briefcase, href: "/employer/job/get-job" },
    { label: "Candidates", icon: Users, href: `/employer/applications` },
  ];

  const navItems = user?.role === "user" ? userNavItems : employerNavItems;

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.picture} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link
            className="flex"
            href={
              user?.role === "user"
                ? "/user/profile/get-profile"
                : "/employer/profile/get-profile"
            }
          >
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link
            className="flex"
            href={
              user?.role === "user"
                ? "/user/profile/create-profile"
                : "/employer/profile/create-profile"
            }
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        {user?.role === "employer" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Building2 className="mr-2 h-4 w-4" />
              <span>Company Settings</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NavItems = ({ mobile = false }) => (
    <div
      className={
        mobile ? "flex flex-col space-y-2" : "flex items-center space-x-1"
      }
    >
      {navItems.map((item, index) => (
        <Link href={item.href} key={index}>
          <Button
            variant="ghost"
            className={`${
              mobile ? "w-full justify-start h-12 text-base" : "h-10 px-4 py-2"
            } hover:bg-accent hover:text-accent-foreground`}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
          >
            <item.icon className={`${mobile ? "mr-3" : "mr-2"} h-4 w-4`} />
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <Link href={"/"}>
                  <h1 className="text-lg font-bold leading-none">
                    {user?.role === "user" ? "JobPortal" : "EmployerHub"}
                  </h1>
                </Link>
                <Badge variant="secondary" className="text-xs w-fit mt-0.5">
                  {user?.role === "user"
                    ? "Find Your Dream Job"
                    : "Hire Top Talent"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItems />

            {/* User Role Badge */}
            <Badge variant={user?.role === "user" ? "default" : "secondary"}>
              {user?.role === "user" ? "Job Seeker" : "Employer"}
            </Badge>

            {/* Profile Dropdown */}
            {user ? <ProfileDropdown /> : <Link href="/login"><Button>Login</Button></Link>}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 py-6">
                  {/* Mobile Profile Info */}
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge
                        variant={
                          user?.role === "user" ? "default" : "secondary"
                        }
                        className="w-fit mt-1"
                      >
                        {user?.role === "user" ? "Job Seeker" : "Employer"}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    <NavItems mobile />
                  </div>

                  {/* Mobile Profile Actions */}
                  <div className="space-y-2 pt-6 border-t">
                    <Link
                      href={
                        user?.role === "user"
                          ? "/user/profile/get-profile"
                          : "/employer/profile/get-profile"
                      }
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-base"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        My Profile
                      </Button>
                    </Link>
                    <Link
                      href={
                        user?.role === "user"
                          ? "/user/profile/create-profile"
                          : "/employer/profile/create-profile"
                      }
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-base"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12 text-base text-red-600 hover:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
