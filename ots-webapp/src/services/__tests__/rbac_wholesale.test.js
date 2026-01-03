import { describe, it, expect } from 'vitest';
import { can, ROLES, PERMISSIONS } from '../rbacMiddleware';
import wholesaleService from '../wholesaleService';
import dealerService from '../dealerService';

describe('RBAC Logic', () => {
    it('should grant all permissions to admin', () => {
        const admin = { role: ROLES.ADMIN };
        Object.values(PERMISSIONS).forEach(p => {
            expect(can(admin, p)).toBe(true);
        });
    });

    it('should grant restricted permissions to dealer', () => {
        const dealer = { role: ROLES.DEALER };
        expect(can(dealer, PERMISSIONS.PLACE_WHOLESALE_ORDER)).toBe(true);
        expect(can(dealer, PERMISSIONS.VIEW_OWN_ORDERS)).toBe(true);
        expect(can(dealer, PERMISSIONS.MANAGE_SETTINGS)).toBe(false);
        expect(can(dealer, PERMISSIONS.MANAGE_USERS)).toBe(false);
    });

    it('should handle invalid users/roles', () => {
        expect(can(null, PERMISSIONS.VIEW_ANALYTICS)).toBe(false);
        expect(can({}, PERMISSIONS.VIEW_ANALYTICS)).toBe(false);
        expect(can({ role: 'non-existent' }, PERMISSIONS.VIEW_ANALYTICS)).toBe(false);
    });
});

describe('Wholesale & Dealer Pricing', () => {
    const basePrice = 1000;

    it('should calculate quantity-based discounts correctly', () => {
        // 0-9: 0%
        expect(wholesaleService.calculateTieredPrice(basePrice, 5)).toBe(1000);
        // 10-49: 10%
        expect(wholesaleService.calculateTieredPrice(basePrice, 10)).toBe(900);
        // 50-99: 15%
        expect(wholesaleService.calculateTieredPrice(basePrice, 50)).toBe(850);
        // 100+: 20%
        expect(wholesaleService.calculateTieredPrice(basePrice, 100)).toBe(800);
    });

    it('should calculate dealer-tier discounts correctly', () => {
        // SILVER: 25%
        expect(dealerService.calculateWholesalePrice(basePrice, 'SILVER')).toBe(750);
        // GOLD: 30%
        expect(dealerService.calculateWholesalePrice(basePrice, 'GOLD')).toBe(700);
        // PLATINUM: 35%
        expect(dealerService.calculateWholesalePrice(basePrice, 'PLATINUM')).toBe(650);
    });

    it('should validate credit limits correctly', () => {
        // SILVER limit: 50,000
        expect(dealerService.checkCreditLimit(60000, 0, 'SILVER').allowed).toBe(false);
        expect(dealerService.checkCreditLimit(40000, 0, 'SILVER').allowed).toBe(true);
        expect(dealerService.checkCreditLimit(20000, 40000, 'SILVER').allowed).toBe(false);
    });
});
