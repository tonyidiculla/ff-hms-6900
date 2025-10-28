-- ============================================
-- CHECK DATABASE DATA
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check PET_MASTER table
SELECT 
  '=== PET_MASTER ===' as info,
  COUNT(*) as total_pets
FROM pet_master;

SELECT 
  name,
  species,
  breed,
  pet_platform_id,
  user_platform_id
FROM pet_master
LIMIT 10;

-- 2. Check HOSPITAL_MASTER table
SELECT 
  '=== HOSPITAL_MASTER ===' as info,
  COUNT(*) as total_hospitals
FROM hospital_master;

SELECT 
  entity_name,
  entity_platform_id,
  organization_platform_id,
  city
FROM hospital_master
LIMIT 10;

-- 3. Check PROFILES table (owners)
SELECT 
  '=== PROFILES ===' as info,
  COUNT(*) as total_profiles
FROM profiles;

SELECT 
  first_name,
  last_name,
  email,
  user_platform_id
FROM profiles
LIMIT 10;

-- 4. Check for specific searches
SELECT 
  '=== SEARCH: Pets with owner containing "idiculla" ===' as info;

SELECT 
  pm.name as pet_name,
  pm.species,
  pm.pet_platform_id,
  p.first_name,
  p.last_name,
  p.email,
  p.user_platform_id
FROM pet_master pm
LEFT JOIN profiles p ON pm.user_platform_id = p.user_platform_id
WHERE 
  p.first_name ILIKE '%idiculla%' OR
  p.last_name ILIKE '%idiculla%' OR
  p.email ILIKE '%idiculla%' OR
  pm.name ILIKE '%idiculla%';

-- 5. Check for hospital_master containing "furfield"
SELECT 
  '=== SEARCH: Hospitals containing "furfield" ===' as info;

SELECT 
  entity_name,
  entity_platform_id,
  city,
  organization_platform_id
FROM hospital_master
WHERE 
  entity_name ILIKE '%furfield%' OR
  entity_platform_id ILIKE '%furfield%' OR
  city ILIKE '%furfield%';
