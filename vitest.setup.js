import { vi } from 'vitest';

// Mock Leaflet(地圖組件需要)
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn().mockReturnThis(),
      panTo: vi.fn(),
      flyTo: vi.fn(),
      eachLayer: vi.fn(),
      removeLayer: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({
      addTo: vi.fn().mockReturnThis(),
      bindPopup: vi.fn().mockReturnThis(),
      openPopup: vi.fn(),
    })),
    icon: vi.fn(),
    LatLng: vi.fn(),
  },
}));

// Mock FontAwesome
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: { name: 'FontAwesomeIcon', template: '<i />' },
}));

// Mock fetch using vi.stubGlobal
vi.stubGlobal('fetch', vi.fn());
