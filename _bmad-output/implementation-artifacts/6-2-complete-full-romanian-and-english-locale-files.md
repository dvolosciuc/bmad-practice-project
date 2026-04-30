# Story 6.2: Complete Full Romanian and English Locale Files

Status: ready-for-dev

## Story

As a visitor,
I want every text string in the app to render in Romanian or English based on my language selection,
so that I never see raw translation keys or untranslated text anywhere in the UI.

## Acceptance Criteria

1. `src/locales/ro.json` contains translations for ALL `t('key')` calls across the entire app.
2. `src/locales/en.json` contains matching English translations for ALL keys in `ro.json`.
3. Zero raw i18n key strings are visible in either language at runtime.
4. `ru.json` remains `{}` (empty — language deferred to future sprint).
5. All number/plural interpolations (`{{count}}`, `{{months}}`, `{{weight}}`, `{{value}}`) work in both locales.
6. `npm run build` passes.

## Tasks / Subtasks

- [ ] Audit all `t('key')` calls across all components (AC: 1–3)
  - [ ] `grep -r "t('" src/` to list all keys in use
- [ ] Write complete `src/locales/ro.json` with all keys (AC: 1, 5)
- [ ] Write complete `src/locales/en.json` with matching keys (AC: 2)
- [ ] Verify `ru.json` is `{}` (AC: 4)
- [ ] Manual smoke test: switch RO → EN → RO, check no raw keys visible (AC: 3)

## Dev Notes

### How to Find All Keys

Run this in the project root to find every `t('...')` key:
```bash
grep -r "t('" src/ --include="*.tsx" --include="*.ts" | grep -oP "t\('([^']+)'\)" | sort -u
```

### Complete Key Inventory by Domain

The following keys have been added across all previous stories. `ro.json` and `en.json` must cover all of them.

#### Navigation / Header (Story 2.4)
| Key | RO | EN |
|---|---|---|
| `nav.hero` | Acasă | Home |
| `nav.charging` | Încărcare | Charging |
| `nav.tax` | Taxe | Tax |
| `nav.savings` | Economii | Savings |
| `nav.co2` | CO₂ | CO₂ |
| `nav.nextSteps` | Pași următori | Next Steps |

#### Hero / Loss Headline (Story 2.6)
| Key | RO | EN |
|---|---|---|
| `hero.sectionLabel` | Costuri combustibil | Fuel costs |
| `hero.lossPrefix` | Arzi lunar | You burn monthly |
| `hero.lossSuffix` | mai mult față de EV | more than EV |

#### Sliders (Story 2.5)
| Key | RO | EN |
|---|---|---|
| `slider.kmPerMonth` | Km pe lună | Km per month |
| `slider.fuelConsumption` | Consum carburant | Fuel consumption |
| `slider.vehicleWeight` | Masa vehiculului (kg) | Vehicle weight (kg) |
| `slider.chargingType` | Tip încărcare | Charging type |
| `slider.operatorRegion` | Regiune operator | Operator region |
| `slider.fuelType` | Tip carburant | Fuel type |

#### Charging Section (Story 3.2)
| Key | RO | EN |
|---|---|---|
| `charging.sectionLabel` | Operatori de încărcare | Charging operators |
| `charging.sectionTitle` | Unde încarci în Moldova | Where to charge in Moldova |
| `charging.acLabel` | AC (standard) | AC (standard) |
| `charging.dcLabel` | DC (rapid) | DC (fast) |
| `charging.perKwh` | per kWh | per kWh |
| `charging.centruSud` | Centru/Sud | Centre/South |
| `charging.nord` | Nord | North |

#### ANRE Banner (Story 3.3)
| Key | RO | EN |
|---|---|---|
| `anre.fallbackBanner` | Prețuri carburant: date de rezervă ({{date}}) | Fuel prices: fallback data ({{date}}) |
| `anre.freshBanner` | Prețuri carburant actualizate la {{date}} | Fuel prices updated {{date}} |

#### Tax Section (Story 4.2)
| Key | RO | EN |
|---|---|---|
| `tax.sectionLabel` | Taxa drumurilor | Road tax |
| `tax.sectionTitle` | EV vs benzină: aceeași taxă | EV vs petrol: same tax |
| `tax.ev` | Vehicul electric | Electric vehicle |
| `tax.ice` | Vehicul pe benzină | Petrol vehicle |
| `tax.perYear` | pe an | per year |
| `tax.equalNote` | Ambele vehicule de {{weight}} kg plătesc aceeași taxă în Moldova | Both {{weight}} kg vehicles pay the same tax in Moldova |
| `tax.masaQuestion` | Ce este masa totală autorizată? | What is the total authorised mass? |
| `tax.masaExplainer` | Masa totală autorizată este greutatea maximă admisă a vehiculului complet încărcat — nu masa proprie (greutatea goală). | The total authorised mass is the maximum permitted laden weight — not the unladen/curb weight. |
| `tax.talonInstruction` | Găsește masa totală autorizată pe talonul mașinii (certificatul de înmatriculare). | Find the total authorised mass on your vehicle registration certificate (talon). |
| `tax.talonHint` | Pe talon se numește «Masa totală maximă admisă» sau câmpul G. | On the talon it is labelled «Masa totală maximă admisă» or field G. |

#### Progressive Disclosure (Story 4.1)
| Key | RO | EN |
|---|---|---|
| `disclosure.expandLabel` | Arată mai mult | Show more |
| `disclosure.collapseLabel` | Arată mai puțin | Show less |

#### Savings Section (Story 5.1, 5.2)
| Key | RO | EN |
|---|---|---|
| `savings.sectionLabel` | Impactul financiar | Financial impact |
| `savings.sectionTitle` | Ce pierzi în fiecare lună | What you lose every month |
| `savings.monthly` | Lunar | Monthly |
| `savings.annual` | Anual | Annual |
| `savings.fiveYear` | 5 ani | 5 years |
| `savings.perMonth` | pe lună | per month |
| `savings.perYear` | pe an | per year |
| `savings.inFiveYears` | în 5 ani | in 5 years |
| `savings.breakEven` | Recuperezi investiția în {{months}} luni | Break even in {{months}} months |
| `savings.negligible` | Economii minime la acest profil | Minimal savings at this profile |
| `savings.counterLabel` | Economii lunare | Monthly savings |
| `savings.counterSuffix` | față de mașina actuală | vs your current car |

#### CO₂ Section (Story 5.3)
| Key | RO | EN |
|---|---|---|
| `co2.sectionLabel` | Impactul asupra mediului | Environmental impact |
| `co2.sectionTitle` | Amprentă de carbon redusă | Reduced carbon footprint |
| `co2.treesEquivalent` | Echivalent cu {{count}} copaci plantați pe an | Equivalent to {{count}} trees planted per year |
| `co2.negligible` | Impact CO₂ minim la acest profil | Minimal CO₂ impact at this profile |

#### Next Steps (Story 5.3)
| Key | RO | EN |
|---|---|---|
| `nextSteps.sectionLabel` | Ce urmează | What's next |
| `nextSteps.sectionTitle` | Începe tranziția azi | Start your transition today |
| `nextSteps.appStore` | Descarcă EVPoint pe iOS | Download EVPoint on iOS |
| `nextSteps.playStore` | Descarcă EVPoint pe Android | Download EVPoint on Android |

### JSON File Structure Pattern

```json
{
  "nav": { "hero": "...", "charging": "..." },
  "hero": { "sectionLabel": "...", "lossPrefix": "..." },
  "slider": { ... },
  "charging": { ... },
  "anre": { ... },
  "tax": { ... },
  "disclosure": { ... },
  "savings": { ... },
  "co2": { ... },
  "nextSteps": { ... }
}
```

Use grouped dot-notation under matching parent keys. The JSON keys use the same namespace prefix as the `t('key')` calls.

### Interpolation Variables

i18next uses `{{variable}}` syntax for interpolation. Verify these keys work end-to-end:
- `anre.fallbackBanner` → `{{date}}`
- `tax.equalNote` → `{{weight}}`
- `savings.breakEven` → `{{months}}`
- `co2.treesEquivalent` → `{{count}}`

### Project Structure Notes

Files modified:
- `src/locales/ro.json` — replace any partial content with full complete file
- `src/locales/en.json` — replace any partial content with full complete file
- `src/locales/ru.json` — ensure it remains `{}`

### References

- [Source: architecture.md#i18n] — i18n setup, key convention
- [Source: prd.md#FR21] — full bilingual RO/EN support
- [Source: epics.md#Story 6.2] — acceptance criteria

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
