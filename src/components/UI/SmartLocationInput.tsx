import { useState, useEffect, useRef, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import styles from './SmartLocationInput.module.css';

interface Location {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

interface LocationSuggestion {
  id: string;
  address: string;
  description?: string;
  type: 'current' | 'recent' | 'popular' | 'search';
  location: Location;
}

interface SmartLocationInputProps {
  type: 'Commencement Point' | 'destination';
  label: string;
  icon: string;
  placeholder: string;
  value: Location | null;
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location | null;
  isLoadingCurrentLocation?: boolean;
  onUseCurrentLocation?: () => void;
  error?: string;
  recentLocations?: Location[];
}

export function SmartLocationInput({
  type,
  label,
  icon,
  placeholder,
  value,
  onLocationSelect,
  currentLocation,
  isLoadingCurrentLocation = false,
  onUseCurrentLocation,
  error,
  recentLocations = []
}: SmartLocationInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update search query when value changes externally
  useEffect(() => {
    if (value) {
      setSearchQuery(value.address);
      setShowSuggestions(false);
    }
  }, [value]);

  // Generate smart suggestions based on context
  const generateSmartSuggestions = useCallback((): LocationSuggestion[] => {
    const suggestions: LocationSuggestion[] = [];

    // Current Location (for Commencement Point only)
    if (type === 'Commencement Point' && currentLocation) {
      suggestions.push({
        id: 'current',
        address: 'Current Location',
        description: 'Use GPS location for Commencement Point',
        type: 'current',
        location: currentLocation
      });
    }

    // Recent locations
    recentLocations.slice(0, 3).forEach((location, index) => {
      suggestions.push({
        id: `recent-${index}`,
        address: location.address,
        description: 'Recent location',
        type: 'recent',
        location
      });
    });

    // Popular VIP locations (mock data - would come from API)
    if (type === 'destination') {
      const popularDestinations = [
        {
          address: 'The Ritz London, Piccadilly',
          lat: 51.5074,
          lng: -0.1278,
          description: 'Premium hotel'
        },
        {
          address: 'Harrods, Knightsbridge',
          lat: 51.4994,
          lng: -0.1630,
          description: 'Premium shopping'
        },
        {
          address: 'The Shard, London Bridge',
          lat: 51.5045,
          lng: -0.0865,
          description: 'Business center'
        }
      ];

      popularDestinations.forEach((dest, index) => {
        if (!suggestions.some(s => s.address.includes(dest.address.split(',')[0]))) {
          suggestions.push({
            id: `popular-${index}`,
            address: dest.address,
            description: dest.description,
            type: 'popular',
            location: {
              lat: dest.lat,
              lng: dest.lng,
              address: dest.address
            }
          });
        }
      });
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }, [type, currentLocation, recentLocations]);

  // Enhanced location search with intelligent suggestions
  const searchLocations = useCallback(async (query: string): Promise<LocationSuggestion[]> => {
    if (!query.trim() || query.length < 2) return [];

    setIsSearching(true);

    try {
      // Simulate realistic API search delay
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

      // Enhanced mock results based on common UK business locations
      const commonLocations = [
        // Business Centers
        'Canary Wharf', 'The City', 'Bank', 'Liverpool Street', 'King\'s Cross',
        'Paddington Station', 'Victoria Station', 'Waterloo Station',
        // Hotels & Venues
        'The Ritz London', 'Claridge\'s', 'The Savoy', 'Park Lane Hotel',
        'Four Seasons London', 'Mandarin Oriental Hyde Park',
        // Airports & Transport
        'Heathrow Terminal', 'Gatwick Airport', 'London Bridge Station',
        'St Pancras International', 'Euston Station',
        // Popular Areas
        'Mayfair', 'Knightsbridge', 'Chelsea', 'Kensington', 'Westminster'
      ];

      const mockResults: any[] = [];

      // Find matching common locations first
      const matchingCommonLocations = commonLocations.filter(location =>
        location.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 2);

      matchingCommonLocations.forEach(location => {
        mockResults.push({
          address: `${location}, London`,
          lat: 51.5074 + (Math.random() - 0.5) * 0.2,
          lng: -0.1278 + (Math.random() - 0.5) * 0.2,
          description: getLocationDescription(location),
          priority: 1
        });
      });

      // Add intelligent street suggestions
      if (mockResults.length < 3) {
        const streetTypes = ['Street', 'Road', 'Avenue', 'Square', 'Place', 'Lane'];
        const areas = ['Mayfair', 'Knightsbridge', 'Chelsea', 'Kensington', 'Westminster', 'The City'];

        streetTypes.forEach(type => {
          const area = areas[Math.floor(Math.random() * areas.length)];
          mockResults.push({
            address: `${query} ${type}, ${area}, London`,
            lat: 51.5074 + (Math.random() - 0.5) * 0.15,
            lng: -0.1278 + (Math.random() - 0.5) * 0.15,
            description: `Street in ${area}`,
            priority: 2
          });
        });
      }

      // Add business/hotel suggestions
      if (query.length >= 3) {
        const businessTypes = ['Hotel', 'Business Centre', 'Office Building', 'Conference Centre'];
        businessTypes.forEach(businessType => {
          mockResults.push({
            address: `${query} ${businessType}, London`,
            lat: 51.5074 + (Math.random() - 0.5) * 0.1,
            lng: -0.1278 + (Math.random() - 0.5) * 0.1,
            description: businessType.toLowerCase(),
            priority: 3
          });
        });
      }

      // Sort by priority and limit results
      const sortedResults = mockResults
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 5);

      return sortedResults.map((result, index) => ({
        id: `search-${index}`,
        address: result.address,
        description: result.description,
        type: 'search' as const,
        location: {
          lat: result.lat,
          lng: result.lng,
          address: result.address
        }
      }));

    } catch (error) {
      console.error('[Location Search] Error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Helper function to get location descriptions
  const getLocationDescription = (location: string): string => {
    const descriptions: { [key: string]: string } = {
      'Canary Wharf': 'Business & finance district',
      'The City': 'Financial district',
      'Bank': 'Financial center',
      'Liverpool Street': 'Major train station',
      'King\'s Cross': 'Transport hub',
      'Paddington Station': 'Major train station',
      'Victoria Station': 'Transport hub',
      'Waterloo Station': 'Major train station',
      'The Ritz London': 'Premium hotel',
      'Claridge\'s': 'Premium hotel',
      'The Savoy': 'Premium hotel',
      'Park Lane Hotel': 'Premium hotel',
      'Four Seasons London': 'Premium hotel',
      'Mandarin Oriental Hyde Park': 'Premium hotel',
      'Heathrow Terminal': 'International airport',
      'Gatwick Airport': 'International airport',
      'London Bridge Station': 'Major train station',
      'St Pancras International': 'International train terminal',
      'Euston Station': 'Major train station',
      'Mayfair': 'Premium district',
      'Knightsbridge': 'Shopping & premium district',
      'Chelsea': 'Upscale residential area',
      'Kensington': 'Cultural district',
      'Westminster': 'Government district'
    };

    return descriptions[location] || 'London location';
  };

  // Handle input change and search
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (hasFocus) {
        let newSuggestions: LocationSuggestion[] = [];

        if (searchQuery.trim().length >= 2) {
          const searchResults = await searchLocations(searchQuery);
          newSuggestions = [...searchResults];
        }

        // Add smart suggestions if no search query or limited results
        if (searchQuery.length < 2 || newSuggestions.length < 3) {
          const smartSuggestions = generateSmartSuggestions();
          newSuggestions = [...newSuggestions, ...smartSuggestions];
        }

        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      }
    }, 200); // Debounce search

    return () => clearTimeout(searchTimer);
  }, [searchQuery, hasFocus, generateSmartSuggestions, searchLocations]);

  // Handle input focus
  const handleFocus = () => {
    setHasFocus(true);
    const smartSuggestions = generateSmartSuggestions();
    setSuggestions(smartSuggestions);
    setShowSuggestions(smartSuggestions.length > 0);
  };

  // Handle input blur (with delay for suggestion clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setHasFocus(false);
      setShowSuggestions(false);
    }, 200);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onLocationSelect(suggestion.location);
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    setHasFocus(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear selection if user is typing new query
    // Don't clear immediately to allow editing
  };

  const getSuggestionIcon = (type: LocationSuggestion['type']) => {
    switch (type) {
      case 'current':
        return '📍';
      case 'recent':
        return '🕒';
      case 'popular':
        return '⭐';
      case 'search':
        return '🔍';
      default:
        return '📌';
    }
  };

  return (
    <div className={styles.locationInputContainer}>
      {/* Label */}
      <div className={styles.locationLabel}>
        <span className={styles.locationIcon}>{icon}</span>
        <span className={styles.labelText}>{label}</span>
        {error && <span className={styles.errorIndicator}>!</span>}
      </div>

      {/* Input Field */}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''} ${hasFocus ? styles.focused : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={styles.locationInput}
          autoComplete="off"
        />

        {/* Current Location Button (Commencement Point only) */}
        {type === 'Commencement Point' && onUseCurrentLocation && (
          <button
            type="button"
            className={styles.currentLocationButton}
            onClick={onUseCurrentLocation}
            disabled={isLoadingCurrentLocation}
            title="Use current location"
          >
            {isLoadingCurrentLocation ? (
              <LoadingSpinner size="small" variant="primary" />
            ) : (
              <span className={styles.gpsIcon}>📍</span>
            )}
          </button>
        )}

        {/* Search Loading Indicator */}
        {isSearching && (
          <div className={styles.searchLoader}>
            <LoadingSpinner size="small" variant="primary" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestionsDropdown}>
          <div className={styles.suggestionsHeader}>
            <span className={styles.suggestionsTitle}>
              {searchQuery.length >= 2 ? 'Search results' : 'Quick options'}
            </span>
          </div>
          <div className={styles.suggestionsList}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className={styles.suggestionIcon}>
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className={styles.suggestionContent}>
                  <span className={styles.suggestionAddress}>
                    {suggestion.address}
                  </span>
                  {suggestion.description && (
                    <span className={styles.suggestionDescription}>
                      {suggestion.description}
                    </span>
                  )}
                </div>
                {suggestion.type === 'current' && (
                  <div className={styles.suggestionBadge}>GPS</div>
                )}
                {suggestion.type === 'popular' && (
                  <div className={styles.suggestionBadge}>VIP</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}