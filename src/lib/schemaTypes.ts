/**
 * Maps business categories to appropriate Schema.org types
 * Based on Google's recommended schema types for local businesses
 */

interface SchemaTypeMapping {
  [key: string]: string[];
}

export const SCHEMA_TYPE_MAP: SchemaTypeMapping = {
  // Construction & Home Services
  "Eletricista": ["LocalBusiness", "HomeAndConstructionBusiness", "Electrician"],
  "Encanador": ["LocalBusiness", "HomeAndConstructionBusiness", "Plumber"],
  "Pedreiro": ["LocalBusiness", "HomeAndConstructionBusiness", "GeneralContractor"],
  "Pintor": ["LocalBusiness", "HomeAndConstructionBusiness", "HousePainter"],
  "Marceneiro": ["LocalBusiness", "HomeAndConstructionBusiness"],
  
  // Food & Dining
  "Restaurante": ["LocalBusiness", "FoodEstablishment", "Restaurant"],
  "Lanchonete": ["LocalBusiness", "FoodEstablishment", "FastFoodRestaurant"],
  "Pizzaria": ["LocalBusiness", "FoodEstablishment", "Restaurant"],
  "Cafeteria": ["LocalBusiness", "FoodEstablishment", "CafeOrCoffeeShop"],
  "Bar": ["LocalBusiness", "FoodEstablishment", "BarOrPub"],
  "Padaria": ["LocalBusiness", "FoodEstablishment", "Bakery"],
  
  // Health & Medical
  "Clínica": ["LocalBusiness", "MedicalBusiness", "MedicalClinic"],
  "Consultório": ["LocalBusiness", "MedicalBusiness", "Physician"],
  "Hospital": ["LocalBusiness", "MedicalBusiness", "Hospital"],
  "Saúde": ["LocalBusiness", "HealthAndBeautyBusiness"],
  "Dentista": ["LocalBusiness", "MedicalBusiness", "Dentist"],
  "Veterinário": ["LocalBusiness", "ProfessionalService", "Veterinarian"],
  
  // Pets
  "Pet Shop": ["LocalBusiness", "Store", "PetStore"],
  
  // Professional Services
  "Advogado": ["LocalBusiness", "ProfessionalService", "Attorney"],
  "Contador": ["LocalBusiness", "ProfessionalService", "AccountingService"],
  "Consultor": ["LocalBusiness", "ProfessionalService"],
  "Tecnologia": ["LocalBusiness", "ProfessionalService"],
  
  // Health & Beauty
  "Academia": ["LocalBusiness", "HealthAndBeautyBusiness", "ExerciseGym"],
  "Personal Trainer": ["LocalBusiness", "HealthAndBeautyBusiness"],
  "Salão de Beleza": ["LocalBusiness", "HealthAndBeautyBusiness", "BeautySalon"],
  "Barbearia": ["LocalBusiness", "HealthAndBeautyBusiness", "BeautySalon"],
  "Spa": ["LocalBusiness", "HealthAndBeautyBusiness", "DaySpa"],
  
  // Retail
  "Loja": ["LocalBusiness", "Store"],
  "Mercado": ["LocalBusiness", "Store", "GroceryStore"],
  "Supermercado": ["LocalBusiness", "Store", "GroceryStore"],
  "Farmácia": ["LocalBusiness", "MedicalBusiness", "Pharmacy"],
  
  // Lodging
  "Hotel": ["LocalBusiness", "LodgingBusiness", "Hotel"],
  "Pousada": ["LocalBusiness", "LodgingBusiness"],
  
  // Automotive
  "Mecânica": ["LocalBusiness", "AutomotiveBusiness", "AutoRepair"],
  "Auto Elétrica": ["LocalBusiness", "AutomotiveBusiness", "AutoRepair"],
  "Lava-Jato": ["LocalBusiness", "AutomotiveBusiness", "AutoWash"],
  
  // Education
  "Escola": ["LocalBusiness", "EducationalOrganization", "School"],
  "Curso": ["LocalBusiness", "EducationalOrganization"],
};

/**
 * Gets Schema.org types for a given business category
 * Returns a fallback type if category is not found
 */
export function getSchemaTypes(category: string): string[] {
  return SCHEMA_TYPE_MAP[category] || ["LocalBusiness"];
}

/**
 * Checks if a category has a specific schema type
 */
export function hasSchemaType(category: string, type: string): boolean {
  const types = getSchemaTypes(category);
  return types.includes(type);
}
