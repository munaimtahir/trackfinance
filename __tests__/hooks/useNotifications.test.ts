/**
 * Tests for useNotifications Hook
 */

import { renderHook } from '@testing-library/react-native';
import {
  useNotificationRegistration,
  useNotificationHandlers,
  useNotifications,
} from '../../app/hooks/useNotifications';
import * as AuthContext from '../../app/contexts/AuthContext';
import * as notificationService from '../../services/notifications';

// Mock dependencies
jest.mock('../../app/contexts/AuthContext');
jest.mock('../../services/notifications');

describe('useNotifications Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useNotificationRegistration', () => {
    it('should register for push notifications when user is authenticated', () => {
      const mockUser = { uid: 'user-123', email: 'test@example.com', displayName: 'Test' };
      (AuthContext.useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      (notificationService.registerForPushNotifications as jest.Mock).mockResolvedValue('token-123');

      renderHook(() => useNotificationRegistration());

      expect(notificationService.registerForPushNotifications).toHaveBeenCalledWith('user-123');
    });

    it('should not register when user is null', () => {
      (AuthContext.useAuth as jest.Mock).mockReturnValue({ user: null });

      renderHook(() => useNotificationRegistration());

      expect(notificationService.registerForPushNotifications).not.toHaveBeenCalled();
    });

    it('should handle registration errors gracefully', () => {
      const mockUser = { uid: 'user-123', email: 'test@example.com', displayName: 'Test' };
      (AuthContext.useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      (notificationService.registerForPushNotifications as jest.Mock).mockRejectedValue(
        new Error('Registration failed')
      );

      // Should not throw
      expect(() => renderHook(() => useNotificationRegistration())).not.toThrow();
    });
  });

  describe('useNotificationHandlers', () => {
    it('should set up notification listeners with handlers', () => {
      const mockReceivedSubscription = { remove: jest.fn() };
      const mockResponseSubscription = { remove: jest.fn() };
      
      (notificationService.addNotificationReceivedListener as jest.Mock).mockReturnValue(
        mockReceivedSubscription
      );
      (notificationService.addNotificationResponseReceivedListener as jest.Mock).mockReturnValue(
        mockResponseSubscription
      );

      const onReceived = jest.fn();
      const onTapped = jest.fn();

      const { unmount } = renderHook(() => useNotificationHandlers(onReceived, onTapped));

      expect(notificationService.addNotificationReceivedListener).toHaveBeenCalledWith(onReceived);
      expect(notificationService.addNotificationResponseReceivedListener).toHaveBeenCalledWith(onTapped);

      unmount();

      expect(mockReceivedSubscription.remove).toHaveBeenCalled();
      expect(mockResponseSubscription.remove).toHaveBeenCalled();
    });

    it('should not set up listeners if handlers not provided', () => {
      renderHook(() => useNotificationHandlers());

      expect(notificationService.addNotificationReceivedListener).not.toHaveBeenCalled();
      expect(notificationService.addNotificationResponseReceivedListener).not.toHaveBeenCalled();
    });
  });

  describe('useNotifications', () => {
    it('should combine registration and handlers', () => {
      const mockUser = { uid: 'user-123', email: 'test@example.com', displayName: 'Test' };
      (AuthContext.useAuth as jest.Mock).mockReturnValue({ user: mockUser });
      (notificationService.registerForPushNotifications as jest.Mock).mockResolvedValue('token-123');
      
      const mockSubscription = { remove: jest.fn() };
      (notificationService.addNotificationReceivedListener as jest.Mock).mockReturnValue(mockSubscription);
      (notificationService.addNotificationResponseReceivedListener as jest.Mock).mockReturnValue(mockSubscription);

      const onReceived = jest.fn();
      const onTapped = jest.fn();

      renderHook(() => useNotifications(onReceived, onTapped));

      expect(notificationService.registerForPushNotifications).toHaveBeenCalledWith('user-123');
      expect(notificationService.addNotificationReceivedListener).toHaveBeenCalledWith(onReceived);
      expect(notificationService.addNotificationResponseReceivedListener).toHaveBeenCalledWith(onTapped);
    });
  });
});
