import { redirect } from "next/navigation";

export const metadata = {
  title: "Simiyon Portfolio",
  description: "I build intelligent systems at the intersection of automation, web3, and full-stack development.",
  openGraph: {
    title: "Simiyon Portfolio",
    description: "I build intelligent systems at the intersection of automation, web3, and full-stack development.",
    url: "https://www.simiyonvinscentsamuel.tech/preview",
    siteName: "Simiyon Portfolio",
    images: [
      {
        url: "https://www.simiyonvinscentsamuel.tech/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Simiyon Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simiyon Portfolio",
    description: "I build intelligent systems at the intersection of automation, web3, and full-stack development.",
    images: ["https://www.simiyonvinscentsamuel.tech/thumbnail.png"],
  },
};

export default function PreviewPage() {
  redirect("/");
}
