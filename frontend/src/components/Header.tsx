"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const Header = () => {
  return (
    <motion.header className="flex flex-col lg:flex-row justify-center items-center gap-10 px-6 py-10 min-h-screen bg-[#f7f4f1]">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl flex flex-col gap-6"
      >
        <p className="text-[#efb177] text-lg md:text-xl font-semibold">
          Why Choose Us
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
          A recruiting software that brings big ideas & talents together
        </h1>
        <p className="text-gray-600 text-base md:text-lg font-medium">
          Scalable features, tools, know-how and support to help you at every
          step of the hiring process.
        </p>

        <div className="mt-4">
          <Link href="/user/job/get-job">
          <Button className="w-full sm:w-64 text-lg bg-[#2d6a4f] cursor-pointer h-[54px] hover:bg-[#2d6a4f]">
            Explore Jobs
          </Button>
        </Link>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Image
            className="rounded-full object-cover"
            alt="profile"
            src="/images/j_header1.avif"
            width={60}
            height={60}
            priority
          />
          <p className="text-gray-600 text-sm md:text-base">
            2488+ candidates got their jobs from here
          </p>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="w-full max-w-md"
      >
        <Image
          src="/images/j_header1.avif"
          alt="Illustration"
          width={500}
          height={800}
          className="w-full h-auto object-cover rounded-xl shadow-xl"
          priority
        />
      </motion.div>
    </motion.header>
  );
};

export default Header;
