import { describe, it, expect, beforeEach } from 'vitest'

describe('Asset Inventory Contract', () => {
  let contractState
  
  beforeEach(() => {
    contractState = {
      ipAssets: new Map(),
      assetCategories: new Map(),
      nextAssetId: 1
    }
  })
  
  describe('Asset Management', () => {
    it('should add a new asset successfully', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const assetData = {
        assetType: 'Patent',
        title: 'Revolutionary Widget',
        description: 'A widget that changes everything',
        registrationNumber: 'US123456789',
        filingDate: 20240101,
        expiryDate: 20440101,
        jurisdiction: 'United States'
      }
      
      const result = addAsset(contractState, owner, assetData)
      
      expect(result.success).toBe(true)
      expect(result.assetId).toBe(1)
      expect(contractState.ipAssets.has(1)).toBe(true)
      expect(contractState.nextAssetId).toBe(2)
      
      const storedAsset = contractState.ipAssets.get(1)
      expect(storedAsset.owner).toBe(owner)
      expect(storedAsset.title).toBe(assetData.title)
      expect(storedAsset.status).toBe('active')
    })
    
    it('should update asset category count', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const assetData = {
        assetType: 'Patent',
        title: 'Test Patent',
        description: 'Test description',
        registrationNumber: 'US123',
        filingDate: 20240101,
        expiryDate: 20440101,
        jurisdiction: 'US'
      }
      
      addAsset(contractState, owner, assetData)
      addAsset(contractState, owner, { ...assetData, title: 'Another Patent' })
      
      expect(contractState.assetCategories.get('Patent')).toBe(2)
    })
    
    it('should validate required fields', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const invalidAssetData = {
        assetType: '',
        title: 'Test',
        description: 'Test',
        registrationNumber: 'US123',
        filingDate: 20240101,
        expiryDate: 20440101,
        jurisdiction: 'US'
      }
      
      const result = addAsset(contractState, owner, invalidAssetData)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid-asset')
    })
  })
  
  describe('Asset Status Updates', () => {
    it('should update asset status by owner', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const assetData = createValidAssetData()
      
      const addResult = addAsset(contractState, owner, assetData)
      const updateResult = updateAssetStatus(contractState, owner, addResult.assetId, 'expired')
      
      expect(updateResult.success).toBe(true)
      
      const asset = contractState.ipAssets.get(addResult.assetId)
      expect(asset.status).toBe('expired')
    })
    
    it('should reject status update by non-owner', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const nonOwner = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const assetData = createValidAssetData()
      
      const addResult = addAsset(contractState, owner, assetData)
      const updateResult = updateAssetStatus(contractState, nonOwner, addResult.assetId, 'expired')
      
      expect(updateResult.success).toBe(false)
      expect(updateResult.error).toBe('unauthorized')
    })
    
    it('should reject update of non-existent asset', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      
      const result = updateAssetStatus(contractState, owner, 999, 'expired')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('not-found')
    })
  })
  
  describe('Asset Transfer', () => {
    it('should transfer asset to new owner', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const newOwner = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const assetData = createValidAssetData()
      
      const addResult = addAsset(contractState, owner, assetData)
      const transferResult = transferAsset(contractState, owner, addResult.assetId, newOwner)
      
      expect(transferResult.success).toBe(true)
      
      const asset = contractState.ipAssets.get(addResult.assetId)
      expect(asset.owner).toBe(newOwner)
    })
    
    it('should reject transfer by non-owner', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const nonOwner = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const newOwner = 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP'
      const assetData = createValidAssetData()
      
      const addResult = addAsset(contractState, owner, assetData)
      const transferResult = transferAsset(contractState, nonOwner, addResult.assetId, newOwner)
      
      expect(transferResult.success).toBe(false)
      expect(transferResult.error).toBe('unauthorized')
    })
  })
  
  describe('Asset Queries', () => {
    it('should retrieve asset information', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const assetData = createValidAssetData()
      
      const addResult = addAsset(contractState, owner, assetData)
      const asset = getAsset(contractState, addResult.assetId)
      
      expect(asset).toBeDefined()
      expect(asset.title).toBe(assetData.title)
      expect(asset.owner).toBe(owner)
    })
    
    it('should return category counts', () => {
      const owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      
      addAsset(contractState, owner, { ...createValidAssetData(), assetType: 'Patent' })
      addAsset(contractState, owner, { ...createValidAssetData(), assetType: 'Trademark' })
      addAsset(contractState, owner, { ...createValidAssetData(), assetType: 'Patent' })
      
      expect(getCategoryCount(contractState, 'Patent')).toBe(2)
      expect(getCategoryCount(contractState, 'Trademark')).toBe(1)
      expect(getCategoryCount(contractState, 'Copyright')).toBe(0)
    })
  })
})

// Helper functions
function createValidAssetData() {
  return {
    assetType: 'Patent',
    title: 'Test Patent',
    description: 'A test patent for testing purposes',
    registrationNumber: 'US123456789',
    filingDate: 20240101,
    expiryDate: 20440101,
    jurisdiction: 'United States'
  }
}

// Mock contract functions
function addAsset(state, owner, assetData) {
  if (!assetData.assetType || !assetData.title || !assetData.description) {
    return { success: false, error: 'invalid-asset' }
  }
  
  const assetId = state.nextAssetId
  const asset = {
    owner,
    ...assetData,
    status: 'active'
  }
  
  state.ipAssets.set(assetId, asset)
  state.nextAssetId += 1
  
  // Update category count
  const currentCount = state.assetCategories.get(assetData.assetType) || 0
  state.assetCategories.set(assetData.assetType, currentCount + 1)
  
  return { success: true, assetId }
}

function updateAssetStatus(state, caller, assetId, newStatus) {
  const asset = state.ipAssets.get(assetId)
  
  if (!asset) {
    return { success: false, error: 'not-found' }
  }
  
  if (asset.owner !== caller) {
    return { success: false, error: 'unauthorized' }
  }
  
  asset.status = newStatus
  return { success: true }
}

function transferAsset(state, caller, assetId, newOwner) {
  const asset = state.ipAssets.get(assetId)
  
  if (!asset) {
    return { success: false, error: 'not-found' }
  }
  
  if (asset.owner !== caller) {
    return { success: false, error: 'unauthorized' }
  }
  
  asset.owner = newOwner
  return { success: true }
}

function getAsset(state, assetId) {
  return state.ipAssets.get(assetId)
}

function getCategoryCount(state, category) {
  return state.assetCategories.get(category) || 0
}
