import Vue from 'vue'

import UniversalStorage from '@vue-storefront/core/store/lib/storage';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { beforeRegistration } from '../../../hooks/beforeRegistration';
import * as localForage from 'localforage';
import Mock = jest.Mock;

jest.mock('localforage', () => ({ createInstance: jest.fn(), someDriver: {} }));
jest.mock('@vue-storefront/core/store/lib/storage', () => jest.fn());
jest.mock('@vue-storefront/core/lib/multistore', () => ({ currentStoreView: jest.fn() }));

Vue.prototype.$db = {};

describe('Cart beforeRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hook initializes cart cache without sufix in name', () => {
    const config = {
      storeViews: {
        commonCache: true
      },
      localForage: {
        defaultDrivers: {
          carts: 'someDriver'
        }
      }
    };
    const storageMock = {foo: 'bar'};

    (currentStoreView as Mock).mockReturnValueOnce({});
    (UniversalStorage as unknown as Mock).mockImplementationOnce(() => storageMock);

    beforeRegistration({ Vue, config, store: undefined, isServer: undefined });

    expect(Vue.prototype.$db.cartsCollection).toEqual(storageMock);
  });

  it('hook initializes cart cache with storeCode sufix in name', () => {
    const config = {
      storeViews: {
        commonCache: false
      },
      localForage: {
        defaultDrivers: {
          carts: 'someDriver'
        }
      }
    };
    const storageMock = {foo: 'bar'};

    (currentStoreView as Mock).mockReturnValueOnce({ storeCode: 'baz' });
    (UniversalStorage as unknown as Mock).mockImplementationOnce(() => storageMock);

    beforeRegistration({ Vue, config, store: undefined, isServer: undefined });

    expect(localForage.createInstance).toBeCalledWith({
      name: 'baz-shop',
      storeName: 'carts',
      driver: {}
    });
    expect(Vue.prototype.$db.cartsCollection).toEqual(storageMock);
  });
});
