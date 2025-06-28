"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Award, Globe, Heart, Target, Shield } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/images/j_header1.avif",
      description: "Visionary leader with 15+ years in HR tech"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/images/j_header1.avif",
      description: "Tech innovator driving platform development"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/images/j_header1.avif",
      description: "Ensuring seamless hiring experiences"
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      image: "/images/j_header1.avif",
      description: "Building the future of recruitment"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-[#2d6a4f]" />,
      title: "People First",
      description: "We believe in putting people at the center of everything we do, creating meaningful connections between employers and candidates."
    },
    {
      icon: <Target className="w-8 h-8 text-[#2d6a4f]" />,
      title: "Innovation Driven",
      description: "Constantly pushing boundaries with cutting-edge technology to revolutionize the hiring landscape."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#2d6a4f]" />,
      title: "Trust & Security",
      description: "Building trust through transparent processes and enterprise-grade security measures."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#f7f4f1] to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About Our Company
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing the way companies hire and candidates find their dream jobs since 2018
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Image
              src="/images/j_header1.avif"
              alt="Company Office"
              width={1200}
              height={600}
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 2018 by Sarah Johnson, our company emerged from a simple observation: 
                  the hiring process was broken. Traditional methods were slow, inefficient, and 
                  often missed the best candidates.
                </p>
                <p>
                  What started as a small team of 5 passionate individuals has grown into a 
                  dynamic workforce of 150+ professionals dedicated to transforming recruitment 
                  through innovative technology and human-centered design.
                </p>
                <p>
                  Today, we serve over 10,000 companies worldwide, helping them find the perfect 
                  talent while empowering millions of job seekers to discover meaningful careers.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-[#2d6a4f] to-[#40916c] text-white">
                <div className="text-3xl font-bold mb-2">5+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </Card>
              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-[#efb177] to-[#f4a261] text-white">
                <div className="text-3xl font-bold mb-2">150+</div>
                <div className="text-sm opacity-90">Team Members</div>
              </Card>
              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-[#2d6a4f] to-[#40916c] text-white">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-sm opacity-90">Companies Served</div>
              </Card>
              <Card className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-[#efb177] to-[#f4a261] text-white">
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="text-sm opacity-90">Jobs Posted</div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-[#f7f4f1] rounded-full mb-4"
                    >
                      {value.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind our mission to transform hiring
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative mb-4"
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#f7f4f1]"
                      />
                    </motion.div>
                    <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-[#2d6a4f] font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
