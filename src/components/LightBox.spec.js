import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { usePharmacyStore } from '../stores/pharmacy';
import LightBox from './LightBox.vue';

describe('LightBox', () => {
  let wrapper;
  let pharmacyStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    pharmacyStore = usePharmacyStore();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should not display when showModal is false', () => {
    pharmacyStore.showModal = false;

    wrapper = mount(LightBox);

    const modalMask = wrapper.find('.modal-mask');
    expect(modalMask.exists()).toBe(true);
    // v-show sets display:none, but element still exists
    expect(modalMask.element.style.display).toBe('none');
  });

  it('should display when showModal is true', () => {
    pharmacyStore.showModal = true;
    pharmacyStore.currOpenedId = '1';
    pharmacyStore.pharmacyData = [
      {
        id: '1',
        name: '健康藥局',
        address: '台北市大安區信義路四段1號',
        phone: '02-1234-5678',
        note: '週一至週五 9:00-18:00',
      },
    ];

    wrapper = mount(LightBox);

    expect(wrapper.find('.modal-mask').isVisible()).toBe(true);
  });

  it('should render pharmacy information correctly', () => {
    pharmacyStore.showModal = true;
    pharmacyStore.currOpenedId = '1';
    pharmacyStore.pharmacyData = [
      {
        id: '1',
        name: '健康藥局',
        address: '台北市大安區信義路四段1號',
        phone: '02-1234-5678',
        note: '週一至週五 9:00-18:00',
      },
    ];

    wrapper = mount(LightBox);

    expect(wrapper.find('.store-name').text()).toBe('健康藥局');
    expect(wrapper.html()).toContain('台北市大安區信義路四段1號');
    expect(wrapper.html()).toContain('02-1234-5678');
    expect(wrapper.html()).toContain('週一至週五 9:00-18:00');
  });

  it('should close modal when clicking on wrapper', async () => {
    pharmacyStore.showModal = true;
    pharmacyStore.currOpenedId = '1';
    pharmacyStore.pharmacyData = [
      {
        id: '1',
        name: '健康藥局',
        address: '台北市大安區信義路四段1號',
        phone: '02-1234-5678',
        note: '週一至週五 9:00-18:00',
      },
    ];

    wrapper = mount(LightBox);

    expect(pharmacyStore.showModal).toBe(true);

    await wrapper.find('.modal-wrapper').trigger('click');

    expect(pharmacyStore.showModal).toBe(false);
  });

  it('should not close modal when clicking on container', async () => {
    pharmacyStore.showModal = true;
    pharmacyStore.currOpenedId = '1';
    pharmacyStore.pharmacyData = [
      {
        id: '1',
        name: '健康藥局',
      },
    ];

    wrapper = mount(LightBox);

    await wrapper.find('.modal-container').trigger('click');

    expect(pharmacyStore.showModal).toBe(true);
  });

  describe('servicePeriods computed', () => {
    it('should transform service_periods correctly', () => {
      pharmacyStore.showModal = true;
      pharmacyStore.currOpenedId = '1';
      pharmacyStore.pharmacyData = [
        {
          id: '1',
          name: '健康藥局',
          service_periods: 'NNYNNNNYYYYNNNNNNNNNNN', // N -> O, Y -> X
        },
      ];

      wrapper = mount(LightBox);

      const tds = wrapper.findAll('tbody td');
      expect(tds[0].text()).toBe('O'); // Monday morning
      expect(tds[1].text()).toBe('O'); // Tuesday morning
      expect(tds[2].text()).toBe('X'); // Wednesday morning
    });

    it('should handle empty service_periods', () => {
      pharmacyStore.showModal = true;
      pharmacyStore.currOpenedId = '1';
      pharmacyStore.pharmacyData = [
        {
          id: '1',
          name: '健康藥局',
          service_periods: '',
        },
      ];

      wrapper = mount(LightBox);

      const tds = wrapper.findAll('tbody td');
      expect(tds.length).toBe(0);
    });

    it('should handle missing service_periods', () => {
      pharmacyStore.showModal = true;
      pharmacyStore.currOpenedId = '1';
      pharmacyStore.pharmacyData = [
        {
          id: '1',
          name: '健康藥局',
        },
      ];

      wrapper = mount(LightBox);

      const tds = wrapper.findAll('tbody td');
      expect(tds.length).toBe(0);
    });

    it('should split service_periods into 3 rows (morning, noon, evening)', () => {
      pharmacyStore.showModal = true;
      pharmacyStore.currOpenedId = '1';
      pharmacyStore.pharmacyData = [
        {
          id: '1',
          name: '健康藥局',
          service_periods: 'YYYYYYYYYYYYYYYYYYYYYY', // 21 chars
        },
      ];

      wrapper = mount(LightBox);

      const rows = wrapper.findAll('tbody tr');
      expect(rows.length).toBe(3);

      // Each row should have 7 cells (one per day)
      expect(rows[0].findAll('td').length).toBe(7); // morning
      expect(rows[1].findAll('td').length).toBe(7); // noon
      expect(rows[2].findAll('td').length).toBe(7); // evening
    });
  });
});
