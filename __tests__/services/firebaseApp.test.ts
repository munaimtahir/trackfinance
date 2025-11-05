/**
 * Tests for Firebase App Initialization
 */

import {
  getFirebaseConfig,
  initializeFirebase,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
} from '../../services/firebaseApp';
import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
import * as firebaseStorage from 'firebase/storage';

// Mock Firebase modules
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('Firebase App', () => {
  const originalEnv = process.env;
  const mockFirebaseApp = {} as firebaseApp.FirebaseApp;
  const mockAuth = {} as firebaseAuth.Auth;
  const mockFirestore = {} as firebaseFirestore.Firestore;
  const mockStorage = {} as firebaseStorage.FirebaseStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getFirebaseConfig', () => {
    it('should read configuration from environment variables', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      const config = getFirebaseConfig();

      expect(config).toEqual({
        apiKey: 'test-api-key',
        authDomain: 'test-project.firebaseapp.com',
        projectId: 'test-project',
        storageBucket: 'test-project.appspot.com',
        messagingSenderId: '123456789',
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

    it('should warn about partially missing configuration', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      // Leave others undefined

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      getFirebaseConfig();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Missing Firebase configuration keys:',
        expect.stringContaining('authDomain'),
        expect.any(String)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('initializeFirebase', () => {
    it('should initialize Firebase app with config from environment', () => {
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'test-app-id';

      (firebaseApp.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
      (firebaseAuth.getAuth as jest.Mock).mockReturnValue(mockAuth);
      (firebaseFirestore.getFirestore as jest.Mock).mockReturnValue(mockFirestore);
      (firebaseStorage.getStorage as jest.Mock).mockReturnValue(mockStorage);

      initializeFirebase();

      expect(firebaseApp.initializeApp).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        authDomain: 'test-project.firebaseapp.com',
        projectId: 'test-project',
        storageBucket: 'test-project.appspot.com',
        messagingSenderId: '123456789',
        appId: 'test-app-id',
      });
      expect(firebaseAuth.getAuth).toHaveBeenCalledWith(mockFirebaseApp);
      expect(firebaseFirestore.getFirestore).toHaveBeenCalledWith(mockFirebaseApp);
      expect(firebaseStorage.getStorage).toHaveBeenCalledWith(mockFirebaseApp);
    });
  });

  describe('getFirebaseAuth', () => {
    it('should return Auth instance', () => {
      (firebaseApp.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
      (firebaseAuth.getAuth as jest.Mock).mockReturnValue(mockAuth);
      (firebaseFirestore.getFirestore as jest.Mock).mockReturnValue(mockFirestore);
      (firebaseStorage.getStorage as jest.Mock).mockReturnValue(mockStorage);

      const auth = getFirebaseAuth();

      expect(auth).toBe(mockAuth);
    });
  });

  describe('getFirebaseFirestore', () => {
    it('should return Firestore instance', () => {
      (firebaseApp.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
      (firebaseAuth.getAuth as jest.Mock).mockReturnValue(mockAuth);
      (firebaseFirestore.getFirestore as jest.Mock).mockReturnValue(mockFirestore);
      (firebaseStorage.getStorage as jest.Mock).mockReturnValue(mockStorage);

      const db = getFirebaseFirestore();

      expect(db).toBe(mockFirestore);
    });
  });

  describe('getFirebaseStorage', () => {
    it('should return Storage instance', () => {
      (firebaseApp.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
      (firebaseAuth.getAuth as jest.Mock).mockReturnValue(mockAuth);
      (firebaseFirestore.getFirestore as jest.Mock).mockReturnValue(mockFirestore);
      (firebaseStorage.getStorage as jest.Mock).mockReturnValue(mockStorage);

      const storage = getFirebaseStorage();

      expect(storage).toBe(mockStorage);
    });
  });
});
