import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";

export default function Home() {
  return (
    <>
      <nav className="w-full h-20 border-b">
        <div className="flex items-center justify-between container mx-auto">
          <span className="text-xl font-bold">KHENA</span>

          <ul className="inline-flex flex-row gap-5">
            <li>SHOP</li>
            <li>COLLECTION</li>
            <li>CONTACT</li>
            <li>SHOWROOM</li>
            <li>ABOUT US</li>
          </ul>

          <Icon icon={ICONS.home} className="w-6 h-6" />
        </div>
      </nav>
    </>
  );
}
