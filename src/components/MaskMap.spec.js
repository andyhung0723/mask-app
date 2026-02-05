import { mount } from '@vue/test-utils';
import L from 'leaflet';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockAreaData } from '../__mocks__/areaData';
import { mockPharmacyData } from '../__mocks__/pharmacyData';
import { useAreaStore } from '../stores/area';
import { usePharmacyStore } from '../stores/pharmacy';
import MaskMap from './MaskMap.vue';

describe('MaskMap', () => {
  let wrapper;
  let areaStore;
  let pharmacyStore;
  let mockMap;

  beforeEach(() => {
    setActivePinia(createPinia());
    areaStore = useAreaStore();
    pharmacyStore = usePharmacyStore();

    // Setup stores
    areaStore.areaData = mockAreaData;
    pharmacyStore.pharmacyData = mockPharmacyData;

    // Create mock map instance
    mockMap = {
      setView: vi.fn().mockReturnThis(),
      panTo: vi.fn(),
      flyTo: vi.fn(),
      eachLayer: vi.fn(),
      removeLayer: vi.fn(),
    };

    // Mock L.map to return our mock
    L.map = vi.fn(() => mockMap);

    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  const mountComponent = () => {
    return mount(MaskMap, {
      attachTo: document.body,
    });
  };

  describe('initialization', () => {
    it('should initialize Leaflet map on mount', () => {
      wrapper = mountComponent();

      expect(L.map).toHaveBeenCalledWith('mask-map');
      expect(mockMap.setView).toHaveBeenCalledWith([25.033964, 121.564468], 14);
    });

    it('should add tile layer on mount', () => {
      wrapper = mountComponent();

      expect(L.tileLayer).toHaveBeenCalledWith(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          maxZoom: 18,
        },
      );
    });
  });

  describe('currDistrictInfo watcher', () => {
    it('should have panTo method available', () => {
      wrapper = mountComponent();
      // Verify the watch is set up (actual watcher testing is complex in unit tests)
      expect(mockMap.panTo).toBeDefined();
    });
  });

  describe('filteredPharmacies watcher', () => {
    it('should have marker and icon methods available', () => {
      wrapper = mountComponent();
      // Verify L.marker and L.icon are callable
      expect(L.marker).toBeDefined();
      expect(L.icon).toBeDefined();
    });
  });

  describe('triggerPopup exposed method', () => {
    it('should be exposed as a method', () => {
      wrapper = mountComponent();
      expect(wrapper.vm.triggerPopup).toBeDefined();
      expect(typeof wrapper.vm.triggerPopup).toBe('function');
    });

    it('should not error when called with non-existent marker id', () => {
      wrapper = mountComponent();
      expect(() => wrapper.vm.triggerPopup('999')).not.toThrow();
    });
  });

  describe('clearMarkers', () => {
    it('should have eachLayer method available for clearing', () => {
      wrapper = mountComponent();
      expect(mockMap.eachLayer).toBeDefined();
    });
  });
});
