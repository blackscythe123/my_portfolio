export type SocialLink = {
  name: string;
  href: string;
};

export const profile = {
  name: "Sam",
  role: "Full Stack Developer",
  location: "Chennai, India",

  // Only include links you actually own.
  socialLinks: [
    {
      name: "GitHub",
      href: "https://github.com/blackscythe123",
    },
  ] satisfies SocialLink[],
};
