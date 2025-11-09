interface GardenFooterProps {
  onBackpackClick: () => void;
  gems: number;
  coins: number;
}

export function GardenFooter({ onBackpackClick, gems, coins }: GardenFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-transparent pt-1 pb-3 px-4">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between">
        {/* Social icon - Left side */}
        <button className="p-2 text-fleur-green hover:text-fleur-green/80 transition-colors">
          <img
            src="/images/community.svg"
            alt="Community"
            className="w-8 h-8"
            aria-hidden="true"
          />
        </button>

        {/* Currency display and Backpack - Right side */}
        <div className="flex items-center gap-4">
          {/* Currency display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/images/gem.svg"
                alt="Gems"
                className="w-6 h-6"
                aria-hidden="true"
              />
              <span className="font-semibold text-gray-700">{gems}</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/images/coin.svg"
                alt="Coins"
                className="w-6 h-6"
                aria-hidden="true"
              />
              <span className="font-semibold text-gray-700">{coins}</span>
            </div>
          </div>

          {/* Backpack icon */}
          <button
            onClick={onBackpackClick}
            className="p-2 text-fleur-green hover:text-fleur-green/80 transition-colors"
            aria-label="Open inventory"
          >
            <img
              src="/images/backpack.svg"
              alt="Backpack"
              className="w-8 h-8"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}

