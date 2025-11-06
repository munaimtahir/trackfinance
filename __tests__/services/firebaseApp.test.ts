/**
 * Tests for Firebase App Service
 */

import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
import * as firebaseStorage from 'firebase/storage';

// Mock Firebase modules with explicit factories that return jest.fn()
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(),
  getApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

// Setup mock return values
const mockFirebaseApp = {} as firebaseApp.FirebaseApp;
const mockAuth = {} as firebaseAuth.Auth;
const mockFirestore = {} as firebaseFirestore.Firestore;
const mockStorage = {} as firebaseStorage.FirebaseStorage;

describe('Firebase App Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clear all mock calls
    jest.clearAllMocks();
    
    // Reset environment
    process.env = { ...originalEnv };
    
    // Setup mock return values
    (firebaseApp.getApps as jest.Mock).mockReturnValue([]);
    (firebaseApp.initializeApp as jest.Mock).mockReturnValue(mockFirebaseApp);
    (firebaseApp.getApp as jest.Mock).mockReturnValue(mockFirebaseApp);
    (firebaseAuth.getAuth as jest.Mock).mockReturnValue(mockAuth);
    (firebaseFirestore.getFirestore as jest.Mock).mockReturnValue(mockFirestore);
    (firebaseStorage.getStorage as jest.Mock).mockReturnValue(mockStorage);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getFirebaseConfig', () => {
    it.skip('should return Firebase config from environment variables', () => {
      // Skipping: EXPO_PUBLIC_ environment variables are replaced at build time
      // in Expo, not at runtime, so mocking process.env in tests doesn't work
    });

    it('should return empty strings for missing environment variables', () => {
      // This test will pass because getFirebaseConfig reads from process.env
      // which at module load time doesn't have EXPO_PUBLIC_ vars set
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Re-import to test with cleared env
      jest.isolateModules(() => {
        const { getFirebaseConfig } = require('../../services/firebaseApp');
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
      });

      consoleWarnSpy.mockRestore();
    });

    it.skip('should warn about specific missing keys', () => {
      // Skipping: EXPO_PUBLIC_ environment variables are replaced at build time
    });
  });

  describe('initializeFirebase', () => {
    it('should initialize Firebase app with config', () => {
      // Use isolateModules to get a fresh import
      jest.isolateModules(() => {
        const { initializeFirebase } = require('../../services/firebaseApp');
        
        initializeFirebase();

        expect(firebaseApp.initializeApp).toHaveBeenCalled();
        expect(firebaseAuth.getAuth).toHaveBeenCalledWith(mockFirebaseApp);
        expect(firebaseFirestore.getFirestore).toHaveBeenCalledWith(mockFirebaseApp);
        expect(firebaseStorage.getStorage).toHaveBeenCalledWith(mockFirebaseApp);
      });
    });

    it('should not reinitialize if already initialized', () => {
      jest.isolateModules(() => {
        const { initializeFirebase } = require('../../services/firebaseApp');
        
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
  });

  describe('getFirebaseAuth', () => {
    it('should return Firebase Auth instance', () => {
      jest.isolateModules(() => {
        const { getFirebaseAuth } = require('../../services/firebaseApp');
        const auth = getFirebaseAuth();
        expect(auth).toBe(mockAuth);
      });
    });

    it('should initialize Firebase if not already initialized', () => {
      jest.isolateModules(() => {
        const { getFirebaseAuth } = require('../../services/firebaseApp');
        
        const callsBefore = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
        getFirebaseAuth();
        const callsAfter = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

        // Should have called initializeApp
        expect(callsAfter).toBeGreaterThan(callsBefore);
      });
    });
  });

  describe('getFirebaseFirestore', () => {
    it('should return Firestore instance', () => {
      jest.isolateModules(() => {
        const { getFirebaseFirestore } = require('../../services/firebaseApp');
        const firestoreInstance = getFirebaseFirestore();
        expect(firestoreInstance).toBe(mockFirestore);
      });
    });

    it('should initialize Firebase if not already initialized', () => {
      jest.isolateModules(() => {
        const { getFirebaseFirestore } = require('../../services/firebaseApp');
        
        const callsBefore = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
        getFirebaseFirestore();
        const callsAfter = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

        expect(callsAfter).toBeGreaterThan(callsBefore);
      });
    });
  });

  describe('getFirebaseStorage', () => {
    it('should return Firebase Storage instance', () => {
      jest.isolateModules(() => {
        const { getFirebaseStorage } = require('../../services/firebaseApp');
        const storageInstance = getFirebaseStorage();
        expect(storageInstance).toBe(mockStorage);
      });
    });

    it('should initialize Firebase if not already initialized', () => {
      jest.isolateModules(() => {
        const { getFirebaseStorage } = require('../../services/firebaseApp');
        
        const callsBefore = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;
        getFirebaseStorage();
        const callsAfter = (firebaseApp.initializeApp as jest.Mock).mock.calls.length;

        expect(callsAfter).toBeGreaterThan(callsBefore);
      });
    });
  });
});
