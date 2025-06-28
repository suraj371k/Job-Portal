"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { Users, Target, Shield } from "lucide-react";

const Choose = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-[#2d6a4f]" />,
      title: "Extensive Talent Pool",
      description: "Access to thousands of qualified candidates across various industries and skill levels. Our platform connects you with the best talent for your organization.",
      delay: 0.1
    },
    {
      icon: <Target className="w-8 h-8 text-[#2d6a4f]" />,
      title: "Smart Matching System",
      description: "Advanced AI-powered algorithms that match job requirements with candidate skills, ensuring the perfect fit for both employers and job seekers.",
      delay: 0.2
    },
    {
      icon: <Shield className="w-8 h-8 text-[#2d6a4f]" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with data protection and privacy compliance. Your information and hiring process are safe with our trusted platform.",
      delay: 0.3
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide cutting-edge solutions that streamline your hiring process, 
            connect you with top talent, and help you build successful teams.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-[#f7f4f1] rounded-full mb-4"
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#2d6a4f] mb-2"
            >
              10K+
            </motion.div>
            <p className="text-gray-600 font-medium">Active Jobs</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#2d6a4f] mb-2"
            >
              50K+
            </motion.div>
            <p className="text-gray-600 font-medium">Candidates</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#2d6a4f] mb-2"
            >
              95%
            </motion.div>
            <p className="text-gray-600 font-medium">Success Rate</p>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-[#2d6a4f] mb-2"
            >
              24/7
            </motion.div>
            <p className="text-gray-600 font-medium">Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Choose;
