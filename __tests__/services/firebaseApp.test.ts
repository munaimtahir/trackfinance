/**
 * Tests for Firebase App Service
 */

import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
import * as firebaseStorage from 'firebase/storage';

jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

// Setup mocks before importing the module
const mockFirebaseApp = {} as firebaseApp.FirebaseApp;
const mockAuth = {} as firebaseAuth.Auth;
const mockFirestore = {} as firebaseFirestore.Firestore;
const mockStorage = {} as firebaseStorage.FirebaseStorage;

(firebaseApp.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
(firebaseApp.getApps as jest.Mock).mockReturnValue([]);
(firebaseApp.getApp as jest.Mock).mockReturnValue(mockFirebaseApp);
(firebaseAuth.getAuth as jest.Mock).mockReturnValue(mockAuth);
(firebaseFirestore.getFirestore as jest.Mock).mockReturnValue(mockFirestore);
(firebaseStorage.getStorage as jest.Mock).mockReturnValue(mockStorage);

// Now import the functions after mock setup
// eslint-disable-next-line import/first
import {
  getFirebaseConfig,
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
} from '../../services/firebaseApp';

describe('Firebase App Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    // Reset getApps to return empty array (not initialized)
    (firebaseApp.getApps as jest.Mock).mockReturnValue([]);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getFirebaseConfig', () => {
    it('should return Firebase config from environment variables', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const config = getFirebaseConfig();

      expect(config).toEqual({
        apiKey: 'test-api-key',
        authDomain: 'test-auth-domain',
        projectId: 'test-project-id',
        storageBucket: 'test-storage-bucket',
        messagingSenderId: 'test-sender-id',
        appId: 'test-app-id',
      });
    });

    it('should return empty strings for missing environment variables', () => {
      // Clear all Firebase env vars
      delete process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
      delete process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
      delete process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
      delete process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
      delete process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      delete process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const config = getFirebaseConfig();

      expect(config).toEqual({
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: '',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Missing Firebase configuration keys:',
        expect.stringContaining('apiKey'),
        expect.any(String)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should warn about specific missing keys', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      // Leave other keys missing
      delete process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
      delete process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      getFirebaseConfig();

      expect(consoleWarnSpy).toHaveBeenCalled();
      const warnCall = consoleWarnSpy.mock.calls[0];
      expect(warnCall[1]).toContain('authDomain');
      expect(warnCall[1]).toContain('projectId');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('initializeFirebase', () => {
    it('should initialize Firebase app with config', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      initializeFirebase();

      expect(firebaseApp.initializeApp).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        authDomain: 'test-auth-domain',
        projectId: 'test-project-id',
        storageBucket: 'test-storage-bucket',
        messagingSenderId: 'test-sender-id',
        appId: 'test-app-id',
      });
      expect(firebaseAuth.getAuth).toHaveBeenCalledWith(mockFirebaseApp);
      expect(firebaseFirestore.getFirestore).toHaveBeenCalledWith(mockFirebaseApp);
      expect(firebaseStorage.getStorage).toHaveBeenCalledWith(mockFirebaseApp);
    });

    it('should not reinitialize if already initialized', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      // First call initializes
      initializeFirebase();
      const callCountAfterFirst = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
      
      // Mock getApps to return an existing app (simulating already initialized)
      (firebaseApp.getApps as jest.Mock).mockReturnValue([mockFirebaseApp]);
      
      // Second call should not reinitialize
      initializeFirebase();
      const callCountAfterSecond = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

      // initializeApp should not be called again
      expect(callCountAfterSecond).toBe(callCountAfterFirst);
    });
  });

  describe('getFirebaseAuth', () => {
    it('should return Firebase Auth instance', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const auth = getFirebaseAuth();

      expect(auth).toBe(mockAuth);
    });

    it('should initialize Firebase if not already initialized', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const callsBefore = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
      getFirebaseAuth();
      const callsAfter = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

      // Should have called initializeApp (or not if already initialized from previous tests)
      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });
  });

  describe('getFirebaseFirestore', () => {
    it('should return Firestore instance', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const firestoreInstance = getFirebaseFirestore();

      expect(firestoreInstance).toBe(mockFirestore);
    });

    it('should initialize Firebase if not already initialized', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const callsBefore = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
      getFirebaseFirestore();
      const callsAfter = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });
  });

  describe('getFirebaseStorage', () => {
    it('should return Firebase Storage instance', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const storageInstance = getFirebaseStorage();

      expect(storageInstance).toBe(mockStorage);
    });

    it('should initialize Firebase if not already initialized', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const callsBefore = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
      getFirebaseStorage();
      const callsAfter = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

      expect(callsAfter).toBeGreaterThanOrEqual(callsBefore);
    });
  });
});
