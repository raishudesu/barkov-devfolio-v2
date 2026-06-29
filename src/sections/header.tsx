import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Envelope,
  MapPin,
  UserIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";

const Header = () => {
  return (
    <section className="flex items-start justify-between w-full">
      <div className="flex items-center justify-start gap-6 flex-wrap">
        <Avatar className="size-30 lg:size-40">
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
              <BookOpenIcon />
              Blog (Coming Soon)
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
      <ModeToggle />
    </section>
  );
};

export default Header;
