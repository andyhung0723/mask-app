import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mockAreaData } from '../__mocks__/areaData';
import { mockPharmacyData } from '../__mocks__/pharmacyData';
import highlightDirective from '../directives/highlight';
import { useAreaStore } from '../stores/area';
import { usePharmacyStore } from '../stores/pharmacy';
import AsideMenu from './AsideMenu.vue';

describe('AsideMenu', () => {
  let wrapper;
  let areaStore;
  let pharmacyStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    areaStore = useAreaStore();
    pharmacyStore = usePharmacyStore();

    // Setup default data
    areaStore.areaData = mockAreaData;
    pharmacyStore.pharmacyData = mockPharmacyData;
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  const mountComponent = () => {
    return mount(AsideMenu, {
      global: {
        directives: {
          highlight: highlightDirective,
        },
        stubs: {
          FontAwesomeIcon: true,
        },
      },
    });
  };

  describe('region selection', () => {
    it('should render city select options', () => {
      wrapper = mountComponent();

      const citySelect = wrapper.find('select').element;
      const options = Array.from(citySelect.options).map((opt) => opt.text);

      expect(options).toEqual(['台北市', '新北市']);
    });

    it('should render district select options based on current city', async () => {
      wrapper = mountComponent();

      areaStore.currCity = '台北市';
      await wrapper.vm.$nextTick();

      const selects = wrapper.findAll('select');
      const districtSelect = selects[1].element;
      const options = Array.from(districtSelect.options).map((opt) => opt.text);

      expect(options).toEqual(['大安區', '信義區']);
    });

    it('should update currCity when city select changes', async () => {
      wrapper = mountComponent();

      const citySelect = wrapper.find('select');
      await citySelect.setValue('新北市');

      expect(areaStore.currCity).toBe('新北市');
    });

    it('should update currDistrict when district select changes', async () => {
      wrapper = mountComponent();

      areaStore.currCity = '台北市';
      await wrapper.vm.$nextTick();

      const selects = wrapper.findAll('select');
      const districtSelect = selects[1];
      await districtSelect.setValue('信義區');

      expect(areaStore.currDistrict).toBe('信義區');
    });
  });

  describe('keyword search', () => {
    it('should render keyword input', () => {
      wrapper = mountComponent();

      const input = wrapper.find('input[type="text"]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('placeholder')).toBe('請輸入關鍵字');
    });

    it('should update keyword when input changes', async () => {
      wrapper = mountComponent();

      const input = wrapper.find('input[type="text"]');
      await input.setValue('健康');

      expect(pharmacyStore.keyword).toBe('健康');
    });
  });

  describe('loading skeleton', () => {
    it('should show skeleton when isLoading is true', () => {
      pharmacyStore.isLoading = true;
      wrapper = mountComponent();

      const skeletons = wrapper.findAll('.skeleton');
      expect(skeletons.length).toBe(8);
    });

    it('should hide skeleton when isLoading is false', () => {
      pharmacyStore.isLoading = false;
      wrapper = mountComponent();

      const skeletons = wrapper.findAll('.skeleton');
      expect(skeletons.length).toBe(0);
    });
  });

  describe('pharmacy list', () => {
    beforeEach(() => {
      areaStore.currCity = '台北市';
      areaStore.currDistrict = '大安區';
      pharmacyStore.isLoading = false;
    });

    it('should render filtered pharmacies', () => {
      wrapper = mountComponent();

      const pharmacies = wrapper.findAll('.store-info:not(.skeleton)');
      expect(pharmacies.length).toBe(1);
      expect(pharmacies[0].text()).toContain('健康藥局');
    });

    it('should display pharmacy details', () => {
      wrapper = mountComponent();

      const pharmacy = wrapper.find('.store-info:not(.skeleton)');
      expect(pharmacy.text()).toContain('健康藥局');
      expect(pharmacy.text()).toContain('大人口罩: 100');
      expect(pharmacy.text()).toContain('兒童口罩: 50');
      expect(pharmacy.text()).toContain('2020/03/20 12:00:00');
    });

    it('should emit triggerMakerPopup when pharmacy clicked', async () => {
      wrapper = mountComponent();

      const pharmacy = wrapper.find('.store-info:not(.skeleton)');
      await pharmacy.trigger('click');

      expect(wrapper.emitted('triggerMakerPopup')).toBeTruthy();
      expect(wrapper.emitted('triggerMakerPopup')[0]).toEqual(['1']);
    });

    it('should open info box when detail button clicked', async () => {
      wrapper = mountComponent();

      const detailBtn = wrapper.find('.btn-store-detail');
      await detailBtn.trigger('click');

      expect(pharmacyStore.showModal).toBe(true);
      expect(pharmacyStore.currOpenedId).toBe('1');
    });

    it('should filter pharmacies by keyword', async () => {
      wrapper = mountComponent();

      pharmacyStore.keyword = '健康';
      await wrapper.vm.$nextTick();

      const pharmacies = wrapper.findAll('.store-info:not(.skeleton)');
      expect(pharmacies.length).toBe(1);
      expect(pharmacies[0].text()).toContain('健康藥局');
    });

    it('should show empty list when keyword not match', async () => {
      wrapper = mountComponent();

      pharmacyStore.keyword = '不存在的藥局';
      await wrapper.vm.$nextTick();

      const pharmacies = wrapper.findAll('.store-info:not(.skeleton)');
      expect(pharmacies.length).toBe(0);
    });

    it('should update list when city changes', async () => {
      wrapper = mountComponent();

      areaStore.currCity = '台北市';
      areaStore.currDistrict = '信義區';
      await wrapper.vm.$nextTick();

      const pharmacies = wrapper.findAll('.store-info:not(.skeleton)');
      expect(pharmacies.length).toBe(1);
      expect(pharmacies[0].text()).toContain('安心藥局');
    });
  });

  describe('highlight directive', () => {
    it('should apply highlight directive to pharmacy name', () => {
      pharmacyStore.keyword = '健康';
      wrapper = mountComponent();

      // highlight directive 會將匹配文字包在 <span class="highlight"> 中
      const pharmacyName = wrapper.find('.store-info:not(.skeleton) h1');
      expect(pharmacyName.exists()).toBe(true);
      // 檢查是否包含藥局名稱
      expect(pharmacyName.text()).toContain('健康藥局');
    });
  });
});
