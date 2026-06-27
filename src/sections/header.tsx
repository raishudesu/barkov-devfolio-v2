import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  Envelope,
  MapPin,
  UserIcon,
} from "@phosphor-icons/react";

const Header = () => {
  return (
    <section>
      <div className="flex items-center justify-start gap-6">
        <Avatar className="size-40">
          <AvatarImage src="/images/header-img.png" />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">Barysh Bacaltos</h1>
          <div className="flex items-center justify-start gap-2">
            <MapPin />
            <span>Philippines</span>
          </div>
          <p className="pt-2 text-sm text-gray-500">
            Full Stack Developer \ Aspiring Content Creator
          </p>
          <div className="pt-4 flex items-center justify-start gap-2">
            <Button>
              <DownloadIcon />
              Download Developer Resume
            </Button>
            <Button variant="outline" asChild>
              <a
                href="mailto:bacaltosbaryshnikov@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Envelope />
                Send Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
