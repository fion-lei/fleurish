interface GardenFooterProps {
  onBackpackClick: () => void;
  onCommunityClick: () => void;
  gems: number;
  coins: number;
  isVisiting?: boolean;
  onReturnHome?: () => void;
}

export function GardenFooter({
  onBackpackClick,
  onCommunityClick,
  gems,
  coins,
  isVisiting = false,
  onReturnHome,
}: GardenFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-transparent pt-1 pb-3 px-4">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between">
        {/* Community icon - Left side */}
        <button
          onClick={onCommunityClick}
          className="p-2 text-fleur-green hover:text-fleur-green/80 transition-colors"
          aria-label="Visit another garden"
        >
          <img
            src="/images/community.svg"
            alt="Community"
            className="w-8 h-8"
            aria-hidden="true"
          />
        </button>

        {/* Currency display and Backpack/Return - Right side */}
        <div className="flex items-center gap-4">
          {/* Currency display - only show when not visiting */}
          {!isVisiting && (
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
          )}

          {/* Backpack icon or Return Home button */}
          {isVisiting ? (
            <button
              onClick={onReturnHome}
              className="px-4 py-2 rounded-lg bg-fleur-green text-white hover:bg-fleur-green/90 transition-colors font-semibold text-sm"
              aria-label="Return to your garden"
            >
              Return Home
            </button>
          ) : (
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
          )}
        </div>
      </div>
    </footer>
  );
}

