import { actions as ReduxToastrActions } from 'react-redux-toastr';
import { uploadSector, updateSyncedSector } from '../api/firebase';
import { setSector } from '../api/local';

import { SuccessToast, ErrorToast, creatorOrUpdateSector } from '../utils';

jest.mock('react-redux-toastr', () => ({
  actions: {
    add: jest.fn(data => data),
  },
}));

jest.mock('../api/local', () => ({
  setSector: jest.fn(() => Promise.resolve()),
}));

jest.mock('../api/firebase', () => ({
  uploadSector: jest.fn(() => Promise.resolve()),
  updateSyncedSector: jest.fn(() => Promise.resolve()),
}));

describe('Store Utils', () => {
  describe('SuccessToast', () => {
    beforeEach(() => {
      ReduxToastrActions.add.mockClear();
    });

    test('should call the toastr action builder', () => {
      SuccessToast();
      expect(ReduxToastrActions.add).toHaveBeenCalledTimes(1);
    });

    test('should have correct option', () => {
      const { options } = SuccessToast();
      expect(options).toMatchObject({
        removeOnHover: true,
        showCloseButton: true,
      });
    });

    test('should have correct position', () => {
      const { position } = SuccessToast();
      expect(position).toEqual('bottom-left');
    });

    test('should be a success toast', () => {
      const { type } = SuccessToast();
      expect(type).toEqual('success');
    });

    test('should have default title and message', () => {
      const { title, message } = SuccessToast();
      expect(title).toEqual('Sector Saved');
      expect(message).toEqual('Your sector has been saved.');
    });

    test('should allow overriding title and message', () => {
      const testTitle = 'asdf';
      const testMessage = 'fdsa';
      const { title, message } = SuccessToast({
        title: testTitle,
        message: testMessage,
      });
      expect(title).toEqual(testTitle);
      expect(message).toEqual(testMessage);
    });
  });

  describe('ErrorToast', () => {
    beforeEach(() => {
      ReduxToastrActions.add.mockClear();
    });

    test('should call the toastr action builder', () => {
      ErrorToast();
      expect(ReduxToastrActions.add).toHaveBeenCalledTimes(1);
    });

    test('should have correct option', () => {
      const { options } = ErrorToast();
      expect(options).toMatchObject({
        removeOnHover: true,
        showCloseButton: true,
      });
    });

    test('should have correct position', () => {
      const { position } = ErrorToast();
      expect(position).toEqual('bottom-left');
    });

    test('should be a success toast', () => {
      const { type } = ErrorToast();
      expect(type).toEqual('error');
    });

    test('should have default title and message', () => {
      const { title, message } = ErrorToast();
      expect(title).toEqual('There has been an error');
      expect(message).toEqual('Report a problem if it persists.');
    });
  });

  describe('creatorOrUpdateSector', () => {
    beforeEach(() => {
      setSector.mockClear();
      uploadSector.mockClear();
      updateSyncedSector.mockClear();
    });

    test('should set local sector if user model does not exist', () => {
      expect.assertions(1);
      return creatorOrUpdateSector({ user: {} }, {}).then(() => {
        expect(setSector).toHaveBeenCalledTimes(1);
      });
    });

    test('should upload sector if the sector is currently generated', () => {
      expect.assertions(1);
      return creatorOrUpdateSector(
        { user: { model: {} }, sector: { generated: {} } },
        {},
      ).then(() => {
        expect(uploadSector).toHaveBeenCalledTimes(1);
      });
    });

    test('should update sector if the sector is not generated', () => {
      expect.assertions(1);
      return creatorOrUpdateSector(
        { user: { model: {} }, sector: {} },
        {},
      ).then(() => {
        expect(updateSyncedSector).toHaveBeenCalledTimes(1);
      });
    });

    test('should return sector', () => {
      expect.assertions(1);
      const testKey = 'key';
      const testValue = 'value';
      return creatorOrUpdateSector(
        { user: {} },
        { [testKey]: testValue },
      ).then(sector => {
        expect(sector[testKey]).toEqual(testValue);
      });
    });
  });
});