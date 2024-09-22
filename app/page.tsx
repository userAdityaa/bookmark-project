'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import gsap from 'gsap';
import Link from "next/link";

const links = [
  "https://www.google.com",
  "https://www.amazon.com",
  "https://stripe.com",
  "https://ui.shadcn.com",
  "https://www.facebook.com",
  "https://www.twitter.com",
  "https://www.linkedin.com",
  "https://www.github.com",
  "https://www.netflix.com",
  "https://www.spotify.com",
  "https://www.apple.com",
  "https://www.microsoft.com",
  "https://www.tesla.com",
  "https://www.adobe.com",
  "https://www.shopify.com",
  "https://www.cloudflare.com",
  "https://www.reddit.com",
  "https://www.wikipedia.org",
  "https://www.mozilla.org",
  "https://www.twitch.tv",
  "https://www.medium.com",
  "https://www.dropbox.com",
  "https://www.slack.com",
  "https://www.airbnb.com",
  "https://www.zoom.us",
  "https://www.github.com",
  "https://www.digitalocean.com",
  "https://www.heroku.com",
  "https://www.discord.com",
  "https://www.figma.com",
  "https://www.behance.net",
  "https://www.dribbble.com",
  "https://www.notion.so",
  "https://www.pinterest.com",
  "https://www.trello.com",
  "https://www.paypal.com",
  "https://www.quora.com",
  "https://www.bitbucket.org",
  "https://www.docker.com",
  "https://www.atlassian.com",
  "https://www.godaddy.com",
  "https://www.cloudflare.com",
  "https://www.wix.com",
  "https://www.weebly.com",
  "https://www.medium.com",
  "https://www.zoom.us",
  "https://www.vimeo.com",
  "https://www.etsy.com",
  "https://www.kickstarter.com",
  "https://www.indiegogo.com",
  "https://www.udemy.com",
  "https://www.coursera.org",
  "https://www.edx.org",
  "https://www.khanacademy.org", 
  "https://www.yahoo.com",
  "https://www.bbc.com",
  "https://www.cnn.com",
  "https://www.wikipedia.org",
  "https://www.salesforce.com",
  "https://www.aircanada.com",
];

function getDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, ''); 
  } catch (error) {
    console.error("Invalid URL");
    return null;
  }
}

function extractDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;

    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }

    return (
      hostname.split(".")[0].charAt(0).toUpperCase() +
      hostname.split(".")[0].slice(1)
    );
  } catch (error) {
    console.error("Invalid URL");
    return null;
  }
}

export default function Home() {
  const [positions, setPositions] = useState<{ top: number; left: number; rotate: number }[]>([]);

  useEffect(() => {
    const newPositions = links.map(() => ({
      top: Math.random() * 40 + 70, 
      left: Math.random() * 100 + 2,
      rotate: Math.random() * 30 - 10,
    }));
    setPositions(newPositions);
  }, []);

  const handleLinkClick = (link: string) => {
    window.open(link, '_blank'); 
  };

  const handleHover = (chip: HTMLElement, isHover: boolean) => {
    const yValue = isHover ? -10 : 0;
    gsap.to(chip, { y: yValue, duration: 0.2 });
};



  useEffect(() => {
    if (positions.length === links.length) {
      positions.forEach((_, index) => {
        const chip = document.querySelectorAll('.chip')[index];

        if (chip) {
          const { rotate } = positions[index];
          gsap.fromTo(chip, 
            {
              y: 500, 
              opacity: 0,
              rotate: rotate + 10, 
            },
            {
              y: 0, 
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              rotate: rotate, 
              delay: index * 0.05, 
            }
          );
        }
      });
    }
  }, [positions]);

  return (
    <div className="bg-[#161616] h-[120vh] w-[100vw] flex items-center justify-center relative">
      <div className="w-[37.2%] h-[80%] flex flex-col mt-[10rem]">
        <div className="flex justify-between">
          <Image
            src="/logo.png"
            alt="logo"
            height={0}
            width={40}
            className="-ml-[0.5rem]"
          />
          <Link href = '/login'>
          <p className="text-[15px] text-[#a0a0a0] underline cursor-pointer">
            Login
          </p>
          </Link>
        </div>
        <div className="flex flex-col mt-[3rem] gap-2">
          <h1 className="text-white">Bookmarks</h1>
          <p className="text-[#a0a0a0] text-[15px] tracking-normal">
            A home for collecting and retrieving the most precious hyperlinks.
            You should probably be using something else, though.
          </p>
        </div>

        <div className="flex flex-col mt-[3rem] gap-2">
          <h1 className="text-white">About</h1>
          <p className="text-[#a0a0a0] text-[15px] tracking-normal">
            Built for personal usage, designed with personal preferences.
            Bare-featured, <span className="line-through">minimal</span> boring
            interface. Auto-detect input content type. Render links with page
            metadata. Keyboard-first design. Animated appropriately. Loads fast{" "}
            <i>(citation needed).</i> No onboarding. No tracking. No ads, ever.
          </p>
        </div>

        <div className="flex flex-col mt-[3rem] gap-2">
          <h1 className="text-white">Join</h1>
          <p className="text-[#a0a0a0] text-[15px] tracking-normal">
            The product is <span className="underline"> free to use</span>.
            However, no new features, bug fixes, or any meaningful support will
            be guaranteed. The codebase is under 2000 lines and I'd like to keep
            it that way. After all, this is a product for myself.
          </p>
        </div>

        <div className="border-t-[0.01px] border-[#a0a0a0] w-full mt-[2.5rem]"></div>

        <div className="flex justify-start mt-[1rem]">
          <p className="text-[15px] text-[#a0a0a0] italic">v0.02</p>
        </div>
      </div>

      <div className="fixed bottom-[2rem] z-10 w-full h-11">
        {links.map((link, index) => {
          const position = positions[index];

          return (
            <div
              key={index}
              className="chip flex text-white border border-[#282828] bg-[#1c1c1c] p-2 rounded-lg gap-2 w-[15rem] absolute items-center"
              style={{
                top: `${position?.top}%`,
                left: `${position?.left}%`,
                transform: `translate(-50%, -50%) rotate(${position?.rotate}deg)`,
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => handleHover(e.currentTarget, true)}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => handleHover(e.currentTarget, false)}
              onClick={() => handleLinkClick(link)} 
            >
              <Image
                src={`https://logo.clearbit.com/${link}`}
                alt="website-link"
                height={0}
                width={25}
              />
              <div className="font-light text-[15px]">
                {extractDomain(link)}
              </div>

              <p className="text-[#606060] font-light text-[14px] ml-auto">{getDomain(link)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
